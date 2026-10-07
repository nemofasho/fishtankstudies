import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTanks } from "../services/tankService";
import { getRecentActivities } from "../services/activityService";

function formatActivityTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  const difference = now - date;

  const minutes = Math.floor(difference / 60000);
  const hours = Math.floor(difference / 3600000);
  const days = Math.floor(difference / 86400000);

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  if (days < 7) {
    return `${days} day${days === 1 ? "" : "s"} ago`;
  }

  return date.toLocaleDateString();
}

function getActivityIcon(type) {
  switch (type) {
    case "TASK_CREATED":
      return "✓";

    case "TASK_COMPLETED":
      return "✓";

    case "TIMER_CREATED":
      return "◷";

    case "TIMER_COMPLETED":
      return "✓";

    case "DOCUMENT_CREATED":
      return "▤";

    case "TANK_CREATED":
      return "+";

    case "TANK_JOINED":
      return "→";

    default:
      return "•";
  }
}

export default function Home() {
  const { user } = useAuth();

  // Tanks
  const [tanks, setTanks] = useState([]);
  const [loadingTanks, setLoadingTanks] = useState(true);

  // Recent activity
  const [activities, setActivities] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(true);

  // Load user's tanks
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

  // Load recent activity
  useEffect(() => {
    async function loadActivities() {
      try {
        const data = await getRecentActivities();
        setActivities(data || []);
      } catch (error) {
        console.error("Failed to load recent activity:", error);
      } finally {
        setLoadingActivity(false);
      }
    }

    loadActivities();
  }, []);

  return (
    <main className="home-page">

      {/* Welcome */}
      <section className="home-hero">
        <div>
          <p className="home-eyebrow">
            Fishbowl Studies
          </p>

          <h1>
            Welcome back, {user?.username || "Student"}!
          </h1>

          <p className="home-subtitle">
            Study smarter, collaborate with classmates,
            and stay on top of your coursework.
          </p>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="home-actions">

        <Link
          to="/tanks/create"
          className="home-action-card"
        >
          <div className="home-action-icon">
            +
          </div>

          <div>
            <h2>Create a Tank</h2>
            <p>
              Start a new study space for your class
              or subject.
            </p>
          </div>
        </Link>

        <Link
          to="/tanks/find"
          className="home-action-card"
        >
          <div className="home-action-icon">
            ⌕
          </div>

          <div>
            <h2>Find a Tank</h2>
            <p>
              Discover study groups and find a tank
              to join.
            </p>
          </div>
        </Link>

      </section>

      {/* My Study Tanks */}
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
                      tanks.length === 1
                        ? "study tank"
                        : "study tanks"
                    }.`}
            </p>
          </div>

          <Link
            to="/dashboard"
            className="home-view-link"
          >
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
              <Link
                to="/dashboard"
                className="home-more-tanks"
              >
                View all {tanks.length} tanks →
              </Link>
            )}

          </div>
        )}

        {!loadingTanks && tanks.length === 0 && (
          <div className="home-empty-tanks">

            <p>
              Your study tanks will appear here once
              you create or join one.
            </p>

            <Link to="/tanks/find">
              Find a Tank →
            </Link>

          </div>
        )}

      </section>

      {/* Recent Activity */}
      <section className="home-section">

        <div className="home-section-header">

          <div>
            <h2>Recent Activity</h2>

            <p>
              Keep track of what's happening in your
              study groups.
            </p>
          </div>

        </div>

        {loadingActivity ? (

          <div className="home-activity-empty">
            <p>
              Loading recent activity...
            </p>
          </div>

        ) : activities.length === 0 ? (

          <div className="home-activity-empty">

            <div className="home-activity-icon">
              ✓
            </div>

            <div>
              <h3>No recent activity</h3>

              <p>
                Activity from your study tanks will
                appear here.
              </p>
            </div>

          </div>

        ) : (

          <div className="home-activity-list">

            {activities.map((activity) => (

              <div
                className="home-activity-item"
                key={activity.id}
              >
                <div className="home-activity-icon">
                  {getActivityIcon(activity.type)}
                </div>

                <div className="home-activity-content">
                  <p>
                    {activity.description}
                  </p>

                  <span>
                    {activity.tankName} •{" "}
                    {formatActivityTime(activity.createdAt)}
                  </span>
                </div>
              </div>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}