import { ApolloClient, InMemoryCache } from '@apollo/client';
import { HASURA_BASE_URL } from '~/config/env';

export const client = new ApolloClient({
  uri: `${HASURA_BASE_URL}/v1/graphql`,
  cache: new InMemoryCache(),
  credentials: 'include',
});
