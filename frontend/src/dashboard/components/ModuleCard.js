
import React from "react";
import {
    ChartNoAxesCombined,
    ShoppingBasket
} from "lucide-react";

import "./ModuleCard.css";

function ModuleCard({
    id,
    title,
    description,
    algorithm,
    number,
    onClick
}) {
    const Icon =
        id === "purchase-prediction"
            ? ChartNoAxesCombined
            : ShoppingBasket;

    return (
        <button
            type="button"
            id={id}
            className="module-card"
            onClick={onClick}
        >
            <div className="module-card-top">
                <span className="module-icon">
                    <Icon size={24} strokeWidth={1.7} />
                </span>

                <span className="module-number">{number}</span>
            </div>

            <h3>{title}</h3>

            <p className="module-description">
                {description}
            </p>

            <div className="module-card-footer">
                <span className="module-tag">{algorithm}</span>

                <span className="module-arrow" aria-hidden="true">
                    →
                </span>
            </div>
        </button>
    );
}

export default ModuleCard;
