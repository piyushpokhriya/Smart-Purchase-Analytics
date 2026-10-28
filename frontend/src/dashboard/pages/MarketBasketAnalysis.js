
import React from "react";

function MarketBasketAnalysis({ onBack }) {
    return (
        <section className="module-page">
            <button onClick={onBack} className="back-button">
                ← Back to Dashboard
            </button>

            <h2>Market Basket Analysis</h2>

            <p>
                Discover products that are frequently purchased
                together using the Apriori algorithm.
            </p>

            <div className="module-placeholder">
                <h3>Market Basket Analysis Module</h3>
                <p>
                    Transaction data and association rules
                    will be added here.
                </p>
            </div>
        </section>
    );
}

export default MarketBasketAnalysis;
