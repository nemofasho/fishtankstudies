import React from "react";

import TaskSection from "./tasks/TaskSection";
import TimerSection from "./timers/TimerSection";
import MemberList from "./members/MemberList";


function WorkspacePanel({

  tank,

  tasks = [],

  timers = [],

  members = [],

  whiteboards = [],

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


      {/* MEMBERS */}

      <MemberList
        members={members}
      />


      {/* WHITEBOARD */}

      <section className="workspace-section">

        <div className="section-header">

          <h3>
            Whiteboard
          </h3>

          <span className="section-count">
            {whiteboards.length}
          </span>

        </div>


        {whiteboards.length === 0 ? (

          <p className="empty-section">
            No whiteboard activity yet.
          </p>

        ) : (

          <div className="whiteboard-list">

            <div className="whiteboard-item">

              <div className="whiteboard-info">

                <span className="whiteboard-name">
                  Tank Whiteboard
                </span>

                <span className="whiteboard-date">

                  {whiteboards.length}{" "}

                  {whiteboards.length === 1
                    ? "event"
                    : "events"}

                </span>

              </div>

            </div>

          </div>

        )}


        <button
          type="button"
          className="open-button"
          onClick={() =>
            setActiveWorkspace(
              "whiteboard"
            )
          }
        >
          Open Whiteboard
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