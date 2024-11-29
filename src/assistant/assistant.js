import '../config.js'
import { openai } from '../openai.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

export async function setupAssistant() {
  console.log("setting up assistant");
  const file = await createFile({ filePath: '../../public/movies.txt' });
  const vectorStore = await createVectorStore({ name: 'Movies' });

  await createVectorStoreFile({ vectorStoreId: vectorStore.id, fileId: file.id });
  await createAssistant(
    {
      instructions: "You are great at recommending movies. When asked a question, use the information in the provided file to form a friendly response. If you cannot find the answer in the file, do your best to infer what the answer should be.",
      name: "Movie Expert",
      tools: [{ type: "code_interpreter" }, { type: "file_search" }],
      model: "gpt-4o-mini",
      tool_resources: { file_search: { vector_store_ids: [vectorStore.id] } }
    }
  );
}

export async function createAssistant({ instructions, name, tools, model, tool_resources }) {
  console.log("creating assistant");
  const assistant = await openai.beta.assistants.create({
    instructions,
    name,
    tools,
    model,
    tool_resources,
  });

  console.log("assistant created", assistant.id);
  return assistant;
}

export async function createVectorStore({ name }) {
  console.log("creating vector store");
  const vectorStore = await openai.beta.vectorStores.create({
    name
  });
  console.log("vector store created", vectorStore.id);
  return vectorStore;
}

export async function createVectorStoreFile({ vectorStoreId, fileId }) {
  console.log("creating vector store file");
  const myVectorStoreFile = await openai.beta.vectorStores.files.create(
    vectorStoreId,
    {
      file_id: fileId
    }
  );
  console.log("vector store file created", myVectorStoreFile.id);
  return myVectorStoreFile;
}

export async function createFile({ filePath }) {
  console.log("creating files");
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const moviesPath = path.join(__dirname, filePath);

  const file = await openai.files.create({
    file: fs.createReadStream(moviesPath),
    purpose: "assistants",
  });

  console.log("file created", file.id);
  return file;
}
