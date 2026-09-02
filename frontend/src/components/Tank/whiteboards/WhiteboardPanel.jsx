import { useState } from "react";

import WhiteboardToolbar from "./WhiteboardToolbar";
import WhiteboardCanvas from "./WhiteboardCanvas";

function WhiteboardPanel({
  tankId,
  userId,
  events = [],
  onCreateEvent,
  onClear,
  loading = false,
  error = ""
}) {
  const [tool, setTool] = useState("pen");
  const [clearSignal, setClearSignal] = useState(0);
  const [clearing, setClearing] = useState(false);

  async function handleDraw(eventData) {
    if (!onCreateEvent) {
      return;
    }

    await onCreateEvent(eventData);
  }

  async function handleClear() {
    if (clearing) {
      return;
    }

    try {
      setClearing(true);

      await onClear();

      // Force the actual canvas to clear
      setClearSignal(
        (previous) => previous + 1
      );

    } catch (error) {
      console.error(
        "Failed to clear whiteboard:",
        error
      );
    } finally {
      setClearing(false);
    }
  }

  if (loading) {
    return (
      <section className="whiteboard-panel">
        <header className="whiteboard-header">
          <div>
            <h2>Whiteboard</h2>

            <span>
              Tank workspace
            </span>
          </div>
        </header>

        <div className="chat-empty">
          <h3>Loading whiteboard...</h3>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="whiteboard-panel">
        <header className="whiteboard-header">
          <div>
            <h2>Whiteboard</h2>

            <span>
              Tank workspace
            </span>
          </div>
        </header>

        <div className="chat-empty">
          <h3>Unable to load whiteboard</h3>

          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="whiteboard-panel">

      <header className="whiteboard-header">
        <div>
          <h2>Whiteboard</h2>

          <span>
            Tank workspace
          </span>
        </div>
      </header>

      <WhiteboardToolbar
        tool={tool}
        onToolChange={setTool}
        onClear={handleClear}
      />

      <div className="whiteboard-canvas-container">

        <WhiteboardCanvas
          tool={tool}
          events={events}
          onDraw={handleDraw}
          clearSignal={clearSignal}
        />

      </div>

    </section>
  );
}

export default WhiteboardPanel;