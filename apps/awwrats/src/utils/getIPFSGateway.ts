import { IPFSGateways } from '~/config/env';

export const getIPFSGateway = (i: number) =>
  IPFSGateways[i % IPFSGateways.length];
