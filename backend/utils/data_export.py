
from config import PROCESSED_DATA_DIR


def export_dataset(dataframe, dataset_name):
    """
    Export processed dataset as CSV.
    """

    PROCESSED_DATA_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    file_path = PROCESSED_DATA_DIR / f"{dataset_name}_processed.csv"

    dataframe.to_csv(file_path, index=False)

    return str(file_path)
