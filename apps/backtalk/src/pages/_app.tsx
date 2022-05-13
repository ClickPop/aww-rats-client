import { ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { EthersContextProvider } from 'common/components/context/EthersContext';
import { client } from '~/lib/graphql';
import '~/styles/index.scss';
import 'feeder-react-feedback/dist/feeder-react-feedback.css';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import '@fontsource/vollkorn/500.css';
import '@fontsource/vollkorn/700.css';
import {
  useCheckAuthQuery,
  useBacktalkLoginMutation,
  BacktalkLoginMutation,
} from '~/schema/generated';
import { Web3Wrapper } from 'common/components/access/Web3Wrapper';

function MyApp({ Component, pageProps }: AppProps) {
  const theme = extendTheme({
    fonts: {
      heading: 'Vollkorn, serif',
    },
    colors: {
      pickRat: {
        500: '#FFFFFF',
        600: '#CCCCCC',
      },
      pickRatStatic: {
        500: '#FFFFFF',
        600: '#FFFFFF',
      },
      pack: {
        500: '#FF7558',
        600: '#ff4a24',
      },
      lab: {
        500: '#00E99A',
        600: '#00c682',
      },
      street: {
        500: '#00A5FF',
        600: '#008cd8',
      },
      pet: {
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
      blueGray: {
        500: '#383D6E',
        600: '#26284a',
        700: '#1C1E3B',
      },
      purple: {
        950: '#1e153a',
      },
      backtalk: {
        background: '#F5F6F8',
        yellow: '#FEC046',
        blue: '#00A5FF',
        red: '#FF7558',
        green: '#51ECAF',
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
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#000000' />
        <meta name='msapplication-TileColor' content='#ffffff' />
        <meta name='theme-color' content='#ffffff' />
      </Head>
      <ChakraProvider theme={theme}>
        {client && (
          <ApolloProvider client={client}>
            <Web3Wrapper>
              <EthersContextProvider<BacktalkLoginMutation>
                checkAuth={useCheckAuthQuery}
                useLogin={useBacktalkLoginMutation}
                checkFunc={(d, s) => d.data?.login?.wallet === s}>
                <Component {...pageProps} />
              </EthersContextProvider>
            </Web3Wrapper>
          </ApolloProvider>
        )}
      </ChakraProvider>
    </>
  );
}
export default MyApp;
