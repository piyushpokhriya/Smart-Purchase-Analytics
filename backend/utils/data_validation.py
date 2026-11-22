
def validate_dataset(dataframe, dataset_name):
    """
    Validate dataset according to its type.
    """

    if dataframe is None or dataframe.empty:
        raise ValueError("Dataset is empty or unavailable.")

    if dataframe.columns.duplicated().any():
        raise ValueError("Duplicate column names found.")

    if dataset_name == "market_basket":

        required_columns = [
            "InvoiceNo",
            "StockCode",
            "Description",
            "Quantity",
            "UnitPrice"
        ]

    elif dataset_name == "purchase_prediction":

        required_columns = [
            "Revenue"
        ]

    else:
        raise ValueError(f"Unknown dataset: {dataset_name}")

    missing_columns = [
        column for column in required_columns
        if column not in dataframe.columns
    ]

    if missing_columns:
        raise ValueError(
            f"Missing required columns: {missing_columns}"
        )

    return True
