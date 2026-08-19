import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Support large payloads for document images
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// AI OCR Document Extractor & Missing Field Flagging API
app.post("/api/gemini/ocr-extract", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", textContent, documentTypeHint } = req.body;

    const ai = getGeminiClient();

    // Fallback if no Gemini API key is configured
    if (!ai) {
      return res.json({
        success: true,
        isFallback: true,
        documentType: documentTypeHint || "Sale Deed (Vikray Patra)",
        extractedFields: {
          documentNumber: "REG/2024/7821/BK1",
          registrationDate: "2024-04-18",
          subRegistrarOffice: "Haveli-04, Pune, Maharashtra",
          state: "Maharashtra",
          district: "Pune",
          taluk: "Haveli",
          village: "Wagholi",
          surveyNumber: "Gat No. 142/2A",
          extentArea: "0.45 Hectare (1.11 Acres)",
          landClassification: "Agricultural (Jirayat / Dry Crop)",
          considerationAmount: "₹ 42,50,000",
          stampDutyPaid: "₹ 2,97,500 (7%)",
          registrationFee: "₹ 30,000",
          transferorSeller: "Ramesh Narayan Patil (Share: 100%)",
          transfereeBuyer: "Suresh Baburao Deshmukh",
          boundaries: {
            north: "Gat No. 142/1 (Anil Kulkarni)",
            south: "Village Approach Cart Road (12m width)",
            east: "Canal distributary channel",
            west: "Gat No. 143 (Shantaram Shinde)",
          },
        },
        missingFields: [
          {
            fieldName: "Co-parcener / Legal Heir NOC",
            severity: "CRITICAL",
            reason: "Ancestral property noted in prior 7/12 (Ferfar 891). Consent affidavit of legal heirs not attached.",
            recommendation: "Obtain registered Consent Deed (Sahmati Patra) from adult sons/daughters before submitting Ferfar mutation.",
          },
          {
            fieldName: "Encumbrance Certificate (13-Year EC / Form 15)",
            severity: "WARNING",
            reason: "No EC attached to verify non-existence of prior mortgage lien with District Central Co-op Bank.",
            recommendation: "Apply online on IGR Maharashtra for 13-year Form 15 EC to prevent future title litigation.",
          },
          {
            fieldName: "Aadhaar / Biometric Linking of Witness 2",
            severity: "INFO",
            reason: "Witness 2 identification only contains voter ID without father's name verification.",
            recommendation: "Ensure witness affidavit has clear residential address and active contact number.",
          },
        ],
        confidenceScore: 88,
        summary: "This is a registered Sale Deed for Agricultural Gat No. 142/2A in Wagholi, Pune. Title conveyance is clear between Ramesh Patil and Suresh Deshmukh, but requires ancestral NOC attachment before mutation entry.",
        actionableNextSteps: [
          "Apply for Mutation entry (Ferfar) on MahaBhumi portal within 90 days of registration.",
          "Submit Form-VI notice to all adjacent plot owners.",
          "Verify that the Talathi updates 7/12 Column 12 (Pahani/Cultivator) during next Kharif inspection.",
        ],
      });
    }

    const systemInstruction = `You are a certified Indian Land Revenue & Document Verification Expert.
Your task is to analyze Indian land records, deeds, 7/12 extracts, Jamabandi, Patta Chitta, Khasra-Khatauni, Mutation orders, or Encumbrance certificates.
Extract all key structural revenue fields and thoroughly scrutinize for MISSING, INCOMPLETE, or HIGH-RISK legal clauses that could cause mutation rejection or title dispute.

Output STRICT JSON with this exact structure:
{
  "documentType": string,
  "extractedFields": {
    "documentNumber": string,
    "registrationDate": string,
    "subRegistrarOffice": string,
    "state": string,
    "district": string,
    "taluk": string,
    "village": string,
    "surveyNumber": string,
    "extentArea": string,
    "landClassification": string,
    "considerationAmount": string,
    "stampDutyPaid": string,
    "registrationFee": string,
    "transferorSeller": string,
    "transfereeBuyer": string,
    "boundaries": {
      "north": string,
      "south": string,
      "east": string,
      "west": string
    }
  },
  "missingFields": [
    {
      "fieldName": string,
      "severity": "CRITICAL" | "WARNING" | "INFO",
      "reason": string,
      "recommendation": string
    }
  ],
  "confidenceScore": number (0-100),
  "summary": string (plain citizen-friendly explanation),
  "actionableNextSteps": [string]
}`;

    const promptText = textContent 
      ? `Analyze this Indian land document text extract. Identify document type, extract all fields, and detect all missing critical details:\n\n${textContent}`
      : `Analyze this uploaded Indian land record / property document image. Perform high-accuracy optical revenue extraction and audit for any missing signatures, NOCs, boundary definitions, stamp duty anomalies, or mutation prerequisites.`;

    const parts: any[] = [];
    if (imageBase64) {
      // Clean up base64 prefix if included
      const cleanBase64 = imageBase64.includes("base64,") 
        ? imageBase64.split("base64,")[1] 
        : imageBase64;
        
      parts.push({
        inlineData: {
          mimeType,
          data: cleanBase64,
        },
      });
    }
    parts.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({
      success: true,
      ...parsed,
    });
  } catch (error: any) {
    console.error("Gemini OCR Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to process document with Gemini OCR",
    });
  }
});

