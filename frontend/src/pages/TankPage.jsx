import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import TankHeader from "../components/TankHeader";
import WorkspacePanel from "../components/Tank/WorkspacePanel";
import ChatWindow from "../components/Tank/Chat/ChatWindow";

import { getTank } from "../services/tankService";
import { getTankTasks } from "../services/taskService";
import { getTankMessages } from "../services/messageService";
import {
  getTankTimers
} from "../services/timerSessionService";
import {
  getTankWhiteboardEvents
} from "../services/whiteboardEventService";

import "../styles/tank.css";

function TankPage() {
  const { tankId } = useParams();

  const [tank, setTank] = useState(null);

  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [timers, setTimers] = useState([]);
  const [whiteboards, setWhiteboards] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTankData() {
      try {
        setLoading(true);
        setError("");

        const [
          tankData,
          taskData,
          messageData,
          timerData,
          whiteboardData
        ] = await Promise.all([
          getTank(tankId),
          getTankTasks(tankId),
          getTankMessages(tankId),
          getTankTimers(tankId),
          getTankWhiteboardEvents(tankId)
        ]);

        setTank(tankData);
        setTasks(taskData);
        setMessages(messageData);
        setTimers(timerData);
        setWhiteboards(whiteboardData);

      } catch (err) {
        console.error("Failed to load Tank:", err);

        setError(
          err.message ||
          "Failed to load Tank data."
        );

      } finally {
        setLoading(false);
      }
    }

    loadTankData();
  }, [tankId]);

  if (loading) {
    return (
      <main className="tank-page-state">
        <h2>Loading Tank...</h2>
      </main>
    );
  }

  if (error) {
    return (
      <main className="tank-page-state">
        <h2>Unable to load Tank</h2>

        <p>{error}</p>

        <button
          type="button"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </main>
    );
  }

  if (!tank) {
    return (
      <main className="tank-page-state">
        <h2>Tank not found</h2>
      </main>
    );
  }

  return (
    <main className="tank-page">

      <TankHeader tank={tank} />

      <div className="tank-layout">

        <WorkspacePanel
          tank={tank}
          members={tank.members || []}
          tasks={tasks}
          timers={timers}
          whiteboards={whiteboards}
        />

        <ChatWindow
          tank={tank}
          messages={messages}
        />

      </div>

    </main>
  );
}

export default TankPage;