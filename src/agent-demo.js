import './config.js'
import OpenAI from "openai"
import { getLocation, getCurrentWeather } from './tools.js'
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

const MAX_ITERATIONS = 5

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

const availableFunctions = {
  getLocation,
  getCurrentWeather
}

const systemPrompt = `
You cycle through Thought, Action, PAUSE, Observation. At the end of the loop you output a final Answer. Your final answer should be highly specific to the observations you have from running
the actions.
1. Thought: Describe your thoughts about the question you have been asked.
2. Action: run one of the actions available to you - then return PAUSE.
3. PAUSE
4. Observation: will be the result of running those actions.

Available actions:
- getCurrentWeather:
    E.g. getCurrentWeather: Salt Lake City
    Returns the current weather of the location specified.
- getLocation:
    E.g. getLocation: null
    Returns user's location details. No arguments needed.

Example session:
Question: Please give me some ideas for activities to do this afternoon.
Thought: I should look up the user's location so I can give location-specific activity ideas.
Action: getLocation: null
PAUSE

You will be called again with something like this:
Observation: "New York City, NY"

Then you loop again:
Thought: To get even more specific activity ideas, I should get the current weather at the user's location.
Action: getCurrentWeather: New York City
PAUSE

You'll then be called again with something like this:
Observation: { location: "New York City, NY", forecast: ["sunny"], temperature: 5, unit: "Celsius" }

You then output:
Answer: <Suggested activities based on sunny weather that are highly specific to New York City and surrounding areas.>

Important things to note:
- Make sure your output does not have any actions if you have the final answer.
- Make sure you never return empty actions or actions with name null or none.
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
  let messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: query }
  ];

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    console.log("iteration", i);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      response_format: zodResponseFormat(agentResponseSchema, "agentResponse")
    })

    const responseText = response.choices[0].message.content
    messages.push({ role: "assistant", content: responseText })

    const parsedResponse = JSON.parse(responseText)
    console.log("parsedResponse", parsedResponse)

    if (parsedResponse.action && parsedResponse.action?.name && (parsedResponse.action?.name !== "none" && parsedResponse.action?.name !== "null")) {
      const action = parsedResponse.action
      const observation = await actionRunner(action)
      console.log("observation from action", observation)

      messages.push({ role: "assistant", content: `Observation: ${observation}` })
    } else {
      console.log("no action, returning final answer")
      return parsedResponse
    }
  }
}

async function actionRunner(action) {
  if (!availableFunctions[action.name]) {
    throw new Error(`Action ${action.name} not found`)
  }

  console.log("running action", action.name, action.args)
  return await availableFunctions[action.name](...action.args)
}