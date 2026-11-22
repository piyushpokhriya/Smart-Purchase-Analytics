
import React, { useEffect, useState, useRef } from "react";

import {
    UsersRound,
    ShoppingCart,
    BrainCircuit,
    GitCompareArrows
} from "lucide-react";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import ModuleCard from "../components/ModuleCard";

import PurchasePrediction from "./PurchasePrediction";
import MarketBasketAnalysis from "./MarketBasketAnalysis";

import "../styles/Dashboard.css";
import "../styles/ModulePages.css";

function Dashboard() {
    const [backendStatus, setBackendStatus] = useState("Checking...");
    const [activeModule, setActiveModule] = useState(null);

    const [stats, setStats] = useState([
        {
            title: "Total Customers",
            value: "—",
            description: "Unique customers in dataset",
            icon: UsersRound
        },
        {
            title: "Total Transactions",
            value: "—",
            description: "Unique purchase invoices",
            icon: ShoppingCart
        },
        {
            title: "Purchase Sessions",
            value: "—",
            description: "Sessions in prediction dataset",
            icon: BrainCircuit
        },
        {
            title: "Product Associations",
            value: "—",
            description: "Rules discovered using Apriori",
            icon: GitCompareArrows
        }
    ]);

    const [purchaseDistribution, setPurchaseDistribution] = useState([]);
    const [basketInsights, setBasketInsights] = useState([]);

    const purchaseChartRef = useRef(null);
    const basketChartRef = useRef(null);

    const [purchaseChartWidth, setPurchaseChartWidth] = useState(450);
    const [basketChartWidth, setBasketChartWidth] = useState(450);

    // Measure chart container widths
    useEffect(() => {
        const purchaseElement = purchaseChartRef.current;
        const basketElement = basketChartRef.current;

        const observers = [];

        if (purchaseElement) {
            const purchaseObserver = new ResizeObserver((entries) => {
                const width = Math.floor(entries[0].contentRect.width);

                if (width > 0) {
                    setPurchaseChartWidth(width);
                }
            });

            purchaseObserver.observe(purchaseElement);
            observers.push(purchaseObserver);
        }

        if (basketElement) {
            const basketObserver = new ResizeObserver((entries) => {
                const width = Math.floor(entries[0].contentRect.width);

                if (width > 0) {
                    setBasketChartWidth(width);
                }
            });

            basketObserver.observe(basketElement);
            observers.push(basketObserver);
        }

        return () => {
            observers.forEach((observer) => observer.disconnect());
        };
    }, [purchaseDistribution.length, basketInsights.length]);

    // Check backend connection
    useEffect(() => {
        const controller = new AbortController();

        fetch("http://127.0.0.1:5000/api/health", {
            signal: controller.signal
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Backend request failed");
                }

                return response.json();
            })
            .then((data) => {
                setBackendStatus(
                    data.status === "success"
                        ? "Connected"
                        : "Disconnected"
                );
            })
            .catch((error) => {
                if (error.name !== "AbortError") {
                    setBackendStatus("Disconnected");
                }
            });

        return () => controller.abort();
    }, []);

    // Load dashboard statistics and purchase distribution
    useEffect(() => {
        const controller = new AbortController();

        async function loadDashboardStats() {
            try {
                const response = await fetch(
                    "http://127.0.0.1:5000/api/dashboard-stats",
                    { signal: controller.signal }
                );

                if (!response.ok) {
                    throw new Error("Dashboard statistics request failed");
                }

                const data = await response.json();

                if (data.status !== "success" || !data.results) {
                    throw new Error("Invalid dashboard statistics response");
                }

                const results = data.results;

                setStats((previousStats) => [
                    {
                        ...previousStats[0],
                        value: results.total_customers.toLocaleString("en-IN")
                    },
                    {
                        ...previousStats[1],
                        value: results.total_transactions.toLocaleString("en-IN")
                    },
                    {
                        ...previousStats[2],
                        value: results.purchase_sessions.toLocaleString("en-IN")
                    },
                    previousStats[3]
                ]);

                const distribution = results.purchase_distribution;

                setPurchaseDistribution([
                    {
                        name: "Purchase",
                        value: distribution.purchase
                    },
                    {
                        name: "No Purchase",
                        value: distribution.no_purchase
                    }
                ]);

            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Dashboard stats error:", error);
                }
            }
        }

        loadDashboardStats();

        return () => controller.abort();
    }, []);

    // Load market basket insights
    useEffect(() => {
        const controller = new AbortController();

        async function loadProductAssociations() {
            try {
                const response = await fetch(
                    "http://127.0.0.1:5000/api/market-basket",
                    { signal: controller.signal }
                );

                if (!response.ok) {
                    throw new Error("Market Basket API request failed");
                }

                const data = await response.json();

                if (data.status !== "success" || !data.results) {
                    throw new Error("Invalid Market Basket API response");
                }

                const results = data.results;

                setStats((previousStats) => [
                    ...previousStats.slice(0, 3),
                    {
                        ...previousStats[3],
                        value: results.total_rules.toLocaleString("en-IN")
                    }
                ]);

                setBasketInsights([
                    {
                        name: "Frequent Itemsets",
                        count: results.total_frequent_itemsets
                    },
                    {
                        name: "Association Rules",
                        count: results.total_rules
                    }
                ]);

            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Product associations error:", error);
                }
            }
        }

        loadProductAssociations();

        return () => controller.abort();
    }, []);

    const modules = [
        {
            id: "purchase-prediction",
            number: "01",
            title: "Purchase Prediction",
            description:
                "Estimate whether a customer is likely to make a purchase using historical customer and transaction data.",
            algorithm: "Machine Learning"
        },
        {
            id: "market-basket",
            number: "02",
            title: "Market Basket Analysis",
            description:
                "Discover products frequently purchased together and identify useful product associations.",
            algorithm: "Apriori Algorithm"
        }
    ];

    function renderActivePage() {
        if (activeModule === "purchase-prediction") {
            return (
                <PurchasePrediction
                    onBack={() => setActiveModule(null)}
                />
            );
        }

        if (activeModule === "market-basket") {
            return (
                <MarketBasketAnalysis
                    onBack={() => setActiveModule(null)}
                />
            );
        }

        return (
            <>
                <section className="dashboard-welcome">
                    <div>
                        <p className="welcome-label">
                            CUSTOMER INSIGHTS PLATFORM
                        </p>

                        <h2>Welcome to Smart Purchase Analytics</h2>

                        <p>
                            Turn purchase data into insights to understand
                            customers and discover product trends.
                        </p>
                    </div>

                    <div className="welcome-decoration">SPA</div>
                </section>

                <section className="stats-section">
                    <h2 className="section-heading">
                        Analytics Overview
                    </h2>

                    <div className="stats-grid">
                        {stats.map((stat) => (
                            <StatCard
                                key={stat.title}
                                title={stat.title}
                                value={stat.value}
                                description={stat.description}
                                icon={stat.icon}
                            />
                        ))}
                    </div>
                </section>

                <section className="charts-section">
                    <h2 className="section-heading">
                        Data Analytics & Insights
                    </h2>

                    <div className="charts-grid">

                        {/* Purchase Distribution */}
                        <div className="chart-card">
                            <div className="chart-heading">
                                <h3>Purchase Distribution</h3>
                                <p>
                                    Customer session purchase behaviour
                                </p>
                            </div>

                            {purchaseDistribution.length > 0 ? (
                                <>
                                    <div
                                        className="chart-container"
                                        ref={purchaseChartRef}
                                    >
                                        <PieChart
                                            width={purchaseChartWidth}
                                            height={280}
                                        >
                                            <Pie
                                                data={purchaseDistribution}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={85}
                                                innerRadius={55}
                                                paddingAngle={3}
                                                label={({ percent }) =>
                                                    `${(percent * 100).toFixed(1)}%`
                                                }
                                            >
                                                <Cell fill="#2563eb" />
                                                <Cell fill="#cbd5e1" />
                                            </Pie>

                                            <Tooltip
                                                formatter={(value) =>
                                                    value.toLocaleString("en-IN")
                                                }
                                            />

                                            <Legend />
                                        </PieChart>
                                    </div>

                                    <div className="chart-summary">
                                        <span>
                                            Purchase:{" "}
                                            <strong>
                                                {purchaseDistribution[0]?.value.toLocaleString("en-IN")}
                                            </strong>
                                        </span>

                                        <span>
                                            No Purchase:{" "}
                                            <strong>
                                                {purchaseDistribution[1]?.value.toLocaleString("en-IN")}
                                            </strong>
                                        </span>
                                    </div>
                                </>
                            ) : (
                                <p className="chart-loading">
                                    Loading purchase data...
                                </p>
                            )}
                        </div>

                        {/* Market Basket Insights */}
                        <div className="chart-card">
                            <div className="chart-heading">
                                <h3>Market Basket Insights</h3>
                                <p>
                                    Frequent itemsets and generated rules
                                </p>
                            </div>

                            {basketInsights.length > 0 ? (
                                <div
                                    className="chart-container"
                                    ref={basketChartRef}
                                >
                                    <BarChart
                                        width={basketChartWidth}
                                        height={280}
                                        data={basketInsights}
                                        margin={{
                                            top: 20,
                                            right: 20,
                                            left: 5,
                                            bottom: 10
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            vertical={false}
                                        />

                                        <XAxis
                                            dataKey="name"
                                            tick={{ fontSize: 11 }}
                                        />

                                        <YAxis
                                            allowDecimals={false}
                                        />

                                        <Tooltip />

                                        <Bar
                                            dataKey="count"
                                            name="Count"
                                            fill="#2563eb"
                                            radius={[7, 7, 0, 0]}
                                            barSize={65}
                                        />
                                    </BarChart>
                                </div>
                            ) : (
                                <p className="chart-loading">
                                    Loading market basket data...
                                </p>
                            )}
                        </div>

                    </div>
                </section>

                <section className="modules-section">
                    <div className="modules-heading">
                        <div>
                            <h2 className="section-heading">
                                Project Modules
                            </h2>

                            <p className="modules-subtitle">
                                Explore the two main analytical features.
                            </p>
                        </div>
                    </div>

                    <div className="modules-grid">
                        {modules.map((module) => (
                            <ModuleCard
                                key={module.id}
                                {...module}
                                onClick={() =>
                                    setActiveModule(module.id)
                                }
                            />
                        ))}
                    </div>
                </section>

                <footer className="dashboard-footer">
                    Smart Purchase Analytics · Machine Learning + Apriori
                </footer>
            </>
        );
    }

    return (
        <div className="app-layout" id="dashboard">
            <Sidebar
                activeModule={activeModule}
                onNavigate={setActiveModule}
            />

            <main className="main-content">
                <Header backendStatus={backendStatus} />

                {renderActivePage()}
            </main>
        </div>
    );
}

export default Dashboard;
