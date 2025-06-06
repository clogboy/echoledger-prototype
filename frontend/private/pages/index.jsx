import React from 'react';
import { useWallet } from '../../shared/WalletProvider';

export default function PrivateDemoApp() {
  const { wallet, connectMetaMask, createBurnerWallet } = useWallet();

return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9fafb' }}>
      <div style={{ width: '100%', maxWidth: '36rem', padding: '1.5rem', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>Welcome to the Echo Ledger Demo</h1>

        {wallet ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ color: '#4b5563' }}>
              Connected wallet: <span style={{ fontFamily: 'monospace' }}>{wallet.address}</span>
            </p>
            <p style={{ color: '#374151' }}>
              ✅ You now have access to this demo space. Here you can see how a registered idea would be validated
              through a burner wallet or MetaMask.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ color: '#374151' }}>Please connect a wallet to continue:</p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={createBurnerWallet} style={{ padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>
                Use Burner Wallet
              </button>
              <button onClick={connectMetaMask} style={{ padding: '0.5rem 1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '0.25rem', cursor: 'pointer' }}>
                Use MetaMask
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  ); }

