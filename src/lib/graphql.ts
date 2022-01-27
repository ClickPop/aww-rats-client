import { GraphQLClient } from 'graphql-request';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { HASURA_ADMIN_SECRET, HASURA_BASE_URL } from '~/config/env';
import { getSdk } from '~/schema/requests';

export const apolloClient = new ApolloClient({
  uri: `${HASURA_BASE_URL}/v1/graphql`,
  cache: new InMemoryCache(),
  credentials: 'include',
});

const client = new GraphQLClient(`${HASURA_BASE_URL}/v1/graphql`, {
  headers: { 'x-hasura-admin-secret': HASURA_ADMIN_SECRET },
});

export const sdk = getSdk(client);
