import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import TankHeader from "../components/TankHeader";
import WorkspacePanel from "../components/Tank/WorkspacePanel";
import ChatWindow from "../components/Tank/Chat/ChatWindow";
import WhiteboardPanel from "../components/Tank/Whiteboards/WhiteboardPanel";

import { getTank } from "../services/tankService";
import { getTankTasks } from "../services/taskService";
import { getTankMessages } from "../services/messageService";

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

  /*
   * =========================
   * Tank
   * =========================
   */

  const [tank, setTank] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  /*
   * =========================
   * Workspace Data
   * =========================
   */

  const [tasks, setTasks] = useState([]);
  const [messages, setMessages] = useState([]);
  const [timers, setTimers] = useState([]);
  const [whiteboards, setWhiteboards] = useState([]);

  /*
   * =========================
   * Workspace Loading
   * =========================
   */

  const [taskLoading, setTaskLoading] =
    useState(true);

  const [messageLoading, setMessageLoading] =
    useState(true);

  const [timerLoading, setTimerLoading] =
    useState(true);

  const [whiteboardLoading, setWhiteboardLoading] =
    useState(true);

  /*
   * =========================
   * Workspace Errors
   * =========================
   */

  const [taskError, setTaskError] =
    useState("");

  const [messageError, setMessageError] =
    useState("");

  const [timerError, setTimerError] =
    useState("");

  const [whiteboardError, setWhiteboardError] =
    useState("");

  /*
   * =========================
   * Workspace Navigation
   * =========================
   */

  const [activeWorkspace, setActiveWorkspace] =
    useState("chat");


  /*
   * =========================
   * Current User
   * =========================
   *
   * Replace this with your actual
   * authentication/user context when
   * that is implemented.
   */

  const userId = 1;


  /*
   * =========================
   * Load Tank
   * =========================
   */

  useEffect(() => {
    async function loadTank() {
      try {
        setLoading(true);
        setError("");

        const tankData =
          await getTank(tankId);

        setTank(tankData);

      } catch (err) {
        console.error(
          "Failed to load Tank:",
          err
        );

        setError(
          err.message ||
          "Failed to load Tank."
        );

      } finally {
        setLoading(false);
      }
    }

    loadTank();

  }, [tankId]);


  /*
   * =========================
   * Load Tasks
   * =========================
   */

  useEffect(() => {
    async function loadTasks() {
      try {
        setTaskLoading(true);
        setTaskError("");

        const data =
          await getTankTasks(tankId);

        setTasks(data || []);

      } catch (err) {
        console.error(
          "Failed to load tasks:",
          err
        );

        setTaskError(
          err.message ||
          "Failed to load tasks."
        );

      } finally {
        setTaskLoading(false);
      }
    }

    loadTasks();

  }, [tankId]);


  /*
   * =========================
   * Load Messages
   * =========================
   */

  useEffect(() => {
    async function loadMessages() {
      try {
        setMessageLoading(true);
        setMessageError("");

        const data =
          await getTankMessages(tankId);

        setMessages(data || []);

      } catch (err) {
        console.error(
          "Failed to load messages:",
          err
        );

        setMessageError(
          err.message ||
          "Failed to load messages."
        );

      } finally {
        setMessageLoading(false);
      }
    }

    loadMessages();

  }, [tankId]);


  /*
   * =========================
   * Load Timers
   * =========================
   */

  useEffect(() => {
    async function loadTimers() {
      try {
        setTimerLoading(true);
        setTimerError("");

        const data =
          await getTankTimers(tankId);

        setTimers(data || []);

      } catch (err) {
        console.error(
          "Failed to load timers:",
          err
        );

        setTimerError(
          err.message ||
          "Failed to load timers."
        );

      } finally {
        setTimerLoading(false);
      }
    }

    loadTimers();

  }, [tankId]);


  /*
   * =========================
   * Load Whiteboard
   * =========================
   */

  useEffect(() => {
    async function loadWhiteboard() {
      try {
        setWhiteboardLoading(true);
        setWhiteboardError("");

        const data =
          await getTankWhiteboardEvents(
            tankId
          );

        setWhiteboards(data || []);

      } catch (err) {
        console.error(
          "Failed to load whiteboard:",
          err
        );

        setWhiteboardError(
          err.message ||
          "Failed to load whiteboard."
        );

      } finally {
        setWhiteboardLoading(false);
      }
    }

    loadWhiteboard();

  }, [tankId]);


  /*
   * =========================
   * Send Message
   * =========================
   */

  async function handleSendMessage(content) {
    try {
      const { sendMessage } =
        await import(
          "../services/messageService"
        );

      const messageData = {
        content
      };

      const savedMessage =
        await sendMessage(
          tank.id,
          userId,
          messageData
        );

      setMessages(
        (previousMessages) => [
          ...previousMessages,
          savedMessage
        ]
      );

    } catch (err) {
      console.error(
        "Failed to send message:",
        err
      );

      throw err;
    }
  }


  /*
   * =========================
   * Create Whiteboard Event
   * =========================
   */

  async function handleCreateWhiteboardEvent(
    eventData
  ) {
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

      return savedEvent;

    } catch (err) {
      console.error(
        "Failed to save whiteboard event:",
        err
      );

      throw err;
    }
  }


  /*
   * =========================
   * Clear Whiteboard
   * =========================
   */

  async function handleClearWhiteboard() {
    try {
      await clearWhiteboard(
        tank.id
      );

      setWhiteboards([]);

    } catch (err) {
      console.error(
        "Failed to clear whiteboard:",
        err
      );

      throw err;
    }
  }


  /*
   * =========================
   * Tank Loading
   * =========================
   */

  if (loading) {
    return (
      <main className="tank-page-state">

        <h2>
          Loading Tank...
        </h2>

        <p>
          Loading your Tank workspace.
        </p>

      </main>
    );
  }


  /*
   * =========================
   * Tank Error
   * =========================
   */

  if (error) {
    return (
      <main className="tank-page-state">

        <h2>
          Unable to load Tank
        </h2>

        <p>
          {error}
        </p>

        <button
          type="button"
          onClick={() =>
            window.location.reload()
          }
        >
          Try Again
        </button>

      </main>
    );
  }


  /*
   * =========================
   * Tank Not Found
   * =========================
   */

  if (!tank) {
    return (
      <main className="tank-page-state">

        <h2>
          Tank not found
        </h2>

        <p>
          The Tank you're looking for
          could not be found.
        </p>

      </main>
    );
  }


  /*
   * =========================
   * Tank Page
   * =========================
   */

  return (
    <main className="tank-page">

      <TankHeader
        tank={tank}
      />

      <div className="tank-layout">

        <WorkspacePanel
          tank={tank}

          tasks={tasks}
          timers={timers}
          whiteboards={whiteboards}

          members={
            tank.members || []
          }

          activeWorkspace={
            activeWorkspace
          }

          setActiveWorkspace={
            setActiveWorkspace
          }

          taskLoading={
            taskLoading
          }

          taskError={
            taskError
          }

          timerLoading={
            timerLoading
          }

          timerError={
            timerError
          }

          onTaskSelect={
            undefined
          }
        />


        <div className="tank-main-workspace">

          {activeWorkspace === "chat" && (
            <ChatWindow
              tank={tank}

              messages={messages}

              onSendMessage={
                handleSendMessage
              }

              currentUserId={
                userId
              }

              loading={
                messageLoading
              }

              error={
                messageError
              }
            />
          )}


          {activeWorkspace === "whiteboard" && (
            <WhiteboardPanel
              tankId={tank.id}

              userId={userId}

              events={
                whiteboards
              }

              onCreateEvent={
                handleCreateWhiteboardEvent
              }

              onClear={
                handleClearWhiteboard
              }

              loading={
                whiteboardLoading
              }

              error={
                whiteboardError
              }
            />
          )}

        </div>

      </div>

    </main>
  );
}

export default TankPage;