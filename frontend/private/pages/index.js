
"use client";

import { useState, useEffect } from "react";
import { useWallet } from "../shared/ui/WalletProvider";

export default function RegisterIdeaPage() {
  const { address, walletType, createBurnerWallet, connectMetaMask, logoutWallet } = useWallet();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    proofURL: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [tokenHash, setTokenHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Auto-create burner wallet for demo purposes on page load
  useEffect(() => {
    if (!address) {
      createBurnerWallet();
    }
  }, [address, createBurnerWallet]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateForm = () => {
    if (!address) {
      setError("Wallet must be connected");
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
      const payload = {
        ...formData,
        walletAddress: address,
        type: walletType,
      };

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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
      <h1 className="text-2xl font-bold mb-4">Register Your Idea (Demo Mode)</h1>
      
      {address && (
        <div className="bg-green-50 p-3 rounded mb-4">
          <p className="text-sm"><strong>Connected:</strong> {address}</p>
          <p className="text-sm"><strong>Wallet Type:</strong> {walletType}</p>
          <div className="mt-2 space-x-2">
            <button 
              onClick={connectMetaMask}
              className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600"
            >
              Connect MetaMask
            </button>
            <button 
              onClick={createBurnerWallet}
              className="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600"
            >
              New Burner
            </button>
            <button 
              onClick={logoutWallet}
              className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
            >
              Disconnect
            </button>
          </div>
        </div>
      )}

      {submitted ? (
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <p className="mb-2">✅ Your idea has been registered successfully!</p>
          <p><strong>Token:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{tokenHash}</code></p>
          <p className="text-sm text-gray-600 mt-2">
            <strong>Wallet:</strong> {address} ({walletType})
          </p>
          <button 
            onClick={() => {
              setSubmitted(false);
              setTokenHash("");
              setFormData({
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
        <>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>Error:</strong> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full mt-1 border rounded p-2 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Short Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
                disabled={loading}
                placeholder="Describe your idea in detail"
                className="w-full mt-1 border rounded p-2 disabled:bg-gray-100"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium">Proof of Intent (URL, if available)</label>
              <input
                type="url"
                name="proofURL"
                value={formData.proofURL}
                onChange={handleChange}
                disabled={loading}
                placeholder="https://example.com/proof"
                className="w-full mt-1 border rounded p-2 disabled:bg-gray-100"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading || !address}
              className="btn w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Submit"}
            </button>
          </form>
        </>
      )}

      <div className="mt-6 text-center">
        <a href="/register" className="text-blue-600 hover:underline">
          Switch to Wallet-Connected Mode →
        </a>
      </div>
    </main>
  );
}
