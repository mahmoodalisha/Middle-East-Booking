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

async function searchRag() {
  await mongoose.connect(process.env.MONGO);

  console.log("MongoDB connected");

  const question = "Can I book multiple rooms?";

  // Convert user's question into an embedding
  const queryEmbedding = await createEmbedding(question);

  console.log("Question embedding generated.");
  console.log("Embedding dimensions:", queryEmbedding.length);

  // Search MongoDB for similar chunks
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

  console.log("\nRelevant chunks:\n");

  for (const result of results) {
    console.log("--------------------------------");
    console.log("Score:", result.score);
    console.log("Source:", result.source);
    console.log(result.text);
  }

  await mongoose.disconnect();
}

searchRag();