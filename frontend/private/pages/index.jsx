
"use client";

import { useState } from "react";

export default function RegisterIdeaPage() {
  const [formData, setFormData] = useState({
    walletAddress: "",
    title: "",
    description: "",
    proofURL: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [tokenHash, setTokenHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.walletAddress.trim()) {
      setError("Wallet address is required");
      return false;
    }
    if (!formData.title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
      return false;
    }
    if (formData.proofURL && !isValidUrl(formData.proofURL)) {
      setError("Please enter a valid URL for proof");
      return false;
    }
    return true;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === "success") {
        setTokenHash(data.tokenHash);
        setSubmitted(true);
      } else {
        throw new Error("Registration failed: Invalid response");
      }
    } catch (error) {
      console.error("Error submitting idea:", error);
      setError(error.message || "Failed to register idea. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register Your Idea</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {submitted ? (
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <p className="mb-2">✅ Idea successfully registered!</p>
          <p><strong>Token:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{tokenHash}</code></p>
          <button 
            onClick={() => {
              setSubmitted(false);
              setTokenHash("");
              setFormData({
                walletAddress: "",
                title: "",
                description: "",
                proofURL: "",
              });
            }}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Register Another Idea
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Wallet Address *</label>
            <input
              type="text"
              name="walletAddress"
              value={formData.walletAddress}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="0x..."
              className="w-full border border-gray-300 rounded p-2 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Brief title for your idea"
              className="w-full border border-gray-300 rounded p-2 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              disabled={loading}
              rows="4"
              placeholder="Describe your idea in detail"
              className="w-full border border-gray-300 rounded p-2 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Proof URL (optional)</label>
            <input
              type="url"
              name="proofURL"
              value={formData.proofURL}
              onChange={handleChange}
              disabled={loading}
              placeholder="https://example.com/proof"
              className="w-full border border-gray-300 rounded p-2 disabled:bg-gray-100"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed w-full"
          >
            {loading ? "Registering..." : "Submit"}
          </button>
        </form>
      )}
    </main>
  );
}
