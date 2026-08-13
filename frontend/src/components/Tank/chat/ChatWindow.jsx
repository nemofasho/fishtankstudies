import { useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

import {
  sendMessage
} from "../../../services/messageService";

function ChatWindow({
  tank,
  messages: initialMessages = []
}) {
  const [messages, setMessages] = useState(
    initialMessages
  );

  const [sending, setSending] = useState(false);

  async function handleSendMessage(content) {
    try {
      setSending(true);

      const messageData = {
        content: content,
        tankId: tank.id
      };

      const savedMessage =
        await sendMessage(tank.id, userId, messageData);

      setMessages((previousMessages) => [
        ...previousMessages,
        savedMessage
      ]);

    } catch (error) {
      console.error(
        "Failed to send message:",
        error
      );

      alert("Failed to send message.");

    } finally {
      setSending(false);
    }
  }

  return (
    <section className="chat-window">

      <ChatHeader
        tankName={tank.name}
        memberCount={
          tank.members?.length || 0
        }
      />

      <MessageList
        messages={messages}
      />

      <MessageInput
        onSend={handleSendMessage}
        disabled={sending}
      />

    </section>
  );
}

export default ChatWindow;