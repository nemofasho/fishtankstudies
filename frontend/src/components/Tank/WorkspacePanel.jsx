import MemberList from "./Members/MemberList";
import TaskSection from "./Tasks/TaskSection";
import TimerSection from "./Timers/TimerSection";
import WhiteboardSection from "./Whiteboards/WhiteboardSection";

function WorkspacePanel({
  tank,
  members = [],
  tasks = [],
  timers = [],
  whiteboards = []
}) {
  return (
    <aside className="workspace-panel">

      <div className="workspace-title">
        <h2>Workspace</h2>
      </div>

      <MemberList
        members={members}
      />

      <TaskSection
        tasks={tasks}
      />

      <TimerSection
        timers={timers}
      />

      <WhiteboardSection
        whiteboards={whiteboards}
      />

    </aside>
  );
}

export default WorkspacePanel;