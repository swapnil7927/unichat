import { useEffect, useState } from "react";
import { useStateContext } from "../../context/StateContext";
import { reducerCases } from "../../context/constants.js";
import { GET_CALL_TOKEN } from "../../utils/ApiRoutes.js";
import { MdOutlineCallEnd } from "react-icons/md";
import axios from "axios";




const Container = ({ data }) => {

  const [{ userInfo, socket }, dispatch] = useStateContext();
  const [callAccepted, setCallAccepted] = useState(false);
  const [token, setToken] = useState(undefined);
  const [zgVar, setZgVar] = useState(undefined);
  const [localStream, setLocalStream] = useState(undefined);
  const [publishStream, setPublishStream] = useState(undefined);

  useEffect(() => {
    if (data.type === "out-going") {
      socket.current.on("accept-call", () => setCallAccepted(true));
    } else {
      setTimeout(() => {
        setCallAccepted(true);
      }, 1000);
    }
  }, [data]);

  useEffect(() => {
    const getToken = async () => {
      try {
        const { data } = await axios.get(`${GET_CALL_TOKEN}/${userInfo?.id}`);
        setToken(data.token)
      } catch (err) {
        console.log(err);
      }
    }

    getToken();
  }, [callAccepted]);

  useEffect(() => {
    const startCall = async () => {
      import("zego-express-engine-webrtc").then(async ({ ZegoExpressEngine }) => {
        const appId = parseInt(import.meta.env.VITE_ZEGO_APP_ID);
        const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET
        const zg = new ZegoExpressEngine(appId, serverSecret);
        setZgVar(zg);
        zg.on("roomStreamUpdate", async (roomID, updateType, streamList, extendedData) => {
          if (updateType === "ADD") {
            const rmVideo = document.getElementById("remote-video");
            const vd = document.createElement(data.callType === "video" ? "video" : "audio");
            vd.id = streamList[0].streamID;
            vd.autoplay = true;
            vd.playsInline = true;
            vd.muted = false;

            if (rmVideo) {
              rmVideo.appendChild(vd);
            }

            zg.startPlayingStream(streamList[0].streamID, {
              audio: true,
              video: true,
            }).then((stream) => vd.srcObject = stream);

          } else if (updateType === "DELETE" && zg && localStream && streamList[0].streamID) {
            zg.destroyStream(localStream);
            zg.stopPublishingStream(streamList[0].streamID);
            zg.logoutRoom(data.roomId.toString());
            dispatch({ type: reducerCases.END_CALL });
          }
        });
        await zg.loginRoom(
          data.roomId.toString(),
          token,
          {
            userID: userInfo.id.toString(),
            userName: userInfo?.name
          },
          { userUpdate: true }
        );

        const localStream = await zg.createStream({
          camera: {
            audio: true,
            video: data.callType === "video" ? true : false,
          },
        });
        const localVideo = document.getElementById("local-audio");
        const videoElement = document.createElement(
          data.callType === "video" ? "video" : "audio"
        );
        videoElement.id = "video-local-zego";
        videoElement.className = "h-28 w-32";
        videoElement.autoplay = true;
        videoElement.muted = false;

        videoElement.playsInline = true;

        localVideo.appendChild(videoElement);
        const td = document.getElementById("video-local-zego");
        td.srcObject = localStream;
        const streamID = '123' + Date.now();
        setPublishStream(streamID);
        setLocalStream(localStream);
        zg.startPublishingStream(streamID, localStream);
      });
    };
    if (token) {
      startCall();
    }
  }, [token])

  const endCall = () => {
    const id = data.id;
    if (zgVar && localStream && publishStream) {
      zgVar.destroyStream(localStream);
      zgVar.stopPublishingStream(publishStream);
      zgVar.logoutRoom(data.roomId.toString());
    }

    if (data.callType === "voice") {
      socket.current.emit("reject-voice-call", {
        from: id
      });

    } else {
      socket.current.emit("reject-video-call", {
        from: id,
      });
    }
    dispatch({ type: reducerCases.END_CALL });
  }

  return (
    <div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col h-[100vh] overflow-hidden items-center justify-center text-white">
      <div className="flex flex-col gap-3 items-center">
        <span className="text-5xl">{data.name}</span>
        <span>
          {
            callAccepted && data.callType !== "video" ? "On going call" : "Calling"
          }
        </span>
      </div>
      {
        (!callAccepted || data.callType === "audio") && (
          <div className="my-24">
            <img
              src={data?.profilePicture}
              alt="avatar"
              height={300}
              width={300}
              className="rounded-full"
            />
          </div>
        )
      }
      <div className="my-5 relative" id="remote-video">
        <div className="absolute bottom-5 right-5" id="local-audio">

        </div>
      </div>
      <div className="h-16 w-16 bg-red-600 flex items-center justify-center rounded-full">
        <MdOutlineCallEnd
          className="text-3xl cursor-pointer"
          onClick={endCall}
        />
      </div>
    </div>
  );
}

export default Container;