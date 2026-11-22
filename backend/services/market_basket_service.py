
import pandas as pd
from mlxtend.preprocessing import TransactionEncoder

from config import DATASETS
from utils.data_loader import load_dataset
from utils.data_validation import validate_dataset
from utils.data_preprocessing import preprocess_dataset


def prepare_transactions():
    """
    Prepare invoice-wise product transactions.
    """

    # Load and preprocess dataset
    dataframe = load_dataset("market_basket")

    validate_dataset(dataframe, "market_basket")

    dataframe = preprocess_dataset(
        dataframe,
        "market_basket"
    )

    # Group products by invoice
    transactions = (
        dataframe.groupby("InvoiceNo")["Description"]
        .apply(lambda products: list(set(products)))
        .tolist()
    )

    if not transactions:
        raise ValueError("No valid transactions found.")

    # Convert transactions into one-hot encoded format
    encoder = TransactionEncoder()

    encoded_data = encoder.fit(transactions).transform(
        transactions,
        sparse=True
    )

    basket_matrix = pd.DataFrame.sparse.from_spmatrix(
        encoded_data,
        columns=encoder.columns_
    )

    return basket_matrix
