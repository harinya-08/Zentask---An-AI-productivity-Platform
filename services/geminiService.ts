import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateSubtasks = async (taskTitle: string): Promise<string[]> => {
  if (!ai) return ["Error: No API Key found"];

  try {
    const prompt = `
      Break down the task "${taskTitle}" into 3-5 sub-tasks.
      Return ONLY a JSON array of strings.
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};

export const generateSuggestions = async (goal: string): Promise<string[]> => {
  if (!ai) return ["Error: No API Key found"];

  try {
    const prompt = `
      The user wants to achieve: "${goal}".
      Generate 5-7 actionable, concrete tasks to help them achieve this.
      Keep titles concise (under 8 words).
      Return ONLY a JSON array of strings.
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};