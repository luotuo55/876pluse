
import { GoogleGenAI } from "@google/genai";

// Always use the named parameter and assume the API_KEY exists in environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartFeedback = async (question: string, userAnswer: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `学生在做 "${question}" 时填写的答案是 "${userAnswer}"。如果错了，请给出一个亲切的鼓励和引导提示（不要直接给答案），如果对了，给一个简短夸奖。限20字以内。`,
    });
    // Correctly accessing the .text property of GenerateContentResponse
    return response.text;
  } catch (e) {
    // Graceful fallback for API errors
    const num = parseInt(userAnswer);
    if (isNaN(num)) return "请输入一个数字算式哦。";
    if (num === 13) return "太棒了！一共是13个。";
    if (num < 13) return "数少了，再数数看？";
    return "算得对吗？再检查一下吧！";
  }
};
