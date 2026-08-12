import { useState } from "react";

import SendButton from "./SendButton";

function MessageInput({ onSend }) {

  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return;
    }

    onSend(trimmedMessage);

    setMessage("");
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      handleSubmit(event);
    }
  }

  return (
    <form
      className="message-input-container"
      onSubmit={handleSubmit}
    >

      <textarea
        value={message}
        onChange={(event) =>
          setMessage(event.target.value)
        }
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        rows="1"
        aria-label="Message"
      />

      <SendButton
        disabled={!message.trim()}
      />

    </form>
  );
}

export default MessageInput;