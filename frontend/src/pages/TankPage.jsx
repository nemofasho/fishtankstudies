import { useParams } from "react-router-dom";
import { useState } from "react";

import ChatWindow from "../components/Tank/Chat/ChatWindow";
import TankHeader from "../components/TankHeader";
import WorkspacePanel from "../components/Tank/WorkspacePanel";

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

     const members = [
    {
      id: 1,
      name: "Nehemiah",
      online: true
    },
    {
      id: 2,
      name: "Alex",
      online: true
    },
    {
      id: 3,
      name: "Sarah",
      online: false
    },
    {
      id: 4,
      name: "Jordan",
      online: true
    }
  ];

    return (

        <main className="tank-page">

            <TankHeader tank={tank} />

            <div className="tank-layout">

                <WorkspacePanel />

                <ChatWindow
                    tankName={tank.name}
                    members={members}
                />


            </div>

        </main>

    );

}

export default TankPage;