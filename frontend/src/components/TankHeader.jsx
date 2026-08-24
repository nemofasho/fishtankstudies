import React from "react";

function TankHeader({ tank }) {
    if (!tank) {
        return (
            <header className="tank-header">
                <p>Loading tank...</p>
            </header>
        );
    }

    return (
        <header className="tank-header">
            <div>
                <h1>{tank.name}</h1>

                <div className="tank-header-info">
                    <span>{tank.subject}</span>
                    <span>{tank.className}</span>
                </div>
            </div>

            <div className="tank-stats">
                <div>
                    <strong>{tank.taskCount}</strong>
                    <span>Tasks</span>
                </div>

                <div>
                    <strong>{tank.memberCount}</strong>
                    <span>Members</span>
                </div>
            </div>
        </header>
    );
}

export default TankHeader;