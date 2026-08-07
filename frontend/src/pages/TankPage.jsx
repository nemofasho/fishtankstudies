import { useParams } from "react-router-dom";

function TankPage() {

  const { tankId } = useParams();

  return (
    <div>
      <h1>Tank</h1>

      <p>Tank ID: {tankId}</p>

      <h2>Tasks</h2>

      <h2>Timer</h2>

      <h2>Chat</h2>

      <h2>Whiteboard</h2>
    </div>
  );
}

export default TankPage;