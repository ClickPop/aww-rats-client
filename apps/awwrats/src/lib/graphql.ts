import { HASURA_BASE_URL } from '~/config/env';
import { getClient } from 'common/lib/graphql';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

export const client: ApolloClient<NormalizedCacheObject> =
  getClient(HASURA_BASE_URL);
