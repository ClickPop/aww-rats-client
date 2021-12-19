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
  ClosetLoading,
  ClosetTokenWithMeta,
  ClosetUserTokenWithMeta,
  CombinedCanvasNullable,
  Metadata,
  SimplifiedMetadata,
} from '~/types';
import {
  RAT_CLOSET_PLACEHOLDER,
  LAYER_HAS_BASE,
  LAYER_ORDER,
  RAT_PIECES_PREFIX,
} from '~/config/env';
import { BigNumber } from 'ethers';
import { fabric } from 'fabric';
import { SingleValue } from 'react-select';
import { EthersContext } from '~/components/context/EthersContext';
import { closetCartReducer } from '~/reducers/closetCart';
import { calculatePercentage } from '~/utils/calculatePercentage';

const defaultClosetContext: ClosetContextType = {
  canvas: null,
  setCanvas: () => {},
  tokenProgress: 0,
  loading: {
    metadata: false,
    mirror: false,
    pieces: false,
    tokens: false,
  },
  signerTokens: [],
  rats: [],
  currentRat: null,
  hidePiece: {},
  setHidePiece: () => {},
  cart: {},
  cartDispatch: () => {},
  tryOnClothes: () => {},
  closetPieces: {},
  ownedItems: {},
  setOwnedItems: () => {},
  handleChangeRat: async () => {},
  getBase64Image: async () => {},
  loadedTokenImages: [],
  setLoadedTokenImages: () => {},
  tokenCounts: { minted: {}, owned: {} },
  setTokenCounts: () => {},
  sponsoredPieces: {},
};

export const ClosetContext = createContext(defaultClosetContext);

