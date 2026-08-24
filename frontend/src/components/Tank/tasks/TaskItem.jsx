function TaskItem({ task, onToggle }) {
  return (
    <div className="task-item">

      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
      />

      <div className="task-content">

        <span
          className={
            task.completed
              ? "task-title completed"
              : "task-title"
          }
        >
          {task.title}
        </span>

        {task.dueDate && (
          <span className="task-due-date">
            Due {task.dueDate}
          </span>
        )}

      </div>

    </div>
  );
}

export default TaskItem;