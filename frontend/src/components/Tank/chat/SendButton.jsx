function SendButton({ disabled }) {
  return (
    <button
      type="submit"
      className="send-button"
      disabled={disabled}
    >
      Send
    </button>
  );
}

export default SendButton;