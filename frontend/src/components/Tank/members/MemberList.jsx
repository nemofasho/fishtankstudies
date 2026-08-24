import React from "react";

function MemberList({ members = [] }) {
    return (
        <section className="member-section">
            <div className="workspace-section-header">
                <h2>Members</h2>
                <span>{members.length}</span>
            </div>

            {members.length === 0 ? (
                <p className="empty-state">
                    No members to display.
                </p>
            ) : (
                <div className="member-list">
                    {members.map((member) => (
                        <div
                            key={member.id}
                            className="member-item"
                        >
                            <div className="member-avatar">
                                {member.username
                                    ?.charAt(0)
                                    .toUpperCase()}
                            </div>

                            <div className="member-info">
                                <strong>
                                    {member.username}
                                </strong>

                                {member.email && (
                                    <small>
                                        {member.email}
                                    </small>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default MemberList;