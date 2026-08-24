import { useState } from "react";

function MessageInput({
  onSubmit,
  disabled = false
}) {
  const [content, setContent] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent || disabled) {
      return;
    }

    onSubmit(trimmedContent);
    setContent("");
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
        value={content}
        onChange={(event) =>
          setContent(event.target.value)
        }
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        disabled={disabled}
        rows={1}
      />

      <button
        type="submit"
        className="send-button"
        disabled={
          disabled || !content.trim()
        }
      >
        {disabled ? "Sending..." : "Send"}
      </button>
    </form>
  );
}

export default MessageInput;