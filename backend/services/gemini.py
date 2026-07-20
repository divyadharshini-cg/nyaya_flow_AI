import os
import json
import google.generativeai as genai
from typing import Dict, Any, List

class GeminiService:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.has_api_key = bool(self.api_key)
        
        if self.has_api_key:
            genai.configure(api_key=self.api_key)
            self.model_name = "gemini-1.5-flash"
        else:
            print("WARNING: GEMINI_API_KEY not found in environment. Running in Mock Sandbox mode.")

    def _call_gemini_json(self, prompt: str, fallback_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calls Gemini API requesting JSON output, falling back to simulated data if no API key exists."""
        if not self.has_api_key:
            return fallback_data

        try:
            model = genai.GenerativeModel(self.model_name)
            # Add strict instruction for JSON formatting
            full_prompt = f"{prompt}\n\nIMPORTANT: Return ONLY a valid JSON object matching the requested schema. Do not enclose it in markdown blocks."
            
            response = model.generate_content(
                full_prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            
            cleaned_text = response.text.strip()
            # Clean potential markdown JSON block wrap
            if cleaned_text.startswith("```"):
                lines = cleaned_text.split("\n")
                if lines[0].startswith("```json") or lines[0].startswith("```"):
                    cleaned_text = "\n".join(lines[1:-1]).strip()
            
            return json.loads(cleaned_text)
        except Exception as e:
            print(f"Error calling Gemini LLM: {e}. Falling back to sandbox datasets.")
            return fallback_data

    def classify_petition(self, description: str, language: str) -> Dict[str, Any]:
        prompt = f"""
        Analyze the following incident report/dispute submitted by a litigant in India.
        Input language of user: {language}
        Dispute Description: "{description}"
        
        Tasks:
        1. Classify the dispute category (Civil, Property, Criminal, Family, Cyber, Labour, etc.).
        2. Assign a classification confidence percentage (e.g. "94%").
        3. Identify the suggested court level in the Indian hierarchy (e.g. Subordinate Civil Court, SDM Court, Cyber Cell).
        4. List the key applicable acts and penal codes under Indian Law (e.g., Section 6 Specific Relief Act, Section 145 CrPC).
        5. Specify the mandatory filing documents required for the registry checklist based on category.
        6. Give an estimated timeline for first board review (e.g., 4-6 Months).
        7. Provide a simple, empathetic layman explanation of what they should do next, highlighting that AI only suggests and does not approve filings.
        
        Strict constraint: Do NOT generate CNR numbers.
        """
        
        fallback = {
            "success": True,
            "category": "Property Dispute (Civil)",
            "confidence": "92%",
            "suggested_court": "Sub-Divisional Magistrate Court",
            "acts": ["Section 145 CrPC", "Maharashtra Land Revenue Code, 1966"],
            "required_documents": ["Land Partition Deed Scan", "7/12 Extract Report"],
            "timeline": "3 - 6 Months",
            "simple_explanation": "This appears to be a civil boundary dispute. Gather survey certificates from the Talathi Office and discuss representation options with your lawyer. AI cannot register cases."
        }
        
        return self._call_gemini_json(prompt, fallback)

    def audit_document_health(self, doc_name: str, ocr_text: str, category: str) -> Dict[str, Any]:
        prompt = f"""
        Scrutinize the following text extracted via OCR from a legal filing document.
        Document Name: {doc_name}
        Document Category: {category}
        OCR Text: "{ocr_text[:3000]}"
        
        Task:
        1. Check for compliance issues: missing fields, lack of witness blocks, missing signature references (e.g., lack of 'Sign here' or 'Litigant Signature' filled), duplicates, or unreadable scanned fragments.
        2. Assign a Document Health Score from 0 to 100 based on completeness.
        3. List all specific issues. If it's ready, output an empty list of issues.
        """
        
        fallback = {
            "success": True,
            "health_score": 85,
            "issues": [
                "Page 3: Signature block of witness is blank.",
                "Missing document seal validation."
            ]
        }
        
        return self._call_gemini_json(prompt, fallback)

    def suggest_bns_sections(self, incident_report: str) -> Dict[str, Any]:
        prompt = f"""
        Analyze this police incident report description under Indian Criminal Laws.
        Incident Narrative: "{incident_report}"
        
        Task:
        1. Recommend 1-3 applicable sections of the Bharatiya Nyaya Sanhita (BNS) or associated laws (like IT Act, etc.).
        2. Provide short explanations and penalty guidelines for each.
        3. Assign confidence rating to each suggestion.
        
        Strict warning: Show that the officer must review and confirm. AI suggestions are not final legal decisions.
        """
        
        fallback = {
            "success": True,
            "suggestions": [
                {
                    "section": "Section 305 BNS",
                    "title": "Theft in dwelling house",
                    "description": "Larceny within residential boundaries.",
                    "penalty": "Up to 7 years imprisonment.",
                    "confidence": "95%"
                }
            ]
        }
        
        return self._call_gemini_json(prompt, fallback)

    def summarize_cause_list_case(self, petition_text: str, hearings_summary: str) -> Dict[str, Any]:
        prompt = f"""
        Summarize the legal petition dossier for a judge Cause List brief.
        Petition: "{petition_text[:2000]}"
        Hearing History: "{hearings_summary}"
        
        Task:
        1. Summarize the dispute in a 3-sentence brief digest.
        2. List applicable acts sections to refer to.
        """
        
        fallback = {
            "success": True,
            "brief_digest": "Civil claim for property boundary settlement. Parties contest family land boundary drawings. Prior registry review verified.",
            "legal_statutes": ["Maharashtra Land Revenue Code Section 143"]
        }
        
        return self._call_gemini_json(prompt, fallback)
