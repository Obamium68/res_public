// app/login/page.tsx
"use client";

import { useState } from "react";
import { nhash, getUserToken } from "@/app/lib/utils/hash";

export default function LoginPage() {
  const [taxNumber, setTaxNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    setError("");

    try {
      // Get stored user token
      const userToken = getUserToken();

      if (!userToken) {
        setError("No user data found. Please sign up first.");
        setLoading(false);
        return;
      }

      // Reconstruct data using stored values and entered tax number
      const nameHashBig = BigInt(userToken.nameHash);
      const surnameHashBig = BigInt(userToken.surnameHash);
      const taxHashBig = nhash(taxNumber);
      const birthDateBig = BigInt(userToken.birthDateEncoded);
      const timestampBig = BigInt(userToken.timestamp);
      const saltBig = BigInt(userToken.salt);

      const sum =
        nameHashBig +
        surnameHashBig +
        (await taxHashBig) +
        birthDateBig +
        timestampBig +
        saltBig; 
      const modulus = BigInt(3) ** BigInt(2 ** 30) + BigInt(1);
      const data = sum % modulus;

    
      const apiResponse = await fetch("/api/proofs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: data.toString(),
          n_query: 5,
        }),
      });

      const result = await apiResponse.json();
      setResponse(result);
    } catch (error) {
      setResponse({
        success: false,
        message: "Error during login: " + (error as Error).message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Login
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="taxNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Tax Number
              </label>
              <div className="mt-1">
                <input
                  id="taxNumber"
                  name="taxNumber"
                  type="text"
                  required
                  value={taxNumber}
                  onChange={(e) => setTaxNumber(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {response && (
            <div className="mt-6 p-4 bg-gray-100 rounded-md">
              <h3 className="text-lg font-medium mb-2">API Response:</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
