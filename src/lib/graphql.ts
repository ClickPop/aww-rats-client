import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { HASURA_BASE_URL } from '~/config/env';
import * as ws from 'ws';

const isServer = () => typeof window === 'undefined';

const wsLink = new WebSocketLink({
  uri: `${HASURA_BASE_URL.replace('https://', 'wss://').replace(
    'http://',
    'ws://',
  )}/v1/graphql`,
  options: {
    reconnect: true,
  },
  webSocketImpl: isServer() ? ws : undefined,
});

const httpLink = new HttpLink({
  uri: `${HASURA_BASE_URL}/v1/graphql`,
  credentials: 'include',
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  credentials: 'include',
});
