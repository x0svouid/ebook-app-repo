import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.warn("VITE_GEMINI_API_KEY is missing in .env file");
}

const genAI = new GoogleGenerativeAI(API_KEY || "dummy-key");

export interface ExtractedLessonData {
    volume_title: string;
    series_title: string;
    lesson_title: string;
    introduction: string;
    base_text: string;
    chapters: ExtractedChapter[];
    conclusion: string;
    truths_to_retain: string[];
    practical_application: string[];
}

export interface ExtractedChapter {
    title: string;
    content: string;
    order: number;
}

// Define prompt at top level to ensure immutability and correct type inference
// Explicitly typed as string to prevent any boolean inference issues
const EXTRACTION_PROMPT: string = `
You are an expert educational content extractor.
Analyze these documents (images or PDFs) which are pages from a Biblical textbook.
Extract the full lesson content and structure it.

**Goal**: Extract metadata (Volume Name, Series Name, Lesson Title, intro, base text, conclusion, truths, application) AND the detailed chapters.

**JSON Structure to return**:
{
    "volume_title": "The name of the Book or Manual (e.g., 'Vol 1: Les Fondements')",
    "series_title": "The name of the Series this lesson belongs to (e.g., 'Série 1: La Nouvelle Vie')",
    "lesson_title": "The specific title of this lesson (e.g., 'Leçon 3: La Prière')",
    "introduction": "The introductory text of the lesson (if any)",
    "base_text": "The main biblical reference or text (e.g., 'Romans 8:1-10')",
    "chapters": [
        {
            "title": "Full title (e.g., '1. HISTOIRE', 'A. Son enfance')",
            "content": "Full body content in Markdown. Keep bolding, lists, etc.",
            "order": 1
        }
    ],
    "conclusion": "The conclusion text",
    "truths_to_retain": ["List of 'Vérités à retenir' or similar summary points"],
    "practical_application": ["List of 'Mise en pratique' or application points"]
}

**Rules**:
1. **Strict JSON**: Return ONLY pure JSON. Do NOT wrap the response in markdown code blocks (e.g., \`\`\`json ... \`\`\`).
2. **Deep Structure**: Create chapters ONLY for Top-Level headings (e.g., "I.", "II.", "1.", "2.").
   - **CRITICAL**: Do NOT create separate chapters for sub-points (like "A.", "B.", "1.1").
   - Instead, keep these sub-points INSIDE the \`content\` of the parent chapter.
   - Format them using Markdown headers (e.g., "### A. Sub-point").
   - Example:
     - If text is "1. Main Point" -> Create Chapter "1. Main Point"
     - If text is "A. Sub Point" under it -> Add "### A. Sub Point" to the CONTENT of "1. Main Point".
3. **Content**:
   - Convert text to clean Markdown.
   - **Reflow Text**: Remove single newlines within sentences. Merge lines so that text flows naturally.
   - **Paragraphs**: Use double newlines (\\n\\n) to separate distinct paragraphs or thoughts. Avoid "walls of text".
4. **Missing Fields**: If a section (like 'intro') is not present, use null or empty string.
5. **Merge**: If content spans pages, merge intelligently.
6. **Formatting**: Use the \`> \` symbol (blockquote) **EXCLUSIVELY** for Biblical Verses/Scripture. Do NOT use it for definitions or regular quotes (use *italics* or **bold** instead).
`;

export async function extractLessonDataFromImages(imagesBase64: string[]): Promise<ExtractedLessonData> {
    if (!API_KEY) {
        // Fallback for demo
        await new Promise(r => setTimeout(r, 2000));
        return {
            volume_title: "Volume Démo",
            series_title: "Série Démo",
            lesson_title: "Leçon Démo",
            introduction: "Introduction de démonstration.",
            base_text: "Jean 3:16",
            chapters: [
                {
                    title: "1. Premier Chapitre",
                    content: "# Contenu du chapitre 1\n\nTexte simulé...",
                    order: 1
                },
                {
                    title: "A. Sous-point",
                    content: "Détails du sous-point...",
                    order: 2
                }
            ],
            conclusion: "Conclusion de la leçon.",
            truths_to_retain: ["Vérité 1", "Vérité 2"],
            practical_application: ["Application 1"]
        };
    }

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                // responseMimeType: "application/json", // Temporarily disable to see if this affects 400 error
                // Leaving standard config
            }
        });

        // Runtime check
        if (typeof EXTRACTION_PROMPT !== 'string') {
            console.error("CRITICAL: EXTRACTION_PROMPT type:", typeof EXTRACTION_PROMPT);
            throw new Error("Internal Error: Prompt is not a string");
        }

        // Filter and prepare image parts
        const validImageParts = imagesBase64
            .map(img => {
                if (!img || typeof img !== 'string') return null;
                // Basic cleanup
                const base64Data = img.includes('base64,') ? img.split('base64,')[1] : img;
                // Improve mime type detection if possible, default to jpeg
                let mimeType = "image/jpeg";
                const mimeMatch = img.match(/^data:([^;]+);/);
                if (mimeMatch && mimeMatch[1]) {
                    mimeType = mimeMatch[1];
                }

                if (!base64Data) return null;

                return {
                    inlineData: {
                        data: base64Data,
                        mimeType: mimeType,
                    },
                };
            })
            .filter((part): part is { inlineData: { data: string; mimeType: string } } => part !== null);

        if (validImageParts.length === 0) {
            throw new Error("Aucune image valide à traiter.");
        }

        // Construct parts array for Gemini API using standard mixed array format
        // This is the most compatible way to call the SDK
        const requestParts = [EXTRACTION_PROMPT, ...validImageParts];

        // Call generateContent
        const result = await model.generateContent(requestParts);
        const response = await result.response;

        if (!response.candidates || response.candidates.length === 0) {
            throw new Error("Aucune réponse générée (Peut-être bloqué par la sécurité).");
        }

        const text = response.text();
        console.log("Gemini Raw Response:", text.substring(0, 200) + "...");

        // Parse JSON safely
        const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonString) as ExtractedLessonData;

    } catch (error: any) {
        console.error("Gemini API Error details:", error);
        throw new Error(error.message || "Échec de l'analyse IA. Réessayez.");
    }
}

export const extractChaptersFromImages = async (images: string[]) => {
    const data = await extractLessonDataFromImages(images);
    return data.chapters;
};
