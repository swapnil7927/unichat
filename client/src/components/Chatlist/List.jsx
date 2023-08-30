import { useEffect } from "react";
import { useStateContext } from "../../context/StateContext";
import { reducerCases } from "../../context/constants.js";
import { GET_INITIAL_CONTACTS_ROUTE } from "../../utils/ApiRoutes.js";
import axios from "axios";
import ChatListItem from "./ChatListItem";



const List = () => {

  const [{ userInfo, userContacts, filteredContacts }, dispatch] = useStateContext();

  useEffect(() => {

    const getContacts = async () => {
      try {
        const { data: { users, onlineUsers } } = await axios.get(`${GET_INITIAL_CONTACTS_ROUTE}/${userInfo.id}`);
        dispatch({ type: reducerCases.SET_ONLINE_USERS, onlineUsers });
        dispatch({ type: reducerCases.SET_USER_CONTACTS, userContacts: users });

      } catch (err) {
        console.log(err)
      }
    }

    if (userInfo?.id) getContacts();
  }, [userInfo]);

  return (
    <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
      {
        filteredContacts && filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <ChatListItem data={contact} key={contact.id} />
          ))
        ) : (
          userContacts.map((contact) => (
            <ChatListItem data={contact} key={contact.id} />
          ))
        )
      }
    </div>
  );
}

export default List;