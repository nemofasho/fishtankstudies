function ChatHeader({ tankName, memberCount }) {
  return (
    <header className="chat-header">
      <div>
        <h2>{tankName} Chat</h2>

        <span className="chat-member-count">
          {memberCount} members
        </span>
      </div>
    </header>
  );
}

export default ChatHeader;