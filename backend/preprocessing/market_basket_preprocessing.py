
import pandas as pd

from utils.data_loader import load_dataset
from utils.data_cleaning import (
    remove_duplicates,
    save_processed_dataset
)


def preprocess_market_basket():

    # Load original dataset
    df = load_dataset("market_basket")

    original_rows = len(df)

    # Remove exact duplicate records
    df, duplicates_removed = remove_duplicates(df)

    # Clean text columns
    text_columns = [
        "InvoiceNo",
        "StockCode",
        "Description",
        "Country"
    ]

    for column in text_columns:
        df[column] = df[column].astype("string").str.strip()

    # Convert empty descriptions into missing values
    df["Description"] = df["Description"].replace("", pd.NA)

    # Remove records with essential missing values
    df = df.dropna(
        subset=["InvoiceNo", "StockCode", "Description"]
    ).copy()

    # Convert InvoiceDate into datetime
    df["InvoiceDate"] = pd.to_datetime(
        df["InvoiceDate"],
        errors="coerce"
    )

    df = df.dropna(subset=["InvoiceDate"]).copy()

    # Remove cancelled invoices
    cancelled_mask = df["InvoiceNo"].str.startswith(
        "C",
        na=False
    )

    cancelled_removed = int(cancelled_mask.sum())

    df = df.loc[~cancelled_mask].copy()

    # Keep only valid purchased quantities
    invalid_quantity = df["Quantity"] <= 0
    invalid_price = df["UnitPrice"] <= 0

    invalid_removed = int(
        (invalid_quantity | invalid_price).sum()
    )

    df = df.loc[
        (df["Quantity"] > 0) &
        (df["UnitPrice"] > 0)
    ].copy()

    # Save cleaned dataset
    output_path = save_processed_dataset(
        df,
        "OnlineRetail_cleaned.csv"
    )

    return {
        "dataset": "market_basket",
        "original_rows": original_rows,
        "duplicates_removed": duplicates_removed,
        "cancelled_invoices_removed": cancelled_removed,
        "invalid_transactions_removed": invalid_removed,
        "cleaned_rows": len(df),
        "removed_rows": original_rows - len(df),
        "remaining_missing_values": int(df.isnull().sum().sum()),
        "output_file": output_path,
        "status": "success"
    }
