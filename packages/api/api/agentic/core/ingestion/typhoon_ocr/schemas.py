from pydantic import BaseModel, Field


class TyphoonOCRResponse(BaseModel):
    """Response schema for Typhoon OCR."""

    natural_text: str = Field(..., description="Extracted text from the image")
