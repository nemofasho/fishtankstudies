function WhiteboardToolbar({
  tool,
  onToolChange,
  onClear
}) {
  return (
    <div className="whiteboard-toolbar">

      <button
        type="button"
        className={
          tool === "pen"
            ? "active"
            : ""
        }
        onClick={() =>
          onToolChange("pen")
        }
      >
        Pen
      </button>

      <button
        type="button"
        className={
          tool === "eraser"
            ? "active"
            : ""
        }
        onClick={() =>
          onToolChange("eraser")
        }
      >
        Eraser
      </button>

      <button
        type="button"
        onClick={onClear}
      >
        Clear
      </button>

    </div>
  );
}

export default WhiteboardToolbar;