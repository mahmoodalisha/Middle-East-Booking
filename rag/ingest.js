require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

const documentsPath = path.join(__dirname, "documents");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const files = fs
  .readdirSync(documentsPath)
  .filter((file) => file.endsWith(".txt"));

const mongoose = require("mongoose");
const RagChunk = require("../models/RagChunk");

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

async function ingestDocuments() {
    await mongoose.connect(process.env.MONGO);
    console.log("MongoDB connected");
    await RagChunk.deleteMany({});
    console.log("Old RAG chunks cleared.");
    for (const file of files) {
    const filePath = path.join(documentsPath, file);
    const text = fs.readFileSync(filePath, "utf-8");

    console.log(`\n==============================`);
    console.log(`FILE: ${file}`);console.log("MongoDB connected");
    console.log(`==============================`);

    const lines = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const chunks = [];

    let currentChunk = "";

    for (const line of lines) {
      // Skip document title
      if (line === lines[0]) {
        continue;
      }

      // A question starts a new chunk
      if (line.endsWith("?")) {
        if (currentChunk) {
          chunks.push(currentChunk);
        }

        currentChunk = line;
      } else {
        currentChunk += `\n${line}`;
      }
    }

    // Add final chunk
    if (currentChunk) {
      chunks.push(currentChunk);
    }

    // Generate embeddings
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      console.log(`\n--- Chunk ${i + 1} ---`);
      console.log(chunk);

      try {
        const embedding = await createEmbedding(chunk);

        await RagChunk.create({
        text: chunk,
        source: file,
        embedding: embedding,
        });

        console.log(`Embedding generated and saved to MongoDB.`);
        console.log(`Embedding dimensions: ${embedding.length}`);

      } catch (error) {
        console.error(
          `Failed to generate embedding for chunk ${i + 1}:`,
          error.message
        );
      }
    }
  }
}

ingestDocuments();