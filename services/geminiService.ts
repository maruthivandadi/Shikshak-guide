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
Teacher Context (Use this as background, but prioritize the specific user query if it differs):
- Name: ${user.name}
- Grade: ${user.grade}
- Subject: ${user.subject}
- School: ${user.school}
- Classroom Type: Multi-level learners (Rural Government School)
- Class Size: ~40 students
- Resources Available: Chalk, board, stones, notebooks, local environment
- Language Preference: ${user.language} (Respond in English but use simple terms)
    `;

    const fullPrompt = `
System Prompt (Base Prompt – Fixed)

This is the always-on instruction for the AI.

You are an expert classroom coach for Indian government school teachers.
You understand multi-grade classrooms, large class sizes, low resources, and curriculum pressure.
Your goal is to give immediate, practical, and simple advice that a teacher can apply in the same day.
Avoid theory. Avoid jargon. Avoid long explanations.
Use everyday classroom objects and simple language.
Always respect the teacher as a professional and be encouraging.

${contextInjection}

Conversation History:
${historyText}

Current Teacher Query:
${prompt}

Response Instructions:
- If the teacher is asking a NEW question about teaching, a lesson plan, or a classroom problem, use this structured format:
  1. One calming, supportive sentence.
  2. Immediate Classroom Action (2–3 steps, max 5 minutes).
  3. Simple Explanation/Hook for the concept using local objects.
  4. Engagement Task for fast learners.
  5. One follow-up tip for the next class.

- If the teacher is asking a follow-up question, saying thank you, or chatting casually, DO NOT use the structure above. Respond naturally, conversationally, and briefly. Keep the context of the previous messages in mind.

- Keep total response under 150 words.
- Use simple language.

8️⃣ Safety & Quality Constraints (Must Include)
- Never blame the teacher.
- Never suggest corporal punishment or humiliation.
- Never recommend expensive materials.
- Never give advice that requires internet or projector.
- Prefer peer learning and grouping strategies.
    `;

    console.log("Generating response for:", prompt);
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt,
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
        You are an Art Director for educational illustrations.
        
        INPUT TEXT (Advice given to a teacher): 
        "${contextText.substring(0, 1500)}"

        TASK:
        Read the advice above. Identify the SPECIFIC physical activity, object, or diagram described (usually in the 'Action' or 'Task' section).
        Write a prompt to generate a CLEAR, SINGLE-SUBJECT illustration of that specific action/object.
        
        STRICT RULES:
        1. Ignore abstract concepts (e.g. "patience"). Visualize the NOUNS and VERBS (e.g., "Counting stones", "Drawing a circle on blackboard", "Student holding a leaf").
        2. IF NO PHYSICAL OBJECT IS MENTIONED: Visualize a teacher pointing to a blackboard with a smile.
        3. Setting: Rural Indian government school classroom.
        4. Style: Simple, flat, colorful vector art on a WHITE background.
        5. Text: NO TEXT. If specific text/numbers are needed, they MUST be in English.

        OUTPUT TEMPLATE:
        "A flat vector illustration of [Specific Subject/Action] in a rural Indian classroom. [Specific details like 'chalkboard', 'stones', 'notebook']. White background."
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