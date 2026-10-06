import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTanks } from "../services/tankService";

export default function Home() {
  const { user } = useAuth();

  const [tanks, setTanks] = useState([]);
  const [loadingTanks, setLoadingTanks] = useState(true);

  useEffect(() => {
    async function loadTanks() {
      try {
        const data = await getTanks();
        setTanks(data || []);
      } catch (error) {
        console.error("Failed to load tanks:", error);
      } finally {
        setLoadingTanks(false);
      }
    }

    loadTanks();
  }, []);

  return (
    <main className="home-page">
      <section className="home-hero">
        <div>
          <p className="home-eyebrow">Fishbowl Studies</p>

          <h1>
            Welcome back, {user?.username || "Student"}!
          </h1>

          <p className="home-subtitle">
            Study smarter, collaborate with classmates, and stay on top
            of your coursework.
          </p>
        </div>
      </section>

      <section className="home-actions">
        <Link to="/tanks/create" className="home-action-card">
          <div className="home-action-icon">+</div>

          <div>
            <h2>Create a Tank</h2>
            <p>
              Start a new study space for your class or subject.
            </p>
          </div>
        </Link>

        <Link to="/tanks/find" className="home-action-card">
          <div className="home-action-icon">⌕</div>

          <div>
            <h2>Find a Tank</h2>
            <p>
              Discover study groups and find a tank to join.
            </p>
          </div>
        </Link>
      </section>

      <section className="home-section">
        <div className="home-section-header">
          <div>
            <h2>My Study Tanks</h2>

            <p>
              {loadingTanks
                ? "Loading your study tanks..."
                : tanks.length === 0
                  ? "You haven't joined any study tanks yet."
                  : `You are a member of ${tanks.length} ${
                      tanks.length === 1 ? "study tank" : "study tanks"
                    }.`}
            </p>
          </div>

          <Link to="/dashboard" className="home-view-link">
            View Dashboard →
          </Link>
        </div>

        {!loadingTanks && tanks.length > 0 && (
          <div className="home-tank-summary">
            {tanks.slice(0, 3).map((tank) => (
              <Link
                key={tank.id}
                to={`/tanks/${tank.id}`}
                className="home-tank-item"
              >
                <div>
                  <h3>{tank.name}</h3>

                  <p>
                    {tank.subject || "No subject"}
                    {tank.className
                      ? ` • ${tank.className}`
                      : ""}
                  </p>
                </div>

                <span>→</span>
              </Link>
            ))}

            {tanks.length > 3 && (
              <Link to="/dashboard" className="home-more-tanks">
                View all {tanks.length} tanks →
              </Link>
            )}
          </div>
        )}

        {!loadingTanks && tanks.length === 0 && (
          <div className="home-empty-tanks">
            <p>
              Your study tanks will appear here once you create or
              join one.
            </p>

            <Link to="/tanks/find">
              Find a Tank →
            </Link>
          </div>
        )}
      </section>

      <section className="home-section">
        <div className="home-section-header">
          <div>
            <h2>Recent Activity</h2>
            <p>Keep track of what's happening in your study groups.</p>
          </div>
        </div>

        <div className="home-activity-empty">
          <div className="home-activity-icon">✓</div>

          <div>
            <h3>No recent activity</h3>
            <p>
              Activity from your study tanks will appear here.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}