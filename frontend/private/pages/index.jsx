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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.status === "success") {
        setTokenHash(data.tokenHash);
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting idea:", error);
    }
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register Your Idea</h1>

      {submitted ? (
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <p className="mb-2">✅ Idea successfully registered!</p>
          <p><strong>Token:</strong> <code>{tokenHash}</code></p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Wallet Address</label>
            <input
              type="text"
              name="walletAddress"
              value={formData.walletAddress}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Proof URL (optional)</label>
            <input
              type="url"
              name="proofURL"
              value={formData.proofURL}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </form>
      )}
    </main>
  );
}