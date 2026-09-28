const mongoose = require("mongoose");

const RagChunkSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },

    source: {
      type: String,
      required: true,
    },

    embedding: {
      type: [Number],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("RagChunk", RagChunkSchema);