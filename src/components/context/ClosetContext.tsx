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
} from '~/config/env';
import { fabric } from 'fabric';
import { SingleValue } from 'react-select';
import { EthersContext } from '~/components/context/EthersContext';
import { closetCartReducer } from '~/reducers/closetCart';
import { GetClosetDataQuery, useGetClosetDataQuery } from '~/schema/generated';

const defaultClosetContext: ClosetContextType = {
  canvas: null,
  setCanvas: () => {},
  loading: {
    metadata: false,
    mirror: false,
    pieces: false,
    tokens: false,
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
  const { signerAddr } = useContext(EthersContext);
  const [currentRat, setCurrentRat] = useState<CachedRat | null>(null);
  const [oldClothes, setOldClothes] = useState<Map<string, string>>(new Map());
  const [hidePiece, setHidePiece] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<ClosetLoading>({
    tokens: false,
    metadata: false,
    mirror: false,
    pieces: false,
  });
  const [cart, cartDispatch] = useReducer(closetCartReducer, {});

  const {
    data,
    loading: closetLoading,
    error,
  } = useGetClosetDataQuery({
    variables: { id: signerAddr! },
    skip: !signerAddr,
  });

  const rats = useMemo(() => data?.rats ?? [], [data?.rats]);

  const closetPieces = useMemo(
    () => data?.closet_pieces ?? [],
    [data?.closet_pieces],
  );

  const sponsoredPieces = useMemo(
    () => closetPieces.filter((p) => !!p.sponsor),
    [closetPieces],
  );

  // useEffect(() => {
  //   if (closetLoading) {
  //     setLoading((l) => ({
  //       ...l,
  //       pieces: true,
  //       metadata: true,
  //     }));
  //   }
  // }, [closetLoading]);

  const handleChangeRat = useCallback(
    async (select: SingleValue<SelectRat>) => {
      const rat = select?.rat ?? null;
      setLoading((l) => ({ ...l, mirror: true }));
      setCurrentRat(rat);

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
        if (rat) {
          const layers: [string, string][] = [];
          LAYER_ORDER.forEach((layer) => {
            const val = rat[layer as keyof CachedRat] as string;
            if (!!val && !hidePiece[layer]) {
              layers.push([layer, `${val}`.toLowerCase().replace(/ /g, '-')]);
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
    [canvas, closetPieces, hidePiece],
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

  const tryOnClothes = (
    pieceType: keyof GetClosetDataQuery['rats'][0],
    piece: string,
  ) => {
    if (currentRat) {
      if (currentRat[pieceType] === piece) {
        const newCurrentRat = !currentRat
          ? currentRat
          : { ...currentRat, [pieceType]: oldClothes.get(pieceType) };
        setCurrentRat(newCurrentRat);
        handleChangeRat(
          newCurrentRat
            ? {
                label: newCurrentRat.id,
                value: newCurrentRat.id,
                rat: newCurrentRat,
              }
            : null,
        );
      } else {
        // if (piece.startsWith('data:') || closetPieces.find(p => p.name === currentRat[pieceType])) {
        //   const old = new Map(oldClothes);
        //   old.set(pieceType, currentRat[pieceType] ?? 'none');
        //   setOldClothes(old);
        // } else if (
        //   Object.keys(closetPieces).includes(
        //     currentRat[pieceType] ?? '',
        //   )
        // ) {
        //   const old = new Map(oldClothes);
        //   old.set(pieceType, currentRat[pieceType] ?? 'none');
        //   setOldClothes(old);
        // } else {
        // }
        const old = new Map(oldClothes);
        old.set(pieceType, currentRat[pieceType] ?? 'none');
        setOldClothes(old);
        handleChangeRat(
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
