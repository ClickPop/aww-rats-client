import Hashids from 'hashids';
import { HASH_IDS_SALT } from '~/config/env';
export const hashids = new Hashids(HASH_IDS_SALT);
