import { GoogleGenAI } from "@google/genai";
import { useState } from "react";

export function useGemini() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) => {
    setLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...history,
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: "你是一位專業的木工家具顧問，服務於『鑶器木居 CAMG WOOD STORE』。你的語氣應該優雅、專業且富有工匠精神。請協助客戶了解原木材質（黑胡桃木、白橡木、櫻桃木、梣木）、家具訂製流程以及保養知識。如果客戶詢問價格，請告知他們每件作品都是獨一無二的，建議進行客製諮詢。",
        }
      });

      const response = await model;
      return response.text;
    } catch (err) {
      console.error("Gemini API Error:", err);
      setError("抱歉，我現在無法回應。請稍後再試。");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading, error };
}
