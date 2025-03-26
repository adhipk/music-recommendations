import { NextResponse } from "next/server";
import { getClient } from "@/lib/weaviate";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const client = await getClient();
    
    // Perform semantic search using Weaviate
    const searchResult = await client.collections
      .get("MusicReviews")
      .query()
      .nearText(query, {
        limit: 10,
        returnMetadata: ["distance"],
      })
      .do();

    // Transform the results to match the expected format
    const transformedResults = searchResult.objects.map((obj: any) => ({
      id: obj.uuid,
      score: 1 - (obj.metadata?.distance || 0), // Convert distance to similarity score
      payload: {
        title: obj.properties.title,
        artists: obj.properties.artists,
        body: obj.properties.body,
        score: obj.properties.score,
        review_url: obj.properties.review_url,
      },
    }));

    return NextResponse.json({ result: transformedResults });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
