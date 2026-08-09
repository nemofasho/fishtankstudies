import MemberItem from "./MemberItem";

function MemberList({ members }) {
  return (
    <section className="workspace-section">

      <div className="section-header">
        <h3>Members</h3>

        <span className="section-count">
          {members.length}
        </span>
      </div>

      <div className="member-list">
        {members.length > 0 ? (
          members.map((member) => (
            <MemberItem
              key={member.id}
              member={member}
            />
          ))
        ) : (
          <p className="empty-section">
            No members
          </p>
        )}
      </div>

    </section>
  );
}

export default MemberList;