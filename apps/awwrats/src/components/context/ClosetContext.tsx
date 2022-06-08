import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import {
  CachedRat,
  ClosetContextType,
  ClosetLoading,
  CombinedCanvasNullable,
  SelectRat,
} from '~/types';
import {
  RAT_CLOSET_PLACEHOLDER,
  LAYER_ORDER,
  RAT_PIECES_PREFIX,
  CLOSET_ADDRESS,
} from '~/config/env';
import { fabric } from 'fabric';
import { SingleValue } from 'react-select';
import { EthersContext } from 'common/components/context/EthersContext';
import { closetCartReducer } from '~/reducers/closetCart';
import {
  useGetClosetDataSubscription,
  GetRatsSubscription,
  useGetRatsSubscription,
} from '~/schema/generated';
import { ContractsContext } from '~/components/context/ContractsContext';
import { useSignerAddress } from 'common/hooks/useSignerAddress';
import { useContractRead } from 'wagmi';
import { Closet__factory, Closet } from 'types';
import { Metadata } from '~/types';

const defaultClosetContext: ClosetContextType = {
  canvas: null,
  setCanvas: () => {},
  loading: {
    data: false,
    mirror: false,
  },
  rats: [],
  currentRat: null,
  hidePiece: {},
  setHidePiece: () => {},
  cart: {},
  cartDispatch: () => {},
  tryOnClothes: () => {},
  closetPieces: [],
  handleChangeRat: async () => {},
  getBase64Image: async () => {},
  sponsoredPieces: [],
};

