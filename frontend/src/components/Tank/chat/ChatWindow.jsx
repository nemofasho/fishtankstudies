import { useEffect, useRef } from "react";
import MessageInput from "./MessageInput";

function ChatWindow({
  tank,
  messages = [],
  onSendMessage,
  currentUserId,
  loading = false,
  error = ""
}) {
  const messagesEndRef = useRef(null);

  // Scroll to the newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

  console.log("CURRENT USER ID:", currentUserId);
  console.log("MESSAGES:", messages);

  return (
    <section className="chat-window">

      {/* Chat Header */}
      <header className="chat-header">
        <div>
          <h2>
            {tank?.name || "Tank Chat"}
          </h2>

          <span className="chat-member-count">
            {tank?.memberCount ?? 0}{" "}
            {tank?.memberCount === 1
              ? "member"
              : "members"}
          </span>
        </div>
      </header>

      {/* Messages */}
      <div className="message-list">
        {loading ? (
          <div className="chat-empty">
            <h3>Loading messages...</h3>
          </div>
        ) : error ? (
          <div className="chat-empty">
            <h3>Unable to load messages</h3>
            <p>{error}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="chat-empty">
            <h3>No messages yet</h3>

            <p>
              Start the conversation with your Tank.
            </p>
          </div>
        ) : (
          messages.map((message) => {

            const senderId =
              Number(message.senderId);

            const userId =
              Number(currentUserId);

            const isOwnMessage =
              senderId === userId;

            console.log(
              "MESSAGE OWNERSHIP:",
              {
                senderId,
                userId,
                isOwnMessage,
                message
              }
            );

            console.log("SENDER ID:", message.senderId);
            console.log(
              "COMPARE:",
              Number(message.senderId),
              Number(currentUserId),
              Number(message.senderId) === Number(currentUserId)
        );

            return (
              <div
                key={message.id}
                className={
                  isOwnMessage
                    ? "message message-own"
                    : "message"
                }
              >

                {/* Sender */}
                <span className="message-author">
                  {message.senderUsername ||
                    "User"}
                </span>

                {/* Message */}
                <div className="message-content">
                  <p>
                    {message.content}
                  </p>
                </div>

                {/* Timestamp */}
                {message.timestamp && (
                  <span className="message-time">
                    {new Date(
                      message.timestamp
                    ).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit"
                    })}
                  </span>
                )}

              </div>
            );
          })
        )}

        {/* Auto-scroll target */}
        <div ref={messagesEndRef} />

      </div>

      {/* Message Input */}
      <MessageInput
        onSubmit={onSendMessage}
      />

    </section>
  );
}

export default ChatWindow;