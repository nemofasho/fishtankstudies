import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import TankHeader from "../components/TankHeader";
import WorkspacePanel from "../components/Tank/WorkspacePanel";
import ChatWindow from "../components/Tank/chat/ChatWindow";
import WhiteboardPanel from "../components/Tank/whiteboards/WhiteboardPanel";
import TaskDetails from "../components/Tank/tasks/TaskDetails";
import DocumentPanel from "../components/Tank/documents/DocumentPanel";

import {
  getTank
} from "../services/tankService";

import {
  getTankTasks,
  createTask,
  updateTask,
  deleteTask
} from "../services/taskService";

import {
  getTankMessages,
  sendMessage,
  sendMessageWithAttachments,
  updateMessage,
  deleteMessage
} from "../services/messageService";

import {
  getTankTimers,
  createTimer,
  updateTimer,
  deleteTimer
} from "../services/timerSessionService";

import {
  getTankWhiteboardEvents,
  clearWhiteboard
} from "../services/whiteboardEventService";

import {
    getTankDocuments,
    createDocument,
    updateDocument,
    deleteDocument
} from "../services/documentService";

import "../styles/tank.css";


function TankPage({ currentUserId }) {

  console.log("CURRENT USER ID:", currentUserId);

  const { tankId } = useParams();


  /* =========================
     Tank
  ========================= */

  const [tank, setTank] = useState(null);


  /* =========================
     Workspace Data
  ========================= */

  const [tasks, setTasks] = useState([]);

  const [messages, setMessages] = useState([]);

  const [timers, setTimers] = useState([]);

  const [whiteboards, setWhiteboards] = useState([]);

  const [documents, setDocuments] = useState([]);

  const [selectedDocumentId, setSelectedDocumentId] = useState(null);


  /* =========================
     Workspace
  ========================= */

  const [activeWorkspace, setActiveWorkspace] =
    useState("chat");

  
  const [selectedTaskId, setSelectedTaskId] =
    useState(null);

  const selectedTask =
    tasks.find(task => task.id === selectedTaskId) || null;


  /* =========================
     Loading
  ========================= */

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* =========================
     Load Tank
  ========================= */

  async function loadTankData() {

    try {

      setLoading(true);
      setError("");

      const [
        tankData,
        taskData,
        messageData,
        timerData,
        whiteboardData,
        documentData
      ] = await Promise.all([

        getTank(tankId),

        getTankTasks(tankId),

        getTankMessages(tankId),

        getTankTimers(tankId),

        getTankWhiteboardEvents(tankId),

        getTankDocuments(tankId)

      ]);


      setTank(tankData);

      setTasks(taskData || []);

      setMessages(messageData || []);

      setTimers(timerData || []);

      setWhiteboards(
        whiteboardData || []
      );

      const loadedDocuments = documentData || [];

      setDocuments(loadedDocuments);

      if (
        loadedDocuments.length > 0)
        setSelectedDocumentId(previousId => { const stillExists = loadedDocuments.some(document => document.id === previousId); return stillExists ? previousId : loadedDocuments[0].id; }); 
        else {
          setSelectedDocumentId(null);
        }

    } catch (err) {

      console.error(
        "Failed to load Tank:",
        err
      );

      setError(
        err.message ||
        "Failed to load Tank data."
      );


    } finally {

      setLoading(false);

    }

  }


  useEffect(() => {

    loadTankData();

  }, [tankId]);


  /* =========================
     TASK CRUD
  ========================= */

  async function handleCreateTask(
    taskData
  ) {

    try {

      const savedTask =
        await createTask(
          tank.id,
          taskData
        );

      setTasks(previousTasks => [
        ...previousTasks,
        savedTask
      ]);

      return savedTask;

    } catch (err) {

      console.error(
        "Failed to create task:",
        err
      );

      throw err;

    }

  }


  async function handleUpdateTask(
    taskId,
    taskData
  ) {

    try {

      const updatedTask =
        await updateTask(
          taskId,
          taskData
        );

      setTasks(previousTasks =>
        previousTasks.map(task =>
          task.id === updatedTask.id
            ? updatedTask
            : task
        )
      );

      return updatedTask;

    } catch (err) {

      console.error(
        "Failed to update task:",
        err
      );

      throw err;

    }

  }


  async function handleDeleteTask(
    taskId
  ) {

    try {

      await deleteTask(taskId);

      setTasks(previousTasks =>
        previousTasks.filter(
          task => task.id !== taskId
        )
      );

    } catch (err) {

      console.error(
        "Failed to delete task:",
        err
      );

      throw err;

    }

  }


  /* =========================
     TIMER CRUD
  ========================= */

  async function handleCreateTimer(
    timerData
  ) {

    try {

      const savedTimer =
        await createTimer(
          tank.id,
          timerData
        );

      setTimers(previousTimers => [
        ...previousTimers,
        savedTimer
      ]);

      return savedTimer;

    } catch (err) {

      console.error(
        "Failed to create timer:",
        err
      );

      throw err;

    }

  }


  async function handleUpdateTimer(
    timerId,
    timerData
  ) {

    try {

      const updatedTimer =
        await updateTimer(
          timerId,
          timerData
        );

      setTimers(previousTimers =>
        previousTimers.map(timer =>
          timer.id === updatedTimer.id
            ? updatedTimer
            : timer
        )
      );

      return updatedTimer;

    } catch (err) {

      console.error(
        "Failed to update timer:",
        err
      );

      throw err;

    }

  }


  async function handleDeleteTimer(
    timerId
  ) {

    try {

      await deleteTimer(timerId);

      setTimers(previousTimers =>
        previousTimers.filter(
          timer => timer.id !== timerId
        )
      );

    } catch (err) {

      console.error(
        "Failed to delete timer:",
        err
      );

      throw err;

    }

  }


  /* =========================
     MESSAGE CRUD
  ========================= */

  async function handleSendMessage(
    content,
    files = []
  ) {

    if (
      !content?.trim() &&
      files.length === 0
    ) {
      return;
    }

    if (!currentUserId) {

      throw new Error(
        "Current user is not available."
      );
    }

    try {

      const savedMessage =
        files.length > 0

          ? await sendMessageWithAttachments(
              tank.id,
              currentUserId,
              content,
              files
            )

          : await sendMessage(
              tank.id,
              currentUserId,
              {
                content:
                  content.trim()
              }
            );

      setMessages(
        previousMessages => [
          ...previousMessages,
          savedMessage
        ]
      );

      return savedMessage;

    } catch (err) {

      console.error(
        "Failed to send message:",
        err
      );

      throw err;
    }
  }


  async function handleDeleteMessage(
    messageId
  ) {

    try {

      await deleteMessage(
        messageId
      );

      setMessages(previousMessages =>
        previousMessages.filter(
          message =>
            message.id !== messageId
        )
      );

    } catch (err) {

      console.error(
        "Failed to delete message:",
        err
      );

      throw err;

    }

  }

  async function handleEditMessage(
  messageId,
  content
) {

  try {

    const updatedMessage =
      await updateMessage(
        messageId,
        {
          content
        }
      );

    setMessages(previousMessages =>
      previousMessages.map(message =>
        message.id === updatedMessage.id
          ? updatedMessage
          : message
      )
    );

    return updatedMessage;

  } catch (err) {

    console.error(
      "Failed to edit message:",
      err
    );

    throw err;
  }
}

async function handleCreateDocument() {
  try {
    const newDocument = await createDocument(tankId, {
      title: "Untitled Document",
      content: ""
    });

    setDocuments(previousDocuments => [
      newDocument,
      ...previousDocuments
    ]);

    setSelectedDocumentId(newDocument.id);

    return newDocument;
  } catch (err) {
    console.error("Failed to create document:", err);
    throw err;
  }
}

async function handleUpdateDocument(documentId, documentData) {
  try {
    const updatedDocument = await updateDocument(
      documentId,
      documentData
    );

    setDocuments(previousDocuments =>
      previousDocuments.map(document =>
        document.id === updatedDocument.id
          ? updatedDocument
          : document
      )
    );

    return updatedDocument;
  } catch (err) {
    console.error("Failed to update document:", err);
    throw err;
  }
}

async function handleDeleteDocument(documentId) {
  const confirmed = window.confirm(
    "Delete this document? This cannot be undone."
  );

  if (!confirmed) {
    return;
  }

  try {
    await deleteDocument(documentId);

    setDocuments(previousDocuments => {
      const remainingDocuments =
        previousDocuments.filter(
          document => document.id !== documentId
        );

      if (selectedDocumentId === documentId) {
        setSelectedDocumentId(
          remainingDocuments.length > 0
            ? remainingDocuments[0].id
            : null
        );
      }

      return remainingDocuments;
    });
  } catch (err) {
    console.error("Failed to delete document:", err);
    throw err;
  }
}


  /* =========================
     WHITEBOARD
  ========================= */

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


  /* =========================
     Loading
  ========================= */

  if (loading) {

    return (

      <main className="tank-page-state">

        <h2>
          Loading Tank...
        </h2>

        <p>
          Loading your workspace.
        </p>

      </main>

    );

  }


  /* =========================
     Error
  ========================= */

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
          onClick={loadTankData}
        >
          Try Again
        </button>

      </main>

    );

  }


  /* =========================
     Tank Not Found
  ========================= */

  if (!tank) {

    return (

      <main className="tank-page-state">

        <h2>
          Tank not found
        </h2>

      </main>

    );

  }


  /* =========================
     PAGE
  ========================= */

  return (

    <main className="tank-page">

      <TankHeader
        tank={tank}
      />


      <div className="tank-layout">


        {/* LEFT PANEL */}

        <WorkspacePanel

          tank={tank}

          members={
            tank.members || []
          }

          tasks={tasks}

          timers={timers}

          documents={
            documents
          }

          whiteboards={
            whiteboards
          }

          activeWorkspace={
            activeWorkspace
          }

          setActiveWorkspace={
            setActiveWorkspace
          }

          onCreateTask={
            handleCreateTask
          }

          onUpdateTask={
            handleUpdateTask
          }

          onDeleteTask={
            handleDeleteTask
          }

          onCreateTimer={
            handleCreateTimer
          }

          onUpdateTimer={
            handleUpdateTimer
          }

          onDeleteTimer={
            handleDeleteTimer
          }

          onTaskSelect={task => {
            setSelectedTaskId(task.id);
            setActiveWorkspace("task");
        }}
        selectedTaskId={selectedTaskId}

        />


        {/* MAIN WORKSPACE */}

        <div className="tank-main-workspace">


          {activeWorkspace === "task" && (
            <TaskDetails
              task={selectedTask}
              onClose={() => {
                setSelectedTaskId(null);
                setActiveWorkspace("chat");
              }}
            />
          )}

          {activeWorkspace === "chat" && (

            <ChatWindow

              tank={tank}

              messages={messages}

              currentUserId={
                currentUserId
              }

              onSendMessage={
                handleSendMessage
              }

              onDeleteMessage={
                handleDeleteMessage
              }

              onEditMessage={
                handleEditMessage
              }

            />

          )}

          {activeWorkspace === "documents" && (
            <DocumentPanel
              tank={tank}
              documents={documents}
              selectedDocumentId={selectedDocumentId}
              onSelectDocument={setSelectedDocumentId}
              onCreateDocument={handleCreateDocument}
              onUpdateDocument={handleUpdateDocument}
              onDeleteDocument={handleDeleteDocument}
            />
          )}


          {activeWorkspace === "whiteboard" && (

            <WhiteboardPanel

              tank={tank}

              whiteboards={
                whiteboards
              }

              currentUserId={
                currentUserId
              }

              onClear={
                handleClearWhiteboard
              }

            />

          )}

        </div>

      </div>

    </main>

  );

}


export default TankPage;