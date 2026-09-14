import { useEffect, useRef, useState } from "react";

import MessageInput from "./MessageInput";

function ChatWindow({
    tank,
    messages = [],
    currentUserId,
    onSendMessage,
    onDeleteMessage,
    onEditMessage
}) {

    const [sending, setSending] =
        useState(false);

    const [editingMessageId, setEditingMessageId] =
        useState(null);

    const [editContent, setEditContent] =
        useState("");

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


    /* =========================
       Edit
    ========================= */

    function handleStartEdit(message) {

        setEditingMessageId(
            message.id
        );

        setEditContent(
            message.content || ""
        );
    }


    function handleCancelEdit() {

        setEditingMessageId(null);
        setEditContent("");
    }


    async function handleSaveEdit(messageId) {

        const trimmedContent =
            editContent.trim();

        if (!trimmedContent) {
            return;
        }

        if (!onEditMessage) {
            return;
        }

        try {

            await onEditMessage(
                messageId,
                trimmedContent
            );

            setEditingMessageId(null);
            setEditContent("");

        } catch (error) {

            console.error(
                "Failed to edit message:",
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
                            Number(message.senderId) ===
                            Number(currentUserId);

                        const isEditing =
                            editingMessageId ===
                            message.id;

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

                              <div className="message-row">

                                <div className="message-bubble">

                                    <span className="message-author">

                                        {message.senderUsername ||
                                            message.username ||
                                            "User"}

                                    </span>


                                    {isOwn &&
                                        !isEditing &&
                                        (onDeleteMessage ||
                                            onEditMessage) && (

                                        <div className="message-actions">

                                            <button
                                                type="button"
                                                className="message-menu-button"
                                                aria-label="Message options"
                                                onClick={(event) => {

                                                    event.stopPropagation();

                                                    const menu =
                                                        event.currentTarget
                                                            .nextElementSibling;

                                                    document
                                                        .querySelectorAll(
                                                            ".message-menu.open"
                                                        )
                                                        .forEach(
                                                            openMenu => {

                                                                if (
                                                                    openMenu !==
                                                                    menu
                                                                ) {
                                                                    openMenu.classList.remove(
                                                                        "open"
                                                                    );
                                                                }

                                                            }
                                                        );

                                                    menu?.classList.toggle(
                                                        "open"
                                                    );

                                                }}
                                            >
                                                ⋯
                                            </button>


                                            <div className="message-menu">

                                                {onEditMessage && (

                                                    <button
                                                        type="button"
                                                        onClick={() => {

                                                            handleStartEdit(
                                                                message
                                                            );

                                                            document
                                                                .querySelectorAll(
                                                                    ".message-menu.open"
                                                                )
                                                                .forEach(
                                                                    openMenu =>
                                                                        openMenu.classList.remove(
                                                                            "open"
                                                                        )
                                                                );

                                                        }}
                                                    >
                                                        Edit
                                                    </button>

                                                )}


                                                {onDeleteMessage && (

                                                    <button
                                                        type="button"
                                                        className="message-menu-delete"
                                                        onClick={() => {

                                                            document
                                                                .querySelectorAll(
                                                                    ".message-menu.open"
                                                                )
                                                                .forEach(
                                                                    openMenu =>
                                                                        openMenu.classList.remove(
                                                                            "open"
                                                                        )
                                                                );

                                                            handleDeleteMessage(
                                                                message.id
                                                            );

                                                        }}
                                                    >
                                                        Delete
                                                    </button>

                                                )}

                                            </div>

                                        </div>

                                    )}

                                    </div>
                                </div>


                                {isEditing ? (

                                    <div className="message-edit">

                                        <textarea
                                            value={editContent}
                                            onChange={event =>
                                                setEditContent(
                                                    event.target.value
                                                )
                                            }
                                            autoFocus
                                        />

                                        <div className="message-edit-actions">

                                            <button
                                                type="button"
                                                onClick={
                                                    handleCancelEdit
                                                }
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleSaveEdit(
                                                        message.id
                                                    )
                                                }
                                                disabled={
                                                    !editContent.trim()
                                                }
                                            >
                                                Save
                                            </button>

                                        </div>

                                    </div>

                                ) : (

                                    <div className="message-content">

                                        <p>
                                            {message.content}
                                        </p>

                                    </div>

                                )}


                                <span className="message-time">

                                    {message.timestamp &&
                                        new Date(
                                            message.timestamp
                                        ).toLocaleTimeString(
                                            [],
                                            {
                                                hour: "numeric",
                                                minute: "2-digit"
                                            }
                                        )}

                                </span>

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