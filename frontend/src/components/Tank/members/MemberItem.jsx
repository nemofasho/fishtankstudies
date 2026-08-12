function MemberItem({ member }) {
  return (
    <div className="member-item">
      <span
        className={`member-status ${
          member.online ? "online" : "offline"
        }`}
      />

      <span className="member-name">
        {member.name}
      </span>
    </div>
  );
}

export default MemberItem;