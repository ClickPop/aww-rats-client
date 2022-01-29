import { useGetGameDataQuery } from '~/schema/apollo';
import { GetGameDataQuery } from '~/schema/generated';

export enum GameIconTypes {
  Energy = 'energy',
  Strength = 'strength',
  Attack = 'attack',
  Reward = 'reward',
  PetRat = 'pet',
  LabRat = 'lab',
  StreetRat = 'street',
  PackRat = 'pack',
  Plus = 'plus',
}

export enum Rattribute {
  Cunning = 'Cunning',
  Cuteness = 'Cuteness',
  Rattitude = 'Rattitude',
}

export enum EncounterType {
  Solo = 'solo',
  Raid = 'raid',
  Gauntlet = 'gauntlet',
}

export enum RatType {
  PetRat = 'pet',
  LabRat = 'lab',
  StreetRat = 'street',
  PackRat = 'pack',
}
export interface NormalizedEncounter
  extends Omit<
    GetGameDataQuery['encounters'][0],
    'gauntlet_encounters' | 'reward' | 'raids'
  > {
  gauntlet_encounters: number[];
  raids: number[];
}

export interface NormalizedRaid
  extends Omit<GetGameDataQuery['raids'][0], 'encounter' | 'reward'> {
  encounter: number;
}

export interface NormalizedGauntlet
  extends Omit<
    GetGameDataQuery['gauntlets'][0],
    'gauntlet_encounters' | 'reward'
  > {
  gauntlet_encounters: number[];
}

export interface GameAdminContext
  extends Omit<GetGameDataQuery, 'encounters' | 'raids' | 'gauntlets'> {
  encounters: NormalizedEncounter[];
  raids: NormalizedRaid[];
  gauntlets: NormalizedGauntlet[];
  refetch: ReturnType<typeof useGetGameDataQuery>['refetch'];
  loading: boolean;
  getTableHeaders: GetTableHeaders;
}

export type GetTableHeaders = <T extends Array<any>>(data: T) => Set<string>;
