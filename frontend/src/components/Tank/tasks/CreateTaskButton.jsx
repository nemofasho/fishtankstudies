function CreateTaskButton({ onClick }) {
  return (
    <button
      type="button"
      className="add-button"
      onClick={onClick}
      aria-label="Create new task"
    >
      +
    </button>
  );
}

export default CreateTaskButton;