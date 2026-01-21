
import { GoogleGenAI } from "@google/genai";
import { UserProfile, ChatMessage } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  
  // Check if key is missing or empty string (from our safe default in vite.config)
  if (!apiKey || apiKey.trim() === "") {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateTextResponse = async (prompt: string, user: UserProfile, history: ChatMessage[] = []): Promise<string> => {
  try {
    const ai = getAiClient();
    
    // Format history for context
    const historyText = history.map(msg => 
      `${msg.role === 'user' ? 'Teacher' : 'AI Coach'}: ${msg.text}`
    ).join('\n');

    // 3️⃣ Context Injection Prompt (Dynamic)
    const contextInjection = `
Teacher Profile:
- Name: ${user.name || "Teacher"}
- Grade Level: ${user.grade ? user.grade : "Primary Level"}
- Main Subject: ${user.subject ? user.subject : "General"}
- School Context: ${user.school || "Rural Government School"} (Low resource environment)
    `;

    const fullPrompt = `
System Prompt:

You are 'Shikshak Guide' (Teacher's Guide), a highly intelligent and proactive AI pedagogue for Indian teachers.

CORE IDENTITY & GOAL:
- You are not just a chatbot; you are a Mentor. Your goal is to simplify teaching, suggest creative low-cost activities (TLM), and align with NIPUN Bharat and NCERT guidelines.
- Your tone should be: Respectful (Namaste!), Encouraging, Royal/Professional, yet Warm.

INSTRUCTIONS FOR ANSWERING:
1. **Be Specific & Actionable**: If asked "how to teach fractions", don't just explain fractions. Give a step-by-step activity using stones, paper, or chalk.
2. **Context Matters**: 
   - If the user teaches Grade 1, focus on play-based learning (FLN).
   - If Grade 5, focus on concepts and critical thinking.
   - Use the user's subject profile to tailor examples, but ANSWER ANY SUBJECT question the teacher asks.
3. **Structure**:
   - Start with a direct answer or a warm acknowledgement.
   - Provide a "Try This" activity or solution.
   - End with a follow-up question to keep the conversation active (e.g., "Would you like a worksheet for this?").
4. **Constraints**:
   - Keep answers under 200 words unless asked for a full lesson plan.
   - Use simple English suitable for a second-language learner context.
   - Assume resources are limited (Chalk, Duster, Blackboard, Nature).

${contextInjection}

Conversation History:
${historyText}

Current Question:
${prompt}
    `;

    console.log("Generating response for:", prompt);
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt,
      config: {
        thinkingConfig: { thinkingBudget: 1024 } // Enable thinking for better pedagogical reasoning
      }
    });

    if (!response.text) {
        console.warn("Gemini response text was empty", response);
        return "I understood your question, but I'm having trouble formulating an answer right now. Please try asking again.";
    }

    return response.text;
  } catch (error: any) {
    console.error("Gemini Text API Error:", error);
    if (error.message === "API_KEY_MISSING") {
        return "⚠️ Configuration Error: API Key is missing. Please add 'API_KEY' to your Render Environment Variables and redeploy.";
    }
    if (error.message?.includes("API Key") || error.message?.includes("403")) {
        return "⚠️ Authentication Error: The provided API Key is invalid or expired. Please check your Render configuration.";
    }
    return "I'm having trouble connecting to the Assistant. Please check your internet connection and try again.";
  }
};

/**
 * Uses Gemini 2.5 Flash Image to edit an image based on a text prompt.
 * The model receives the image and the instruction, and returns a new image.
 */
export const editImageWithGemini = async (base64Image: string, prompt: string): Promise<string | null> => {
  try {
    const ai = getAiClient();
    
    // We send the original image and the text prompt instructions
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming jpeg for simplicity, or detect from source
              data: base64Image
            }
          },
          {
            text: `Edit this image. Instruction: ${prompt}. Return the result as an image.`
          }
        ]
      }
    });

    // We iterate to find the image part in the response
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return part.inlineData.data;
        }
      }
    }
    
    return null;
  } catch (error: any) {
    console.error("Gemini Image Edit API Error:", error);
    if (error.message === "API_KEY_MISSING") {
        throw new Error("Configuration Error: API Key is missing.");
    }
    throw error;
  }
};

/**
 * Uses a two-step process to generate a meaningful educational illustration.
 * 1. Uses Gemini 3 Flash to distill the "essence" of the text into a visual prompt.
 * 2. Uses Gemini 2.5 Flash Image to generate the image from that prompt.
 * 
 * Enforces English text.
 */
export const generateClassroomImage = async (contextText: string, language: string): Promise<string | null> => {
    try {
      const ai = getAiClient();
      
      // STEP 1: PROMPT REFINEMENT (The "Essence" Step)
      // We ask the text model to act as an Art Director.
      const refinementPrompt = `
        You are an Art Director for educational illustrations for Indian schools.
        
        INPUT TEXT (Advice given to a teacher): 
        "${contextText.substring(0, 1500)}"

        TASK:
        Read the advice above. Identify the SPECIFIC physical activity, object, or diagram described (usually in the 'Action' or 'Task' section).
        Write a prompt to generate a CLEAR, SINGLE-SUBJECT illustration of that specific action/object.
        
        STRICT RULES:
        1. Ignore abstract concepts (e.g. "patience", "kindness"). Visualize the NOUNS and VERBS (e.g., "Counting stones", "Drawing a circle on blackboard", "Student holding a leaf").
        2. IF NO PHYSICAL OBJECT IS MENTIONED: Visualize a clean blackboard with 'Welcome' written on it.
        3. Setting: Rural Indian government school classroom.
        4. Style: Simple, flat, colorful vector art on a WHITE background. High contrast.
        5. Text: NO TEXT. If specific text/numbers are needed for the concept, they MUST be in English.

        OUTPUT TEMPLATE:
        "A flat vector illustration of [Specific Subject/Action] in a rural Indian classroom. [Specific details like 'chalkboard', 'stones', 'notebook']. White background, bright colors."
      `;

      console.log("Refining image prompt...");
      const refinementResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: refinementPrompt,
      });

      const refinedPrompt = refinementResponse.text?.trim();

      if (!refinedPrompt) {
          console.warn("Prompt refinement failed.");
          return null;
      }

      console.log("Generating image with refined prompt:", refinedPrompt);

      // STEP 2: IMAGE GENERATION
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: refinedPrompt,
      });
  
      // Extract inlineData (Base64)
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            return part.inlineData.data;
          }
        }
      }
      
      return null;
    } catch (error: any) {
      console.error("Gemini Image Gen API Error:", error);
      return null;
    }
  };
