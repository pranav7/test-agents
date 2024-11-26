import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { agent } from './agent-demo.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 7001

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <title>AI Agent Test</title>
      </head>
      <body class="bg-gray-50 p-4">
        <h1 class="text-2xl font-bold mb-4">AI Agent Test</h1>
        <form id="queryForm" method="POST" action="/query" class="mb-4">
          <div class="flex items-center gap-2 max-w-xl">
            <input
              type="text"
              name="query"
              placeholder="Ask a question ... (e.g. 'What is the weather in my current location?')"
              class="w-full p-1 border border-gray-300 rounded-md"
              required
            >
            <button
              type="submit"
              class="bg-purple-500 text-white px-2 py-1 rounded-md hover:bg-purple-600 text-sm"
            >
              Submit
            </button>
          </div>
        </form>
        <div id="loading" class="hidden">
          <div class="flex items-center gap-2 text-gray-600">
            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Thinking...</span>
          </div>
        </div>
        <script>
          const form = document.getElementById('queryForm');
          const loading = document.getElementById('loading');

          form.addEventListener('submit', (e) => {
            e.preventDefault();
            loading.classList.remove('hidden');
            form.submit();
          });
        </script>
      </body>
    </html>
  `)
})

app.post('/query', async (req, res) => {
  try {
    const query = req.body.query
    console.log("calling agent, query:", query)
    const agentResponse = await agent(query)

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
          <title>AI Agent Test</title>
        </head>
        <body class="bg-gray-50 p-4">
          <h1 class="text-2xl font-bold mb-4">AI Agent Test</h1>
          <form id="queryForm" method="POST" action="/query" class="mb-4">
            <div class="flex items-center gap-2 max-w-lg">
              <input
                type="text"
                name="query"
                placeholder="Ask a question..."
                class="w-full p-1 border border-gray-300 rounded-md"
                value="${query}"
                required
              >
              <button
                type="submit"
                class="bg-purple-500 text-white px-2 py-1 rounded-md hover:bg-purple-600 text-sm"
              >
                Submit
              </button>
            </div>
          </form>
          <div id="loading" class="hidden">
            <div class="flex items-center gap-2 text-gray-600">
              <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Agent is thinking...</span>
            </div>
          </div>
          <div class="flex flex-col gap-2 bg-white p-4 rounded-md shadow-md text-sm text-wrap mb-2 max-w-xl">
            <div class="whitespace-pre-wrap">${agentResponse.answer.replace(/\n/g, '<br>')}</div>
          </div>
          <a
            href="/"
            class="inline-block mt-4 text-purple-500 hover:text-purple-600 text-sm"
          >
            ← Start Over
          </a>
          <script>
            const form = document.getElementById('queryForm');
            const loading = document.getElementById('loading');

            form.addEventListener('submit', (e) => {
              e.preventDefault();
              loading.classList.remove('hidden');
              form.submit();
            });
          </script>
        </body>
      </html>
    `)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error processing your request')
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})