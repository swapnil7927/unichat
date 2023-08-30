import { useEffect, useState } from "react";
import { useStateContext } from "../../context/StateContext";
import List from "./List";
import ChatListHeader from "./ChatListHeader";
import SearchBar from "./SearchBar";
import ContactsList from "./ContactsList";



const ChatList = () => {

  const [{ contactsPage }] = useStateContext();
  const [pageType, setPageType] = useState("default");

  useEffect(() => {
    if (contactsPage) {
      setPageType("all-contacts");
    } else {
      setPageType("default");
    }
  }, [contactsPage])

  return (
    <div className="bg-panel-header-background flex flex-col max-h-screen z-20">
      {
        (pageType === "default") && (
          <>
            <ChatListHeader />
            <SearchBar />
            <List />
          </>
        )
      }
      {
        (pageType === "all-contacts") && (
          <ContactsList />
        )
      }
    </div>
  );
}

export default ChatList;