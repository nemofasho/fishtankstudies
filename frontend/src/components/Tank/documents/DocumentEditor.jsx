import { useEffect, useRef, useState } from "react";

function DocumentEditor({
  document: documentData,
  onUpdate,
  onDelete,
  sidebarCollapsed
}) {
  const editorRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  const [title, setTitle] = useState(
    documentData.title || "Untitled Document"
  );
  const [saveStatus, setSaveStatus] = useState("Saved");

  const [activeFormats, setActiveFormats] = useState({
  bold: false,
  italic: false,
  underline: false,
  justifyLeft: false,
  justifyCenter: false,
  justifyRight: false,
  insertUnorderedList: false,
  insertOrderedList: false
});

const [exportMenuOpen, setExportMenuOpen] = useState(false);

  // Load the selected document into the editor
  useEffect(() => {
    setTitle(documentData.title || "Untitled Document");

    if (editorRef.current) {
      editorRef.current.innerHTML = documentData.content || "";
    }

    setSaveStatus("Saved");
  }, [documentData.id]);

  // Clear timeout when component is removed
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
  function handleSelectionChange() {
    if (!editorRef.current) return;

    const selection = window.getSelection();

    if (
      selection &&
      selection.rangeCount > 0 &&
      editorRef.current.contains(
        selection.anchorNode
      )
    ) {
      updateActiveFormats();
    }
  }

  window.document.addEventListener(
    "selectionchange",
    handleSelectionChange
  );

  return () => {
    window.document.removeEventListener(
      "selectionchange",
      handleSelectionChange
    );
  };
}, []);

  // Execute formatting commands
  function executeCommand(command, value = null) {
    if (!editorRef.current) return;

    editorRef.current.focus();

    window.document.execCommand(command, false, value);

    updateActiveFormats();
    handleEditorChange();
  }

  // Handle changes inside the editor
  function handleEditorChange() {
    setSaveStatus("Saving...");

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await saveDocument();
      } catch (err) {
        console.error("Failed to save document:", err);
        setSaveStatus("Save failed");
      }
    }, 800);
  }

  // Save document
  async function saveDocument() {
    if (!editorRef.current) return;

    const content = editorRef.current.innerHTML;

    const updatedDocument = await onUpdate(documentData.id, {
      title: title.trim() || "Untitled Document",
      content
    });

    if (updatedDocument && updatedDocument.title) {
      setTitle(updatedDocument.title);
    }

    setSaveStatus("Saved");
  }

  // Save when title loses focus
  function handleTitleBlur() {
    saveDocument();
  }

  // Keyboard shortcuts
  function handleKeyDown(event) {
    if (
      (event.ctrlKey || event.metaKey) &&
      event.key.toLowerCase() === "s"
    ) {
      event.preventDefault();
      saveDocument();
    }
  }

  function updateActiveFormats() {
  setActiveFormats({
    bold: window.document.queryCommandState("bold"),
    italic: window.document.queryCommandState("italic"),
    underline: window.document.queryCommandState("underline"),

    justifyLeft:
      window.document.queryCommandState("justifyLeft"),

    justifyCenter:
      window.document.queryCommandState("justifyCenter"),

    justifyRight:
      window.document.queryCommandState("justifyRight"),

    insertUnorderedList:
      window.document.queryCommandState(
        "insertUnorderedList"
      ),

    insertOrderedList:
      window.document.queryCommandState(
        "insertOrderedList"
      )
  });
}

function getCurrentDocumentContent() {
  if (editorRef.current) {
    return editorRef.current.innerHTML;
  }

  return documentData.content || "";
}

function getSafeFileName() {
  const title =
    documentData.title?.trim() ||
    "Untitled Document";

  return title
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, " ")
    .trim() || "Untitled Document";
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);

  const link = window.document.createElement("a");

  link.href = url;
  link.download = fileName;

  window.document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

