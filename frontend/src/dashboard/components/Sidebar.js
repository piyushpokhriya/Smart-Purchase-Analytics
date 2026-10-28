
import React from "react";
import {
    LayoutDashboard,
    ChartNoAxesCombined,
    ShoppingBasket
} from "lucide-react";

import "./Sidebar.css";

function Sidebar({ activeModule, onNavigate }) {
    const navigationItems = [
        {
            id: null,
            label: "Dashboard",
            Icon: LayoutDashboard
        },
        {
            id: "purchase-prediction",
            label: "Purchase Prediction",
            Icon: ChartNoAxesCombined
        },
        {
            id: "market-basket",
            label: "Market Basket Analysis",
            Icon: ShoppingBasket
        }
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <div className="brand-icon">S</div>

                <div>
                    <h2>Smart Purchase</h2>
                    <p>Analytics</p>
                </div>
            </div>

            <p className="sidebar-label">WORKSPACE</p>

            <nav className="sidebar-nav">
                {navigationItems.map(({ id, label, Icon }) => (
                    <button
                        key={label}
                        type="button"
                        className={`sidebar-link ${
                            activeModule === id ? "active" : ""
                        }`}
                        onClick={() => onNavigate(id)}
                        aria-current={
                            activeModule === id ? "page" : undefined
                        }
                    >
                        <Icon size={19} strokeWidth={1.8} />
                        <span>{label}</span>
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <p>Smart Purchase Analytics</p>
                <span>Machine Learning + Apriori</span>
            </div>
        </aside>
    );
}

export default Sidebar;
