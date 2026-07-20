const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || (typeof window !== "undefined" ? `${window.location.origin}/api/backend` : "http://localhost:8000");

// Fallback Mock Datasets
const MOCK_STATS = {
  total_active: 148209,
  disposed: 392019,
  pending_scrutiny: 412,
  mean_resolution_speed: "5.2 Mo",
};

const MOCK_ADVOCATES = [
  {
    id: "adv-1",
    full_name: "Adv. Abhishek Deshmukh",
    specialization: "Property & Civil Law",
    experience_years: 12,
    languages: "English, Hindi, Marathi",
    fee_estimate: "₹25,000 / case",
    availability: "Available tomorrow",
    rating: 4.9,
    reason: "He resides in your district and has solved 42 similar property disputes with a 92% success rate in the SDM Court.",
  },
  {
    id: "adv-2",
    full_name: "Adv. Meera Sen",
    specialization: "Family & Property Law",
    experience_years: 9,
    languages: "English, Bengali, Hindi",
    fee_estimate: "₹18,000 / case",
    availability: "Next week",
    rating: 4.7,
    reason: "Expert in local partition law, handles familial reconciliation disputes, highly rated for clear communication.",
  },
  {
    id: "adv-3",
    full_name: "Adv. Rohan Malhotra",
    specialization: "Cyber Law & Intellectual Property",
    experience_years: 15,
    languages: "English, Hindi, Punjabi",
    fee_estimate: "₹40,000 / case",
    availability: "Available today",
    rating: 4.95,
    reason: "A national consultant on BNS digital theft laws, recommended for complex cybersecurity litigation.",
  },
];

const MOCK_PETITIONS = [
  {
    id: "default-petition-001",
    citizen_id: "55446677-8899-4444-8888-999900000001",
    citizen_name: "Aditya Patil",
    advocate_id: null,
    advocate_name: null,
    category: "Property & Land Dispute (Civil)",
    description: "Claiming partition encroachment on a 7/12 mutation survey plot #142 in Kothrud, Pune. Neighbor constructed a partition masonry boundary wall violating survey drawings. Injunction needed.",
    language: "Marathi",
    suggested_court: "Sub-Divisional Magistrate Court, Pune",
    ai_confidence: "94.8%",
    status: "Scrutiny Pending",
    cnr_number: null,
    created_at: new Date().toISOString(),
  },
];

const MOCK_AUDIT_LOGS = [
  {
    timestamp: "2026-07-20 12:00:00",
    actor_name: "Registrar Clerk",
    actor_role: "registrar",
    action: "Database sync completed with Supabase sovereign secondary",
    ip: "10.0.99.1",
  },
];

async function safeFetch(path: string, options: RequestInit = {}, fallback: any) {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.warn(`FastAPI backend offline or error at ${path}. Falling back to sandbox database.`, error);
    return fallback;
  }
}

export async function apiAuthLogin(email: string, fullName: string, role: string, phone?: string) {
  return await safeFetch(
    "/api/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, full_name: fullName, role, phone }),
    },
    {
      success: true,
      id: role === "citizen" ? "55446677-8899-4444-8888-999900000001" : `sandbox-id-${role}`,
      email,
      full_name: fullName,
      role,
      phone,
    }
  );
}

export async function apiListAdvocates() {
  return await safeFetch("/api/advocates", {}, MOCK_ADVOCATES);
}

export async function apiListPetitions() {
  return await safeFetch("/api/petitions", {}, MOCK_PETITIONS);
}

export async function apiClassifyCase(description: string, language: string, citizenId?: string) {
  const res = await safeFetch(
    "/api/case/classify",
    {
      method: "POST",
      body: JSON.stringify({ description, language, citizen_id: citizenId }),
    },
    {
      success: true,
      id: "new-petition-uuid-" + Math.floor(Math.random() * 1000),
      category: "Property & Land Dispute (Civil)",
      confidence: "94.8%",
      suggested_court: "Sub-Divisional Magistrate Court, Pune",
      acts: [
        "Section 145 of the Code of Criminal Procedure (CrPC)",
        "Maharashtra Land Revenue Code, 1966 (Section 143)",
        "The Specific Relief Act, 1963 (Section 6)",
      ],
      required_documents: [
        "Land Boundary Map (Traced from Talathi Office)",
        "Mutation Entry Record (7/12 Extract Maharashtra)",
        "Physical Boundary Photo Encroachment proof",
      ],
      timeline: "4 - 8 Months depending on mediation and boundary inspection reports.",
      simple_explanation:
        "This case involves a dispute regarding agricultural boundary borders. Under Maharashtra land revenue laws, the Sub-Divisional Officer / Magistrate handles physical encroachment complaints. The AI suggests gathering the 7/12 extract land documents and local survey records to establish ownership boundaries.",
    }
  );
  return {
    success: res.success,
    id: res.id,
    category: res.category,
    confidence: res.confidence,
    suggestedCourt: res.suggested_court || res.suggestedCourt,
    acts: res.acts,
    documents: res.required_documents || res.documents,
    timeline: res.timeline,
    simpleExplanation: res.simple_explanation || res.simpleExplanation,
  };
}

