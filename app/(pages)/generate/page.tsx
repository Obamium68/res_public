// app/proof-result/page.tsx
"use client";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useState } from "react";

export default function ProofResult() {
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [data, setData] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const generateProof = async () => {
    if (!data.trim()) {
      setError("Please enter data value");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const response = await fetch("/api/generate_proof", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: data.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Unknown error");
        return;
      }

      const responseData = await response.json();
      setResult(responseData.result);
    } catch (err) {
      setError("Failed to fetch proof");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  function formatJson(text: string): string {
    try {
      const obj = JSON.parse(text);
      return JSON.stringify(obj, null, 2);
    } catch {
      return text;
    }
  }

  return (
    <div className="h-screen flex flex-col justify-start items-center p-8">
      <h2 className="text-2xl font-bold mb-6">Proof Generator</h2>

      <div className="w-full max-w-md mb-6">
        <label htmlFor="data-input" className="block text-sm font-medium mb-2">
          Data:
        </label>
        <input
          id="data-input"
          type="text"
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder="Enter data value"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={generateProof}
          disabled={loading}
          className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Generating..." : "Generate Proof"}
        </button>
      </div>

      {error && (
        <div className="w-full max-w-4xl mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {result && (
        <div className="w-full max-w-4xl">
          <h3 className="text-lg font-semibold mb-2">Proof Result:</h3>
          <div
            className="border rounded-lg overflow-hidden"
            style={{ height: "600px" }}
          >
            <SyntaxHighlighter
              language="json"
              style={tomorrow}
              customStyle={{
                margin: 0,
                height: "100%",
                overflowX: "hidden",
                overflowY: "auto",
                borderRadius: "0.5rem",
              }}
              wrapLines={true}
              wrapLongLines={true}
            >
              {formatJson(result)}
            </SyntaxHighlighter>
          </div>
        </div>
      )}
    </div>
  );
}
