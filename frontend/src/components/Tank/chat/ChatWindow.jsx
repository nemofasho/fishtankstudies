import { useEffect, useRef, useState } from "react";

import MessageInput from "./MessageInput";


function ChatWindow({

  tank,

  messages = [],

  currentUserId,

  onSendMessage,

  onDeleteMessage

}) {

  const [sending, setSending] =
    useState(false);

  const messagesEndRef =
    useRef(null);


  /* =========================
     Auto Scroll
  ========================= */

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });

  }, [messages]);


  /* =========================
     Send
  ========================= */

  async function handleSendMessage(
    content
  ) {

    if (!content?.trim()) {
      return;
    }


    try {

      setSending(true);

      await onSendMessage(
        content.trim()
      );

    } catch (error) {

      console.error(
        "Failed to send message:",
        error
      );

      throw error;

    } finally {

      setSending(false);

    }

  }


  /* =========================
     Delete
  ========================= */

  async function handleDeleteMessage(
    messageId
  ) {

    if (!onDeleteMessage) {
      return;
    }


    const confirmed =
      window.confirm(
        "Delete this message?"
      );


    if (!confirmed) {
      return;
    }


    try {

      await onDeleteMessage(
        messageId
      );

    } catch (error) {

      console.error(
        "Failed to delete message:",
        error
      );

    }

  }


  return (

    <section className="chat-window">


      {/* HEADER */}

      <header className="chat-header">

        <div>

          <h2>
            {tank?.name || "Tank Chat"}
          </h2>

          <span className="chat-member-count">

            {messages.length}{" "}

            {messages.length === 1
              ? "message"
              : "messages"}

          </span>

        </div>

      </header>


      {/* MESSAGES */}

      <div className="message-list">

        {messages.length === 0 ? (

          <div className="chat-empty">

            <h3>
              No messages yet
            </h3>

            <p>
              Start the conversation
              with your Tank.
            </p>

          </div>

        ) : (

          messages.map(message => {

            const isOwn =
              Number(
                message.senderId
              ) ===
              Number(
                currentUserId
              );


            return (

              <div
                key={message.id}
                className={
                  `message ${
                    isOwn
                      ? "message-own"
                      : ""
                  }`
                }
              >

                <span className="message-author">

                  {message.senderUsername ||
                    message.username ||
                    "User"}

                </span>


                <div className="message-content">

                  <p>
                    {message.content}
                  </p>

                </div>


                <span className="message-time">

                  {message.timestamp &&
                    new Date(
                      message.timestamp
                    ).toLocaleTimeString(
                      [],
                      {
                        hour:
                          "numeric",
                        minute:
                          "2-digit"
                      }
                    )}

                </span>


                {isOwn &&
                  onDeleteMessage && (

                  <button
                    type="button"
                    className="message-delete-button"
                    onClick={() =>
                      handleDeleteMessage(
                        message.id
                      )
                    }
                  >
                    Delete
                  </button>

                )}

              </div>

            );

          })

        )}


        <div
          ref={messagesEndRef}
        />

      </div>


      {/* INPUT */}

      <div className="message-input-container">

        <MessageInput

          onSubmit={
            handleSendMessage
          }

          disabled={
            sending
          }

        />

      </div>

    </section>

  );

}


export default ChatWindow;