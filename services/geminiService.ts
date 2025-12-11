import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateSchoolReport = async (dataContext: string, prompt: string): Promise<string> => {
  try {
    const fullPrompt = `
      You are an intelligent assistant for a School Management System.
      You have access to the following context summary:
      ${dataContext}
      
      User Request: ${prompt}
      
      Provide a professional, concise, and helpful response. If asked for a draft (email, notice), format it properly.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error processing your request.";
  }
};

export const analyzeAttendance = async (attendanceData: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze this attendance JSON data and identify trends, students with low attendance, and suggestions for improvement. Keep it brief. Data: ${attendanceData}`
        });
        return response.text || "Analysis failed.";
    } catch (error) {
        return "Error analyzing attendance.";
    }
}