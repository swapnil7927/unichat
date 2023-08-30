import { useEffect, useState } from "react";
import { useStateContext } from "../context/StateContext";
import { reducerCases } from "../context/constants.js";
import { ONBOARD_USER_ROUTE } from "../utils/ApiRoutes.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Input from "../components/common/Input";
import Avatar from "../components/common/Avatar";

const OnBoarding = () => {

  const navigate = useNavigate();

  const [{ userInfo, newUser }, dispatch] = useStateContext();
  const [name, setName] = useState(userInfo?.name || '');
  const [about, setAbout] = useState("");
  const [image, setImage] = useState("/defaultAvatar.png");

  const onBoardUserHandler = async () => {
    if (validateDetails) {
      const email = userInfo.email;
      try {
        const { data } = await axios.post(`${ONBOARD_USER_ROUTE}`, {
          email,
          name,
          about,
          image,
        });

        if (data.status) {
          dispatch({
            type: reducerCases.SET_NEW_USER,
            newUser: false,
          });

          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              id: data.data.id,
              name,
              email,
              profileImage: image,
              status: about,
            }
          });
        }
        navigate('/');

      } catch (err) {
        console.log(err);
      }
    }
  }

  const validateDetails = () => {
    if (name.length < 3) return false;
    return true;
  }

  useEffect(() => {
    if (!newUser && !userInfo?.email) navigate('/login');
    else if (!newUser && userInfo?.email) navigate('/');
  }, [newUser, userInfo, navigate]);

  return (
    <div className="bg-panel-header-background h-screen w-screen text-white flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-2">
        <img
          src='/unichat.gif'
          alt="unichat-logo"
          height={300}
          width={300}
        />
        <span className="text-7xl">UniChat</span>
      </div>
      <h2 className="text-2xl">Create Your Profile</h2>
      <div className="flex gap-6 mt-6">
        <div className="flex flex-col items-center justify-center mt-5 gap-6">
          <Input name="Display name" state={name} setState={setName} label />
          <Input name="About" state={about} setState={setAbout} label />
          <div className="flex items-center justify-center">
            <button
              onClick={onBoardUserHandler}
              className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-lg"
            >Create Profile
            </button>
          </div>
        </div>
        <div>
          <Avatar type='xl' image={image} setImage={setImage} />
        </div>
      </div>
    </div>
  )
};

export default OnBoarding;
