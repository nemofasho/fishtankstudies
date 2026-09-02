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
      className="task-form"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(event) =>
          setTitle(event.target.value)
        }
        disabled={saving}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(event) =>
          setDescription(event.target.value)
        }
        disabled={saving}
      />

      <input
        type="date"
        value={dueDate}
        onChange={(event) =>
          setDueDate(event.target.value)
        }
        disabled={saving}
      />

      <div className="task-form-actions">

        <button
          type="submit"
          disabled={
            saving || !title.trim()
          }
        >
          {saving ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </button>

      </div>
    </form>
  );
}

export default TaskForm;