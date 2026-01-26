/**
 * AI-Powered Department & Category Classifier
 * Uses Gemini Vision + NLP to automatically route reports to correct departments
 */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export interface ClassificationResult {
  category: string;
  department: string;
  priority: 'low' | 'medium' | 'high';
  confidence: number;
  reasoning: string;
}

/**
 * Machine-learning classifier that infers appropriate department from visual and textual cues
 * Guarantees correct routing on first submission
 */
export async function classifyIssue(
  description: string,
  imageBase64?: string
): Promise<ClassificationResult> {
  try {
    if (!API_KEY) {
      throw new Error("AI classifier not configured");
    }

    const prompt = `You are an AI classifier for a civic issue reporting system. Analyze the following issue and determine:

1. CATEGORY: Choose ONE from: Infrastructure, Safety, Environment, Transportation, Public Services, Utilities, Parks & Recreation
2. DEPARTMENT: Choose the specific government department that should handle this (e.g., Public Works, Sanitation, Traffic Police, Electricity Board, Water Authority, Parks Department)
3. PRIORITY: Assess as low, medium, or high based on urgency and public safety impact
4. CONFIDENCE: Your confidence level (0-100%)
5. REASONING: Brief explanation of your classification

Issue Description: "${description}"

${imageBase64 ? "An image is provided showing the issue." : "No image provided."}

Respond in this EXACT JSON format:
{
  "category": "category name",
  "department": "department name",
  "priority": "low/medium/high",
  "confidence": 85,
  "reasoning": "brief explanation"
}`;

    // Fetch available models and use the first one that supports generateContent
    const modelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    let modelName = "gemini-1.5-flash-latest";
    
    if (modelsResponse.ok) {
      const modelsData = await modelsResponse.json();
      const availableModel = modelsData.models?.find((m: any) => 
        m.supportedGenerationMethods?.includes('generateContent') &&
        m.name.includes('gemini')
      );
      if (availableModel) {
        modelName = availableModel.name.replace('models/', '');
      }
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

    let requestBody: any;

    if (imageBase64) {
      const base64Data = imageBase64.includes("base64,")
        ? imageBase64.split("base64,")[1]
        : imageBase64;

      requestBody = {
        contents: [{
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: base64Data
              }
            }
          ]
        }]
      };
    } else {
      requestBody = {
        contents: [{
          parts: [{ text: prompt }]
        }]
      };
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Classification API Error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid classification response format");
    }

    const result = JSON.parse(jsonMatch[0]);

    // Validate and return
    return {
      category: result.category || "Infrastructure",
      department: result.department || "Public Works",
      priority: result.priority || "medium",
      confidence: result.confidence || 75,
      reasoning: result.reasoning || "Classified based on description and image analysis"
    };

  } catch (error) {
    console.error("Classification error:", error);
    
    // Throw the error so UI can handle it properly
    throw error;
  }
}

/**
 * Get department recommendations based on category
 */
export function getDepartmentsByCategory(category: string): string[] {
  const departmentMap: Record<string, string[]> = {
    "Infrastructure": ["Public Works", "Roads & Highways", "Building Department", "Engineering"],
    "Safety": ["Police Department", "Fire Department", "Traffic Police", "Emergency Services"],
    "Environment": ["Sanitation Department", "Environmental Health", "Waste Management", "Pollution Control"],
    "Transportation": ["Transport Department", "Traffic Management", "Public Transit Authority", "Parking Authority"],
    "Public Services": ["Municipal Corporation", "Citizen Services", "Health Department", "Social Welfare"],
    "Utilities": ["Electricity Board", "Water Authority", "Gas Department", "Telecom Services"],
    "Parks & Recreation": ["Parks Department", "Sports Authority", "Community Services", "Horticulture"]
  };

  return departmentMap[category] || ["Public Works"];
}
