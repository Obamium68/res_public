"use client";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function ProofVerificator() {
  const [jsonText, setJsonText] = useState("");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const verifyProof = async () => {
    if (!jsonText.trim()) {
      setError("Please enter JSON data");
      return;
    }

    try {
      JSON.parse(jsonText);
    } catch {
      setError("Invalid JSON format");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const response = await fetch("/api/verify_proof", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ proof: JSON.parse(jsonText.trim()) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Unknown error");
        return;
      }

      const responseData = await response.json();
      console.log(responseData);
      setResult(JSON.stringify(responseData, null, 2));
    } catch (err) {
      setError("Failed to verify proof");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-start items-center p-8">
      <h1 className="text-5xl font-black mb-8">Verificatore di prove</h1>

      <div className="flex w-full max-w-7xl items-start justify-center space-x-8 mb-6">
        <div className="w-1/2">
          <label
            htmlFor="json-input"
            className="block text-sm font-medium mb-2"
          >
            JSON Proof:
          </label>
          <textarea
            id="json-input"
            className="border border-gray-400 rounded-2xl w-full h-96 p-4 text-sm font-mono resize-none"
            placeholder="Incolla qui il JSON..."
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
          />
          <button
            onClick={verifyProof}
            disabled={loading}
            className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify Proof"}
          </button>
        </div>

        <div className="w-1/2">
          <h3 className="text-sm font-medium mb-2">JSON Preview:</h3>
          <div className="h-96 overflow-auto text-xs border rounded-xl p-4 bg-gray-100">
            <SyntaxHighlighter language="json" style={tomorrow}>
              {formatJson(jsonText)}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>

      {error && (
        <div className="w-full max-w-7xl mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {result && (
        <div className="w-full max-w-7xl">
          <h3 className="text-lg font-semibold mb-2">Verification Result:</h3>
          <div
            className="border rounded-lg overflow-hidden"
            style={{ height: "400px" }}
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
              {result}
            </SyntaxHighlighter>
          </div>
        </div>
      )}
    </div>
  );
}

// funzione che prova a fare il pretty print, evita errori se json non valido
function formatJson(text: string): string {
  try {
    const obj = JSON.parse(text);
    return JSON.stringify(obj, null, 2);
  } catch {
    return text;
  }
}
