function CreateWhiteboardButton({ onClick }) {
  return (
    <button
      type="button"
      className="add-button"
      onClick={onClick}
      aria-label="Create new whiteboard"
    >
      +
    </button>
  );
}

export default CreateWhiteboardButton;