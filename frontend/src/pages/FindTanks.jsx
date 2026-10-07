import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAvailableTanks, joinTank } from "../services/tankService";
import { useAuth } from "../context/AuthContext";

export default function FindTanks() {
  const { user } = useAuth();

  const [tanks, setTanks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [joiningTankId, setJoiningTankId] = useState(null);
  const [error, setError] = useState("");

  async function loadTanks() {
    try {
      setError("");

      const data = await getAvailableTanks();

      // Don't show tanks the current user already belongs to.
      const availableTanks = (data || []).filter((tank) => {
        const members = tank.members || [];

        return !members.some(
          (member) => member.id === user?.id
        );
      });

      setTanks(availableTanks);
    } catch (error) {
      console.error("Failed to load tanks:", error);
      setError("Unable to load available tanks.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTanks();
  }, []);

  async function handleJoin(tankId) {
    try {
      setJoiningTankId(tankId);
      setError("");

      await joinTank(tankId);

      // Remove the tank from the discovery list.
      setTanks((currentTanks) =>
        currentTanks.filter((tank) => tank.id !== tankId)
      );
    } catch (error) {
      console.error("Failed to join tank:", error);
      setError(error.message || "Unable to join tank.");
    } finally {
      setJoiningTankId(null);
    }
  }

  const filteredTanks = tanks.filter((tank) => {
    const searchText = search.toLowerCase();

    return (
      tank.name?.toLowerCase().includes(searchText) ||
      tank.subject?.toLowerCase().includes(searchText) ||
      tank.className?.toLowerCase().includes(searchText)
    );
  });

  return (
    <main className="find-tanks-page">
      <div className="find-tanks-header">
        <div>
          <p className="find-tanks-eyebrow">
            StudySync
          </p>

          <h1>Find a Tank</h1>

          <p>
            Discover study groups and join a tank for your class.
          </p>
        </div>

        <Link to="/" className="find-tanks-back">
          ← Home
        </Link>
      </div>

      <div className="find-tanks-search">
        <input
          type="text"
          placeholder="Search by tank name, subject, or class..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {error && (
        <div className="find-tanks-error">
          {error}
        </div>
      )}

      {loading ? (
        <div className="find-tanks-state">
          Loading available tanks...
        </div>
      ) : filteredTanks.length === 0 ? (
        <div className="find-tanks-empty">
          <h2>No tanks found</h2>

          <p>
            {search
              ? "Try a different search."
              : "There are no available tanks to join right now."}
          </p>

          {!search && (
            <Link to="/tanks/create">
              Create a Tank
            </Link>
          )}
        </div>
      ) : (
        <div className="find-tanks-grid">
          {filteredTanks.map((tank) => (
            <div className="find-tank-card" key={tank.id}>
              <div className="find-tank-card-header">
                <div>
                  <h2>{tank.name}</h2>

                  <p>
                    {tank.subject || "No subject"}
                  </p>
                </div>
              </div>

              {tank.className && (
                <p className="find-tank-class">
                  {tank.className}
                </p>
              )}

              <div className="find-tank-info">
                <span>
                  {tank.memberCount || 0}{" "}
                  {tank.memberCount === 1
                    ? "member"
                    : "members"}
                </span>

                <span>
                  {tank.taskCount || 0}{" "}
                  {tank.taskCount === 1
                    ? "task"
                    : "tasks"}
                </span>
              </div>

              <button
                type="button"
                className="find-tank-join-button"
                onClick={() => handleJoin(tank.id)}
                disabled={joiningTankId === tank.id}
              >
                {joiningTankId === tank.id
                  ? "Joining..."
                  : "Join Tank"}
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}