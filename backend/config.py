from pathlib import Path

# Main backend directory
BASE_DIR = Path(__file__).resolve().parent

# Dataset directory
DATA_DIR = BASE_DIR / "data"

# Processed dataset directory
PROCESSED_DATA_DIR = DATA_DIR / "processed"

# Dataset paths
DATASETS = {
    "market_basket": DATA_DIR / "OnlineRetail.csv",
    "purchase_prediction": DATA_DIR / "online_shoppers_intention.csv"
}

# Dataset-specific encoding
DATASET_ENCODINGS = {
    "market_basket": "ISO-8859-1",
    "purchase_prediction": "utf-8"
}