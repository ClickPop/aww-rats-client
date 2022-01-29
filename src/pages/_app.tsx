import { ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { EthersContextProvider } from '~/components/context/EthersContext';
import { client } from '~/lib/apollo';
import '~/styles/index.scss';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

function MyApp({ Component, pageProps }: AppProps) {
  const theme = extendTheme({
    colors: {
      pickRat: {
        500: '#FFFFFF',
        600: '#CCCCCC',
      },
      pickRatStatic: {
        500: '#FFFFFF',
        600: '#FFFFFF',
      },
      packRat: {
        500: '#FF7558',
        600: '#ff4a24',
      },
      labRat: {
        500: '#00E99A',
        600: '#00c682',
      },
      streetRat: {
        500: '#00A5FF',
        600: '#008cd8',
      },
      petRat: {
        500: '#FE7098',
        600: '#fd3970',
      },
      darkAlpha: {
        50: 'rgba(40, 45, 58, 0.1)',
        100: 'rgba(40, 45, 58, 0.25)',
        200: 'rgba(40, 45, 58, 0.4)',
        300: 'rgba(40, 45, 58, 0.55)',
        400: 'rgba(40, 45, 58, 0.7)',
        500: 'rgba(40, 45, 58, 0.85)',
        600: 'rgba(40, 45, 58, 1)',
        700: '#212631',
        800: '#1c1f28',
        900: '#16181f',
      },
      dark: {
        50: '#c2c7d4',
        100: '#9da5bb',
        200: '#7884a2',
        300: '#5a6583',
        400: '#41495e',
        500: '#282D3A',
        600: '#212631',
        700: '#1c1f28',
        800: '#16181f',
        900: '#101217',
      },
    },
  });

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
      <ChakraProvider theme={theme}>
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
