import React from "react";
import "./Header.css";

function Header({ backendStatus }) {
    const isConnected = backendStatus === "Connected";

    return (
        <header className="dashboard-header">
            <div>
                <p className="header-eyebrow">OVERVIEW</p>
                <h1>Dashboard</h1>
                <p className="header-subtitle">
                    Understand customer purchase behaviour.
                </p>
            </div>

            <div
                className={`connection-status ${
                    isConnected ? "connected" : "disconnected"
                }`}
            >
                <span className="status-dot"></span>
                Backend: {backendStatus}
            </div>
        </header>
    );
}

export default Header;