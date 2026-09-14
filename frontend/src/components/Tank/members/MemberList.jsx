function MemberList({
    members = [],
    loading = false,
    error = "",
    onRetry
}) {
    if (loading) {
        return (
            <section className="workspace-section">
                <div className="section-header">
                    <h3>Members</h3>
                </div>

                <p className="empty-section">
                    Loading members...
                </p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="workspace-section">
                <div className="section-header">
                    <h3>Members</h3>
                </div>

                <p className="empty-section">
                    Unable to load members.
                </p>

                {onRetry && (
                    <button
                        type="button"
                        className="open-button"
                        onClick={onRetry}
                    >
                        Retry
                    </button>
                )}
            </section>
        );
    }

    return (
        <section className="workspace-section member-section">
            <div className="section-header">
                <div>
                    <h3>Members</h3>

                    <span className="task-progress">
                        {members.length}{" "}
                        {members.length === 1
                            ? "member"
                            : "members"}
                    </span>
                </div>

                <span className="section-count">
                    {members.length}
                </span>
            </div>

            {members.length === 0 ? (
                <p className="empty-section">
                    No members yet.
                </p>
            ) : (
                <div className="member-list">
                    {members.map(member => (
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
                                    {member.username ||
                                        "Unknown User"}
                                </strong>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default MemberList;