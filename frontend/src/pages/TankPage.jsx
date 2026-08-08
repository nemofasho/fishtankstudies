import { useParams } from "react-router-dom";
import { useState } from "react";

import TankHeader from "../components/TankHeader";
import WorkspacePanel from "../components/WorkspacePanel";

import "../styles/tank.css";
function TankPage() {

    const { tankId } = useParams();

    // Temporary mock data
    const [tank] = useState({
        id: tankId,
        name: "Database Study Group",
        subject: "Computer Science",
        className: "CSC 471"
    });

    return (

        <main className="tank-page">

            <TankHeader tank={tank} />

            <div className="tank-layout">

                <WorkspacePanel />

                <section className="chat-area">

                    <div className="chat-placeholder">

                        <h2>Tank Chat</h2>

                        <p>

                            Chat will be implemented later.

                        </p>

                    </div>

                </section>

            </div>

        </main>

    );

}

export default TankPage;