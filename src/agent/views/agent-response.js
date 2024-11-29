export function renderAgentResponse(query, htmlResponse) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <title>AI Agent Test</title>
        <style>
          .markdown-content h1 { font-size: 1.5rem; font-weight: bold; margin: 1rem 0; }
          .markdown-content h2 { font-size: 1.25rem; font-weight: bold; margin: 0.75rem 0; }
          .markdown-content h3 { font-size: 1.1rem; font-weight: bold; margin: 0.5rem 0; }
          .markdown-content p { margin: 0.5rem 0; }
          .markdown-content ul { list-style-type: disc; margin-left: 1.5rem; }
          .markdown-content ol { list-style-type: decimal; margin-left: 1.5rem; }
          .markdown-content code { background-color: #f3f4f6; padding: 0.2rem 0.4rem; border-radius: 0.25rem; }
          .markdown-content pre { background-color: #f3f4f6; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 0.5rem 0; }
          .markdown-content blockquote { border-left: 4px solid #e5e7eb; padding-left: 1rem; margin: 0.5rem 0; }
        </style>
      </head>
      <body class="bg-gray-50 p-4">
        <h1 class="text-2xl font-bold mb-4">AI Agent Test</h1>
        <form id="queryForm" method="POST" action="/agent/run" class="mb-4">
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
              class="bg-black text-white px-3 py-1.5 rounded-md hover:bg-gray-900 text-sm"
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
        <div class="flex flex-col gap-2 bg-white p-4 rounded-md shadow-md text-sm mb-2 max-w-xl">
          <div class="markdown-content">${htmlResponse}</div>
        </div>
        <a
          href="/"
          class="inline-block mt-4 text-black hover:text-gray-900 text-sm"
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
  `
}