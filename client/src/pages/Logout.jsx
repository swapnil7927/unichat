import { useEffect } from "react";
import { firebaseAuth } from "../utils/FirebaseConfig.js";
import { signOut } from "firebase/auth";
import { useStateContext } from "../context/StateContext";
import { reducerCases } from "../context/constants.js";
import { useNavigate } from "react-router-dom";



const Logout = () => {

  const navigate = useNavigate();
  const [{ userInfo, socket }, dispatch] = useStateContext();

  useEffect(() => {
    socket.current.emit('signout', userInfo?.id);
    dispatch({ type: reducerCases.SET_USER_INFO, userInfo: undefined });
    signOut(firebaseAuth);
    navigate('/login');
  }, [socket]);

  return (
    <div className="bg-conversation-panel-background">

    </div>
  );
}

export default Logout;