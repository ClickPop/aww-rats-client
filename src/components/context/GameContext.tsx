import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { EthersContext } from '~/components/context/EthersContext';
import {
  useGetActiveEncountersQuery,
  GetActiveEncountersQuery,
  useGetRatsByWalletQuery,
  GetRatsByWalletQuery,
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
  ratResult: Pick<
    ReturnType<typeof useGetRatsByWalletQuery>,
    'data' | 'loading' | 'error'
  >;
  selectedRats: Array<GetRatsByWalletQuery['rats'][0] | null>;
  setSelectedRats: Dispatch<
    SetStateAction<Array<GetRatsByWalletQuery['rats'][0] | null>>
  >;
  selectRatIndex: number | null;
  setSelectRatIndex: Dispatch<SetStateAction<number | null>>;
};

export const GameContext = createContext<defaultContext>({
  soloEncountersResults: {
    data: { encounters: [] },
    loading: false,
  },
  selectedEncounter: null,
  setSelectedEncounter: () => {},
  ratResult: {
    data: { rats: [] },
    loading: false,
  },
  selectedRats: [],
  setSelectedRats: () => {},
  selectRatIndex: null,
  setSelectRatIndex: () => {},
});

export const GameContextProvider: FC = ({ children }) => {
  const { signerAddr } = useContext(EthersContext);
  const ratResult = useGetRatsByWalletQuery({
    variables: { wallet: signerAddr! },
    skip: !signerAddr,
  });
  const soloEncountersResults = useGetActiveEncountersQuery();
  const [selectedEncounter, setSelectedEncounter] = useState<
    GetActiveEncountersQuery['encounters'][0] | null
  >(null);
  const [selectedRats, setSelectedRats] = useState<
    Array<GetRatsByWalletQuery['rats'][0] | null>
  >([]);
  const [selectRatIndex, setSelectRatIndex] = useState<number | null>(null);

  useEffect(() => {
    if (selectedEncounter) {
      setSelectedRats(new Array(selectedEncounter.max_rats).fill(null));
    }
  }, [selectedEncounter]);

  return (
    <GameContext.Provider
      value={{
        soloEncountersResults,
        selectedEncounter,
        setSelectedEncounter,
        ratResult,
        selectedRats,
        setSelectedRats,
        selectRatIndex,
        setSelectRatIndex,
      }}>
      {children}
    </GameContext.Provider>
  );
};
