function WorkspacePanel() {

    return (

        <aside className="workspace-panel">

            <section className="workspace-section">

                <h3>Members</h3>

                <div className="placeholder-list">

                    <p>🟢 Nehemiah</p>

                    <p>🟢 Alex</p>

                    <p>⚪ Sarah</p>

                    <p>🟢 Jordan</p>

                </div>

            </section>

            <section className="workspace-section">

                <div className="section-header">

                    <h3>Tasks</h3>

                    <button>+</button>

                </div>

                <div className="placeholder-list">

                    <p>☐ Study Chapter 5</p>

                    <p>☑ SQL Homework</p>

                    <p>☐ Final Review</p>

                </div>

            </section>

            <section className="workspace-section">

                <div className="section-header">

                    <h3>Timers</h3>

                    <button>+</button>

                </div>

                <div className="placeholder-list">

                    <p>🍅 Study Timer — 18:42</p>

                    <p>☕ Break — 03:17</p>

                </div>

            </section>

            <section className="workspace-section">

                <div className="section-header">

                    <h3>Whiteboards</h3>

                    <button>+</button>

                </div>

                <div className="placeholder-list">

                    <button className="open-button">

                        Lecture Notes

                    </button>

                    <button className="open-button">

                        Homework Review

                    </button>

                    <button className="open-button">

                        ER Diagram

                    </button>

                </div>

            </section>

        </aside>

    );

}

export default WorkspacePanel;