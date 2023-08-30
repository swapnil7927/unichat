import { useStateContext } from "../context/StateContext";
import { reducerCases } from "../context/constants.js";
import { CHECK_USER_ROUTE } from "../utils/ApiRoutes.js";
import { firebaseAuth } from "../utils/FirebaseConfig.js";
import axios from "axios";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

const Login = () => {

  const [{ userInfo }, dispatch] = useStateContext();

  const navigate = useNavigate();

  onAuthStateChanged(firebaseAuth, async (currentUser) => {
    if (!userInfo && currentUser?.email) {
      const { data } = await axios.post(CHECK_USER_ROUTE, { email: currentUser.email });

      if (data.status) {
        const { id, name, email, profilePicture: profileImage, about: status } = data.data;

        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: {
            id,
            name,
            email,
            profileImage,
            status,
          }
        });
        navigate('/');
      }

    }
  });

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const { user: { displayName: name, email, photoURL: profileImage } } = await signInWithPopup(firebaseAuth, provider);

    try {
      if (email) {
        const { data } = await axios.post(CHECK_USER_ROUTE, { email });

        if (!data.status) {
          dispatch({
            type: reducerCases.SET_NEW_USER,
            newUser: true,
          });

          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              name,
              email,
              profileImage,
              status: "",
            }
          });
          navigate('/onboarding');
        } else {
          const { id, name, email, profilePicture: profileImage, about: status } = data.data;
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              id,
              name,
              email,
              profileImage,
              status
            }
          });
          navigate('/');
        }
      }
    } catch (err) {
      console.log(err);
    }

  }



  return (
    <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6">
      <div className="flex items-center justify-center gap-2 text-white">
        <img
          src="/unichat.gif"
          alt="unichat-logo"
          height={300}
          width={300}
        />
        <span className="text-7xl">UniChat</span>
      </div>
      <button
        onClick={handleLogin}
        className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-lg"
      >
        <FcGoogle className="text-4xl" />
        <span className="text-white text-2xl">Login with Google</span>
      </button>
    </div>
  )
};

export default Login;
