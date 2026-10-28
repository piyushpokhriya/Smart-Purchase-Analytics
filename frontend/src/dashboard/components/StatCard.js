
import React from "react";
import "./StatCard.css";

function StatCard({ title, value, description, icon: Icon }) {
    return (
        <article className="stat-card">
            <div className="stat-card-top">
                <span className="stat-icon">
                    <Icon size={20} strokeWidth={1.8} />
                </span>
            </div>

            <p className="stat-title">{title}</p>

            <h2 className="stat-value">{value}</h2>

            <p className="stat-description">{description}</p>
        </article>
    );
}

export default StatCard;
