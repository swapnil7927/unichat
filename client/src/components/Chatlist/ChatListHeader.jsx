import { useState } from "react";
import { useStateContext } from "../../context/StateContext";
import { reducerCases } from "../../context/constants.js";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import ContextMenu from "../common/ContextMenu";
import Avatar from "../common/Avatar";

const ChatListHeader = () => {

  const navigate = useNavigate();

  const [{ userInfo }, dispatch] = useStateContext();

  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [contextMenuCoordinates, setContextMenuCoordinates] = useState({
    x: 0,
    y: 0,
  });

  const showContextMenu = (e) => {
    e.preventDefault();
    setContextMenuCoordinates(
      {
        x: e.pageX - 50,
        y: e.pageY + 20,
      }
    );
    setIsContextMenuVisible(true);
  }

  const contextMenuOptions = [
    {
      name: 'Logout',
      callback: async () => {
        setIsContextMenuVisible(false);
        navigate('/logout');
      },
    }
  ];

  const handleAllContactsPage = () => {
    dispatch({
      type: reducerCases.SET_ALL_CONTACTS_PAGE,

    });
  }

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center">
      <div className="cursor-pointer">
        <Avatar type='sm' image={userInfo?.profileImage} />
      </div>
      <div className="flex gap-6">
        <BsFillChatLeftTextFill
          className="text-panel-header-icon cursor-pointer text-xl"
          title="New Chat"
          onClick={handleAllContactsPage}
        />
        <>
          <BsThreeDotsVertical
            className="text-panel-header-icon cursor-pointer text-xl"
            title="Menu"
            onClick={(e) => showContextMenu(e)}
            id="context-opener"
          />
          {
            isContextMenuVisible && (
              <ContextMenu
                options={contextMenuOptions}
                coordinates={contextMenuCoordinates}
                contextMenu={isContextMenuVisible}
                setContextMenu={setIsContextMenuVisible}
              />
            )
          }{

          }
        </>
      </div>
    </div>
  );
}

export default ChatListHeader;