import { Storage } from '@google-cloud/storage';
import { GCP_CLIENT_EMAIL, GCP_PRIVATE_KEY } from 'common/env';

const creds = {
  credentials: {
    client_email: GCP_CLIENT_EMAIL,
    private_key: GCP_PRIVATE_KEY,
  },
};

export const storage = new Storage(creds);
