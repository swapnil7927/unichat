import ChatContainer from "./ChatContainer";
import ChatHeader from "./ChatHeader";
import MessageBar from "./MessageBar";



const Chat = () => {
  return (
    <div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col h-screen z-10">
      <ChatHeader />
      <ChatContainer />
      <MessageBar />
    </div>
  );
}

export default Chat;