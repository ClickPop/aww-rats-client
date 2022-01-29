import { NetworkStatus } from '@apollo/client';
import { createContext, FC, useMemo, useState } from 'react';
import { useGetGameDataQuery } from '~/schema/apollo';
import { GetGameDataQuery } from '~/schema/generated';
import {
  GameAdminContext as GameAdminContextType,
  GetTableHeaders,
  NormalizedEncounter,
  NormalizedGauntlet,
  NormalizedRaid,
} from '~/types/game';

const getTableHeaders: GetTableHeaders = (data) =>
  data.reduce((acc, curr) => {
    Object.keys(curr)
      .filter((curr) => !curr.includes('typename'))
      .forEach((k) => {
        acc.add(k);
      });
    return acc;
  }, new Set<string>());

const normalizeEncounters = (encounters?: GetGameDataQuery['encounters']) =>
  encounters?.map((e) =>
    Object.keys(e)
      .map((k) => k as keyof typeof e)
      .reduce((acc, key) => {
        switch (key as keyof NormalizedEncounter) {
          case 'gauntlet_encounters':
            acc['gauntlet_encounters'] = e['gauntlet_encounters'].map(
              (ge) => ge.gauntlet_id,
            );
            break;
          case 'raids':
            acc['raids'] = e['raids'].map((r) => r.id);
            break;
            break;
          default:
            acc[key as keyof NormalizedEncounter] = e[key] as never;
            break;
        }
        return acc;
      }, {} as NormalizedEncounter),
  ) ?? [];

const normalizeRaids = (raids?: GetGameDataQuery['raids']) =>
  raids?.map((e) =>
    Object.keys(e)
      .map((k) => k as keyof typeof e)
      .reduce((acc, key) => {
        switch (key as keyof NormalizedRaid) {
          case 'encounter':
            acc['encounter'] = e['encounter'].id;
            break;
          default:
            acc[key as keyof NormalizedRaid] = e[key] as never;
            break;
        }
        return acc;
      }, {} as NormalizedRaid),
  ) ?? [];

const normalizeGauntlets = (gauntlets?: GetGameDataQuery['gauntlets']) =>
  gauntlets?.map((e) =>
    Object.keys(e)
      .map((k) => k as keyof typeof e)
      .reduce((acc, key) => {
        switch (key as keyof NormalizedGauntlet) {
          case 'gauntlet_encounters':
            acc['gauntlet_encounters'] = e['gauntlet_encounters'].map(
              (e) => e.encounter.id,
            );
            break;
          default:
            acc[key as keyof NormalizedGauntlet] = e[key] as never;
            break;
        }
        return acc;
      }, {} as NormalizedGauntlet),
  ) ?? [];

const defaultContext: GameAdminContextType = {
  encounters: [],
  raids: [],
  gauntlets: [],
  rewards: [],
  rat_types: [],
  rattributes: [],
  encounter_types: [],
  loading: false,
  refetch: async () => ({
    data: {
      encounters: [],
      raids: [],
      gauntlets: [],
      rewards: [],
      rat_types: [],
      rattributes: [],
      encounter_types: [],
    },
    loading: false,
    networkStatus: NetworkStatus.refetch,
  }),
  getTableHeaders,
};

export const GameAdminContext = createContext(defaultContext);

export const GameAdminContextProvider: FC = ({ children }) => {
  const { data, loading, refetch } = useGetGameDataQuery();
  const encounters = useMemo(
    () => normalizeEncounters(data?.encounters),
    [data?.encounters],
  );
  const raids = useMemo<NormalizedRaid[]>(
    () => normalizeRaids(data?.raids),
    [data?.raids],
  );
  const gauntlets = useMemo<NormalizedGauntlet[]>(
    () => normalizeGauntlets(data?.gauntlets),
    [data?.gauntlets],
  );
  return (
    <GameAdminContext.Provider
      value={{
        loading,
        refetch,
        encounters,
        raids,
        gauntlets,
        rewards: data?.rewards ?? [],
        encounter_types: data?.encounter_types ?? [],
        rat_types: data?.rat_types ?? [],
        rattributes: data?.rattributes ?? [],
        getTableHeaders: getTableHeaders,
      }}>
      {children}
    </GameAdminContext.Provider>
  );
};
