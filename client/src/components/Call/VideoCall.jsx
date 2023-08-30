import { useEffect } from "react";
import { useStateContext } from "../../context/StateContext";
import Container from "./Container";



const VideoCall = () => {

  const [{ videoCall, socket, userInfo }] = useStateContext();


  useEffect(() => {
    if (videoCall.type === 'out-going') {
      socket.current.emit("outgoing-video-call", {
        to: videoCall.id,
        from: {
          id: userInfo?.id,
          profilePicture: userInfo?.profileImage,
          name: userInfo?.name,
        },
        callType: videoCall.callType,
        roomId: videoCall.roomId,
      })
    }
  }, [videoCall]);

  return (
    <Container data={videoCall} />
  );
}

export default VideoCall;