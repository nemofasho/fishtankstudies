import { useEffect, useState } from "react";
import TankCard from "../components/TankCard";
import { getTanks } from "../services/tankService";
import { Link } from "react-router-dom";
function Dashboard() {

  const [tanks, setTanks] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);


  useEffect(() => {

    async function loadTanks() {

      try {

        const data = await getTanks();

        setTanks(data);

      } catch (error) {

        console.error(error);

        setError("Unable to load Tanks.");

      } finally {

        setLoading(false);

      }
    }

    loadTanks();

  }, []);


  if (loading) {
    return (
      <main className="dashboard">
        <p>Loading Tanks...</p>
      </main>
    );
  }


  if (error) {
    return (
      <main className="dashboard">
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="dashboard">

      <div className="dashboard-header">

        <div>
          <h1>Your Tanks</h1>
          <p>Select a Tank and start studying.</p>
        </div>

        <Link
          to="/tanks/create"
          className="create-tank-button"
        >
          + Create Tank
        </Link>

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