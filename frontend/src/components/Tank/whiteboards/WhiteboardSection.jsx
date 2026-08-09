import CreateWhiteboardButton from "./CreateWhiteboardButton";
import WhiteboardItem from "./WhiteboardItem";

function WhiteboardSection({ whiteboards }) {

  function handleCreateWhiteboard() {
    console.log("Create Whiteboard clicked");
  }

  function handleOpenWhiteboard(whiteboard) {
    console.log("Opening whiteboard:", whiteboard);
  }

  return (
    <section className="workspace-section">

      <div className="section-header">

        <h3>Whiteboards</h3>

        <CreateWhiteboardButton
          onClick={handleCreateWhiteboard}
        />

      </div>

      <div className="whiteboard-list">

        {whiteboards.length > 0 ? (

          whiteboards.map((whiteboard) => (
            <WhiteboardItem
              key={whiteboard.id}
              whiteboard={whiteboard}
              onOpen={handleOpenWhiteboard}
            />
          ))

        ) : (

          <p className="empty-section">
            No whiteboards
          </p>

        )}

      </div>

    </section>
  );
}

export default WhiteboardSection;