import weaviate from "weaviate-client";

let weaviateClient: any = null;

export async function getClient() {
  if (!weaviateClient) {
    weaviateClient = await weaviate.connectToWeaviateCloud(
      process.env.WEAVIATE_HOST_URL as string,
      {
        authCredentials: new weaviate.ApiKey(process.env.WEAVIATE_ADMIN_KEY as string),
      }
    );
  }
  return weaviateClient;
}

export async function initWeaviate() {
  try {
    const client = await getClient();
    
    // Create the schema for music preferences
    const preferencesSchema = {
      class: "MusicPreferences",
      description: "User music preferences for recommendations",
      vectorizer: "text2vec-contextionary",
      properties: [
        {
          name: "genresPositive",
          dataType: ["text[]"],
          description: "Genres the user likes",
        },
        {
          name: "genresNegative",
          dataType: ["text[]"],
          description: "Genres the user dislikes",
        },
        {
          name: "favoriteArtists",
          dataType: ["text"],
          description: "User's favorite artists",
        },
        {
          name: "tempoPreference",
          dataType: ["number"],
          description: "User's tempo preference (0-100)",
        },
        {
          name: "moodPreference",
          dataType: ["text[]"],
          description: "User's preferred moods",
        },
        {
          name: "instrumentalVocal",
          dataType: ["number"],
          description: "User's instrumental vs vocal preference (0-100)",
        },
        {
          name: "userId",
          dataType: ["text"],
          description: "Unique identifier for the user",
        },
      ],
    };

    // Create the schema for music reviews
    const reviewsSchema = {
      class: "MusicReviews",
      description: "Music reviews from Pitchfork",
      vectorizer: "text2vec-contextionary",
      properties: [
        {
          name: "title",
          dataType: ["text"],
          description: "Title of the review",
        },
        {
          name: "artists",
          dataType: ["text"],
          description: "Name of the artist(s)",
        },
        {
          name: "body",
          dataType: ["text"],
          description: "Review text content",
        },
        {
          name: "score",
          dataType: ["number"],
          description: "Review score (0-10)",
        },
        {
          name: "review_url",
          dataType: ["text"],
          description: "URL to the full review",
        },
      ],
    };

    // Create the collections if they don't exist
    try {
      await client.collections.create(preferencesSchema);
      console.log("Created MusicPreferences collection");
    } catch (error) {
      console.log("MusicPreferences collection might already exist:", error);
    }

    try {
      await client.collections.create(reviewsSchema);
      console.log("Created MusicReviews collection");
    } catch (error) {
      console.log("MusicReviews collection might already exist:", error);
    }

    return client;
  } catch (error) {
    console.error("Error initializing Weaviate:", error);
    throw error;
  }
} 