import { useEffect, useRef, useState } from "react";

function formatTime(seconds) {
  if (seconds == null) {
    return "00:00";
  }

  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

function TimerSection({
  timers = [],
  loading = false,
  error = "",
  onRetry,
  onCreateTimer,
  onUpdateTimer,
  onDeleteTimer
}) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [remainingTimes, setRemainingTimes] = useState({});
  const [finishedTimer, setFinishedTimer] = useState(null);

  /*
   * Keeps track of timers that were already finished when
   * the timers first loaded into the tank.
   */
  const initiallyFinishedTimers = useRef(new Set());

  /*
   * Keeps track of timers for which we've already shown
   * the finished notification.
   */
  const notifiedTimers = useRef(new Set());

  /*
   * Tracks whether this is the first timer load.
   */
  const hasInitializedTimers = useRef(false);

  /*
   * Initialize timers from the backend.
   *
   * The backend is the source of truth.
   */
  useEffect(() => {
    if (loading) {
      return;
    }

    setRemainingTimes(previous => {
      const updated = { ...previous };

      timers.forEach(timer => {
        // Only initialize timers that don't already
        // have a local countdown value.
        if (updated[timer.id] === undefined) {
          updated[timer.id] =
            timer.remainingSeconds ?? 0;
        }
      });

      return updated;
    });

    /*
    * On the first load, remember timers that were already
    * finished so they don't trigger a notification.
    */
    if (!hasInitializedTimers.current) {
      timers.forEach(timer => {
        const remaining =
          timer.remainingSeconds ?? 0;

        if (!timer.active && remaining <= 0) {
          initiallyFinishedTimers.current.add(timer.id);
        }
      });

      hasInitializedTimers.current = true;
    }
  }, [timers, loading]);

  /*
   * Local display countdown.
   *
   * The server remains the source of truth. This only
   * updates the visible clock between server requests.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTimes(previous => {
        const updated = { ...previous };

        timers.forEach(timer => {
          if (!timer.active) {
            return;
          }

          const currentTime =
            updated[timer.id] ??
            timer.remainingSeconds ??
            0;

          if (currentTime > 0) {
            updated[timer.id] =
              currentTime - 1;
          }
        });

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timers]);

  /*
   * Detect when a timer reaches zero while the user
   * is currently inside the tank.
   */
  useEffect(() => {
    timers.forEach(timer => {
      if (!timer.active) {
        return;
      }

      const remaining =
        remainingTimes[timer.id] ??
        timer.remainingSeconds ??
        0;

      if (remaining > 0) {
        return;
      }

      /*
       * Don't notify if this timer was already finished
       * when the user entered the tank.
       */
      if (
        initiallyFinishedTimers.current.has(
          timer.id
        )
      ) {
        return;
      }

      /*
       * Don't notify more than once for the same timer.
       */
      if (
        notifiedTimers.current.has(timer.id)
      ) {
        return;
      }

      notifiedTimers.current.add(timer.id);

      setFinishedTimer(timer);
    });
  }, [timers, remainingTimes]);

  /*
   * Play the alarm whenever a timer finishes.
   */
  useEffect(() => {
    if (!finishedTimer) {
      return;
    }

    playAlarm();

  }, [finishedTimer]);

  function playAlarm() {
    try {
      const audioContext =
        new (
          window.AudioContext ||
          window.webkitAudioContext
        )();

      const oscillator =
        audioContext.createOscillator();

      const gainNode =
        audioContext.createGain();

      oscillator.type = "sine";

      oscillator.frequency.setValueAtTime(
        880,
        audioContext.currentTime
      );

      gainNode.gain.setValueAtTime(
        0.25,
        audioContext.currentTime
      );

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.start();

      /*
       * Create a short repeating alarm pattern.
       */
      setTimeout(() => {
        oscillator.frequency.setValueAtTime(
          660,
          audioContext.currentTime
        );
      }, 250);

      setTimeout(() => {
        oscillator.frequency.setValueAtTime(
          880,
          audioContext.currentTime
        );
      }, 500);

      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 750);

    } catch (error) {
      console.error(
        "Unable to play timer alarm:",
        error
      );
    }
  }

  function dismissFinishedTimer() {
    setFinishedTimer(null);
  }

  async function handleCreateTimer(event) {
    event.preventDefault();

    const parsedDuration =
      Number(duration);

    const trimmedName =
      name.trim();

    if (
      !parsedDuration ||
      parsedDuration < 1
    ) {
      return;
    }

    if (!onCreateTimer) {
      return;
    }

    const timerData = {
      name:
        trimmedName || "Study Timer",
      duration: parsedDuration,
      active: true
    };

    try {
      const createdTimer =
        await onCreateTimer(timerData);

      /*
       * This timer was just created and is actively
       * running, so it is eligible to notify when it
       * reaches zero.
       */
      if (createdTimer?.id != null) {
        initiallyFinishedTimers.current.delete(
          createdTimer.id
        );

        notifiedTimers.current.delete(
          createdTimer.id
        );
      }

      setName("");
      setDuration("");
      setShowCreateModal(false);

    } catch (error) {
      console.error(
        "Failed to create timer:",
        error
      );
    }
  }

  async function handleToggleTimer(timer) {
    if (!onUpdateTimer) {
      return;
    }

    try {
      const updatedTimer =
        await onUpdateTimer(timer.id, {
          name:
            timer.name ||
            "Study Timer",
          duration: timer.duration,
          active: !timer.active
        });

      /*
       * If the timer is resumed, allow it to trigger
       * a notification when it eventually finishes.
       */
      if (
        updatedTimer?.active
      ) {
        initiallyFinishedTimers.current.delete(
          timer.id
        );

        notifiedTimers.current.delete(
          timer.id
        );
      }

    } catch (error) {
      console.error(
        "Failed to update timer:",
        error
      );
    }
  }

  async function handleDeleteTimer(timerId) {
    if (!onDeleteTimer) {
      return;
    }

    const confirmed =
      window.confirm(
        "Delete this timer?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await onDeleteTimer(timerId);

      setRemainingTimes(previous => {
        const updated = {
          ...previous
        };

        delete updated[timerId];

        return updated;
      });

      initiallyFinishedTimers.current.delete(
        timerId
      );

      notifiedTimers.current.delete(
        timerId
      );

    } catch (error) {
      console.error(
        "Failed to delete timer:",
        error
      );
    }
  }

  if (loading) {
    return (
      <section className="workspace-section">
        <div className="section-header">
          <h3>Timers</h3>
        </div>

        <p className="empty-section">
          Loading timers...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="workspace-section">
        <div className="section-header">
          <h3>Timers</h3>
        </div>

        <p className="empty-section">
          Unable to load timers.
        </p>

        {onRetry && (
          <button
            type="button"
            className="open-button"
            onClick={onRetry}
          >
            Retry
          </button>
        )}
      </section>
    );
  }

  return (
    <>
      <section className="workspace-section timer-section">
        <div className="section-header">
          <div>
            <h3>Timers</h3>

            <span className="task-progress">
              {timers.length}{" "}
              {timers.length === 1
                ? "timer"
                : "timers"}
            </span>
          </div>

          <div className="timer-header-actions">
            <button
              type="button"
              className="timer-add-button"
              onClick={() =>
                setShowCreateModal(true)
              }
              title="Create timer"
              aria-label="Create timer"
            >
              +
            </button>
          </div>
        </div>

        {timers.length === 0 ? (
          <p className="empty-section">
            No timers yet.
          </p>
        ) : (
          <div className="timer-list">
            {timers.map(timer => {
              const remaining =
                remainingTimes[timer.id] ??
                timer.remainingSeconds ??
                0;

              const finished =
                remaining <= 0;

              return (
                <div
                  key={timer.id}
                  className="timer-item"
                >
                  <div className="timer-info">
                    <strong className="timer-name">
                      {timer.name ||
                        "Study Timer"}
                    </strong>

                    <span className="timer-countdown">
                      {formatTime(
                        remaining
                      )}
                    </span>

                    <span
                      className={`timer-status ${
                        timer.active &&
                        !finished
                          ? "active"
                          : ""
                      }`}
                    >
                      {finished
                        ? "Finished"
                        : timer.active
                        ? "Running"
                        : "Paused"}
                    </span>
                  </div>

                  <div className="timer-actions">
                    {!finished && (
                      <button
                        type="button"
                        className="timer-action-button"
                        onClick={() =>
                          handleToggleTimer(
                            timer
                          )
                        }
                      >
                        {timer.active
                          ? "Pause"
                          : "Resume"}
                      </button>
                    )}

                    <button
                      type="button"
                      className="timer-delete-button"
                      onClick={() =>
                        handleDeleteTimer(
                          timer.id
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {showCreateModal && (
        <div
          className="task-modal-overlay"
          onMouseDown={event => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setShowCreateModal(false);
            }
          }}
        >
          <div
            className="task-modal timer-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-timer-title"
          >
            <div className="task-modal-header">
              <div>
                <span className="task-details-label">
                  New Timer
                </span>

                <h2 id="create-timer-title">
                  Create Timer
                </h2>
              </div>

              <button
                type="button"
                className="task-details-close"
                onClick={() => {
                  setName("");
                  setDuration("");
                  setShowCreateModal(false);
                }}
                aria-label="Close create timer dialog"
              >
                ×
              </button>
            </div>

            <form
              className="timer-create-form"
              onSubmit={
                handleCreateTimer
              }
            >
              <div className="timer-form-field">
                <label htmlFor="timer-name">
                  Timer Name
                </label>

                <input
                  id="timer-name"
                  type="text"
                  value={name}
                  onChange={event =>
                    setName(
                      event.target.value
                    )
                  }
                  placeholder="Biology Study"
                  maxLength={50}
                />
              </div>

              <div className="timer-form-field">
                <label htmlFor="timer-duration">
                  Duration
                </label>

                <div className="timer-duration-input">
                  <input
                    id="timer-duration"
                    type="number"
                    min="1"
                    step="1"
                    value={duration}
                    onChange={event =>
                      setDuration(
                        event.target.value
                      )
                    }
                    placeholder="25"
                    required
                  />

                  <span>
                    minutes
                  </span>
                </div>
              </div>

              <div className="timer-modal-actions">
                <button
                  type="button"
                  className="timer-cancel-button"
                  onClick={() => {
                    setName("");
                    setDuration("");
                    setShowCreateModal(false);
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="timer-create-button"
                >
                  Create Timer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {finishedTimer && (
        <div
          className="task-modal-overlay"
          onMouseDown={event => {
            if (
              event.target ===
              event.currentTarget
            ) {
              dismissFinishedTimer();
            }
          }}
        >
          <div
            className="task-modal timer-finished-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="timer-finished-title"
          >
            <div className="timer-finished-content">
              <div className="timer-finished-icon">
                ⏰
              </div>

              <span className="task-details-label">
                Timer Finished
              </span>

              <h2 id="timer-finished-title">
                {finishedTimer.name ||
                  "Study Timer"}
              </h2>

              <p>
                Your timer is complete!
              </p>

              <button
                type="button"
                className="timer-create-button"
                onClick={
                  dismissFinishedTimer
                }
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default TimerSection;