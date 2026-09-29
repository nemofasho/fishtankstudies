import {
  useEffect,
  useRef,
  useState
} from "react";

const MAX_FILE_SIZE =
  25 * 1024 * 1024;

const MAX_FILES = 10;

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

function MessageInput({
  onSubmit,
  disabled = false
}) {

  const [content, setContent] =
    useState("");

  const [files, setFiles] =
    useState([]);

  const [fileError, setFileError] =
    useState("");

  const fileInputRef =
    useRef(null);

  function getExtension(
    fileName
  ) {

    const parts =
      fileName
        .toLowerCase()
        .split(".");

    return parts.length > 1
      ? parts.pop()
      : "";
  }

  function addFiles(event) {

    const selectedFiles =
      Array.from(
        event.target.files || []
      );

    setFileError("");

    if (!selectedFiles.length) {
      return;
    }

    const remainingSlots =
      MAX_FILES - files.length;

    if (
      selectedFiles.length >
      remainingSlots
    ) {

      setFileError(
        `You can attach up to ${MAX_FILES} files per message.`
      );

      event.target.value = "";

      return;
    }

    const invalidFile =
      selectedFiles.find(file => {

        const extension =
          getExtension(file.name);

        return (
          file.size >
            MAX_FILE_SIZE ||
          !ALLOWED_EXTENSIONS.has(
            extension
          )
        );
      });

    if (invalidFile) {

      const extension =
        getExtension(
          invalidFile.name
        );

      if (
        invalidFile.size >
        MAX_FILE_SIZE
      ) {

        setFileError(
          `${invalidFile.name} is larger than 25 MB.`
        );

      } else {

        setFileError(
          `File type .${extension || "unknown"} is not supported.`
        );
      }

      event.target.value = "";

      return;
    }

    setFiles(
      previousFiles => [
        ...previousFiles,
        ...selectedFiles
      ]
    );

    event.target.value = "";
  }

  function removeFile(index) {

    setFiles(
      previousFiles =>
        previousFiles.filter(
          (_, fileIndex) =>
            fileIndex !== index
        )
    );

    setFileError("");
  }

  function clearFiles() {

    setFiles([]);

    setFileError("");
  }

  async function handleSubmit(
    event
  ) {

    event.preventDefault();

    if (
      disabled ||
      (
        !content.trim() &&
        files.length === 0
      )
    ) {
      return;
    }

    const contentToSend =
      content.trim();

    const filesToSend =
      [...files];

    try {

      await onSubmit(
        contentToSend,
        filesToSend
      );

      setContent("");

      clearFiles();

    } catch {
      // Keep draft/files if sending fails.
    }
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
      onSubmit={handleSubmit}
    >

      <input
        ref={fileInputRef}
        type="file"
        className="message-file-input"
        multiple
        accept="
          image/*,
          video/*,
          .pdf,
          .doc,
          .docx,
          .txt,
          .csv,
          .xls,
          .xlsx,
          .ppt,
          .pptx
        "
        onChange={addFiles}
        disabled={disabled}
      />

      <div className="message-input-main">

        {files.length > 0 && (

          <div className="message-attachment-preview-list">

            {files.map(
              (file, index) => (

                <AttachmentPreview
                  key={
                    `${file.name}-${file.size}-${file.lastModified}-${index}`
                  }
                  file={file}
                  onRemove={() =>
                    removeFile(index)
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

        <textarea
          value={content}
          onChange={
            event =>
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

      </div>

      <button
        type="button"
        className="message-attach-button"
        onClick={() =>
          fileInputRef.current?.click()
        }
        disabled={
          disabled ||
          files.length >= MAX_FILES
        }
        title="Attach files"
        aria-label="Attach files"
      >
        📎
      </button>

      <button
        type="submit"
        className="message-send-button"
        disabled={
          disabled ||
          (
            !content.trim() &&
            files.length === 0
          )
        }
      >
        {disabled
          ? "Sending..."
          : "Send"}
      </button>

    </form>
  );
}

function AttachmentPreview({
  file,
  onRemove
}) {

  const isImage =
    file.type.startsWith(
      "image/"
    );

  const isVideo =
    file.type.startsWith(
      "video/"
    );

  const [previewUrl] =
    useState(() =>
      isImage || isVideo
        ? URL.createObjectURL(file)
        : ""
    );

  useEffect(() => {

    if (!previewUrl) {
      return undefined;
    }

    return () =>
      URL.revokeObjectURL(
        previewUrl
      );

  }, [previewUrl]);

  return (

    <div className="message-attachment-preview">

      <div className="message-attachment-preview-media">

        {isImage &&
        previewUrl ? (

          <img
            src={previewUrl}
            alt={file.name}
          />

        ) : isVideo &&
          previewUrl ? (

          <video
            src={previewUrl}
            controls
          />

        ) : (

          <span className="message-file-icon">
            📄
          </span>

        )}

      </div>

      <div className="message-attachment-preview-info">

        <span title={file.name}>
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
        aria-label={
          `Remove ${file.name}`
        }
        title="Remove attachment"
      >
        ×
      </button>

    </div>
  );
}

function formatFileSize(
  bytes
) {

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

export default MessageInput;