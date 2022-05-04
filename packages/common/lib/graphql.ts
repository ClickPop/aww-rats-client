import {
  ApolloClient,
  InMemoryCache,
  split,
  HttpLink,
  NormalizedCacheObject,
} from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import * as ws from 'isomorphic-ws';

export const getClient = (
  endpoint: string,
): ApolloClient<NormalizedCacheObject> => {
  const httpLink = new HttpLink({
    uri: `${endpoint}/v1/graphql`,
    credentials: 'include',
  });

  const wsLink = new GraphQLWsLink(
    createClient({
      url: `${endpoint
        .replace('https://', 'wss://')
        .replace('http://', 'ws://')}/v1/graphql`,
      lazy: true,
      retryAttempts: 5,
      webSocketImpl: typeof window === 'undefined' ? ws : undefined,
    }),
  );

  const splitLink = split(
    (op) => {
      const definition = getMainDefinition(op.query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink,
  );

  return new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
    credentials: 'include',
  });
};
