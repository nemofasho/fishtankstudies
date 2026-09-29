function TaskDetails({ task, onClose }) {
  if (!task) {
    return (
      <section className="task-details task-details-empty">
        <div>
          <h2>Select a Task</h2>
          <p>
            Choose a task from the Workspace to view its details.
          </p>
        </div>
      </section>
    );
  }

  let formattedDueDate = "No due date";

  if (task.dueDate) {
    const date = new Date(`${task.dueDate}T00:00:00`);

    if (!Number.isNaN(date.getTime())) {
      formattedDueDate = date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: "numeric"
      });
    }
  }

  return (
    <section className="task-details">
      <header className="task-details-header">
        <div>
          <span className="task-details-label">
            Task Details
          </span>

          <h2 className={task.completed ? "completed" : ""}>
            {task.title}
          </h2>
        </div>

        {onClose && (
          <button
            type="button"
            className="task-details-close"
            onClick={onClose}
            aria-label="Close task details"
          >
            ×
          </button>
        )}
      </header>

      <div className="task-details-status">
        <span
          className={`task-status-badge ${
            task.completed ? "completed" : "incomplete"
          }`}
        >
          {task.completed ? "Completed" : "Incomplete"}
        </span>
      </div>

      <div className="task-details-section">
        <h3>Description</h3>

        <p>
          {task.description?.trim()
            ? task.description
            : "No description provided."}
        </p>
      </div>

      <div className="task-details-section">
        <h3>Due Date</h3>

        <p>{formattedDueDate}</p>
      </div>
    </section>
  );
}

export default TaskDetails;