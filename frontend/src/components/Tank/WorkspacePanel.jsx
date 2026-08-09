import MemberList from "./Members/MemberList";

import TaskSection from "./Tasks/TaskSection";

import TimerSection from "./Timers/TimerSection";

import WhiteboardSection from "./Whiteboards/WhiteboardSection";

function WorkspacePanel() {

  const members = [
    {
      id: 1,
      name: "Nehemiah",
      online: true
    },
    {
      id: 2,
      name: "Alex",
      online: true
    },
    {
      id: 3,
      name: "Sarah",
      online: false
    },
    {
      id: 4,
      name: "Jordan",
      online: true
    }
  ];

  const tasks = [
    {
      id: 1,
      title: "Study Chapter 5",
      completed: false,
      dueDate: "Today"
    },
    {
      id: 2,
      title: "Complete SQL Homework",
      completed: true,
      dueDate: "Today"
    },
    {
      id: 3,
      title: "Review for Final",
      completed: false,
      dueDate: "Friday"
    }
  ];

  const timers = [
    {
      id: 1,
      name: "Pomodoro",
      durationSeconds: 18 * 60 + 42,
      active: true
    },
    {
      id: 2,
      name: "Break",
      durationSeconds: 3 * 60 + 17,
      active: true
    }
  ];

  const whiteboards = [
    {
      id: 1,
      name: "Lecture Notes",
      lastEdited: "today"
    },
    {
      id: 2,
      name: "Homework Review",
      lastEdited: "yesterday"
    },
    {
      id: 3,
      name: "ER Diagram",
      lastEdited: "2 days ago"
    }
  ];

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