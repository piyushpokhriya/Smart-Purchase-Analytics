
import React, { useState } from "react";

function MarketBasketAnalysis({ onBack }) {
    const [minSupport, setMinSupport] = useState("0.02");
    const [minConfidence, setMinConfidence] = useState("0.3");
    const [minLift, setMinLift] = useState("1.0");

    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function runAnalysis(event) {
        event.preventDefault();

        setLoading(true);
        setError("");
        setResults(null);

        try {
            const params = new URLSearchParams({
                min_support: minSupport,
                min_confidence: minConfidence,
                min_lift: minLift
            });

            const response = await fetch(
                `http://127.0.0.1:5000/api/market-basket?${params}`
            );

            const data = await response.json();

            if (!response.ok || data.status !== "success") {
                throw new Error(data.message || "Analysis failed.");
            }

            setResults(data.results);

        } catch (err) {
            setError(err.message || "Unable to connect to backend.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="module-page">

            <button onClick={onBack} className="back-button">
                Back to Dashboard
            </button>

            <h2>Market Basket Analysis</h2>

            <p>
                Discover products frequently purchased together
                using the Apriori algorithm.
            </p>

            <div className="module-placeholder">

                <h3>Analysis Parameters</h3>

                <form onSubmit={runAnalysis}>

                    <label>
                        Minimum Support
                        <input
                            type="number"
                            min="0.0001"
                            max="1"
                            step="any"
                            value={minSupport}
                            onChange={(e) => setMinSupport(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Minimum Confidence
                        <input
                            type="number"
                            min="0.0001"
                            max="1"
                            step="any"
                            value={minConfidence}
                            onChange={(e) => setMinConfidence(e.target.value)}
                            required
                        />
                    </label>

                    <label>
                        Minimum Lift
                        <input
                            type="number"
                            min="0"
                            step="any"
                            value={minLift}
                            onChange={(e) => setMinLift(e.target.value)}
                            required
                        />
                    </label>

                    <button type="submit" disabled={loading}>
                        {loading ? "Analyzing..." : "Run Analysis"}
                    </button>

                </form>

                {error && (
                    <p role="alert" style={{ color: "red" }}>
                        {error}
                    </p>
                )}

            </div>

            {results && (
                <div className="module-placeholder">

                    <h3>Analysis Results</h3>

                    <div className="stats-grid">

                        <div className="stat-card">
                            <h4>Total Transactions</h4>
                            <p>{results.total_transactions}</p>
                        </div>

                        <div className="stat-card">
                            <h4>Frequent Itemsets</h4>
                            <p>{results.total_frequent_itemsets}</p>
                        </div>

                        <div className="stat-card">
                            <h4>Association Rules</h4>
                            <p>{results.total_rules}</p>
                        </div>

                    </div>

                    <h3>Top Association Rules</h3>

                    <div style={{ overflowX: "auto" }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Products Purchased</th>
                                    <th>Recommended Products</th>
                                    <th>Support</th>
                                    <th>Confidence</th>
                                    <th>Lift</th>
                                </tr>
                            </thead>

                            <tbody>
                                {results.association_rules?.slice(0, 10).map(
                                    (rule, index) => (
                                        <tr key={index}>
                                            <td>{rule.antecedents}</td>
                                            <td>{rule.consequents}</td>
                                            <td>{Number(rule.support).toFixed(4)}</td>
                                            <td>{Number(rule.confidence).toFixed(4)}</td>
                                            <td>{Number(rule.lift).toFixed(4)}</td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    <h3>Frequent Itemsets</h3>

                    <div style={{ overflowX: "auto" }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Products</th>
                                    <th>Support</th>
                                </tr>
                            </thead>

                            <tbody>
                                {results.frequent_itemsets?.slice(0, 10).map(
                                    (item, index) => (
                                        <tr key={index}>
                                            <td>{item.itemsets}</td>
                                            <td>{Number(item.support).toFixed(4)}</td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            )}

        </section>
    );
}

export default MarketBasketAnalysis;
