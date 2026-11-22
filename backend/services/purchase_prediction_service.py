
from pathlib import Path

import joblib
import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report
)
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline

from utils.data_loader import load_dataset
from utils.data_preprocessing import preprocess_dataset
from utils.data_validation import validate_dataset


BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_DIR = BASE_DIR / "models"


def train_purchase_prediction_model():
    """
    Train and evaluate the purchase prediction model.
    """

    # Load dataset
    dataframe = load_dataset("purchase_prediction")

    # Validate dataset
    validate_dataset(dataframe, "purchase_prediction")

    # Preprocess dataset
    dataframe = preprocess_dataset(
        dataframe,
        "purchase_prediction"
    )

    # Separate features and target
    X = dataframe.drop(columns=["Revenue"])
    y = dataframe["Revenue"].astype(int)

    # Identify numerical and categorical columns
    numerical_columns = X.select_dtypes(
        include=["number"]
    ).columns.tolist()

    categorical_columns = X.select_dtypes(
        include=["object", "category", "bool"]
    ).columns.tolist()

    # Create preprocessing pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            (
                "numerical",
                StandardScaler(),
                numerical_columns
            ),
            (
                "categorical",
                OneHotEncoder(handle_unknown="ignore"),
                categorical_columns
            )
        ]
    )

    # Create Random Forest model
    model = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            (
                "classifier",
                RandomForestClassifier(
                    n_estimators=150,
                    random_state=42,
                    class_weight="balanced",
                    n_jobs=-1
                )
            )
        ]
    )

    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    # Train model
    model.fit(X_train, y_train)

    # Make predictions
    predictions = model.predict(X_test)

    # Evaluate model
    accuracy = accuracy_score(y_test, predictions)

    precision = precision_score(
        y_test,
        predictions,
        zero_division=0
    )

    recall = recall_score(
        y_test,
        predictions,
        zero_division=0
    )

    f1 = f1_score(
        y_test,
        predictions,
        zero_division=0
    )

    # Save trained model
    MODEL_DIR.mkdir(
        parents=True,
        exist_ok=True
    )

    model_path = MODEL_DIR / "purchase_prediction_model.pkl"

    joblib.dump(model, model_path)

    return {
        "model_name": "Random Forest Classifier",
        "training_rows": len(X_train),
        "testing_rows": len(X_test),
        "accuracy": round(float(accuracy), 4),
        "precision": round(float(precision), 4),
        "recall": round(float(recall), 4),
        "f1_score": round(float(f1), 4),
        "confusion_matrix": confusion_matrix(
            y_test,
            predictions
        ).tolist(),
        "classification_report": classification_report(
            y_test,
            predictions,
            output_dict=True,
            zero_division=0
        ),
        "model_path": str(model_path)
    }


def predict_purchase(input_data):
    """
    Predict whether a visitor will make a purchase.
    """

    model_path = MODEL_DIR / "purchase_prediction_model.pkl"

    if not model_path.exists():
        raise FileNotFoundError(
            "Trained purchase prediction model not found."
        )

    # Load trained model
    model = joblib.load(model_path)

    # Get required input features
    required_columns = model.feature_names_in_.tolist()

    # Check missing features
    missing_columns = [
        column
        for column in required_columns
        if column not in input_data
    ]

    if missing_columns:
        raise ValueError(
            f"Missing input features: {missing_columns}"
        )

    # Prepare input dataframe
    input_dataframe = pd.DataFrame(
        [input_data],
        columns=required_columns
    )

    # Predict purchase
    prediction = int(
        model.predict(input_dataframe)[0]
    )

    # Calculate purchase probability
    probabilities = model.predict_proba(
        input_dataframe
    )[0]

    positive_class_index = list(
        model.classes_
    ).index(1)

    purchase_probability = float(
        probabilities[positive_class_index]
    )

    return {
        "purchase_prediction": prediction,
        "prediction_label": (
            "Purchase" if prediction == 1 else "No Purchase"
        ),
        "purchase_probability": round(
            purchase_probability * 100,
            2
        )
    }
