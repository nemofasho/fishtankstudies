import { Link } from "react-router-dom";

function TankHeader({ tank }) {

    return (

        <header className="tank-header">

            <Link
                to="/dashboard"
                className="back-button"
            >
                ← Dashboard
            </Link>

            <div className="tank-info">

                <h1>{tank.name}</h1>

                <p>

                    {tank.className}

                    •

                    {tank.subject}

                </p>

            </div>

        </header>

    );

}

export default TankHeader;