// Explain Revenue & Land Legal Terminology API
app.post("/api/gemini/explain-term", async (req, res) => {
  try {
    const { term, stateContext, userLanguage = "English" } = req.body;
    if (!term) {
      return res.status(400).json({ error: "Term is required" });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Fallback term explainer
      return res.json({
        term,
        simpleExplanation: `${term} is a foundational Indian land revenue concept used to record ownership rights, plot demarcation, or transfer of title in revenue registers.`,
        analogy: `Think of it like a vehicle's official registration smart card (RC), but for ancestral or purchased land parcel boundaries.`,
        stateEquivalents: {
          "Maharashtra / Gujarat": "7/12 (Saat-Baara) / Ferfar",
          "Uttar Pradesh / MP / Bihar": "Khasra-Khatauni / Dakhil Kharij",
          "Karnataka": "RTC / Pahani (Bhoomi)",
          "Tamil Nadu": "Patta Chitta",
          "Telangana / AP": "Pahani / 1-B Record",
          "Punjab / Haryana": "Jamabandi / Fard",
          "West Bengal": "Khatian / Porcha",
        },
        commonPitfalls: [
          "Assuming electricity bill or municipal tax receipt proves revenue land ownership (only RoR proves title).",
          "Forgetting to verify active civil court caveats or bank encumbrances before executing deeds.",
        ],
        faqs: [
          {
            q: "Where can I get a certified digitally signed copy?",
            a: "Directly from your state revenue portal (e.g. Bhulekh, MahaBhumi, Bhoomi, Dharani) or local MeeSeva / CSC center.",
          },
        ],
      });
    }

    const systemInstruction = `You are a friendly Indian Land Revenue Law Tutor. Explain legal, cadastral, and revenue terminology in simple terms that an everyday citizen or farmer can easily understand without jargon.
Include real-life relatable analogies, equivalents in other Indian states, common misconceptions/pitfalls, and answers to common citizen questions.
Target language: ${userLanguage}. Context State: ${stateContext || "All India / DILRMP"}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Explain this Indian land record / revenue legal term: "${term}".`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            term: { type: Type.STRING },
            simpleExplanation: { type: Type.STRING },
            analogy: { type: Type.STRING },
            stateEquivalents: {
              type: Type.OBJECT,
              description: "Equivalent terminology across major states like Maharashtra, UP, Karnataka, Tamil Nadu, Telangana, Punjab, Bengal",
            },
            commonPitfalls: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            faqs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  q: { type: Type.STRING },
                  a: { type: Type.STRING },
                },
                required: ["q", "a"],
              },
            },
          },
          required: ["term", "simpleExplanation", "analogy", "commonPitfalls"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Explain Term Error:", error);
    res.status(500).json({ error: error.message || "Failed to explain term" });
  }
});

// Mutation AI Advisor & Objection Forecaster
app.post("/api/gemini/mutation-advisor", async (req, res) => {
  try {
    const { mutationType, state, details } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        estimatedDays: 30,
        statutoryActs: "State Land Revenue Code & Right to Public Services Act (RTS)",
        stepByStepGuide: [
          "Submit Form-VI Mutation Application with registered Sale Deed copy & 13-year EC.",
          "Talathi / Revenue Inspector issues Form-VII Public Notice to all adjoining survey landholders.",
          "Mandatory 30-day objection window opens on the Gram Panchayat notice board.",
          "Revenue Inspector conducts field spot inspection (Spot Panchnama).",
          "Tehsildar verifies mutation entry and issues digitally signed RoR update.",
        ],
        criticalChecklist: [
          "Registered Deed Book-1 copy",
          "Latest tax paid receipt",
          "Aadhaar e-KYC acknowledgment",
          "Family Tree affidavit (if inheritance case)",
        ],
        commonObjections: [
          "Claim of undivided ancestral share by siblings/cousins.",
          "Disputed boundary demarcation with adjacent plot holder.",
          "Unresolved bank mortgage or cooperative society charge.",
        ],
        tipsToFastTrack: "Track online weekly and ensure physical attendance during the Talathi spot inspection.",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Provide an expert step-by-step mutation advisory for:
Type: ${mutationType || "Sale Deed / Registered Transfer"}
State: ${state || "National / Multi-State"}
Context: ${JSON.stringify(details || {})}`,
      config: {
        systemInstruction: "You are an expert Indian Tehsildar & Land Revenue Advisor. Provide practical mutation guidance adhering to state Citizen Charters.",
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Mutation Advisor Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate mutation advice" });
  }
});

// Vite middleware & Static server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Smart Land Record Assistant running on http://localhost:${PORT}`);
  });
}

startServer();
