import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { agent } from './agent/agent.js'
import { marked } from 'marked'
import { renderAgentForm } from './agent/views/agent-form.js'
import { renderAgentResponse } from './agent/views/agent-response.js'
import { setupAssistant } from './assistant/assistant.js'

const __filename = fileURLToPath(import.meta.url)

const app = express()
const PORT = process.env.PORT || 7001

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.get('/assistant', async (req, res) => {
  await setupAssistant()
  res.send("done")
})

app.get('/agent', (req, res) => {
  res.send(renderAgentForm())
})

app.post('/agent/run', async (req, res) => {
  try {
    const query = req.body.query
    console.log("calling agent, query:", query)
    const agentResponse = await agent(query)

    const htmlResponse = marked(agentResponse, {
      breaks: true,
      gfm: true,
      sanitize: true
    })

    res.send(renderAgentResponse(query, htmlResponse))
  } catch (error) {
    console.error(error)
    res.status(500).send('Error processing your request')
  }
})

// Start the server and store the server instance
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})