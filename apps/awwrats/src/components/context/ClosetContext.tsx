import {
  createContext,
  FC,
  useCallback,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import {
  ClosetContextType,
  CombinedCanvasNullable,
  PieceTypeUnion,
  RatToken,
  SelectRat,
} from '~/types';
import {
  RAT_CLOSET_PLACEHOLDER,
  LAYER_ORDER,
  RAT_PIECES_PREFIX,
} from '~/config/env';
import { fabric } from 'fabric';
import { SingleValue } from 'react-select';
import { closetCartReducer } from '~/reducers/closetCart';
import { ContractsContext } from '~/components/context/ContractsContext';
import { useSignerAddress } from 'common/hooks/useSignerAddress';
import { useLoadCloset } from '~/hooks/useLoadCloset';
import { useLoadRats } from '~/hooks/useLoadRats';

const defaultClosetContext: ClosetContextType = {
  canvas: null,
  setCanvas: () => {},
  loading: {
    rats: false,
    closet: false,
    mirror: false,
  },
  rats: [],
  currentRat: null,
  hidePiece: {},
  setHidePiece: () => {},
  cart: {},
  cartDispatch: () => {},
  tryOnClothes: () => {},
  closetPieces: new Map(),
  handleChangeRat: async () => {},
  getBase64Image: async () => {},
};

export const ClosetContext = createContext(defaultClosetContext);
export const ClosetContextProvider: FC = ({ children }) => {
  const [canvas, setCanvas] = useState<CombinedCanvasNullable>(null);
  const signerAddr = useSignerAddress();
  const { closet, rat } = useContext(ContractsContext);
  const [currentRat, setCurrentRat] = useState<RatToken | null>(null);
  const [oldClothes, setOldClothes] = useState<Map<string, string>>(new Map());
  const [hidePiece, setHidePiece] = useState<Record<string, boolean>>({});
  const [mirrorLoading, setMirrorLoading] = useState(false);
  const [cart, cartDispatch] = useReducer(closetCartReducer, {});

  const { closetPieces, closetLoading } = useLoadCloset();
  const { rats, ratsLoading } = useLoadRats();

  const handleChangeRat = useCallback(
    async (select: SingleValue<SelectRat>) => {
      const selectedRat = select?.rat ?? null;
      setMirrorLoading(true);
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

        const piece = closetPieces.get(key)?.get(val);
        if (!!piece) {
          return piece.meta.image;
        }
        return `${RAT_PIECES_PREFIX}${key}-${val}.png`;
      };
      if (canvas) {
        canvas.clear();
        if (selectedRat) {
          const layers: [string, string][] = [];
          LAYER_ORDER.forEach((layer) => {
            const val = (selectedRat[layer as keyof RatToken] as string) ?? '';
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
      setTimeout(() => setMirrorLoading(false), 300);
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

  const tryOnClothes = async (pieceType: PieceTypeUnion, piece: string) => {
    setMirrorLoading(true);
    if (currentRat && signerAddr && closet) {
      const closetPiece = closetPieces.get(pieceType)?.get(piece);
      if (closetPiece) {
        const ownedAmount = await closet.balanceOf(signerAddr, closetPiece.id);
        if (ownedAmount.gt(0)) {
          if (currentRat[pieceType] === piece) {
            const ratDefaults = rats.find((rat) => rat.id === currentRat.id);
            const newCurrentRat = {
              ...currentRat,
              [pieceType]: ratDefaults?.[pieceType] ?? 'none',
            };
            setCurrentRat(newCurrentRat);
            await handleChangeRat({
              label: newCurrentRat.id,
              value: newCurrentRat.id,
              rat: newCurrentRat,
            });
          } else {
            oldClothes.set(pieceType, currentRat[pieceType] ?? 'none');
            setOldClothes(oldClothes);
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
        oldClothes.set(pieceType, currentRat[pieceType] ?? 'none');
        setOldClothes(oldClothes);
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
      setMirrorLoading(false);
    }
  };

  return (
    <ClosetContext.Provider
      value={{
        canvas,
        setCanvas,
        loading: {
          closet: closetLoading,
          rats: ratsLoading,
          mirror: mirrorLoading,
        },
        rats,
        hidePiece,
        setHidePiece,
        currentRat,
        cart,
        cartDispatch,
        closetPieces,
        handleChangeRat,
        getBase64Image,
        tryOnClothes,
      }}>
      {children}
    </ClosetContext.Provider>
  );
};
