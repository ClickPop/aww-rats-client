import { ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { EthersContextProvider } from '~/components/context/EthersContext';
import { client } from '~/lib/apollo';
import '~/styles/index.scss';
import { ChakraProvider } from '@chakra-ui/react'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon-16x16.png'
        />
        <link rel='manifest' href='/site.webmanifest' />
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#fcd446' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta name='msapplication-TileColor' content='#2b5797' />
        <meta name='theme-color' content='#ffffff' />
      </Head>
      <ChakraProvider>
        <ApolloProvider client={client}>
          <EthersContextProvider>
            <Component {...pageProps} />
          </EthersContextProvider>
        </ApolloProvider>
      </ChakraProvider>
    </>
  );
}
export default MyApp;
