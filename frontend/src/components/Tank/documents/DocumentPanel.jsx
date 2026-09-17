import { useState } from "react";
import DocumentEditor from "./DocumentEditor";

function DocumentPanel({
  tank,
  documents,
  selectedDocumentId,
  onSelectDocument,
  onCreateDocument,
  onUpdateDocument,
  onDeleteDocument
}) {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const selectedDocument =
    documents.find(
      document => document.id === selectedDocumentId
    ) || null;

  async function handleCreate() {
    try {
      await onCreateDocument();
    } catch (err) {
      console.error(
        "Failed to create document:",
        err
      );
    }
  }

  async function handleUpdate(
    documentId,
    documentData
  ) {
    return onUpdateDocument(
      documentId,
      documentData
    );
  }

  async function handleDelete(documentId) {
    try {
      await onDeleteDocument(documentId);
    } catch (err) {
      console.error(
        "Failed to delete document:",
        err
      );
    }
  }

  return (
    <section
      className={`document-panel ${
        sidebarCollapsed
          ? "sidebar-collapsed"
          : ""
      }`}
    >

      {/* DOCUMENT SIDEBAR */}
      <div className="document-sidebar">

        <div className="document-sidebar-header">

          <div>
            <h2>Shared Notes</h2>

            <span>
              {documents.length}{" "}
              {documents.length === 1
                ? "document"
                : "documents"}
            </span>
          </div>

          <div className="document-sidebar-actions">

            {/* CREATE DOCUMENT */}
            <button
              type="button"
              className="document-new-button"
              onClick={handleCreate}
              title="Create document"
              aria-label="Create document"
            >
              +
            </button>

            {/* COLLAPSE SIDEBAR */}
            <button
              type="button"
              className="document-collapse-button"
              onClick={() =>
                setSidebarCollapsed(true)
              }
              title="Minimize document sidebar"
              aria-label="Minimize document sidebar"
            >
              ‹
            </button>

          </div>

        </div>

        {/* DOCUMENT LIST */}
        <div className="document-list">

          {documents.length === 0 ? (
            <div className="document-empty">

              <p>No documents yet.</p>

              <button
                type="button"
                onClick={handleCreate}
              >
                Create your first document
              </button>

            </div>
          ) : (
            documents.map(document => (

              <button
                key={document.id}
                type="button"
                className={
                  `document-list-item ${
                    selectedDocumentId === document.id
                      ? "active"
                      : ""
                  }`
                }
                onClick={() =>
                  onSelectDocument(document.id)
                }
              >

                <span className="document-list-icon">
                  📄
                </span>

                <span className="document-list-info">

                  <strong>
                    {document.title ||
                      "Untitled Document"}
                  </strong>

                  <small>
                    {formatUpdatedDate(
                      document.updatedAt
                    )}
                  </small>

                </span>

              </button>

            ))
          )}

        </div>

      </div>


      {/* DOCUMENT EDITOR */}
      <div className="document-main">

        {/* SHOW SIDEBAR BUTTON WHEN COLLAPSED */}
        {sidebarCollapsed && (
          <button
            type="button"
            className="document-expand-button"
            onClick={() =>
              setSidebarCollapsed(false)
            }
            title="Show documents"
            aria-label="Show documents"
          >
            ›
          </button>
        )}

        {selectedDocument ? (

          <DocumentEditor
            key={selectedDocument.id}
            document={selectedDocument}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            sidebarCollapsed={sidebarCollapsed}
          />

        ) : (

          <div className="document-no-selection">

            <div className="document-no-selection-icon">
              📝
            </div>

            <h2>Shared Notes</h2>

            <p>
              Create a document to start
              studying together.
            </p>

            <button
              type="button"
              onClick={handleCreate}
            >
              Create Document
            </button>

          </div>

        )}

      </div>

    </section>
  );
}


/* =========================
   FORMAT UPDATED DATE
   ========================= */

function formatUpdatedDate(dateString) {
  if (!dateString) {
    return "Not saved yet";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Recently updated";
  }

  return `Updated ${date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  })}`;
}


export default DocumentPanel;