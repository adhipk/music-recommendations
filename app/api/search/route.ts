import { NextResponse } from "next/server";
import axios from "axios";
import { pipeline } from "@xenova/transformers";

const QDRANT_URL = process.env.QDRANT_URL;
const QDRANT_API_KEY = process.env.QDRANT_API_KEY;

// Initialize text embedder
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let textEmbedder: any = null;

async function getTextEmbedder() {
  if (!textEmbedder) {
    textEmbedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }
  return textEmbedder;
}

async function getTextEmbedding(text: string) {
  const embedder = await getTextEmbedder();
  const output = await embedder(text, {
    pooling: "mean",
    normalize: true,
  });
  return Array.from(output.data);
}

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Get text embedding
    const vector = await getTextEmbedding(query);
    console.log('envs', QDRANT_API_KEY, QDRANT_URL);
    const response = await axios.post(
      `${QDRANT_URL}/collections/music_reviews/points/search`,
      {
        vector,
        limit: 10,
        with_payload: true,
      },
      {
        headers: {
          "api-key": QDRANT_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
