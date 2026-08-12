function MessageBubble({ message }) {
  return (
    <div
      className={`message ${
        message.isCurrentUser ? "message-own" : ""
      }`}
    >
      {!message.isCurrentUser && (
        <span className="message-author">
          {message.author}
        </span>
      )}

      <div className="message-content">
        <p>{message.content}</p>
      </div>

      <span className="message-time">
        {message.time}
      </span>
    </div>
  );
}

export default MessageBubble;