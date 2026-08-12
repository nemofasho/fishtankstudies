import { useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

function ChatWindow({ tankName, members }) {

  const [messages, setMessages] = useState([
    {
      id: 1,
      author: "Alex",
      content: "Did everyone finish the assignment?",
      time: "2:14 PM",
      isCurrentUser: false
    },
    {
      id: 2,
      author: "Nehemiah",
      content: "Almost. I'm working on the last question.",
      time: "2:15 PM",
      isCurrentUser: true
    },
    {
      id: 3,
      author: "Jordan",
      content: "I'm opening the whiteboard so we can go over it.",
      time: "2:16 PM",
      isCurrentUser: false
    }
  ]);

  function handleSendMessage(content) {

    const newMessage = {
      id: Date.now(),
      author: "Nehemiah",
      content,
      time: new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
      }),
      isCurrentUser: true
    };

    setMessages((previousMessages) => [
      ...previousMessages,
      newMessage
    ]);
  }

  return (
    <section className="chat-window">

      <ChatHeader
        tankName={tankName}
        memberCount={members.length}
      />

      <MessageList
        messages={messages}
      />

      <MessageInput
        onSend={handleSendMessage}
      />

    </section>
  );
}

export default ChatWindow;