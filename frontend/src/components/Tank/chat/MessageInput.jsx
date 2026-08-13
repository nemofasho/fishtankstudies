import { useState } from "react";

import SendButton from "./SendButton";

function MessageInput({
  onSend,
  disabled = false
}) {
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const trimmedMessage =
      message.trim();

    if (!trimmedMessage || disabled) {
      return;
    }

    await onSend(trimmedMessage);

    setMessage("");
  }

  function handleKeyDown(event) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
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
        placeholder={
          disabled
            ? "Sending..."
            : "Type a message..."
        }
        rows="1"
        disabled={disabled}
        aria-label="Message"
      />

      <SendButton
        disabled={
          disabled ||
          !message.trim()
        }
      />

    </form>
  );
}

export default MessageInput;