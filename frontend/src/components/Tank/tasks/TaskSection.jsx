import { useState } from "react";

import TaskForm from "../tasks/TaskForm";

function TaskSection({

  tasks = [],

  onTaskSelect,

  onCreateTask,

  onUpdateTask,

  onDeleteTask

}) {

  const [showForm, setShowForm] =
    useState(false);

  const [editingTask, setEditingTask] =
    useState(null);


  /* =========================
     Create
  ========================= */

  async function handleCreate(
    taskData
  ) {

    if (!onCreateTask) {
      return;
    }

    await onCreateTask(
      taskData
    );

    setShowForm(false);

  }


  /* =========================
     Edit
  ========================= */

  function handleEdit(task) {

    setEditingTask(task);

    setShowForm(false);

  }


  async function handleUpdate(
    taskData
  ) {

    if (!onUpdateTask) {
      return;
    }

    await onUpdateTask(
      editingTask.id,
      taskData
    );

    setEditingTask(null);

  }


  /* =========================
     Complete
  ========================= */

  async function handleToggle(
    task
  ) {

    if (!onUpdateTask) {
      return;
    }

    await onUpdateTask(
      task.id,
      {
        title: task.title,
        description:
          task.description || "",
        dueDate:
          task.dueDate || null,
        completed:
          !task.completed
      }
    );

  }


  /* =========================
     Delete
  ========================= */

  async function handleDelete(
    taskId
  ) {

    if (!onDeleteTask) {
      return;
    }

    const confirmed =
      window.confirm(
        "Delete this task?"
      );

    if (!confirmed) {
      return;
    }

    await onDeleteTask(
      taskId
    );

  }


  return (

    <section className="workspace-section">


      {/* HEADER */}

      <div className="section-header">

        <div>

          <h3>
            Tasks
          </h3>

          <span className="section-count">
            {tasks.length}
          </span>

        </div>


        <button
          type="button"
          className="add-button"
          onClick={() => {

            setEditingTask(null);

            setShowForm(
              previous =>
                !previous
            );

          }}
        >
          {showForm ? "×" : "+"}
        </button>

      </div>


      {/* CREATE FORM */}

      {showForm && (

        <TaskForm

          onSubmit={
            handleCreate
          }

          onCancel={() =>
            setShowForm(false)
          }

        />

      )}


      {/* EDIT FORM */}

      {editingTask && (

        <TaskForm

          initialTask={
            editingTask
          }

          onSubmit={
            handleUpdate
          }

          onCancel={() =>
            setEditingTask(null)
          }

        />

      )}


      {/* TASKS */}

      {tasks.length === 0 ? (

        <p className="empty-section">
          No tasks yet.
        </p>

      ) : (

        <div className="task-list">

          {tasks.map(task => (

            <div
              key={task.id}
              className="task-item"
            >

              <input
                type="checkbox"
                checked={
                  Boolean(
                    task.completed
                  )
                }
                onChange={() =>
                  handleToggle(task)
                }
              />


              <div className="task-content">

                <span
                  className={
                    `task-title ${
                      task.completed
                        ? "completed"
                        : ""
                    }`
                  }
                  onClick={() => {

                    if (onTaskSelect) {
                      onTaskSelect(task);
                    }

                  }}
                >
                  {task.title}
                </span>


                {task.dueDate && (

                  <span className="task-due-date">

                    Due: {task.dueDate}

                  </span>

                )}

              </div>


              <div className="task-actions">

                <button
                  type="button"
                  onClick={() =>
                    handleEdit(task)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(
                      task.id
                    )
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </section>

  );

}


export default TaskSection;