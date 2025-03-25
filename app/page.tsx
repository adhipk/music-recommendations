"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import axios from "axios";

interface SearchResult {
  id: string;
  score: number;
  payload: {
    title: string;
    artists: string;
    body: string;
    score: number;
    review_url: string;
  };
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/search", { query });
      console.log("Search response:", response.data);
      setResults(response.data.result);
    } catch (err) {
      setError("Failed to perform search. Please try again.");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getFullUrl = (relativeUrl: string) => {
    if (!relativeUrl) return "#";
    if (relativeUrl.startsWith("http")) return relativeUrl;
    return `https://pitchfork.com${relativeUrl}`;
  };

  const highlightRelevantText = (
    text: string | undefined,
    query: string
  ): string => {
    if (!text) return "No review text available.";
    if (!query) return text;

    try {
      // Split the text into sentences, handling various sentence endings
      const sentences = text
        .split(/[.!?]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      if (sentences.length === 0) return text;

      // Find sentences that contain words from the query
      const queryWords = query
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 0);
      const relevantSentences = sentences.filter((sentence) =>
        queryWords.some((word) => sentence.toLowerCase().includes(word))
      );

      // If we found relevant sentences, return them with highlighting
      if (relevantSentences.length > 0) {
        return relevantSentences
          .map((sentence) =>
            queryWords.reduce(
              (acc, word) =>
                acc.replace(
                  new RegExp(word, "gi"),
                  (match) => `<mark class="bg-yellow-100">${match}</mark>`
                ),
              sentence
            )
          )
          .join(". ");
      }

      // If no relevant sentences found, return the first few sentences
      return sentences.slice(0, 2).join(". ") + ".";
    } catch (err) {
      console.error("Error highlighting text:", err);
      return text;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Pitchfork Review Search
        </h1>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for music reviews (e.g., 'party', 'breakup', 'summer vibes')"
              className="w-full px-4 py-3 pl-12 text-lg border border-gray-300 rounded-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <MagnifyingGlassIcon className="absolute left-4 top-3.5 h-6 w-6 text-gray-400" />
          </div>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-600">Searching...</div>
        ) : (
          <div className="space-y-6">
            {results.map((result) => (
              <div
                key={result.id}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {result.payload.title}
                    </h2>
                    <p className="text-gray-600">{result.payload.artists}</p>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    {result.payload.score}
                  </span>
                </div>
                <div className="mb-4">
                  <p className="text-gray-700">
                    <span className="font-medium text-gray-900">
                      Relevant context:{" "}
                    </span>
                    <span className="italic">
                      {result.payload.body.split(/[.!?]+/)[0] + "."}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    This album was selected based on semantic similarity to your
                    search query, not just keyword matching. The similarity
                    score ({(result.score * 100).toFixed(2)}%) indicates how
                    closely the review's meaning matches your search intent.
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <a
                    href={getFullUrl(result.payload.review_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Read full review →
                  </a>
                  <div className="text-sm text-gray-500">
                    Similarity score: {(result.score * 100).toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
