import { useState } from "react";

import TaskItem from "./TaskItem";
import CreateTaskButton from "./CreateTaskButton";

function TaskSection({ tasks }) {

  const [taskList, setTaskList] = useState(tasks);

  function handleToggle(taskId) {
    setTaskList((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed
            }
          : task
      )
    );
  }

  function handleCreateTask() {
    console.log("Create Task clicked");
  }

  return (
    <section className="workspace-section">

      <div className="section-header">

        <h3>Tasks</h3>

        <CreateTaskButton
          onClick={handleCreateTask}
        />

      </div>

      <div className="task-list">

        {taskList.length > 0 ? (

          taskList.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggle}
            />
          ))

        ) : (

          <p className="empty-section">
            No tasks
          </p>

        )}

      </div>

    </section>
  );
}

export default TaskSection;