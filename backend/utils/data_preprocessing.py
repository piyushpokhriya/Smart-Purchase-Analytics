
import pandas as pd


def preprocess_dataset(dataframe, dataset_name):
    """
    Clean dataset based on dataset type.
    """

    if dataframe is None or dataframe.empty:
        raise ValueError("Dataset is empty.")

    dataframe = dataframe.copy()

    # Remove duplicate rows
    dataframe.drop_duplicates(inplace=True)

    # Remove completely empty rows
    dataframe.dropna(how="all", inplace=True)

    # Clean column names
    dataframe.columns = dataframe.columns.str.strip()

    if dataset_name == "market_basket":

        # Remove cancelled transactions
        dataframe = dataframe[
            ~dataframe["InvoiceNo"].astype(str).str.startswith("C")
        ]

        # Remove invalid quantities and prices
        dataframe = dataframe[
            (dataframe["Quantity"] > 0) &
            (dataframe["UnitPrice"] > 0)
        ]

        # Remove missing transaction details
        dataframe.dropna(
            subset=["InvoiceNo", "StockCode", "Description"],
            inplace=True
        )

        dataframe["Description"] = (
            dataframe["Description"].astype(str).str.strip()
        )

    elif dataset_name == "purchase_prediction":

        # Remove rows with missing target
        dataframe.dropna(
            subset=["Revenue"],
            inplace=True
        )

        # Handle remaining missing values
        for column in dataframe.columns:

            if dataframe[column].isnull().any():

                if pd.api.types.is_numeric_dtype(dataframe[column]):
                    dataframe[column] = dataframe[column].fillna(
                        dataframe[column].median()
                    )
                else:
                    mode = dataframe[column].mode()

                    dataframe[column] = dataframe[column].fillna(
                        mode.iloc[0] if not mode.empty else "Unknown"
                    )

    else:
        raise ValueError("Unsupported dataset name.")

    return dataframe.reset_index(drop=True)
