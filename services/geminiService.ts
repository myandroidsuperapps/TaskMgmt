
import { GoogleGenAI, Type } from "@google/genai";
import { Task } from "../types";

export const geminiService = {
  analyzeTasks: async (tasks: Task[]): Promise<string> => {
    // Correctly initialize with API key from environment variable as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const taskSummary = tasks.map(t => 
      `- ${t.title} (${t.recurrence}, Priority: ${t.priority}, Due: ${t.dueDate})`
    ).join('\n');

    const prompt = `
      You are an elite productivity consultant. 
      Analyze the following task list and provide 3 actionable insights:
      1. Potential scheduling conflicts.
      2. Suggestions for breaking down complex tasks.
      3. A priority recommendation for today.

      Task List:
      ${taskSummary}
    `;

    try {
      // Using gemini-3-pro-preview for advanced task analysis reasoning
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          temperature: 0.7,
        }
      });
      // Correctly access text property (not a method)
      return response.text || "I couldn't generate insights at this moment.";
    } catch (error) {
      console.error("Gemini Error:", error);
      return "Unable to connect to Gemini AI. Check your API configuration.";
    }
  },

  suggestSubtasks: async (taskTitle: string, description: string): Promise<string[]> => {
    // Correctly initialize with API key from environment variable as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      // Using gemini-3-pro-preview for complex reasoning task breakdown
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: `Break down the task "${taskTitle}" (${description}) into exactly 5 specific, manageable sub-steps.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              steps: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["steps"]
          }
        }
      });
      
      // Access text property and handle potential undefined value
      const jsonStr = response.text?.trim() || '{"steps": []}';
      const data = JSON.parse(jsonStr);
      return data.steps;
    } catch (error) {
      console.error("Subtask Generation Error:", error);
      return [];
    }
  }
};
