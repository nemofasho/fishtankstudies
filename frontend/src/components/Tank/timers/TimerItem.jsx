import { useEffect, useState } from "react";

function TimerItem({ timer }) {

  const [secondsRemaining, setSecondsRemaining] = useState(
    timer.durationSeconds
  );

  useEffect(() => {

    if (!timer.active) {
      return;
    }

    const interval = setInterval(() => {

      setSecondsRemaining((previousSeconds) => {

        if (previousSeconds <= 1) {
          clearInterval(interval);
          return 0;
        }

        return previousSeconds - 1;

      });

    }, 1000);

    return () => clearInterval(interval);

  }, [timer.active]);

  const minutes = Math.floor(secondsRemaining / 60);

  const seconds = secondsRemaining % 60;

  const formattedTime =
    `${String(minutes).padStart(2, "0")}:` +
    `${String(seconds).padStart(2, "0")}`;

  return (
    <div className="timer-item">

      <div className="timer-info">

        <span className="timer-name">
          {timer.name}
        </span>

        <span className="timer-time">
          {formattedTime}
        </span>

      </div>

      <span
        className={
          timer.active
            ? "timer-status active"
            : "timer-status"
        }
      >
        {timer.active ? "Running" : "Paused"}
      </span>

    </div>
  );
}

export default TimerItem;