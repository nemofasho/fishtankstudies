function CreateTimerButton({ onClick }) {
  return (
    <button
      type="button"
      className="add-button"
      onClick={onClick}
      aria-label="Create new timer"
    >
      +
    </button>
  );
}

export default CreateTimerButton;