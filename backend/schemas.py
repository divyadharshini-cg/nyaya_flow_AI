from pydantic import BaseModel, Field
from typing import List, Optional

class UserAuthRequest(BaseModel):
    email: str = Field(..., description="User email for login")
    full_name: str = Field(..., description="User full name")
    role: str = Field(..., description="Role chosen (citizen, advocate, etc.)")
    phone: Optional[str] = Field(None, description="Optional phone number")

class UserAuthResponse(BaseModel):
    success: bool
    id: str
    email: str
    full_name: str
    role: str
    phone: Optional[str]

class CaseClassifyRequest(BaseModel):
    description: str = Field(..., description="The user incident or dispute description in any Indian language")
    language: Optional[str] = Field("auto", description="Preferred language for classification context")
    citizen_id: Optional[str] = Field(None, description="Optional citizen ID to save petition in DB")

class CaseClassifyResponse(BaseModel):
    success: bool
    id: Optional[str] = Field(None, description="Petition ID in DB if saved")
    category: str = Field(..., description="Suggested dispute category (e.g. Civil, Property, Criminal)")
    confidence: str = Field(..., description="AI confidence score for classification")
    suggested_court: str = Field(..., description="Appropriate court level or magistrate")
    acts: List[str] = Field(..., description="List of relevant acts or legal statutes suggested")
    required_documents: List[str] = Field(..., description="Filing checklist documents required")
    timeline: str = Field(..., description="Estimated dispute resolution timeline")
    simple_explanation: str = Field(..., description="Layman description of what the case entails and recommendations")

class DocumentAuditRequest(BaseModel):
    petition_id: Optional[str] = None
    document_name: str
    ocr_text: str = Field(..., description="Extracted OCR text from document file")
    category: str = Field(..., description="Category of document (e.g., Petition, Deed, Aadhaar)")

class DocumentAuditResponse(BaseModel):
    success: bool
    health_score: int = Field(..., description="Computed document validity score between 0 and 100")
    issues: List[str] = Field(..., description="Identified errors (e.g., missing signature, blur, wrong format)")

class BnsSuggestionRequest(BaseModel):
    incident_report: str = Field(..., description="Police crime narrative description")

class BnsSuggestion(BaseModel):
    section: str = Field(..., description="Suggested BNS section")
    title: str = Field(..., description="BNS section title")
    description: str = Field(..., description="Summary of the statute offense definition")
    penalty: str = Field(..., description="Prescribed legal penalty scope")
    confidence: str = Field(..., description="AI prediction confidence percentage")

class BnsSuggestionResponse(BaseModel):
    success: bool
    suggestions: List[BnsSuggestion]

class CaseSummaryRequest(BaseModel):
    petition_text: str
    hearings_summary: Optional[str] = ""

class CaseSummaryResponse(BaseModel):
    success: bool
    brief_digest: str = Field(..., description="AI-generated judicial cause summary brief")
    legal_statutes: List[str] = Field(..., description="Prescribed sections for judge evaluation")

class ArchiveRequest(BaseModel):
    petition_id: str
    building: str
    floor: str
    room_number: str
    rack_number: str
    cupboard_number: Optional[str] = None
    shelf_number: str
    box_number: str
    file_barcode: str
    logged_by: str

class CourtOrderRequest(BaseModel):
    petition_id: str
    judge_id: str
    action_taken: str
    order_text: str

class UpdateAdvocateRequest(BaseModel):
    advocate_id: str

class UpdateCnrRequest(BaseModel):
    cnr_number: str
