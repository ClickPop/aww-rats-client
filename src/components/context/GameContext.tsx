import { createContext, Dispatch, FC, SetStateAction, useState } from 'react';
import {
  useGetActiveEncountersQuery,
  Encounters,
  GetActiveEncountersQuery,
} from '~/schema/generated';

type defaultContext = {
  soloEncountersResults: Pick<
    ReturnType<typeof useGetActiveEncountersQuery>,
    'data' | 'loading' | 'error'
  >;
  selectedEncounter: GetActiveEncountersQuery['encounters'][0] | null;
  setSelectedEncounter: Dispatch<
    SetStateAction<GetActiveEncountersQuery['encounters'][0] | null>
  >;
};

export const GameContext = createContext<defaultContext>({
  soloEncountersResults: {
    data: { encounters: [] },
    loading: false,
  },
  selectedEncounter: null,
  setSelectedEncounter: () => {},
});

export const GameContextProvider: FC = ({ children }) => {
  const soloEncountersResults = useGetActiveEncountersQuery();
  const [selectedEncounter, setSelectedEncounter] = useState<
    GetActiveEncountersQuery['encounters'][0] | null
  >(null);
  return (
    <GameContext.Provider
      value={{
        soloEncountersResults,
        selectedEncounter,
        setSelectedEncounter,
      }}>
      {children}
    </GameContext.Provider>
  );
};
