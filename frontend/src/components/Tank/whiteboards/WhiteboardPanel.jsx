import { useState } from "react";

import WhiteboardToolbar
  from "./WhiteboardToolbar";

import WhiteboardCanvas
  from "./WhiteboardCanvas";

function WhiteboardPanel({
  tankId,
  userId,
  events = [],
  onCreateEvent,
  onClear
}) {
  const [tool, setTool] =
    useState("pen");

  async function handleDraw(eventData) {
    if (!onCreateEvent) {
      return;
    }

    await onCreateEvent(eventData);
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
        onClear={onClear}
      />

      <div className="whiteboard-canvas-container">

        <WhiteboardCanvas
          tool={tool}
          events={events}
          onDraw={handleDraw}
        />

      </div>

    </section>
  );
}

export default WhiteboardPanel;