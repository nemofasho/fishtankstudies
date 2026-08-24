import React from "react";

import TaskSection from "./Tasks/TaskSection";
import TimerSection from "./Timers/TimerSection";
import MemberList from "./Members/MemberList";

function WorkspacePanel({
  tank,
  tasks = [],
  timers = [],
  members = [],
  whiteboards = [],
  activeWorkspace,
  setActiveWorkspace,
  onTaskSelect
}) {
  return (
    <aside className="workspace-panel">

      {/* Workspace Title */}
      <div className="workspace-title">
        <h2>Workspace</h2>
      </div>

      {/* Tasks */}
      <TaskSection
        tasks={tasks}
        onTaskSelect={onTaskSelect}
      />

      {/* Timers */}
      <TimerSection
        timers={timers}
      />

      {/* Members */}
      <MemberList
        members={members}
      />

      {/* Whiteboard */}
      <section className="workspace-section">

        <div className="section-header">
          <h3>Whiteboard</h3>

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
            setActiveWorkspace("whiteboard")
          }
        >
          Open Whiteboard
        </button>

      </section>

      {/* Chat Button */}
      <section className="workspace-section">

        <div className="section-header">
          <h3>Chat</h3>
        </div>

        <button
          type="button"
          className="open-button"
          onClick={() =>
            setActiveWorkspace("chat")
          }
        >
          Open Chat
        </button>

      </section>

    </aside>
  );
}

export default WorkspacePanel;