export const ClosetContext = createContext(defaultClosetContext);
export const ClosetContextProvider: FC = ({ children }) => {
  const [canvas, setCanvas] = useState<CombinedCanvasNullable>(null);
  const signerAddr = useSignerAddress();
  const { closet, rat } = useContext(ContractsContext);
  const [closetMeta, setClosetMeta] = useState<Record<string, unknown>[]>([]);
  const { data, isLoading } = useContractRead(
    {
      addressOrName: CLOSET_ADDRESS ?? '',
      contractInterface: Closet__factory.abi,
    },
    'loadCloset',
  );

  useEffect(() => {
    async function loadCloset() {
      const d = data as Awaited<ReturnType<Closet['loadCloset']>> | undefined;
      if (d) {
        const promises = d.map((t) =>
          fetch(`/closet/tokens/${t.id.toString()}`).then((r) => r.json()),
        ) as Promise<Metadata>[];
        const tokens = await Promise.all(promises);
        console.log(tokens);
      }
    }

    loadCloset();
  }, [data]);

  const {
    data: closetData,
    loading: closetLoading,
    error,
  } = useGetClosetDataSubscription({
    variables: { id: signerAddr! },
    skip: !signerAddr,
  });
  const { data: ratData, loading: ratsLoading } = useGetRatsSubscription({
    variables: { id: signerAddr! },
    skip: !signerAddr,
  });
  const [currentRat, setCurrentRat] = useState<CachedRat | null>(null);
  const [oldClothes, setOldClothes] = useState<Map<string, string>>(new Map());
  const [hidePiece, setHidePiece] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<ClosetLoading>({
    data: closetLoading,
    mirror: false,
  });
  const [cart, cartDispatch] = useReducer(closetCartReducer, {});

  const rats = useMemo(() => ratData?.rats ?? [], [ratData?.rats]);

  const closetPieces = useMemo(
    () => closetData?.closet_pieces ?? [],
    [closetData?.closet_pieces],
  );

  const sponsoredPieces = useMemo(
    () => closetPieces.filter((p) => !!p.sponsor),
    [closetPieces],
  );

  useEffect(() => {
    setLoading((l) => ({ ...l, data: closetLoading }));
  }, [closetLoading]);

  useEffect(() => {
    const loadCloset = async () => {
      const c = closet?.loadCloset(0, 0);
    };

    loadCloset();
  }, [closet]);

  const handleChangeRat = useCallback(
    async (select: SingleValue<SelectRat>) => {
      const selectedRat = select?.rat ?? null;
      setLoading((l) => ({ ...l, mirror: true }));
      setCurrentRat(selectedRat);
      if (signerAddr && rat && selectedRat) {
        const owner = await rat.ownerOf(selectedRat.id);
        if (owner !== signerAddr) {
          return;
        }
      }
      const getImageURL = (key: string, val: string): string => {
        if (!val) {
          return `${RAT_PIECES_PREFIX}${key}-base.png`;
        }

        if (val.startsWith('data:')) {
          return val;
        }

        const piece = closetPieces.find((p) => `${p.id}` === val);
        if (!!piece) {
          return piece.image;
        }
        return `${RAT_PIECES_PREFIX}${key}-${val}.png`;
      };
      if (canvas) {
        canvas.clear();
        if (selectedRat) {
          const layers: [string, string][] = [];
          LAYER_ORDER.forEach((layer) => {
            const val = `${selectedRat[layer as keyof CachedRat]}`;
            if (!!val && val !== 'none' && !hidePiece[layer]) {
              layers.push([
                layer,
                `${
                  val?.startsWith('data:')
                    ? val
                    : val.toLowerCase().replace(/ /g, '-')
                }`,
              ]);
            }
            if (layer === 'torso' || layer === 'head') {
              layers.push([layer, 'base']);
            }
          });
          for (const [key, val] of layers) {
            const img = await new Promise<fabric.Image>((resolve) => {
              fabric.Image.fromURL(getImageURL(key, val), resolve);
            });
            let aspect = img.width && img.height ? img.width / img.height : 1;

            if (aspect >= 1) {
              //@ts-ignore
              img.scaleToHeight(canvas.height);
            } else {
              //@ts-ignore
              img.scaleToWidth(canvas.width);
            }
            canvas.add(img);
            canvas.centerObject(img);
          }
        } else {
          fabric.Image.fromURL(RAT_CLOSET_PLACEHOLDER, (img) => {
            canvas.add(img);
          });
        }
      }
      setTimeout(() => setLoading((l) => ({ ...l, mirror: false })), 300);
      canvas?.renderAll();
    },
    [canvas, closetPieces, hidePiece, rat, signerAddr],
  );

  const getBase64Image = (file: Blob): Promise<any | Error> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  useEffect(() => {
    handleChangeRat(
      currentRat
        ? { label: currentRat.id, value: currentRat.id, rat: currentRat }
        : null,
    );
    // In this case the handleChangeRat method is causing needless re-renders, but the linter warns if it's not there
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRat, hidePiece]);

  const tryOnClothes = async (
    pieceType: keyof GetRatsSubscription['rats'][0],
    piece: string,
  ) => {
    setLoading((l) => ({ ...l, mirror: true }));
    if (currentRat && signerAddr && closet) {
      const closetPiece = closetPieces.find((p) => p.id === piece);
      if (closetPiece) {
        const ownedAmount = await closet.balanceOf(signerAddr, closetPiece.id);
        if (ownedAmount.gt(0)) {
          if (currentRat[pieceType] === piece) {
            const newCurrentRat = !currentRat
              ? currentRat
              : { ...currentRat, [pieceType]: oldClothes.get(pieceType) };
            setCurrentRat(newCurrentRat);
            await handleChangeRat(
              newCurrentRat
                ? {
                    label: newCurrentRat.id,
                    value: newCurrentRat.id,
                    rat: newCurrentRat,
                  }
                : null,
            );
          } else {
            const old = new Map(oldClothes);
            old.set(pieceType, currentRat[pieceType] ?? 'none');
            setOldClothes(old);
            await handleChangeRat(
              currentRat
                ? {
                    label: currentRat.id,
                    value: currentRat.id,
                    rat: { ...currentRat, [pieceType]: piece },
                  }
                : null,
            );
          }
        }
      } else {
        const old = new Map(oldClothes);
        old.set(pieceType, currentRat[pieceType] ?? 'none');
        setOldClothes(old);
        await handleChangeRat(
          currentRat
            ? {
                label: currentRat.id,
                value: currentRat.id,
                rat: { ...currentRat, [pieceType]: piece },
              }
            : null,
        );
      }
      setLoading((l) => ({ ...l, mirror: false }));
    }
  };

  return (
    <ClosetContext.Provider
      value={{
        canvas,
        setCanvas,
        loading,
        rats,
        hidePiece,
        setHidePiece,
        currentRat,
        cart,
        cartDispatch,
        closetPieces,
        handleChangeRat,
        getBase64Image,
        sponsoredPieces,
        tryOnClothes,
      }}>
      {children}
    </ClosetContext.Provider>
  );
};