function exportAsWord() {
  const content = getCurrentDocumentContent();
  const fileName = getSafeFileName();

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${escapeHtml(
          documentData.title || "Untitled Document"
        )}</title>

        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 40px;
          }

          img {
            max-width: 100%;
            height: auto;
          }

          table {
            border-collapse: collapse;
            width: 100%;
          }

          td,
          th {
            border: 1px solid #ccc;
            padding: 8px;
          }
        </style>
      </head>

      <body>
        ${content}
      </body>
    </html>
  `;

  const blob = new Blob([html], {
    type: "application/msword"
  });

  downloadBlob(blob, `${fileName}.doc`);
}

function exportAsHtml() {
  const content = getCurrentDocumentContent();
  const fileName = getSafeFileName();

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${escapeHtml(
          documentData.title || "Untitled Document"
        )}</title>

        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 900px;
            margin: 40px auto;
            padding: 0 30px;
          }

          img {
            max-width: 100%;
            height: auto;
          }

          table {
            border-collapse: collapse;
            width: 100%;
          }

          td,
          th {
            border: 1px solid #ccc;
            padding: 8px;
          }
        </style>
      </head>

      <body>
        ${content}
      </body>
    </html>
  `;

  const blob = new Blob([html], {
    type: "text/html"
  });

  downloadBlob(blob, `${fileName}.html`);
}

