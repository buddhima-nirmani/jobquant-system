from pathlib import Path

import joblib
import pandas as pd

from fastapi import APIRouter, HTTPException

from app.schemas.prediction import (
    PredictionRequest,
    PredictionResponse,
)


router = APIRouter(
    prefix="/api/prediction",
    tags=["Prediction"],
)


MODEL_PATH = (
    Path(__file__).resolve().parents[3]
    / "ml-model"
    / "models"
    / "jobquant_final_random_forest_model.pkl"
)


_model = None


def get_model():
    global _model

    if _model is None:
        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"ML model not found: {MODEL_PATH}"
            )

        _model = joblib.load(MODEL_PATH)

    return _model


@router.post(
    "/predict",
    response_model=PredictionResponse,
)
def predict_cost(data: PredictionRequest):
    try:
        model = get_model()

        # --------------------------------------------------
        # Create input data using the same original features
        # used during model training
        # --------------------------------------------------

        input_data = pd.DataFrame(
            [
                {
                    "Product Category": data.product_category,
                    "Product Name": data.product_name,
                    "Width": data.width,
                    "Height": data.height,
                    "Area": data.area,
                    "Unit": data.unit,
                    "Quantity": data.quantity,
                    "Material": data.material,
                    "Specification": data.specification,
                    "Print Type": data.print_type,
                    "Lamination": data.lamination,
                    "Installation": data.installation,
                    "Transport": data.transport,

                    # Feature-engineered columns
                    # These MUST match the training process.
                    "Area_per_Quantity": (
                        data.area * data.quantity
                    ),
                    "Width_per_Quantity": (
                        data.width * data.quantity
                    ),
                    "Height_per_Quantity": (
                        data.height * data.quantity
                    ),
                }
            ]
        )

        # --------------------------------------------------
        # Generate prediction
        # --------------------------------------------------

        prediction = model.predict(input_data)

        # The trained model predicts TOTAL COST.
        predicted_total_cost = float(prediction[0])

        # Calculate unit price from predicted total cost.
        if data.quantity <= 0:
            raise HTTPException(
                status_code=400,
                detail="Quantity must be greater than zero.",
            )

        predicted_unit_price = (
            predicted_total_cost / data.quantity
        )

        # --------------------------------------------------
        # Return response
        # --------------------------------------------------

        return PredictionResponse(
            predicted_unit_price=round(
                predicted_unit_price,
                2,
            ),
            predicted_total_cost=round(
                predicted_total_cost,
                2,
            ),
        )

    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=500,
            detail=str(exc),
        )

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(exc)}",
        )