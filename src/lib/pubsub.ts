import { PubSub } from '@google-cloud/pubsub';
import { PROJECT_ID } from '~/config/env';
export const pubsub = new PubSub({projectId: PROJECT_ID, keyFile: "./pubsub-keyfile.json"});