function exportAsPdf() {
  const content = getCurrentDocumentContent();

  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    alert(
      "Please allow pop-ups to export the document as PDF."
    );
    return;
  }

  printWindow.document.open();

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">

        <title>
          ${escapeHtml(
            documentData.title ||
              "Untitled Document"
          )}
        </title>

        <style>
          @page {
            margin: 1in;
          }

          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #000;
          }

          img {
            max-width: 100%;
            height: auto;
          }

          table {
            border-collapse: collapse;
            width: 100%;
          }

          td,
          th {
            border: 1px solid #999;
            padding: 8px;
          }

          @media print {
            body {
              margin: 0;
            }
          }
        </style>
      </head>

      <body>
        ${content}
      </body>
    </html>
  `);

  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}



  return (
    <div
  className={`document-editor ${
    sidebarCollapsed ? "sidebar-collapsed" : ""
  }`}
>

              {/* Document Header */}
    <header className="document-editor-header">

      <div className="document-title-section">

        <input
          className="document-title-input"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            setSaveStatus("Unsaved");
          }}
          onBlur={handleTitleBlur}
          onKeyDown={handleKeyDown}
          placeholder="Untitled Document"
          aria-label="Document title"
        />

        <span
          className={`document-save-status ${
            saveStatus === "Save failed" ? "error" : ""
          } ${
            sidebarCollapsed
              ? "document-save-status-collapsed"
              : ""
          }`}
        >
          {saveStatus}
        </span>

      </div>

      {/* Only show actions in the header when sidebar is collapsed */}
      {sidebarCollapsed && (
        <div className="document-header-actions">

          <div className="document-export-container">

            <button
              type="button"
              className="document-export-button"
              onClick={() =>
                setExportMenuOpen(
                  previous => !previous
                )
              }
            >
              Export
              <span className="document-export-arrow">
                ▾
              </span>
            </button>

            {exportMenuOpen && (
              <div className="document-export-menu">

                <button
                  type="button"
                  onClick={() => {
                    exportAsPdf();
                    setExportMenuOpen(false);
                  }}
                >
                  <span>📄</span>
                  Export as PDF
                </button>

                <button
                  type="button"
                  onClick={() => {
                    exportAsWord();
                    setExportMenuOpen(false);
                  }}
                >
                  <span>📝</span>
                  Export as Word
                </button>

                <button
                  type="button"
                  onClick={() => {
                    exportAsHtml();
                    setExportMenuOpen(false);
                  }}
                >
                  <span>🌐</span>
                  Export as HTML
                </button>

              </div>
            )}

          </div>

          <button
            type="button"
            className="document-delete-button"
            onClick={() => onDelete(documentData.id)}
          >
            Delete
          </button>

        </div>
      )}

    </header>


    {/* Export when sidebar is OPEN */}
    {!sidebarCollapsed && (
      <div className="document-export-container document-export-open">

        <button
          type="button"
          className="document-export-button"
          onClick={() =>
            setExportMenuOpen(
              previous => !previous
            )
          }
        >
          Export
          <span className="document-export-arrow">
            ▾
          </span>
        </button>

        {exportMenuOpen && (
          <div className="document-export-menu">

            <button
              type="button"
              onClick={() => {
                exportAsPdf();
                setExportMenuOpen(false);
              }}
            >
              <span>📄</span>
              Export as PDF
            </button>

            <button
              type="button"
              onClick={() => {
                exportAsWord();
                setExportMenuOpen(false);
              }}
            >
              <span>📝</span>
              Export as Word
            </button>

            <button
              type="button"
              onClick={() => {
                exportAsHtml();
                setExportMenuOpen(false);
              }}
            >
              <span>🌐</span>
              Export as HTML
            </button>

          </div>
        )}

      </div>
    )}


    {/* Delete when sidebar is OPEN */}
    {!sidebarCollapsed && (
      <button
        type="button"
        className="document-delete-button document-delete-open"
        onClick={() => onDelete(documentData.id)}
      >
        Delete
      </button>
    )}


      {/* Formatting Toolbar */}
      <div className="document-toolbar">

        {/* Undo / Redo */}
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => executeCommand("undo")}
          title="Undo"
          aria-label="Undo"
        >
          ↶
        </button>

        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => executeCommand("redo")}
          title="Redo"
          aria-label="Redo"
        >
          ↷
        </button>


        <span className="toolbar-divider" />


        {/* Text Style */}
        <select
          defaultValue="p"
          onMouseDown={(event) => {
            // Prevent the editor selection from being lost
            event.stopPropagation();
          }}
          onChange={(event) => {
            executeCommand("formatBlock", event.target.value);
          }}
          title="Text style"
          aria-label="Text style"
        >
          <option value="p">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>


        <span className="toolbar-divider" />


        {/* Bold */}
        <button
          type="button"
          className={`document-toolbar-button ${activeFormats.bold ? "active" : ""
          }`}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => executeCommand("bold")}
          title="Bold"
          aria-label="Bold"
        >
          <strong>B</strong>
        </button>


        {/* Italic */}
        <button
          type="button"
          className={`document-toolbar-button ${activeFormats.italic ? "active" : ""
          }`}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => executeCommand("italic")}
          title="Italic"
          aria-label="Italic"
        >
          <em>I</em>
        </button>


        {/* Underline */}
        <button
          type="button"
          className={`document-toolbar-button ${activeFormats.underline ? "active" : ""
          }`}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => executeCommand("underline")}
          title="Underline"
          aria-label="Underline"
        >
          <u>U</u>
        </button>


        <span className="toolbar-divider" />


        {/* Bulleted List */}
        <button
          type="button"
          className={`document-toolbar-button ${activeFormats.insertUnorderedList ? "active" : ""
          }`}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => executeCommand("insertUnorderedList")}
          title="Bulleted list"
          aria-label="Bulleted list"
        >
          •
        </button>


        {/* Numbered List */}
        <button
          type="button"
          className={`document-toolbar-button ${activeFormats.insertOrderedList ? "active" : ""
          }`}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => executeCommand("insertOrderedList")}
          title="Numbered list"
          aria-label="Numbered list"
        >
          1.
        </button>


        <span className="toolbar-divider" />


        {/* Align Left */}
        <button
          type="button"
          className={`document-toolbar-button ${activeFormats.justifyLeft ? "active" : ""
          }`}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => executeCommand("justifyLeft")}
          title="Align left"
          aria-label="Align left"
        >
          ≡
        </button>


        {/* Align Center */}
        <button
          type="button"
          className={`document-toolbar-button ${activeFormats.justifyCenter ? "active" : ""
          }`}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => executeCommand("justifyCenter")}
          title="Align center"
          aria-label="Align center"
        >
          ≡
        </button>


        {/* Align Right */}
        <button
          type="button"
          className={`document-toolbar-button ${activeFormats.justifyRight ? "active" : ""
          }`}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => executeCommand("justifyRight")}
          title="Align right"
          aria-label="Align right"
        >
          ≡
        </button>

      </div>


      {/* Editable Document Area */}
      <div
        ref={editorRef}
        className="document-content"
        contentEditable
        suppressContentEditableWarning
        onInput={handleEditorChange}
        onKeyDown={handleKeyDown}
        data-placeholder="Start typing your study notes..."
      />


      {/* Footer */}
      <footer className="document-editor-footer">
        <span>
          Shared with Tank members
        </span>

        <span>
          Press Ctrl + S to save
        </span>
      </footer>

    </div>
  );
}

export default DocumentEditor;