require("dotenv").config();

const mongoose = require("mongoose");
const { GoogleGenAI } = require("@google/genai");
const RagChunk = require("../models/RagChunk");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function createEmbedding(text) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents: text,
    config: {
      outputDimensionality: 768,
    },
  });

  return response.embeddings[0].values;
}

async function chat() {
  await mongoose.connect(process.env.MONGO);

  console.log("MongoDB connected");

  const question = "Can I book multiple rooms?";

  // 1. Convert question into an embedding
  const queryEmbedding = await createEmbedding(question);

  // 2. Find relevant chunks
  const results = await RagChunk.aggregate([
    {
      $vectorSearch: {
        index: "vector_index",
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: 20,
        limit: 3,
      },
    },
    {
      $project: {
        _id: 0,
        text: 1,
        source: 1,
        score: {
          $meta: "vectorSearchScore",
        },
      },
    },
  ]);

  // 3. Combine retrieved chunks into context
  const context = results
    .map((result) => result.text)
    .join("\n\n");

  // 4. Ask Gemini to answer using the retrieved context
  const response = await ai.models.generateContent({
    model: "gemini-3.8-flash",
    contents: `
You are a helpful assistant for the Middle East Booking application.

Answer the user's question using ONLY the information provided in the context below.

If the context does not contain enough information to answer the question, say that the information is not available.

Context:
${context}

User question:
${question}
`,
  });

  console.log("\nAnswer:");
  console.log(response.text);

  await mongoose.disconnect();
}

chat();