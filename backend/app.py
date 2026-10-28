
from pathlib import Path

import pandas as pd
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Dataset folder ka path
BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"


@app.route("/")
def home():
    return {
        "message": "Smart Purchase Analytics Backend is running"
    }


@app.route("/api/health")
def health():
    return {
        "status": "success",
        "message": "Frontend connected to Flask backend successfully"
    }


@app.route("/api/datasets")
def check_datasets():
    datasets = {
        "purchase_prediction": (
            DATA_DIR
            / "online_shoppers_intention.csv"
            / "online_shoppers_intention.csv"
        ),
        "market_basket": (
            DATA_DIR
            / "OnlineRetail.csv"
            / "OnlineRetail.csv"
        )
    }

    results = {}

    for name, file_path in datasets.items():
        if not file_path.is_file():
            results[name] = {
                "status": "error",
                "message": f"Dataset file not found: {file_path}"
            }
            continue

        try:
            df = pd.read_csv(file_path, nrows=5)

            results[name] = {
                "status": "success",
                "columns": df.columns.tolist(),
                "sample_rows": len(df)
            }

        except Exception as error:
            results[name] = {
                "status": "error",
                "message": str(error)
            }

    return results


if __name__ == "__main__":
    app.run(debug=True)
