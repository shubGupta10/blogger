import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const apiKey: string = process.env.API_KEY as string;

if (!apiKey) {
  throw new Error("API key is missing. Please set the API_KEY environment variable.");
}

const genAI = new GoogleGenerativeAI(apiKey);

// In-memory rate-limiting map to store user last request times
const userRequestTimes = new Map<string, number>(); // stores timestamps for users

const RATE_LIMIT_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

const generateContent = async (userId: string, prompt: string): Promise<string> => {
  // Check if the user is within the rate limit
  const lastRequestTime = userRequestTimes.get(userId);
  const currentTime = Date.now();

  if (lastRequestTime && currentTime - lastRequestTime < RATE_LIMIT_INTERVAL) {
    throw new Error("Rate limit exceeded. Please try again in 5 minutes.");
  }

  // Update the user's last request time to current time
  userRequestTimes.set(userId, currentTime);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const result = await model.generateContent(prompt);
    const generatedText = result.response.text();
    console.log(generatedText);
    return generatedText;
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("AI hits its rate limit, Please try after sometime");
  }
};

export default generateContent;
