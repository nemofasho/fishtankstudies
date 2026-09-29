function TaskItem({
  task,
  onUpdate,
  onDelete,
  onSelect,
  selected = false
}) {
  async function handleToggleComplete(event) {
    event.stopPropagation();

    if (!onUpdate) return;

    try {
      await onUpdate(task.id, {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        completed: !task.completed
      });
    } catch (error) {
      console.error(
        "Failed to update task:",
        error
      );
    }
  }

  async function handleDelete(event) {
    event.stopPropagation();

    if (!onDelete) return;

    const confirmed = window.confirm(
      "Delete this task?"
    );

    if (!confirmed) return;

    try {
      await onDelete(task.id);
    } catch (error) {
      console.error(
        "Failed to delete task:",
        error
      );
    }
  }

  function handleSelect() {
    if (onSelect) {
      onSelect(task);
    }
  }

  const hasDueDate =
    task.dueDate || task.dueAt;

  let formattedDueDate = "";

  if (hasDueDate) {
    const date = new Date(hasDueDate);

    if (!Number.isNaN(date.getTime())) {
      formattedDueDate = date.toLocaleDateString([], {
        month: "short",
        day: "numeric"
      });
    }
  }

  return (
    <article
      className={`task-item ${
        selected ? "task-item-selected" : ""
      }`}
      onClick={handleSelect}
      onKeyDown={event => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          handleSelect();
        }
      }}
      tabIndex={0}
      role="button"
      aria-pressed={selected}
    >
      <button
        type="button"
        className={`task-checkbox ${
          task.completed ? "checked" : ""
        }`}
        onClick={handleToggleComplete}
        aria-label={
          task.completed
            ? "Mark task incomplete"
            : "Mark task complete"
        }
      >
        {task.completed ? "✓" : ""}
      </button>

      <div className="task-content">
        <span
          className={`task-title ${
            task.completed ? "completed" : ""
          }`}
        >
          {task.title}
        </span>

        {formattedDueDate && (
          <span className="task-due-date">
            Due {formattedDueDate}
          </span>
        )}
      </div>

      {onDelete && (
        <button
          type="button"
          className="task-delete-button"
          onClick={handleDelete}
          aria-label={`Delete ${task.title}`}
        >
          ×
        </button>
      )}
    </article>
  );
}

export default TaskItem;