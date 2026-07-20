import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body;

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (action === "classify") {
      return NextResponse.json({
        success: true,
        category: "Property & Land Dispute (Civil)",
        confidence: "94.8%",
        suggestedCourt: "Sub-Divisional Magistrate Civil Court, Pune",
        acts: [
          "Section 145 of the Code of Criminal Procedure (CrPC)",
          "Maharashtra Land Revenue Code, 1966 (Section 143)",
          "The Specific Relief Act, 1963 (Section 6)",
        ],
        documents: [
          "Land Boundary Map (Traced from Talathi Office)",
          "Mutation Entry Record (7/12 Extract Maharashtra)",
          "Physical Boundary Photo Encroachment proof",
        ],
        timeline: "4 - 8 Months depending on survey reports.",
        simpleExplanation:
          "This case involves a boundary dispute regarding private land boundaries. Under local land codes, boundary surveyors can establish lines. AI recommends assembling survey papers.",
      });
    }

    if (action === "audit") {
      return NextResponse.json({
        success: true,
        healthScore: 88,
        issues: [
          "Page 2: Aadhaar Card scan is slightly blurry.",
          "Page 3: Boundary Partition document is missing signature validation from Talathi.",
          "Missing Optional Document: Land Title Deed.",
        ],
      });
    }

    if (action === "bns") {
      return NextResponse.json({
        success: true,
        suggestions: [
          {
            section: "Section 305 BNS",
            title: "Theft in dwelling house, etc.",
            description: "Theft inside residential dwellings.",
            penalty: "Up to 7 years imprisonment.",
          },
          {
            section: "Section 331(3) BNS",
            title: "Lurking house-trespass or house-breaking",
            description: "Forced entry during night.",
            penalty: "Up to 14 years imprisonment.",
          },
        ],
      });
    }

    return NextResponse.json({ error: "Unknown action node" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON request payload" }, { status: 500 });
  }
}
