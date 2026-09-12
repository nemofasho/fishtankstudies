import { useMemo, useState } from "react";
import TaskItem from "./TaskItem";
import TaskForm from "./TaskForm";

function TaskSection({
  tasks = [],
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onTaskSelect,
  selectedTaskId
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("default");

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    // Filter tasks
    if (filter === "completed") {
      result = result.filter(task => task.completed);
    }

    if (filter === "incomplete") {
      result = result.filter(task => !task.completed);
    }

    // Sort tasks
    if (sort === "title") {
      result.sort((a, b) =>
        (a.title || "").localeCompare(b.title || "")
      );
    }

    if (sort === "dueDate") {
      result.sort((a, b) => {
        const dateA = a.dueDate
          ? new Date(a.dueDate).getTime()
          : Infinity;

        const dateB = b.dueDate
          ? new Date(b.dueDate).getTime()
          : Infinity;

        return dateA - dateB;
      });
    }

    if (sort === "status") {
      result.sort((a, b) => {
        if (a.completed === b.completed) {
          return 0;
        }

        return a.completed ? 1 : -1;
      });
    }

    return result;
  }, [tasks, filter, sort]);

  const completedCount = tasks.filter(
    task => task.completed
  ).length;

  const incompleteCount =
    tasks.length - completedCount;

  async function handleCreateTask(taskData) {
    if (!onCreateTask) return;

    await onCreateTask(taskData);
    setShowCreateModal(false);
  }

  return (
    <>
      <section className="workspace-section task-section">
        <div className="section-header">
          <div>
            <h3>Tasks</h3>

            <span className="task-progress">
              {completedCount} of {tasks.length} completed
            </span>
          </div>

          <span className="section-count">
            {tasks.length}
          </span>
        </div>

        <div className="task-controls">
          <select
            value={filter}
            onChange={event => setFilter(event.target.value)}
            aria-label="Filter tasks"
          >
            <option value="all">
              All ({tasks.length})
            </option>

            <option value="incomplete">
              Incomplete ({incompleteCount})
            </option>

            <option value="completed">
              Completed ({completedCount})
            </option>
          </select>

          <select
            value={sort}
            onChange={event => setSort(event.target.value)}
            aria-label="Sort tasks"
          >
            <option value="default">
              Sort: Default
            </option>

            <option value="dueDate">
              Sort: Due Date
            </option>

            <option value="title">
              Sort: Title
            </option>

            <option value="status">
              Sort: Status
            </option>
          </select>
        </div>

        {filteredAndSortedTasks.length === 0 ? (
          <div className="empty-section">
            {tasks.length === 0 ? (
              <>
                <p>No tasks yet.</p>
                <p>Create a task to get started.</p>
              </>
            ) : (
              <p>No tasks match this filter.</p>
            )}
          </div>
        ) : (
          <div className="task-list">
            {filteredAndSortedTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdate={onUpdateTask}
                onDelete={onDeleteTask}
                onSelect={onTaskSelect}
                selected={task.id === selectedTaskId}
              />
            ))}
          </div>
        )}

        {onCreateTask && (
          <button
            type="button"
            className="add-button"
            onClick={() => setShowCreateModal(true)}
          >
            + Add Task
          </button>
        )}
      </section>

      {showCreateModal && (
        <div
          className="task-modal-overlay"
          onMouseDown={event => {
            if (event.target === event.currentTarget) {
              setShowCreateModal(false);
            }
          }}
        >
          <div
            className="task-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-task-title"
          >
            <div className="task-modal-header">
              <div>
                <span className="task-details-label">
                  New Task
                </span>

                <h2 id="create-task-title">
                  Create Task
                </h2>
              </div>

              <button
                type="button"
                className="task-details-close"
                onClick={() => setShowCreateModal(false)}
                aria-label="Close create task dialog"
              >
                ×
              </button>
            </div>

            <TaskForm
              onSubmit={handleCreateTask}
              onCancel={() => setShowCreateModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default TaskSection;