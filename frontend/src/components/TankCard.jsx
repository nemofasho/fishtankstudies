import { Link } from "react-router-dom";

function TankCard({ tank }) {
  return (
    <div className="tank-card">

      <div className="tank-card-header">
        <span className="tank-class">{tank.className}</span>
      </div>

      <h2>{tank.name}</h2>

      <p className="tank-subject">{tank.subject}</p>

      <div className="tank-stats">
        <span>{tank.memberCount ?? 0} Members</span>
        <span>{tank.taskCount ?? 0} Tasks</span>
      </div>

      <Link
        to={`/tanks/${tank.id}`}
        className="open-tank-button"
      >
        Open Tank
      </Link>

    </div>
  );
}

export default TankCard;