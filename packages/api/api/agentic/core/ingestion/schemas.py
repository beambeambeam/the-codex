from typing import Optional, Union

from pydantic import BaseModel, ConfigDict, Field


class FileInput(BaseModel):
    """Normalized file input structure using Pydantic."""

    content: Union[str, bytes] = Field(
        ..., description="File content as string or bytes"
    )
    file_name: str = Field(..., description="Name of the file")
    full_text: Optional[str] = Field(
        None, description="Full text content of the file, if applicable"
    )
    name: str = Field(..., description="File name without path")
    type: str = Field(..., description="File type (e.g., pdf, txt, docx)")
    is_path: bool = Field(False, description="Indicates if the content is a file path")


class ChunkMetadata(BaseModel):
    """Metadata for a document chunk."""

    start_index: Optional[int] = Field(
        None, description="Start index of the chunk in the document"
    )
    end_index: Optional[int] = Field(
        None, description="End index of the chunk in the document"
    )
    token_count: Optional[int] = Field(
        None, description="Number of tokens in the chunk"
    )
    level: Optional[int] = Field(None, description="Chunking level or type")
    # Optional field for page number if applicable
    page_number: Optional[int] = Field(
        None, description="Page number of the chunk in the original document"
    )


class DocumentChunk(BaseModel):
    """Base schema for a document chunk."""

    file_name: str = Field(..., description="Name of the file containing the chunk")
    file_type: str = Field(..., description="Type of the file (e.g., pdf, txt, docx)")
    chunk_text: str = Field(..., description="Text content of the chunk")
    chunk_metadata: ChunkMetadata = Field(
        default_factory=ChunkMetadata, description="Metadata associated with the chunk"
    )


# ------
class document_details(BaseModel):
    """Schema for document generated details."""

    title: str = Field(None, description="Title of the document")
    description: Optional[str] = Field(
        None, description="Full summary of document content"
    )

    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "title": "Possession",
                    "description": (
                        "A. S. Byatt’s novel 'Possession' tells the intertwined stories of two modern scholars, Roland Michell and Maud Bailey, who uncover the clandestine Victorian romance between poets Randolph Henry Ash and Christabel LaMotte.\n"
                        "Roland, working in the London Library, discovers hidden letters that spark an obsessive inquiry; Maud, a LaMotte scholar and distant relative, becomes his reluctant collaborator.\n"
                        "The dual narratives alternate between the present-day academic sleuthing—journals, letters, and postcards—and the 19th‑century poetic voices.\n"
                        "As they piece together evidence of holidays, possible consummation, and poetic influence, their own lives begin to mirror the historical affair.\n"
                        "Themes of literary scholarship, identity, secrecy, and the resonance of past passions in modern life are deeply explored.\n"
                        "The plot twists involve revelations in archives, shifting loyalties, and culminating in emotional parallels between the past lovers and the present ones.\n"
                        "The novel examines how researchers become intertwined with their subjects, blurring boundaries between life and literature."
                    ),
                },
                {
                    "title": "A Study on the Effects of Exercise on Mental Health: A Randomized Controlled Trial",
                    "description": (
                        "This is a hypothetical but realistic‑style research study summary (similar to published mental health trials).\n"
                        "A 12‑week randomized controlled trial (n=100 adults aged 25–40) examined aerobic exercise versus usual activity on symptoms of depression, anxiety, self-esteem, and overall mood.\n"
                        "Methods: participants were randomized to a thrice‑weekly supervised aerobic program (45 min per session) or control.\n"
                        "Assessment at baseline, 6 weeks, and 12 weeks used validated scales (e.g., Beck Depression Inventory, GAD‑7, Rosenberg Self‑Esteem Scale).\n"
                        "Results: the exercise group showed a 30 % reduction in depression scores and 25 % anxiety reduction versus controls, alongside a 15 % increase in self‑esteem ratings; effect sizes were moderate to large (Cohen’s d ≈ 0.7).\n"
                        "Drop‑out rates were low (~8 %) and compliance high (>90 %).\n"
                        "Discussion: the trial supports aerobic exercise as an effective non‑pharmacological intervention for young adults with mild to moderate mental health symptoms.\n"
                        "Limitations included single-site recruitment and short follow‑up.\n"
                        "Implications include integrating structured exercise into wellness programs and further research with longer durations and diverse populations."
                    ),
                },
                {
                    "title": "COVID-19 Case Trend Graph (2020–2021, Global)",
                    "description": (
                        "A line graph plotting global COVID-19 confirmed cases from Jan 2020 to Dec 2021.\n"
                        "The x-axis shows months, while the y-axis shows daily case counts on a logarithmic scale.\n"
                        "Three distinct waves are visible: the first wave (Mar–Jun 2020), second (Oct 2020–Feb 2021), and third (Delta, Jun–Sep 2021).\n"
                        "The graph includes vertical markers for major events such as WHO pandemic declaration, vaccine rollout dates, and variant emergence.\n"
                        "Data sources are labeled as WHO and Johns Hopkins University."
                    ),
                },
            ]
        }
    )
