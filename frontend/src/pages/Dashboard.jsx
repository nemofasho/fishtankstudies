import TankCard from "../components/TankCard";

function Dashboard() {

  const tanks = [
    {
      id: 1,
      name: "Database Study Group",
      subject: "Computer Science",
      className: "CSC 471",
      memberCount: 5,
      taskCount: 3
    },
    {
      id: 2,
      name: "Programming Languages",
      subject: "Computer Science",
      className: "CSC 339",
      memberCount: 4,
      taskCount: 6
    },
    {
      id: 3,
      name: "Operating Systems",
      subject: "Computer Science",
      className: "CSC 362",
      memberCount: 6,
      taskCount: 4
    }
  ];

  return (
    <main className="dashboard">

      <div className="dashboard-header">

        <div>
          <h1>Your Tanks</h1>
          <p>Select a Tank and start studying.</p>
        </div>

        <button className="create-tank-button">
          + Create Tank
        </button>

      </div>

      {tanks.length > 0 ? (

        <div className="tank-grid">

          {tanks.map((tank) => (
            <TankCard
              key={tank.id}
              tank={tank}
            />
          ))}

        </div>

      ) : (

        <div className="empty-tanks">
          <h2>No Tanks Yet</h2>
          <p>Create your first Tank to start studying.</p>
        </div>

      )}

    </main>
  );
}

export default Dashboard;