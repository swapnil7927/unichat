import { firebaseAuth } from "../utils/FirebaseConfig.js";
import { onAuthStateChanged } from "firebase/auth";
import { useStateContext } from "../context/StateContext";
import { reducerCases } from "../context/constants.js";
import { CHECK_USER_ROUTE } from "../utils/ApiRoutes.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Main from "../components/Main";


const Index = () => {

  const navigate = useNavigate();
  const [{ userInfo }, dispatch] = useStateContext();

  onAuthStateChanged(firebaseAuth, async (currentUser) => {
    if (!currentUser) navigate('/login');
    if (!userInfo && currentUser?.email) {
      const { data } = await axios.post(CHECK_USER_ROUTE, { email: currentUser.email });

      if (!data.status) navigate('/login');

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
    }
  });

  return (
    <Main />
  );
}

export default Index;
