// /shared/WalletProvider.js import { createContext, useContext, useEffect, useState } from 'react'; import { ethers } from 'ethers';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => { const [wallet, setWallet] = useState(null); const [provider, setProvider] = useState(null); const [isMetaMask, setIsMetaMask] = useState(false);

const connectMetaMask = async () => { if (window.ethereum) { const ethProvider = new ethers.BrowserProvider(window.ethereum); const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }); const signer = await ethProvider.getSigner(); setProvider(ethProvider); setWallet({ address: accounts[0], signer }); setIsMetaMask(true); } else { alert('Please install MetaMask.'); } };

const createBurnerWallet = () => { const randomWallet = ethers.Wallet.createRandom(); setWallet(randomWallet); setProvider(null); setIsMetaMask(false); };

return ( <WalletContext.Provider value={{ wallet, provider, isMetaMask, connectMetaMask, createBurnerWallet }}> {children} </WalletContext.Provider> ); };

export const useWallet = () => useContext(WalletContext);

