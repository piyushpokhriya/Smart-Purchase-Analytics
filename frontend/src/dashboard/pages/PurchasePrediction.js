
import React from "react";

function PurchasePrediction({ onBack }) {
    return (
        <section className="module-page">
            <button onClick={onBack} className="back-button">
                ← Back to Dashboard
            </button>

            <h2>Purchase Prediction</h2>

            <p>
                Predict whether a customer is likely to make a purchase
                using Machine Learning.
            </p>

            <div className="module-placeholder">
                <h3>Purchase Prediction Module</h3>
                <p>
                    Customer data and prediction functionality
                    will be added here.
                </p>
            </div>
        </section>
    );
}

export default PurchasePrediction;
