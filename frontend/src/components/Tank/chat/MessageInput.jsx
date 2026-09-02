import { useState } from "react";


function MessageInput({
  onSubmit,
  disabled = false
}) {

  const [content, setContent] =
    useState("");


  function handleSubmit(
    event
  ) {

    event.preventDefault();

    if (
      disabled ||
      !content.trim()
    ) {
      return;
    }


    onSubmit(
      content.trim()
    );

    setContent("");

  }


  function handleKeyDown(
    event
  ) {

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
      className="message-input"
      onSubmit={
        handleSubmit
      }
    >

      <textarea

        value={content}

        onChange={event =>
          setContent(
            event.target.value
          )
        }

        onKeyDown={
          handleKeyDown
        }

        placeholder={
          disabled
            ? "Sending..."
            : "Type a message..."
        }

        disabled={disabled}

        rows={1}

      />


      <button

        type="submit"

        disabled={
          disabled ||
          !content.trim()
        }

      >

        {disabled
          ? "Sending..."
          : "Send"}

      </button>

    </form>

  );

}


export default MessageInput;