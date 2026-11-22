
import React, { useState } from "react";

const initialForm = {
    Administrative: 0,
    Administrative_Duration: 0,
    Informational: 0,
    Informational_Duration: 0,
    ProductRelated: 1,
    ProductRelated_Duration: 30,
    BounceRates: 0.02,
    ExitRates: 0.05,
    PageValues: 0,
    SpecialDay: 0,
    Month: "Nov",
    OperatingSystems: 2,
    Browser: 2,
    Region: 1,
    TrafficType: 2,
    VisitorType: "Returning_Visitor",
    Weekend: false
};

const numericFields = [
    ["Administrative", "Administrative Pages"],
    ["Administrative_Duration", "Administrative Duration"],
    ["Informational", "Informational Pages"],
    ["Informational_Duration", "Informational Duration"],
    ["ProductRelated", "Product Related Pages"],
    ["ProductRelated_Duration", "Product Related Duration"],
    ["BounceRates", "Bounce Rates"],
    ["ExitRates", "Exit Rates"],
    ["PageValues", "Page Values"],
    ["SpecialDay", "Special Day"],
    ["OperatingSystems", "Operating Systems"],
    ["Browser", "Browser"],
    ["Region", "Region"],
    ["TrafficType", "Traffic Type"]
];

function PurchasePrediction({ onBack }) {
    const [form, setForm] = useState(initialForm);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleChange(event) {
        const { name, value, type, checked } = event.target;

        setForm(previous => ({
            ...previous,
            [name]: type === "checkbox"
                ? checked
                : type === "number"
                    ? Number(value)
                    : value
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setLoading(true);
        setError("");
        setResult(null);

        try {
            const response = await fetch(
                "http://127.0.0.1:5000/api/purchase-prediction/predict",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(form)
                }
            );

            const data = await response.json();

            if (!response.ok || data.status !== "success") {
                throw new Error(data.message || "Prediction failed.");
            }

            setResult(data.results);
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

            <h2>Purchase Prediction</h2>

            <p>
                Predict whether a website visitor will make a purchase
                using the Random Forest Machine Learning model.
            </p>

            <div className="module-placeholder">
                <h3>Customer Session Details</h3>

                <form onSubmit={handleSubmit}>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "16px"
                    }}>
                        {numericFields.map(([name, label]) => (
                            <label key={name}>
                                {label}
                                <input
                                    type="number"
                                    name={name}
                                    value={form[name]}
                                    onChange={handleChange}
                                    min="0"
                                    step="any"
                                    required
                                />
                            </label>
                        ))}

                        <label>
                            Month
                            <select
                                name="Month"
                                value={form.Month}
                                onChange={handleChange}
                            >
                                {[
                                    "Feb", "Mar", "May", "June",
                                    "Jul", "Aug", "Sep", "Oct",
                                    "Nov", "Dec"
                                ].map(month => (
                                    <option key={month} value={month}>
                                        {month}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            Visitor Type
                            <select
                                name="VisitorType"
                                value={form.VisitorType}
                                onChange={handleChange}
                            >
                                <option value="Returning_Visitor">
                                    Returning Visitor
                                </option>
                                <option value="New_Visitor">
                                    New Visitor
                                </option>
                                <option value="Other">Other</option>
                            </select>
                        </label>

                        <label style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px"
                        }}>
                            <input
                                type="checkbox"
                                name="Weekend"
                                checked={form.Weekend}
                                onChange={handleChange}
                            />
                            Weekend Visit
                        </label>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Predicting..." : "Predict Purchase"}
                    </button>
                </form>

                {error && (
                    <p role="alert" style={{ color: "red" }}>
                        {error}
                    </p>
                )}
            </div>

            {result && (
                <div className="module-placeholder">
                    <h3>Prediction Result</h3>

                    <h2 style={{
                        color: result.purchase_prediction === 1
                            ? "green"
                            : "red"
                    }}>
                        {result.prediction_label}
                    </h2>

                    <p>
                        Purchase Probability:{" "}
                        <strong>
                            {Number(result.purchase_probability).toFixed(2)}%
                        </strong>
                    </p>

                    <div style={{
                        background: "#e5e7eb",
                        borderRadius: "10px",
                        height: "14px",
                        overflow: "hidden"
                    }}>
                        <div style={{
                            width: `${Math.min(100, Math.max(0, Number(result.purchase_probability)))}%`,
                            background: "#16a34a",
                            height: "100%"
                        }} />
                    </div>
                </div>
            )}
        </section>
    );
}

export default PurchasePrediction;
