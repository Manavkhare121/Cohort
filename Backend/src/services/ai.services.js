import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export default async function generateresponse(chathistory) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: chathistory,
  });

  return response.text;
}
  