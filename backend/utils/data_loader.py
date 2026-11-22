
import pandas as pd

from config import DATASETS, DATASET_ENCODINGS


def load_dataset(dataset_name):
    """
    Load a dataset using its configured path and encoding.
    """

    if dataset_name not in DATASETS:
        raise ValueError(f"Unknown dataset: {dataset_name}")

    file_path = DATASETS[dataset_name]
    encoding = DATASET_ENCODINGS[dataset_name]

    if not file_path.exists():
        raise FileNotFoundError(
            f"Dataset not found: {file_path}"
        )

    try:
        dataframe = pd.read_csv(
            file_path,
            encoding=encoding
        )

        return dataframe

    except Exception as error:
        raise RuntimeError(
            f"Error loading {dataset_name}: {error}"
        )
