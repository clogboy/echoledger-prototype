'use client';

import React, { useState } from 'react'; import { useWallet } from '../../shared/ui/WalletProvider';

export default function RegistrationForm() { const { address, walletType } = useWallet();

const [formData, setFormData] = useState({ title: '', description: '', website: '', });

const [submitted, setSubmitted] = useState(false);

const handleChange = (e) => { const { name, value } = e.target; setFormData({ ...formData, [name]: value }); };

const handleSubmit = async (e) => { e.preventDefault(); const payload = { ...formData, wallet: address, type: walletType, };

try {
  const res = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (res.ok) setSubmitted(true);
} catch (error) {
  console.error('Registration error:', error);
}

};

if (!address) return <p className="p-4">Please connect your wallet first.</p>;

if (submitted) return <p className="p-4">Your idea has been registered. Thank you!</p>;

return ( <form onSubmit={handleSubmit} className="p-6 max-w-xl mx-auto space-y-4"> <div> <label className="block text-sm font-medium">Title</label> <input
type="text"
name="title"
value={formData.title}
onChange={handleChange}
required
className="w-full mt-1 border rounded p-2"
/> </div>

<div>
    <label className="block text-sm font-medium">Short Description</label>
    <textarea
      name="description"
      value={formData.description}
      onChange={handleChange}
      rows={4}
      required
      className="w-full mt-1 border rounded p-2"
    ></textarea>
  </div>

  <div>
    <label className="block text-sm font-medium">Proof of Intent (URL, if available)</label>
    <input
      type="url"
      name="website"
      value={formData.website}
      onChange={handleChange}
      className="w-full mt-1 border rounded p-2"
    />
  </div>

  <button type="submit" className="btn w-full mt-4">Submit</button>
</form>

); }

