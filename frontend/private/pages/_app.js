
import { WalletProvider } from '../../shared/ui/WalletProvider';
import '../../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <WalletProvider>
      <Component {...pageProps} />
    </WalletProvider>
  );
}
