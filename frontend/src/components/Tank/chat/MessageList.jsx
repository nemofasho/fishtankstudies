import { useEffect, useRef } from "react";

import MessageBubble from "./MessageBubble";

function MessageList({ messages }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  return (
    <div className="message-list">

      {messages.length === 0 ? (
        <div className="chat-empty">
          <h3>No messages yet</h3>

          <p>
            Start the conversation with your Tank.
          </p>
        </div>
      ) : (
        messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
          />
        ))
      )}

      <div ref={messagesEndRef} />

    </div>
  );
}

export default MessageList;