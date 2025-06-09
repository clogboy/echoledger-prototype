
'use client';

import React, { useState } from 'react';
import { useWallet } from '../../shared/ui/WalletProvider';

export default function RegistrationForm() {
  const { address, walletType } = useWallet();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    website: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tokenHash, setTokenHash] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (formData.website && !isValidUrl(formData.website)) {
      setError('Please enter a valid URL for website');
      return false;
    }
    if (!address) {
      setError('Wallet must be connected');
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
    setError('');

    const payload = {
      ...formData,
      wallet: address,
      type: walletType,
    };

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || `Server error: ${res.status}`);
      }

      const data = await res.json();
      if (data.status === 'success') {
        setTokenHash(data.tokenHash);
        setSubmitted(true);
      } else {
        throw new Error('Registration failed: Invalid response');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Failed to register idea. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!address) {
    return (
      <div className="p-4 text-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <strong>Wallet Required:</strong> Please connect your wallet first to register an idea.
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="p-4">
        <div className="bg-green-100 p-4 rounded-lg shadow max-w-xl mx-auto">
          <p className="mb-2">✅ Your idea has been registered successfully!</p>
          <p><strong>Token:</strong> <code className="bg-gray-100 px-2 py-1 rounded">{tokenHash}</code></p>
          <p className="text-sm text-gray-600 mt-2">
            <strong>Wallet:</strong> {address} ({walletType})
          </p>
          <button 
            onClick={() => {
              setSubmitted(false);
              setTokenHash('');
              setFormData({
                title: '',
                description: '',
                website: '',
              });
            }}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Register Another Idea
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register Idea (Wallet Connected)</h1>
      
      <div className="bg-blue-50 p-3 rounded mb-4">
        <p className="text-sm"><strong>Connected:</strong> {address}</p>
        <p className="text-sm"><strong>Wallet Type:</strong> {walletType}</p>
      </div>

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
            name="website"
            value={formData.website}
            onChange={handleChange}
            disabled={loading}
            placeholder="https://example.com/proof"
            className="w-full mt-1 border rounded p-2 disabled:bg-gray-100"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Registering...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
