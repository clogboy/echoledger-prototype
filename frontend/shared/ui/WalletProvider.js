'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { v4 as uuidv4 } from 'uuid';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [address, setAddress] = useState(null);
  const [walletType, setWalletType] = useState(null); // 'metamask' or 'burner'

  // --- Connect MetaMask ---
  const connectMetaMask = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed');
      return;
    }

    const ethProvider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await ethProvider.send('eth_requestAccounts', []);
    const ethSigner = await ethProvider.getSigner();

    setProvider(ethProvider);
    setSigner(ethSigner);
    setAddress(accounts[0]);
    setWalletType('metamask');
  };

  // --- Create Burner Wallet ---
  const createBurnerWallet = async () => {
    const burner = ethers.Wallet.createRandom();
    const memoryProvider = new ethers.JsonRpcProvider('https://polygon-rpc.com'); // Public Polygon RPC
    const connectedBurner = burner.connect(memoryProvider);

    setProvider(memoryProvider);
    setSigner(connectedBurner);
    setAddress(burner.address);
    setWalletType('burner');
  };

  const logoutWallet = () => {
    setProvider(null);
    setSigner(null);
    setAddress(null);
    setWalletType(null);
  };

  useEffect(() => {
    // Optional: Auto-connect logic for MetaMask or session-persisted burner
  }, []);

  return (
    <WalletContext.Provider
      value={{
        provider,
        signer,
        address,
        walletType,
        connectMetaMask,
        createBurnerWallet,
        logoutWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};