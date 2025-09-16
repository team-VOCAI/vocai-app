// src/lib/gemini.ts
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) throw new Error("GEMINI_API_KEY is not defined in .env");

export const genAI = new GoogleGenAI({ apiKey });
