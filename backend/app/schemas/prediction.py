from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    product_category: str
    product_name: str

    width: float = Field(gt=0)
    height: float = Field(gt=0)
    area: float = Field(gt=0)

    unit: str
    quantity: int = Field(gt=0)

    material: str
    specification: str
    print_type: str
    lamination: str
    installation: str
    transport: str


class PredictionResponse(BaseModel):
    predicted_unit_price: float
    predicted_total_cost: float