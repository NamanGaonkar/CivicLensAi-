// Initialize Gemini AI
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  image?: string;
}

/**
 * Generate AI response using Google Gemini REST API directly
 * Supports both text and image inputs
 */
export async function generateAIResponse(
  messages: ChatMessage[],
  currentInput: string,
  imageBase64?: string
): Promise<string> {
  try {
    // Check if API key is configured
    if (!API_KEY || API_KEY === "your_gemini_api_key_here" || API_KEY.trim() === "") {
      return "⚠️ AI is not configured yet. Please add your Gemini API key to the .env file. Get a free key at: https://makersuite.google.com/app/apikey";
    }

    // Fetch available models and use the first one that supports generateContent
    const modelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    let modelName = "gemini-1.5-flash";
    
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
    
    console.log("Using model:", modelName);

    // Build context from conversation history
    const conversationContext = messages
      .slice(-5) // Only use last 5 messages for context
      .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.text}`)
      .join("\n");

    // System prompt for CivicLens AI
    const systemPrompt = `You are a helpful AI assistant for CivicLens, a civic engagement platform. Your role is to:
- Help citizens understand and report civic issues (potholes, streetlights, garbage, etc.)
- Provide insights on community problems and solutions
- Analyze images of civic issues when provided
- Suggest appropriate issue categories
- Offer helpful information about civic processes
- Be concise, friendly, and action-oriented

Keep responses brief (2-3 sentences) unless detailed explanation is needed.`;

    const fullPrompt = `${systemPrompt}\n\nConversation History:\n${conversationContext}\n\nUser: ${currentInput}`;

    console.log("Sending request to Gemini API...");

    // Use the dynamically discovered model
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;

    let requestBody: any;

    if (imageBase64) {
      // Handle image + text input
      const base64Data = imageBase64.includes("base64,")
        ? imageBase64.split("base64,")[1]
        : imageBase64;

      requestBody = {
        contents: [{
          parts: [
            { text: fullPrompt + "\n\n[User has shared an image. Analyze it and provide insights about this civic issue.]" },
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
      // Text-only input
      requestBody = {
        contents: [{
          parts: [{ text: fullPrompt }]
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
      const errorData = await response.json();
      console.error("API Error Response:", errorData);
      throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log("Gemini response received successfully");

    // Extract text from response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated";
    return text;

  } catch (error) {
    console.error("Gemini AI Error (Full):", error);
    
    // Provide helpful error messages
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      
      if (error.message.includes("API_KEY_INVALID") || error.message.includes("API key")) {
        return "❌ Invalid API key. Please check your Gemini API key in the .env file.";
      }
      if (error.message.includes("429") || error.message.includes("quota")) {
        return "⏳ Rate limit reached. Please try again in a moment.";
      }
      if (error.message.includes("SAFETY")) {
        return "⚠️ Content blocked by safety filters. Please rephrase your question.";
      }
      
      // Return more specific error for debugging
      return `AI Error: ${error.message}. Please check browser console for details.`;
    }

    return "I'm having trouble connecting to the AI service right now. Please try again later.";
  }
}

/**
 * Analyze an image for civic issues
 * Specialized function for image analysis
 */
export async function analyzeImage(imageBase64: string): Promise<string> {
  try {
    if (!API_KEY || API_KEY === "your_gemini_api_key_here") {
      return "AI is not configured. Please add your Gemini API key.";
    }

    const base64Data = imageBase64.includes("base64,")
      ? imageBase64.split("base64,")[1]
      : imageBase64;

    const prompt = `You are analyzing an image for a civic issue reporting platform. 
Identify:
1. Type of civic issue (pothole, broken streetlight, garbage, graffiti, etc.)
2. Severity level (low, medium, high)
3. Key details visible in the image
4. Suggested action or department to handle this

Be concise and specific.`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to analyze image";
    return text;

  } catch (error) {
    console.error("Image Analysis Error:", error);
    return "Unable to analyze image at this time.";
  }
}
