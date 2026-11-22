
from utils.data_loader import load_dataset


def inspect_dataset(dataset_name):
    """
    Inspect dataset structure and generate basic statistics.
    """

    dataframe = load_dataset(dataset_name)

    inspection = {
        "dataset_name": dataset_name,
        "total_rows": int(dataframe.shape[0]),
        "total_columns": int(dataframe.shape[1]),
        "columns": dataframe.columns.tolist(),
        "data_types": {
            column: str(dtype)
            for column, dtype in dataframe.dtypes.items()
        },
        "missing_values": {
            column: int(count)
            for column, count in dataframe.isnull().sum().items()
        },
        "total_missing_values": int(
            dataframe.isnull().sum().sum()
        ),
        "duplicate_rows": int(
            dataframe.duplicated().sum()
        ),
        "statistics": dataframe.describe(
            include="all"
        ).fillna("").to_dict()
    }

    return inspection
