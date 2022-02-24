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
  useGetCurrentPlayerQuery,
  GetCurrentPlayerQuery,
  GetCurrentPlayerDocument,
  Rat_Types_Enum,
} from '~/schema/generated';
import { getCachedRatUrl } from '~/utils/getCachedImageUrl';

export type RatSlot = {
  rat?: GetRatsByWalletQuery['rats'][0];
  slotType?: Rat_Types_Enum;
  tokenAddr?: string | null;
};

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
  ratSlots: Array<RatSlot>;
  setRatSlots: Dispatch<SetStateAction<Array<RatSlot>>>;
  selectRatIndex: number | null;
  setSelectRatIndex: Dispatch<SetStateAction<number | null>>;
  player?: GetCurrentPlayerQuery['players_by_pk'];
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
  ratSlots: [],
  setRatSlots: () => {},
  selectRatIndex: null,
  setSelectRatIndex: () => {},
});

export const GameContextProvider: FC = ({ children }) => {
  const { signerAddr, isLoggedIn } = useContext(EthersContext);
  const ratResult = useGetRatsByWalletQuery({
    variables: { wallet: signerAddr! },
    skip: !signerAddr,
  });
  const soloEncountersResults = useGetActiveEncountersQuery();
  const [selectedEncounter, setSelectedEncounter] = useState<
    GetActiveEncountersQuery['encounters'][0] | null
  >(null);
  const [ratSlots, setRatSlots] = useState<Array<RatSlot>>([]);
  const [selectRatIndex, setSelectRatIndex] = useState<number | null>(null);
  const {
    data,
    error,
    loading: playerLoading,
    subscribeToMore,
  } = useGetCurrentPlayerQuery({
    variables: { id: signerAddr! },
    skip: !isLoggedIn && !signerAddr,
  });

  useEffect(() => {
    if (signerAddr && isLoggedIn) {
      subscribeToMore({
        variables: {
          id: signerAddr,
        },
        document: GetCurrentPlayerDocument,
      });
    }
  }, [signerAddr, isLoggedIn, subscribeToMore]);

  useEffect(() => {
    if (selectedEncounter) {
      const totalLockedSlots =
        selectedEncounter.encounter_rat_constraints.reduce(
          (acc, curr) => acc + curr.locked_slots,
          0,
        );

      setRatSlots(
        new Array(selectedEncounter.max_rats)
          .fill({})
          .reduce((acc: RatSlot[], slot: RatSlot, i) => {
            if (i < totalLockedSlots || totalLockedSlots === 0) {
              return [...acc, slot];
            }
            for (const constraint of selectedEncounter.encounter_rat_constraints) {
              const totalOfType = acc.filter(
                (s) => s.slotType === constraint.rat_type,
              ).length;
              if (totalOfType < constraint.locked_slots) {
                return [
                  ...acc,
                  {
                    ...slot,
                    slotType: constraint.rat_type,
                    addr: constraint.external_contract_address,
                  },
                ];
              }
            }
            return acc;
          }, [] as RatSlot[]),
      );
    }
  }, [selectedEncounter]);

  return (
    <GameContext.Provider
      value={{
        soloEncountersResults,
        selectedEncounter,
        setSelectedEncounter,
        ratResult: {
          ...ratResult,
          data: {
            ...ratResult.data,
            rats:
              ratResult.data?.rats.map((rat) => ({
                ...rat,
                image: getCachedRatUrl(`${rat.id}`),
              })) ?? [],
          },
        },
        ratSlots,
        setRatSlots,
        selectRatIndex,
        setSelectRatIndex,
        player: data?.players_by_pk,
      }}>
      {children}
    </GameContext.Provider>
  );
};
