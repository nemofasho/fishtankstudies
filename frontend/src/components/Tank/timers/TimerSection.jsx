import TimerItem from "./TimerItem";
import CreateTimerButton from "./CreateTimerButton";

function TimerSection({ timers }) {

  function handleCreateTimer() {
    console.log("Create Timer clicked");
  }

  return (
    <section className="workspace-section">

      <div className="section-header">

        <h3>Timers</h3>

        <CreateTimerButton
          onClick={handleCreateTimer}
        />

      </div>

      <div className="timer-list">

        {timers.length > 0 ? (

          timers.map((timer) => (
            <TimerItem
              key={timer.id}
              timer={timer}
            />
          ))

        ) : (

          <p className="empty-section">
            No timers
          </p>

        )}

      </div>

    </section>
  );
}

export default TimerSection;