import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import WhiteboardPanel from "../components/Tank/whiteboards/WhiteboardPanel";
import TankHeader from "../components/TankHeader";
import WorkspacePanel from "../components/Tank/WorkspacePanel";
import ChatWindow from "../components/Tank/Chat/ChatWindow";

import { getTank } from "../services/tankService";

import { getTankTasks } from "../services/taskService";

import {
  getTankMessages,
  sendMessage
} from "../services/messageService";

import {
  getTankTimers
} from "../services/timerSessionService";

import {
  getTankWhiteboardEvents,
  createWhiteboardEvent,
  clearWhiteboard
} from "../services/whiteboardEventService";

import "../styles/tank.css";

function TankPage() {
  const { tankId } = useParams();

  // -------------------------
  // Tank state
  // -------------------------

  const [tank, setTank] = useState(null);

  // -------------------------
  // Workspace state
  // -------------------------

  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [timers, setTimers] = useState([]);
  const [whiteboards, setWhiteboards] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState("chat");

  // Temporary user ID for testing
  // Replace this with the authenticated user's ID later.
  const [userId] = useState(1);

  // -------------------------
  // Page state
  // -------------------------

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -------------------------
  // Load Tank data
  // -------------------------

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
        setTasks(taskData || []);
        setMessages(messageData || []);
        setTimers(timerData || []);
        setWhiteboards(whiteboardData || []);

      } catch (err) {
        console.error("Failed to load Tank:", err);

        setError(
          err.message || "Failed to load Tank data."
        );

      } finally {
        setLoading(false);
      }
    }

    if (tankId) {
      loadTankData();
    }
  }, [tankId]);

  // -------------------------
  // Send message
  // -------------------------

  async function handleSendMessage(content) {
    try {
      if (!content || !content.trim()) {
        return;
      }

      const messageData = {
        content: content.trim()
      };

      const savedMessage = await sendMessage(
        tank.id,
        userId,
        messageData
      );

      setMessages((previousMessages) => [
        ...previousMessages,
        savedMessage
      ]);

    } catch (err) {
      console.error(
        "Failed to send message:",
        err
      );

      alert("Failed to send message.");
    }
  }

    async function handleCreateWhiteboardEvent(eventData) {
      try {
        const savedEvent =
          await createWhiteboardEvent(
            tank.id,
            userId,
            eventData
          );

      setWhiteboards(
        (previousEvents) => [
          ...previousEvents,
          savedEvent
        ]
      );

    } catch (error) {
      console.error(
        "Failed to save whiteboard event:",
        error
      );
    }
  }

    async function handleClearWhiteboard() {
      try {
        await clearWhiteboard(tank.id);

        setWhiteboards([]);

      } catch (error) {
        console.error(
          "Failed to clear whiteboard:",
          error
        );
      }
    }

  // -------------------------
  // Loading state
  // -------------------------

  if (loading) {
    return (
      <main className="tank-page-state">
        <h2>Loading Tank...</h2>
      </main>
    );
  }

  // -------------------------
  // Error state
  // -------------------------

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

  // -------------------------
  // Tank not found
  // -------------------------

  if (!tank) {
    return (
      <main className="tank-page-state">
        <h2>Tank not found</h2>
      </main>
    );
  }

  // -------------------------
  // Tank page
  // -------------------------

  return (
    <main className="tank-page">

      {/* Tank information */}
      <TankHeader
        tank={tank}
      />

      <div className="tank-layout">

        {/* Left workspace panel */}
        <WorkspacePanel
          tank={tank}
          tasks={tasks}
          timers={timers}
          whiteboards={whiteboards}
          members={[]}
          activeWorkspace={activeWorkspace}
          setActiveWorkspace={setActiveWorkspace}
        />

        {activeWorkspace === "chat" && (
          <ChatWindow
            tank={tank}
            messages={messages}
            onSendMessage={handleSendMessage}
            currentUserId={userId}
          />
        )}

        {activeWorkspace === "whiteboard" && (
          <WhiteboardPanel
            tankId={tank.id}
            userId={userId}
            events={whiteboards}
            onCreateEvent={handleCreateWhiteboardEvent}
            onClear={handleClearWhiteboard}
          />
        )}

      </div>

    </main>
  );
}

export default TankPage;