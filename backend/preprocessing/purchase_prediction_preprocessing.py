
from utils.data_loader import load_dataset
from utils.data_cleaning import (
    remove_duplicates,
    save_processed_dataset
)


def preprocess_purchase_prediction():

    # Load original dataset
    df = load_dataset("purchase_prediction")

    original_rows = len(df)

    # Remove exact duplicate records
    df, duplicates_removed = remove_duplicates(df)

    # Clean categorical text columns
    categorical_columns = [
        "Month",
        "VisitorType"
    ]

    for column in categorical_columns:
        df[column] = df[column].astype("string").str.strip()

    # Check missing values
    missing_values = int(df.isnull().sum().sum())

    # Save cleaned dataset
    output_path = save_processed_dataset(
        df,
        "online_shoppers_intention_cleaned.csv"
    )

    return {
        "dataset": "purchase_prediction",
        "original_rows": original_rows,
        "duplicates_removed": duplicates_removed,
        "cleaned_rows": len(df),
        "removed_rows": original_rows - len(df),
        "remaining_missing_values": missing_values,
        "output_file": output_path,
        "status": "success"
    }
