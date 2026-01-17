import { GoogleGenAI } from "@google/genai";
import { UserProfile, ChatMessage } from "../types";

const getAiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
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
    if (error.message?.includes("API Key")) {
        return "Error: API Key is missing or invalid. Please check your configuration.";
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
  } catch (error) {
    console.error("Gemini Image Edit API Error:", error);
    throw error;
  }
};