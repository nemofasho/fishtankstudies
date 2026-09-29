import { useState } from "react";

function TaskForm({
  initialTask = null,
  onSubmit,
  onCancel
}) {
  const [title, setTitle] = useState(
    initialTask?.title || ""
  );

  const [description, setDescription] =
    useState(
      initialTask?.description || ""
    );

  const [dueDate, setDueDate] = useState(
    initialTask?.dueDate || ""
  );

  const [saving, setSaving] =
    useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
      setSaving(true);

      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDate || null
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      className="task-create-form"
      onSubmit={handleSubmit}
    >
      <div className="task-form-field">
        <label htmlFor="task-title">
          Task Name
        </label>

        <input
          id="task-title"
          type="text"
          placeholder="Biology Study"
          value={title}
          onChange={event =>
            setTitle(event.target.value)
          }
          disabled={saving}
          maxLength={100}
          required
        />
      </div>

      <div className="task-form-field">
        <label htmlFor="task-description">
          Description
        </label>

        <textarea
          id="task-description"
          placeholder="Review chapters 1–3..."
          value={description}
          onChange={event =>
            setDescription(event.target.value)
          }
          disabled={saving}
          rows={4}
        />
      </div>

      <div className="task-form-field">
        <label htmlFor="task-due-date">
          Due Date
        </label>

        <input
          id="task-due-date"
          type="date"
          value={dueDate}
          onChange={event =>
            setDueDate(event.target.value)
          }
          disabled={saving}
        />
      </div>

      <div className="task-modal-actions">
        <button
          type="button"
          className="task-cancel-button"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="task-create-button"
          disabled={
            saving || !title.trim()
          }
        >
          {saving
            ? "Saving..."
            : "Create Task"}
        </button>
      </div>
    </form>
  );
}

export default TaskForm;