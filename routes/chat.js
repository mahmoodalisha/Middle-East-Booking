const express = require("express");
const mongoose = require("mongoose");
const { GoogleGenAI } = require("@google/genai");
const RagChunk = require("../models/RagChunk");

const router = express.Router();

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

router.post("/", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        message: "Question is required",
      });
    }

    // 1. Convert user's question into an embedding
    const queryEmbedding = await createEmbedding(question);

    // 2. Find relevant chunks from MongoDB
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

    // 3. Create context from retrieved chunks
    const context = results
      .map((result) => result.text)
      .join("\n\n");

    // 4. Ask Gemini to generate the answer
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

    // 5. Send answer back to the frontend
    res.json({
      answer: response.text,
    });

  } catch (error) {
    console.error("Chat error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;