// /frontend/demo/PrivateDemoApp.jsx import React, { useContext } from 'react'; import { WalletContext } from '../shared/WalletProvider'; import { Card, CardContent } from '@/components/ui/card'; import { Button } from '@/components/ui/button';

export default function PrivateDemoApp() { const { walletAddress, connectWallet, isConnected } = useContext(WalletContext);

return ( <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50"> <Card className="w-full max-w-xl p-6"> <CardContent> <h1 className="text-2xl font-semibold mb-4">Welcome to the Echo Ledger Demo</h1>

{isConnected ? (
        <div className="space-y-4">
          <p className="text-gray-600">
            Connected wallet: <span className="font-mono">{walletAddress}</span>
          </p>
          <p className="text-gray-700">
            ✅ You now have access to this demo space. Here you can see how a registered idea would be validated
            through a burner wallet or MetaMask.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-700">Please connect a wallet to continue:</p>
          <div className="flex space-x-4">
            <Button onClick={() => connectWallet('burner')}>Use Burner Wallet</Button>
            <Button onClick={() => connectWallet('metamask')}>Use MetaMask</Button>
          </div>
        </div>
      )}
    </CardContent>
  </Card>
</div>

); }

