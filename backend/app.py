
from flask import Flask, jsonify, request
from flask_cors import CORS

from config import DATASETS
from services.market_basket_analysis import (
    perform_market_basket_analysis
)
from services.purchase_prediction_service import (
    train_purchase_prediction_model,
    predict_purchase
)
from utils.data_loader import load_dataset


app = Flask(__name__)
CORS(app)


# Home route
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Smart Purchase Analytics Backend is running"
    })


# Health check
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "success",
        "message": "Backend connected successfully"
    })


# Dataset information
@app.route("/api/datasets", methods=["GET"])
def get_datasets():

    results = {}

    for dataset_name in DATASETS:

        try:
            dataframe = load_dataset(dataset_name)

            results[dataset_name] = {
                "status": "available",
                "total_rows": len(dataframe),
                "total_columns": len(dataframe.columns),
                "columns": dataframe.columns.tolist(),
                "sample_data": dataframe.head(5).to_dict(
                    orient="records"
                )
            }

        except Exception as error:
            results[dataset_name] = {
                "status": "error",
                "message": str(error)
            }

    return jsonify({
        "status": "success",
        "datasets": results
    })


# Dashboard Statistics
@app.route("/api/dashboard-stats", methods=["GET"])
def dashboard_stats():

    try:
        retail_data = load_dataset("market_basket")
        purchase_data = load_dataset("purchase_prediction")

        total_customers = int(
            retail_data["CustomerID"].nunique()
        )

        total_transactions = int(
            retail_data["InvoiceNo"].nunique()
        )

        purchase_sessions = len(purchase_data)

        purchase_count = int(
            (purchase_data["Revenue"] == True).sum()
        )

        no_purchase_count = int(
            (purchase_data["Revenue"] == False).sum()
        )

        purchase_percentage = round(
            (purchase_count / purchase_sessions) * 100, 2
        ) if purchase_sessions > 0 else 0

        no_purchase_percentage = round(
            (no_purchase_count / purchase_sessions) * 100, 2
        ) if purchase_sessions > 0 else 0

        return jsonify({
            "status": "success",
            "results": {
                "total_customers": total_customers,
                "total_transactions": total_transactions,
                "purchase_sessions": purchase_sessions,
                "purchase_distribution": {
                    "purchase": purchase_count,
                    "no_purchase": no_purchase_count,
                    "purchase_percentage": purchase_percentage,
                    "no_purchase_percentage": no_purchase_percentage
                }
            }
        })

    except Exception as error:
        app.logger.exception("Dashboard statistics failed")

        return jsonify({
            "status": "error",
            "message": str(error)
        }), 500


# Market Basket Analysis
@app.route("/api/market-basket", methods=["GET"])
def market_basket():

    try:
        min_support = float(
            request.args.get("min_support", 0.02)
        )

        min_confidence = float(
            request.args.get("min_confidence", 0.3)
        )

        min_lift = float(
            request.args.get("min_lift", 1.0)
        )

        if not 0 < min_support <= 1:
            return jsonify({
                "status": "error",
                "message": "min_support must be between 0 and 1"
            }), 400

        if not 0 < min_confidence <= 1:
            return jsonify({
                "status": "error",
                "message": "min_confidence must be between 0 and 1"
            }), 400

        if min_lift < 0:
            return jsonify({
                "status": "error",
                "message": "min_lift cannot be negative"
            }), 400

        results = perform_market_basket_analysis(
            min_support=min_support,
            min_confidence=min_confidence,
            min_lift=min_lift
        )

        return jsonify({
            "status": "success",
            "results": results
        })

    except (ValueError, TypeError) as error:
        return jsonify({
            "status": "error",
            "message": str(error)
        }), 400

    except Exception as error:
        app.logger.exception("Market Basket Analysis failed")

        return jsonify({
            "status": "error",
            "message": str(error)
        }), 500


# Train Purchase Prediction Model
@app.route(
    "/api/purchase-prediction/train",
    methods=["POST"]
)
def train_purchase_model():

    try:
        results = train_purchase_prediction_model()

        return jsonify({
            "status": "success",
            "message": "Purchase prediction model trained successfully",
            "results": results
        })

    except Exception as error:
        app.logger.exception("Model training failed")

        return jsonify({
            "status": "error",
            "message": str(error)
        }), 500


# Predict Purchase
@app.route(
    "/api/purchase-prediction/predict",
    methods=["POST"]
)
def purchase_prediction():

    try:
        input_data = request.get_json(silent=True)

        if not isinstance(input_data, dict) or not input_data:
            return jsonify({
                "status": "error",
                "message": "Please provide valid JSON input data"
            }), 400

        results = predict_purchase(input_data)

        return jsonify({
            "status": "success",
            "results": results
        })

    except (ValueError, TypeError) as error:
        return jsonify({
            "status": "error",
            "message": str(error)
        }), 400

    except FileNotFoundError as error:
        return jsonify({
            "status": "error",
            "message": str(error)
        }), 404

    except Exception as error:
        app.logger.exception("Purchase prediction failed")

        return jsonify({
            "status": "error",
            "message": str(error)
        }), 500


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