export async function apiAuditDocument(petitionId: string | null, documentName: string, ocrText: string, category: string) {
  const res = await safeFetch(
    "/api/document/audit",
    {
      method: "POST",
      body: JSON.stringify({ petition_id: petitionId, document_name: documentName, ocr_text: ocrText, category }),
    },
    {
      success: true,
      health_score: 88,
      issues: [
        "Page 2: Aadhaar Card scan is slightly blurry. (Action: Acceptable, but high-resolution copy recommended at Court)",
        "Page 3: Boundary Partition document is missing signature validation from Talathi. (Action: Manual edit suggested)",
        "Missing Optional Document: Land Title Deed. (AI Note: Adding this increases probability of early registration)",
      ],
    }
  );
  return {
    success: res.success,
    healthScore: res.health_score !== undefined ? res.health_score : res.healthScore,
    issues: res.issues,
  };
}

export async function apiSuggestBns(incidentReport: string) {
  return await safeFetch(
    "/api/police/bns-suggest",
    {
      method: "POST",
      body: JSON.stringify({ incident_report: incidentReport }),
    },
    {
      success: true,
      suggestions: [
        {
          section: "Section 305 BNS",
          title: "Theft in dwelling house, etc.",
          description: "Whoever commits theft in any building, tent or vessel, which building, tent or vessel is used as a human dwelling...",
          penalty: "Imprisonment up to 7 years and fine.",
          confidence: "98%",
        },
        {
          section: "Section 331(3) BNS",
          title: "Lurking house-trespass or house-breaking",
          description: "Whoever commits lurking house-trespass or house-breaking after sunset and before sunrise...",
          penalty: "Imprisonment up to 14 years and fine.",
          confidence: "91%",
        },
      ],
    }
  );
}

export async function apiSummarizeCase(petitionText: string, hearingsSummary?: string) {
  return await safeFetch(
    "/api/judge/case-summary",
    {
      method: "POST",
      body: JSON.stringify({ petition_text: petitionText, hearings_summary: hearingsSummary }),
    },
    {
      success: true,
      brief_digest: "Civil claim for property boundary settlement. Parties contest family land boundary drawings. Prior registry review verified.",
      legal_statutes: ["Maharashtra Land Revenue Code Section 143"],
    }
  );
}

export async function apiUpdatePetitionAdvocate(petitionId: string, advocateId: string) {
  return await safeFetch(
    `/api/petitions/${petitionId}/advocate`,
    {
      method: "PUT",
      body: JSON.stringify({ advocate_id: advocateId }),
    },
    { success: true }
  );
}

export async function apiUpdatePetitionCnr(petitionId: string, cnrNumber: string) {
  return await safeFetch(
    `/api/petitions/${petitionId}/cnr`,
    {
      method: "PUT",
      body: JSON.stringify({ cnr_number: cnrNumber }),
    },
    { success: true }
  );
}

export async function apiUpdatePetitionStatus(petitionId: string, status: string) {
  return await safeFetch(
    `/api/petitions/${petitionId}/status?status=${status}`,
    {
      method: "PUT",
    },
    { success: true }
  );
}

export async function apiSaveArchive(
  petitionId: string,
  building: string,
  floor: string,
  roomNumber: string,
  rackNumber: string,
  cupboardNumber: string | null,
  shelfNumber: string,
  boxNumber: string,
  fileBarcode: string,
  loggedBy: string
) {
  return await safeFetch(
    "/api/archive",
    {
      method: "POST",
      body: JSON.stringify({
        petition_id: petitionId,
        building,
        floor,
        room_number: roomNumber,
        rack_number: rackNumber,
        cupboard_number: cupboardNumber,
        shelf_number: shelfNumber,
        box_number: boxNumber,
        file_barcode: fileBarcode,
        logged_by: loggedBy,
      }),
    },
    { success: true }
  );
}

export async function apiSaveOrder(petitionId: string, judgeId: string, actionTaken: string, orderText: string) {
  return await safeFetch(
    "/api/orders",
    {
      method: "POST",
      body: JSON.stringify({ petition_id: petitionId, judge_id: judgeId, action_taken: actionTaken, order_text: orderText }),
    },
    { success: true }
  );
}

export async function apiListAuditLogs() {
  return await safeFetch("/api/audit-logs", {}, MOCK_AUDIT_LOGS);
}

export async function apiListStats() {
  return await safeFetch("/api/stats", {}, MOCK_STATS);
}
