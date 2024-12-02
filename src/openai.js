import './config.js'
import OpenAI from "openai"

if (!process.env.OPENAI_API_KEY) throw new Error("OpenAI API key is missing or invalid.");

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})