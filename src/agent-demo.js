import './config.js'
import OpenAI from "openai"
import { availableFunctions, tools } from './tools.js'
import { z } from "zod";

const MAX_ITERATIONS = 5
const MODEL = "gpt-4o-mini"

const FINISH_REASONS = {
  STOP: "stop",
  TOOL_CALLS: "tool_calls"
}

const ROLES = {
  SYSTEM: "system",
  USER: "user",
  ASSISTANT: "assistant",
  TOOL: "tool"
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

const systemPrompt = `
You are a helpful AI agent. Give highly specific answers based on the information you're provided. Prefer to gather information with the tools provided to you rather than giving basic, generic answers.
`

const actionSchema = z.object({
  name: z.string(),
  args: z.array(z.string())
})

const agentResponseSchema = z.object({
  answer: z.string(),
  thought: z.string(),
  action: actionSchema,
  observation: z.string()
})

export async function agent(query) {
  const messages = [
    { role: ROLES.SYSTEM, content: systemPrompt },
    { role: ROLES.USER, content: query }
  ];

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    console.log(`[agent] iteration ${i + 1}`);

    const response = await runAgent(messages)
    const { finish_reason: finishReason, message } = response.choices[0]
    const { tool_calls: toolCalls, content } = message
    messages.push(message)

    switch (finishReason) {
      case FINISH_REASONS.STOP:
        console.log("[agent] stopping", content)
        return content
      case FINISH_REASONS.TOOL_CALLS:
        console.log("[agent] making tool calls", toolCalls.length)

        for (const toolCall of toolCalls) {
          const toolCallResult = await runTool(toolCall)
          console.log("[agent] tool call result", toolCallResult)
          messages.push({
            tool_call_id: toolCall.id,
            role: ROLES.TOOL,
            name: toolCall.function.name,
            content: toolCallResult
          })
        }
        break;
      default:
        throw new Error(`Unknown finish reason: ${finishReason}`)
    }
  }

  throw new Error("Max iterations reached")
}

async function runAgent(messages) {
  return await openai.chat.completions.create({
    messages,
    tools,
    model: MODEL,
  })
}

async function runTool(toolCall) {
  const name = toolCall.function.name
  const args = JSON.parse(toolCall.function.arguments)

  if (!availableFunctions[name]) {
    throw new Error(`Function ${name} not found`)
  }

  console.log(`[agent] running tool ${name} with args`, args)
  return await availableFunctions[name](args)
}
