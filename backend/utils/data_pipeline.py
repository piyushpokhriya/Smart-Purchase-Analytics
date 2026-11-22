
from utils.data_loader import load_dataset
from utils.data_validation import validate_dataset
from utils.data_inspection import inspect_dataset
from utils.data_preprocessing import preprocess_dataset
from utils.data_export import export_dataset


def run_data_pipeline(dataset_name):

    dataframe = load_dataset(dataset_name)

    validate_dataset(dataframe, dataset_name)

    inspection = inspect_dataset(dataset_name)

    processed_dataframe = preprocess_dataset(
        dataframe,
        dataset_name
    )

    export_path = export_dataset(
        processed_dataframe,
        dataset_name
    )

    return {
        "dataset_name": dataset_name,
        "original_shape": list(dataframe.shape),
        "processed_shape": list(processed_dataframe.shape),
        "inspection": inspection,
        "export_path": export_path
    }
