import { useEffect, useRef, useState } from "react";
import { useStateContext } from "../context/StateContext";
import { reducerCases } from "../context/constants.js";
import { GET_MESSAGES_ROUTE, HOST } from "../utils/ApiRoutes.js";
import { io } from "socket.io-client";
import axios from "axios";
import Chat from "./Chat/Chat";
import Empty from "./Empty";
import SearchMessages from "./Chat/SearchMessages";
import ChatList from "./Chatlist/ChatList";
import VideoCall from "./Call/VideoCall";
import VoiceCall from "./Call/VoiceCall";
import IncomingVideoCall from "./common/IncomingVideoCall";
import IncomingCall from "./common/IncomingCall";




const Main = () => {

  const [{ userInfo, currentChatUser, messageSearch, videoCall, voiceCall, incomingVideoCall, incomingVoiceCall }, dispatch] = useStateContext();
  const [socketEvent, setSocketEvent] = useState(false);
  const socket = useRef();


  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST);
      socket.current.emit('add-user', userInfo?.id);
      dispatch({ type: reducerCases.SET_SOCKET, socket });
    }
  }, [userInfo]);


  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on("msg-receive", (data) => {
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: {
            ...data.message,
          }
        })
      });

      socket.current.on("incoming-voice-call", ({ from, roomId, callType }) => {
        dispatch({
          type: reducerCases.SET_INCOMING_VOICE_CALL,
          incomingVoiceCall: {
            ...from,
            roomId,
            callType,
          }
        });
      });

      socket.current.on("incoming-video-call", ({ from, roomId, callType }) => {
        dispatch({
          type: reducerCases.SET_INCOMING_VIDEO_CALL,
          incomingVideoCall: {
            ...from,
            roomId,
            callType,
          }
        });
      });

      socket.current.on("voice-call-rejected", () => {
        dispatch({
          type: reducerCases.END_CALL,
        });
      });

      socket.current.on("video-call-rejected", () => {
        dispatch({
          type: reducerCases.END_CALL,
        });
      });

      socket.current.on("online-users", ({ onlineUsers }) => {
        dispatch({
          type: reducerCases.SET_ONLINE_USERS,
          onlineUsers,
        })
      })

      setSocketEvent(true);
    }
  }, [socket.current]);


  useEffect(() => {
    const getMessages = async () => {
      const { data: { messages } } = await axios.get(`${GET_MESSAGES_ROUTE}/${userInfo?.id}/${currentChatUser?.id}`);
      dispatch({ type: reducerCases.SET_MESSAGES, messages });
    }

    if (currentChatUser?.id) {
      getMessages();
    }

  }, [currentChatUser]);

  return (
    <>
      {
        incomingVideoCall && <IncomingVideoCall />
      }
      {
        incomingVoiceCall && <IncomingCall />
      }
      {
        videoCall && (
          <div className="h-screen max-h-full w-screen overflow-hidden">
            <VideoCall />
          </div>
        )
      }
      {
        voiceCall && (
          <div className="h-screen max-h-full w-screen overflow-hidden">
            <VoiceCall />
          </div>
        )
      }
      {
        !videoCall && !voiceCall && (

          <div className="grid grid-cols-main h-screen w-screen max-h-screen  max-w-full overflow-hidden">
            <ChatList />
            {
              currentChatUser ? (
                <div className={messageSearch ? "grid grid-cols-2" : "grid-cols-2"}>
                  <Chat />
                  {
                    messageSearch && <SearchMessages />
                  }
                </div>
              ) : (
                <Empty />
              )
            }
          </div>
        )
      }
    </>
  );
}

export default Main;