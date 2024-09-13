import '../styles/globals.sass'; // Global sass faylni import qilish
import type { AppProps } from 'next/app';
import Layout from '../components/Layout'; // Layout komponentini import qilish

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;
