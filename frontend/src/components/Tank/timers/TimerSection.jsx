import React from "react";

function formatTime(seconds) {
    if (seconds == null) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
        remainingSeconds
    ).padStart(2, "0")}`;
}

function TimerSection({ timers = [], loading = false, error = "", onRetry }) {
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

    if (timers.length === 0) {
        return (
            <section className="workspace-section">
                <div className="section-header">
                    <h3>Timers</h3>
                </div>

                <p className="empty-section">
                    No timers yet.
                </p>
            </section>
        );
    }
    
    return (
        <section className="timer-section">
            <div className="workspace-section-header">
                <h2>Timers</h2>
                <span>{timers.length}</span>
            </div>

            {timers.length === 0 ? (
                <p className="empty-state">
                    No active timers.
                </p>
            ) : (
                <div className="timer-list">
                    {timers.map((timer) => (
                        <div
                            key={timer.id}
                            className="timer-item"
                        >
                            <div>
                                <strong>
                                    {timer.name || "Timer"}
                                </strong>
                            </div>

                            <span className="timer-countdown">
                                {formatTime(
                                    timer.remainingSeconds
                                )}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default TimerSection;