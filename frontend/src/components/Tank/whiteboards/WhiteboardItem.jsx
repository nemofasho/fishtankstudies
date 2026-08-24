function WhiteboardItem({ whiteboard, onOpen }) {
  return (
    <div className="whiteboard-item">

      <div className="whiteboard-info">

        <span className="whiteboard-name">
          {whiteboard.name}
        </span>

        {whiteboard.lastEdited && (
          <span className="whiteboard-date">
            Edited {whiteboard.lastEdited}
          </span>
        )}

      </div>

      <button
        type="button"
        className="open-button"
        onClick={() => onOpen(whiteboard)}
      >
        Open
      </button>

    </div>
  );
}

export default WhiteboardItem;