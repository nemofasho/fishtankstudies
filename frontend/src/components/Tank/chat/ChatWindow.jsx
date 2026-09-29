import { useEffect, useRef, useState } from "react";
import { getAttachmentUrl } from "../../../services/messageService";

function ChatWindow({
    tank,
    messages,
    currentUserId,
    onSendMessage,
    onDeleteMessage,
    onEditMessage
}) {
    const [editingMessageId, setEditingMessageId] =
        useState(null);

    const [editingContent, setEditingContent] =
        useState("");

    const [openMenuId, setOpenMenuId] =
        useState(null);

    const [sending, setSending] =
        useState(false);

    const messageListRef =
        useRef(null);

    useEffect(() => {
        const messageList =
            messageListRef.current;

        if (!messageList) {
            return;
        }

        messageList.scrollTop =
            messageList.scrollHeight;
    }, [messages]);

    function startEditing(message) {
        setEditingMessageId(message.id);
        setEditingContent(
            message.content || ""
        );
        setOpenMenuId(null);
    }

    function cancelEditing() {
        setEditingMessageId(null);
        setEditingContent("");
    }

    async function handleSaveEdit(messageId) {
        const content =
            editingContent.trim();

        if (!content) {
            return;
        }

        try {
            await onEditMessage(
                messageId,
                content
            );

            cancelEditing();
        } catch (error) {
            console.error(
                "Failed to edit message:",
                error
            );
        }
    }

    async function handleDelete(messageId) {
        setOpenMenuId(null);

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

    async function handleSendMessage(
        content,
        files = []
    ) {
        if (
            !content?.trim() &&
            files.length === 0
        ) {
            return;
        }

        try {
            setSending(true);

            await onSendMessage(
                content,
                files
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

    return (
        <section className="chat-window">
            <div className="chat-header">
                <div>
                    <h2>Chat</h2>
                </div>
            </div>

            <div
                className="message-list"
                ref={messageListRef}
            >
                {messages.length === 0 ? (
                    <div className="chat-empty">
                        <div className="chat-empty-icon">
                            💬
                        </div>

                        <h3>
                            No messages yet
                        </h3>

                        <p>
                            Start the
                            conversation with
                            your tank members.
                        </p>
                    </div>
                ) : (
                    messages.map(message => {
                        const isOwnMessage =
                            Number(
                                message.senderId
                            ) ===
                            Number(
                                currentUserId
                            );

                        const isEditing =
                            editingMessageId ===
                            message.id;

                        const attachments =
                            message.attachments ||
                            [];

                        return (
                            <div
                                key={
                                    message.id
                                }
                                className={`message ${
                                    isOwnMessage
                                        ? "message-own"
                                        : "message-other"
                                }`}
                            >
                                <div className="message-content-wrapper">
                                    {!isOwnMessage && (
                                        <div className="message-sender">
                                            {
                                                message.senderUsername
                                            }
                                        </div>
                                    )}

                                    <div className="message-bubble-container">
                                        {isEditing ? (
                                            <div className="message-edit-container">
                                                <textarea
                                                    value={
                                                        editingContent
                                                    }
                                                    onChange={event =>
                                                        setEditingContent(
                                                            event
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                    onKeyDown={event => {
                                                        if (
                                                            event.key ===
                                                                "Enter" &&
                                                            !event.shiftKey
                                                        ) {
                                                            event.preventDefault();

                                                            handleSaveEdit(
                                                                message.id
                                                            );
                                                        }

                                                        if (
                                                            event.key ===
                                                                "Escape"
                                                        ) {
                                                            cancelEditing();
                                                        }
                                                    }}
                                                    autoFocus
                                                />

                                                <div className="message-edit-actions">
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            cancelEditing
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
                                                            !editingContent.trim()
                                                        }
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="message-bubble">
                                                    {message.content && (
                                                        <div className="message-text">
                                                            {message.content}
                                                        </div>
                                                    )}

                                                    {attachments.length >
                                                        0 && (
                                                        <div className="message-attachments">
                                                            {attachments.map(
                                                                attachment => (
                                                                    <AttachmentDisplay
                                                                        key={
                                                                            attachment.id
                                                                        }
                                                                        attachment={
                                                                            attachment
                                                                        }
                                                                        tankId={
                                                                            tank?.id
                                                                        }
                                                                    />
                                                                )
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {isOwnMessage && (
                                                    <div
                                                        className="message-menu-container"
                                                        onClick={event =>
                                                            event.stopPropagation()
                                                        }
                                                    >
                                                        <button
                                                            type="button"
                                                            className="message-menu-button"
                                                            onClick={() => {
                                                                setOpenMenuId(
                                                                    currentId =>
                                                                        currentId ===
                                                                        message.id
                                                                            ? null
                                                                            : message.id
                                                                );
                                                            }}
                                                            aria-label="Message options"
                                                            title="Message options"
                                                        >
                                                            ⋯
                                                        </button>

                                                        {openMenuId === message.id && (
                                                            <div className="message-menu">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        startEditing(
                                                                            message
                                                                        );
                                                                    }}
                                                                >
                                                                    Edit
                                                                </button>

                                                                <button
                                                                    type="button"
                                                                    className="message-delete-option"
                                                                    onClick={() => {
                                                                        handleDelete(
                                                                            message.id
                                                                        );
                                                                    }}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    <div className="message-timestamp">
                                        {formatMessageTime(
                                            message.timestamp
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <MessageInput
                onSubmit={
                    handleSendMessage
                }
                disabled={sending}
            />
        </section>
    );
}

function MessageInput({
    onSubmit,
    disabled
}) {
    const [content, setContent] =
        useState("");

    const [files, setFiles] =
        useState([]);

    const [fileError, setFileError] =
        useState("");

    const fileInputRef =
        useRef(null);

    const MAX_FILES = 10;

    const MAX_FILE_SIZE =
        25 * 1024 * 1024;

    const ALLOWED_EXTENSIONS =
        new Set([
            "jpg",
            "jpeg",
            "png",
            "gif",
            "webp",
            "mp4",
            "webm",
            "mov",
            "pdf",
            "doc",
            "docx",
            "txt",
            "csv",
            "xls",
            "xlsx",
            "ppt",
            "pptx"
        ]);

    function getFileExtension(
        fileName
    ) {
        const lastDot =
            fileName.lastIndexOf(".");

        if (
            lastDot === -1 ||
            lastDot ===
                fileName.length - 1
        ) {
            return "";
        }

        return fileName
            .substring(lastDot + 1)
            .toLowerCase();
    }

    function handleFileSelection(
        event
    ) {
        const selectedFiles =
            Array.from(
                event.target.files || []
            );

        if (
            selectedFiles.length === 0
        ) {
            return;
        }

        setFileError("");

        const availableSlots =
            MAX_FILES - files.length;

        if (availableSlots <= 0) {
            setFileError(
                `You can attach up to ${MAX_FILES} files.`
            );

            event.target.value = "";
            return;
        }

        const filesToAdd =
            selectedFiles.slice(
                0,
                availableSlots
            );

        const validFiles = [];

        for (const file of filesToAdd) {
            const extension =
                getFileExtension(
                    file.name
                );

            if (
                !ALLOWED_EXTENSIONS.has(
                    extension
                )
            ) {
                setFileError(
                    `${file.name} is not a supported file type.`
                );
                continue;
            }

            if (
                file.size >
                MAX_FILE_SIZE
            ) {
                setFileError(
                    `${file.name} is larger than 25 MB.`
                );
                continue;
            }

            validFiles.push(file);
        }

        setFiles(previousFiles => [
            ...previousFiles,
            ...validFiles
        ]);

        event.target.value = "";
    }

    function removeFile(index) {
        setFiles(previousFiles =>
            previousFiles.filter(
                (_, fileIndex) =>
                    fileIndex !== index
            )
        );
    }

    async function handleSubmit(
        event
    ) {
        event.preventDefault();

        if (
            disabled ||
            (!content.trim() &&
                files.length === 0)
        ) {
            return;
        }

        const contentToSend =
            content;

        const filesToSend = [
            ...files
        ];

        try {
            await onSubmit(
                contentToSend,
                filesToSend
            );

            setContent("");
            setFiles([]);
            setFileError("");
        } catch (error) {
            console.error(
                "Message send failed:",
                error
            );
        }
    }

    function handleKeyDown(event) {
        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();

            if (
                !disabled &&
                (content.trim() ||
                    files.length > 0)
            ) {
                event.currentTarget
                    .form
                    ?.requestSubmit();
            }
        }
    }

    return (
        <form
            className="message-input"
            onSubmit={handleSubmit}
        >
            {files.length > 0 && (
                <div className="message-attachment-preview-list">
                    {files.map(
                        (file, index) => (
                            <AttachmentPreview
                                key={`${file.name}-${file.size}-${index}`}
                                file={file}
                                onRemove={() =>
                                    removeFile(
                                        index
                                    )
                                }
                            />
                        )
                    )}
                </div>
            )}

            {fileError && (
                <div className="message-attachment-error">
                    {fileError}
                </div>
            )}

            <div className="message-input-row">
                <input
                    ref={fileInputRef}
                    type="file"
                    className="message-file-input"
                    multiple
                    accept={[
                        ".jpg",
                        ".jpeg",
                        ".png",
                        ".gif",
                        ".webp",
                        ".mp4",
                        ".webm",
                        ".mov",
                        ".pdf",
                        ".doc",
                        ".docx",
                        ".txt",
                        ".csv",
                        ".xls",
                        ".xlsx",
                        ".ppt",
                        ".pptx"
                    ].join(",")}
                    onChange={
                        handleFileSelection
                    }
                    disabled={disabled}
                />

                <button
                    type="button"
                    className="message-attach-button"
                    onClick={() =>
                        fileInputRef.current?.click()
                    }
                    disabled={disabled}
                    title="Attach files"
                    aria-label="Attach files"
                >
                    📎
                </button>

                <div className="message-input-main">
                    <textarea
                        value={content}
                        onChange={event =>
                            setContent(
                                event.target
                                    .value
                            )
                        }
                        onKeyDown={
                            handleKeyDown
                        }
                        placeholder="Type a message..."
                        rows={1}
                        disabled={disabled}
                    />
                </div>

                <button
                    type="submit"
                    className="message-send-button"
                    disabled={
                        disabled ||
                        (!content.trim() &&
                            files.length === 0)
                    }
                >
                    Send
                </button>
            </div>
        </form>
    );
}

function AttachmentPreview({
    file,
    onRemove
}) {
    const [previewUrl, setPreviewUrl] =
        useState(null);

    const isImage =
        file.type.startsWith(
            "image/"
        );

    const isVideo =
        file.type.startsWith(
            "video/"
        );

    useEffect(() => {
        if (!isImage && !isVideo) {
            return undefined;
        }

        const url =
            URL.createObjectURL(file);

        setPreviewUrl(url);

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [file, isImage, isVideo]);

    return (
        <div className="message-attachment-preview">
            <div className="message-attachment-preview-media">
                {previewUrl &&
                isImage ? (
                    <img
                        src={previewUrl}
                        alt={file.name}
                    />
                ) : previewUrl &&
                  isVideo ? (
                    <video
                        src={previewUrl}
                        muted
                    />
                ) : (
                    <span>
                        📄
                    </span>
                )}
            </div>

            <div className="message-attachment-preview-info">
                <span>
                    {file.name}
                </span>

                <small>
                    {formatFileSize(
                        file.size
                    )}
                </small>
            </div>

            <button
                type="button"
                className="message-attachment-remove"
                onClick={onRemove}
                aria-label={`Remove ${file.name}`}
                title="Remove attachment"
            >
                ×
            </button>
        </div>
    );
}

function AttachmentDisplay({
    attachment,
    tankId
}) {
    if (
        !tankId ||
        !attachment?.id
    ) {
        return null;
    }

    const url =
        getAttachmentUrl(
            tankId,
            attachment.id
        );

    const contentType =
        attachment.contentType ||
        "";

    const isImage =
        contentType.startsWith(
            "image/"
        );

    const isVideo =
        contentType.startsWith(
            "video/"
        );

    if (isImage) {
        return (
            <a
                className="message-image-attachment"
                href={url}
                target="_blank"
                rel="noreferrer"
            >
                <img
                    src={url}
                    alt={
                        attachment.fileName ||
                        "Image attachment"
                    }
                />
            </a>
        );
    }

    if (isVideo) {
        return (
            <div className="message-video-attachment">
                <video
                    src={url}
                    controls
                    preload="metadata"
                />

                <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="message-attachment-name"
                >
                    {attachment.fileName ||
                        "Video"}
                </a>
            </div>
        );
    }

    return (
        <a
            className="message-file-attachment"
            href={url}
        >
            <span className="message-file-icon">
                📄
            </span>

            <span className="message-file-details">
                <strong>
                    {attachment.fileName ||
                        "Attachment"}
                </strong>

                <small>
                    {formatFileSize(
                        attachment.fileSize
                    )}
                </small>
            </span>

            <span className="message-file-download">
                ↓
            </span>
        </a>
    );
}

function formatFileSize(bytes) {
    if (!bytes) {
        return "";
    }

    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (
        bytes <
        1024 * 1024
    ) {
        return `${Math.round(
            bytes / 1024
        )} KB`;
    }

    return `${(
        bytes /
        (1024 * 1024)
    ).toFixed(1)} MB`;
}

function formatMessageTime(
    timestamp
) {
    if (!timestamp) {
        return "";
    }

    const date =
        new Date(timestamp);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "";
    }

    return date.toLocaleString(
        [],
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );
}

export default ChatWindow;