export const ClosetContextProvider: FC = ({ children }) => {
  const [canvas, setCanvas] = useState<CombinedCanvasNullable>(null);
  const { contract, signerAddr, closet } = useContext(EthersContext);
  const [signerTokens, setSignerTokens] = useState<BigNumber[]>([]);
  const [ownedItems, setOwnedItems] = useState<
    Record<string, ClosetUserTokenWithMeta>
  >({});
  const [rats, setRats] = useState<Array<SimplifiedMetadata | null>>([]);
  const [currentRat, setCurrentRat] = useState<SimplifiedMetadata | null>(null);
  const [oldClothes, setOldClothes] = useState<Map<string, string>>(new Map());
  const [hidePiece, setHidePiece] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<ClosetLoading>({
    tokens: false,
    metadata: false,
    mirror: false,
    pieces: false,
  });
  const [loadedTokenImages, setLoadedTokenImages] = useState<string[]>([]);
  const [loadedTokens, setLoadedTokens] = useState<string[]>([]);
  const [tokenProgress, setTokenProgress] = useState(0);
  const [cart, cartDispatch] = useReducer(closetCartReducer, {});
  const [closetPieces, setClosetPieces] = useState<
    Record<string, ClosetTokenWithMeta>
  >({});
  const [sponsoredPieces, setSponsoredPieces] = useState<
    Record<string, ClosetTokenWithMeta>
  >({});
  const [totalClosetPieces, setTotalClosetPieces] = useState(0);
  const [tokenCounts, setTokenCounts] = useState<{
    minted: Record<string, BigNumber>;
    owned: Record<string, BigNumber>;
  }>({ minted: {}, owned: {} });

  useEffect(() => {
    (async () => {
      if (signerAddr) {
        try {
          setLoading((l) => ({ ...l, tokens: true }));
          if (contract) {
            const ratTokens = await contract.getTokensByOwner(signerAddr);
            setSignerTokens(ratTokens);
          }
          setLoading((l) => ({ ...l, tokens: false }));
        } catch (err) {
          console.error(err);
          setLoading((l) => ({ ...l, tokens: false }));
        }
      }
    })();
  }, [contract, signerAddr]);

  useEffect(() => {
    (async () => {
      if (closet && signerAddr) {
        try {
          const closetTokens = await closet.getActiveTokens();
          const ownedTokens = await closet.getTokensByWallet(signerAddr);
          const tokens = [...closetTokens, ...ownedTokens].reduce(
            (
              acc,
              curr: {
                id: BigNumber;
                amount?: BigNumber;
                token: typeof closetTokens[0]['token'];
              },
            ) => {
              const idx = acc.findIndex((t) => t.id.eq(curr.id));
              if (curr.id.gt(0)) {
                if (idx !== -1) {
                  const newAcc = [...acc];
                  newAcc[idx] = {
                    id: curr.id,
                    amount: curr.amount,
                    token: curr.token,
                  };
                  return newAcc;
                }
                return [
                  ...acc,
                  { id: curr.id, amount: curr.amount, token: curr.token },
                ];
              }
              return acc;
            },
            [] as {
              id: BigNumber;
              amount?: BigNumber;
              token: typeof closetTokens[0]['token'];
            }[],
          );
          // console.log(tokens);
          setTotalClosetPieces(tokens.length);
          const uri = await closet.uri(1);
          const tokenObject: Record<string, ClosetTokenWithMeta> = {};
          for (const token of tokens) {
            try {
              const id = token.id.toString();
              const total = await closet.totalSupply(token.id);
              const bal = await closet.balanceOf(signerAddr, token.id);
              setTokenCounts((c) => ({
                minted: { ...c.minted, [id]: total },
                owned: { ...c.owned, [id]: bal },
              }));
              const meta = (await fetch(uri.replace('{id}', id)).then((r) =>
                r.json(),
              )) as Metadata;
              tokenObject[id] = { ...token, tokenMeta: meta };
              setLoadedTokens((l) => [...l, id]);
              if (meta.attributes.find((a) => a.trait_type === 'Sponsor')) {
                setSponsoredPieces((p) => ({
                  ...p,
                  [id]: { ...token, tokenMeta: meta },
                }));
              }
              if (token.amount) {
                setOwnedItems((o) => ({
                  ...o,
                  [id]: {
                    ...token,
                    tokenMeta: meta,
                  } as ClosetUserTokenWithMeta,
                }));
              }
            } catch (err) {
              console.error(err);
            }
          }

          setClosetPieces(tokenObject);
        } catch (err) {
          console.error(err);
        }
      }
    })();
  }, [closet, signerAddr]);

  // Get the metadata for those tokens and store them in state
  useEffect(() => {
    const getToken = async (token: BigNumber) => {
      const uri = await contract?.tokenURI(token);
      if (!uri?.includes('ipfs')) return null;
      const hash = uri?.split('//')[1];
      if (hash) {
        const meta: Metadata = await fetch(
          `https://gateway.pinata.cloud/ipfs/${hash}`,
        ).then((res) => res.json());

        if (meta) {
          return meta;
        }
      }
      return null;
    };

    (async () => {
      // Get token URI from contract then fetch token metadata from IFPS
      if (Array.isArray(signerTokens)) {
        setLoading((l) => ({ ...l, metadata: true }));
        const tempMetas = [];
        for (const token of signerTokens) {
          const t = await getToken(token);
          if (t) {
            tempMetas.push(t);
          }
        }

        setRats(
          tempMetas.map((rat) => ({
            label: rat.name,
            value: rat.image.replace(
              'ipfs://',
              'https://gateway.pinata.cloud/ipfs/',
            ),
            // We use a Map here to retain the correct order for layering assets
            properties: new Map(
              LAYER_ORDER.map((layer) => {
                const attribute = rat.attributes.find(
                  (attr) =>
                    attr.trait_type &&
                    attr.trait_type.toLowerCase() === layer.toLowerCase(),
                );
                let val = LAYER_HAS_BASE.includes(layer) ? 'base' : 'none';
                if (attribute && typeof attribute.value === 'string') {
                  val = attribute.value.replace(/\s|\%20/gi, '-').toLowerCase();
                }
                return [layer, val];
              }),
            ),
          })),
        );
        setLoading((l) => ({ ...l, metadata: false }));
      }
    })();
  }, [contract, signerTokens]);

  const handleChangeRat = useCallback(
    async (rat: SingleValue<SimplifiedMetadata | null>) => {
      setLoading((l) => ({ ...l, mirror: true }));
      setCurrentRat(rat);

      const getImageURL = (key: string, val: string): string => {
        if (val.startsWith('data:')) {
          return val;
        }

        if (ownedItems[val]) {
          return ownedItems[val].tokenMeta.image;
        }
        return `${RAT_PIECES_PREFIX}${key}-${val}.png`;
      };
      if (canvas) {
        canvas.clear();
        if (rat) {
          const layers: [string, string][] = [];
          rat.properties.forEach((val, key) => {
            if (val !== 'none' && !hidePiece[key]) {
              layers.push([key, val]);
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
    [canvas, hidePiece, ownedItems],
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
    handleChangeRat(currentRat);
    // In this case the handleChangeRat method is causing needless re-renders, but the linter warns if it's not there
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRat, hidePiece]);

  const tryOnClothes = (pieceType: string, piece: string) => {
    if (currentRat) {
      if (currentRat.properties.get(pieceType) === piece) {
        const rat = rats.find((r) => r?.value === currentRat.value);
        currentRat.properties.set(
          pieceType,
          rat?.properties.get(pieceType) ?? 'none',
        );
        handleChangeRat(currentRat);
      } else {
        if (piece.startsWith('data:')) {
          const old = new Map(oldClothes);
          old.set(pieceType, currentRat.properties.get(pieceType) ?? 'none');
          setOldClothes(old);
        } else if (
          Object.keys(closetPieces).includes(
            currentRat.properties.get(pieceType) ?? '',
          )
        ) {
          const old = new Map(oldClothes);
          old.set(pieceType, currentRat.properties.get(pieceType) ?? 'none');
          setOldClothes(old);
        } else {
          const old = new Map(oldClothes);
          old.set(pieceType, currentRat.properties.get(pieceType) ?? 'none');
          setOldClothes(old);
        }
        const newClothes = new Map(currentRat.properties).set(pieceType, piece);
        handleChangeRat({ ...currentRat, properties: newClothes });
      }
    }
  };

  useEffect(() => {
    setLoading((l) => ({
      ...l,
      pieces:
        loadedTokens.length + loadedTokenImages.length < totalClosetPieces * 2,
    }));

    setTokenProgress(
      calculatePercentage(
        loadedTokens.length + loadedTokenImages.length,
        totalClosetPieces * 2,
      ),
    );
  }, [loadedTokenImages.length, loadedTokens.length, totalClosetPieces]);

  return (
    <ClosetContext.Provider
      value={{
        canvas,
        setCanvas,
        loading,
        rats,
        signerTokens,
        hidePiece,
        setHidePiece,
        currentRat,
        tokenProgress,
        cart,
        cartDispatch,
        tryOnClothes,
        closetPieces,
        ownedItems,
        setOwnedItems,
        handleChangeRat,
        getBase64Image,
        tokenCounts,
        setTokenCounts,
        loadedTokenImages,
        setLoadedTokenImages,
        sponsoredPieces,
      }}>
      {children}
    </ClosetContext.Provider>
  );
};
