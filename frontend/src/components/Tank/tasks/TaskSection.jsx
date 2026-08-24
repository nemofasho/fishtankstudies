import React from "react";

function TaskSection({ tasks = [], onTaskSelect }) {
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