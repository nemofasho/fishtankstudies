import React from "react";

import TaskSection from "./tasks/TaskSection";
import TimerSection from "./timers/TimerSection";
import MemberList from "./members/MemberList";


function WorkspacePanel({

  tank,

  tasks = [],

  timers = [],

  members = [],

  documents = [],

  activeWorkspace,

  setActiveWorkspace,

  onTaskSelect,

  selectedTaskId,

  onCreateTask,

  onUpdateTask,

  onDeleteTask,

  onCreateTimer,

  onUpdateTimer,

  onDeleteTimer

}) {

  return (

    <aside className="workspace-panel">


      <div className="workspace-title">

        <h2>
          Workspace
        </h2>

      </div>

      {/* MEMBERS */}

      <MemberList
        members={members}
      />


      {/* TASKS */}

      <TaskSection

        tasks={tasks}

        onTaskSelect={
          onTaskSelect
        }

        onCreateTask={
          onCreateTask
        }

        onUpdateTask={
          onUpdateTask
        }

        onDeleteTask={
          onDeleteTask
        }

        selectedTaskId={
          selectedTaskId
        }

      />


      {/* TIMERS */}

      <TimerSection

        timers={timers}

        onCreateTimer={
          onCreateTimer
        }

        onUpdateTimer={
          onUpdateTimer
        }

        onDeleteTimer={
          onDeleteTimer
        }

      />


      {/* SHARED DOCUMENTS */}

      <section className="workspace-section">

        <div className="section-header">

          <h3>
            Shared Documents
          </h3>

          <span className="section-count">
            {documents.length}
          </span>

        </div>

        <button
          type="button"
          className="open-button"
          onClick={() =>
            setActiveWorkspace(
              "documents"
            )
          }
        >
          Open Shared Documents
        </button>

      </section>


      {/* CHAT */}

      <section className="workspace-section">

        <div className="section-header">

          <h3>
            Chat
          </h3>

        </div>


        <button
          type="button"
          className="open-button"
          onClick={() =>
            setActiveWorkspace(
              "chat"
            )
          }
        >
          Open Chat
        </button>

      </section>


    </aside>

  );

}


export default WorkspacePanel;