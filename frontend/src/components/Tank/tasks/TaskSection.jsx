import React from "react";

function TaskSection({ tasks = [], loading = false, error = "", onRetry, onTaskSelect }) {
    if (loading) {
        return (
            <section className="workspace-section">
                <div className="section-header">
                    <h3>Tasks</h3>
                </div>

                <p className="empty-section">
                    Loading tasks...
                </p>
            </section>
        );
    }
    
    if (error) {
        return (
            <section className="workspace-section">
                <div className="section-header">
                    <h3>Tasks</h3>
                </div>

                <p className="empty-section">
                    Unable to load tasks.
                </p>

                {onRetry && (
                    <button
                        type="button"
                        className="open-button"
                        onClick={onRetry}
                    >
                        Retry
                    </button>
                )}
            </section>
        );
    }

    if (tasks.length === 0) {
        return (
            <section className="workspace-section">
                <div className="section-header">
                    <h3>Tasks</h3>
                </div>

                <p className="empty-section">
                    No tasks yet.
                </p>
            </section>
        );
    }

    return (
        <section className="task-section">
            <div className="workspace-section-header">
                <h2>Tasks</h2>
                <span>{tasks.length}</span>
            </div>

            {tasks.length === 0 ? (
                <p className="empty-state">
                    No tasks yet.
                </p>
            ) : (
                <div className="task-list">
                    {tasks.map((task, index) => (
                        <button
                            key={task.id}
                            className={`task-item ${
                                task.completed ? "completed" : ""
                            }`}
                            onClick={() =>
                                onTaskSelect?.(task)
                            }
                        >
                            <span className="task-number">
                                {index + 1}
                            </span>

                            <span className="task-content">
                                <strong>{task.title}</strong>

                                {task.description && (
                                    <small>
                                        {task.description}
                                    </small>
                                )}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
}

export default TaskSection;