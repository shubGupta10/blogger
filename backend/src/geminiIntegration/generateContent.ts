import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const apiKey: string = process.env.API_KEY as string;

if (!apiKey) {
  throw new Error("API key is missing. Please set the API_KEY environment variable.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const generateContent = async (prompt: string): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent(prompt);
    const generatedText = result.response.text();
    console.log(generatedText);
    return generatedText; 
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("Failed to generate content");
  }
};


export default generateContent