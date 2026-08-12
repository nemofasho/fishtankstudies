import MemberItem from "./MemberItem";

function MemberList({ members = [] }) {
  return (
    <section className="workspace-section">

      <div className="section-header">
        <h3>Members</h3>

        <span className="section-count">
          {members.length}
        </span>
      </div>

      <div className="member-list">

        {members.length === 0 ? (
          <p className="empty-section">
            No members
          </p>
        ) : (
          members.map((member) => (
            <MemberItem
              key={member.id}
              member={member}
            />
          ))
        )}

      </div>

    </section>
  );
}

export default MemberList;