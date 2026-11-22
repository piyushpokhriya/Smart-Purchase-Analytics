
from config import PROCESSED_DATA_DIR


def remove_duplicates(df):
    """Remove exact duplicate rows and return removal count."""

    original_rows = len(df)

    df = df.drop_duplicates().copy()

    removed_rows = original_rows - len(df)

    return df, removed_rows


def save_processed_dataset(df, filename):
    """Save cleaned dataset without modifying original CSV."""

    PROCESSED_DATA_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    file_path = PROCESSED_DATA_DIR / filename

    df.to_csv(file_path, index=False)

    return str(file_path)
