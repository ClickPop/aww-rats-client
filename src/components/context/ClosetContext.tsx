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
  hideBackground: false,
  setHideBackground: () => {},
  cart: {},
  cartDispatch: () => {},
  tryOnClothes: () => {},
  closetPieces: {},
  ownedItems: {},
  setOwnedItems: () => {},
  handleChangeRat: async () => {},
  getBase64Image: async () => {},
  loadedTokens: [],
  setLoadedTokens: () => {},
};

export const ClosetContext = createContext(defaultClosetContext);

export const ClosetContextProvider: FC = ({ children }) => {
  const [canvas, setCanvas] = useState<CombinedCanvasNullable>(null);
  const { signer, contract, signerAddr, closet } = useContext(EthersContext);
  const [signerTokens, setSignerTokens] = useState<BigNumber[]>([]);
  const [ownedItems, setOwnedItems] = useState<
    Record<string, ClosetUserTokenWithMeta>
  >({});
  const [rats, setRats] = useState<Array<SimplifiedMetadata | null>>([]);
  const [currentRat, setCurrentRat] = useState<SimplifiedMetadata | null>(null);
  const [oldClothes, setOldClothes] = useState<Map<string, string>>(new Map());
  const [hideBackground, setHideBackground] = useState(false);
  const [loading, setLoading] = useState<ClosetLoading>({
    tokens: false,
    metadata: false,
    mirror: false,
    pieces: false,
  });
  const [loadedTokens, setLoadedTokens] = useState<string[]>([]);
  const [tokenProgress, setTokenProgress] = useState(0);
  const [cart, cartDispatch] = useReducer(closetCartReducer, {});
  const [closetPieces, setClosetPieces] = useState<
    Record<string, ClosetTokenWithMeta>
  >({});

  const totalClosetPieces = useMemo(
    () => Object.keys(closetPieces).length,
    [closetPieces],
  );

  useEffect(() => {
    (async () => {
      if (signerAddr) {
        try {
          setLoading((l) => ({ ...l, tokens: true }));
          if (contract) {
            const rats = await contract.getTokensByOwner(signerAddr);
            setSignerTokens(rats);
          }
          if (closet) {
            const tokens = await closet.getActiveTokens();
            const tokenObject: Record<string, ClosetTokenWithMeta> = {};
            for (const token of tokens) {
              const meta = (await fetch(`/closet/${token.id}.json`).then((r) =>
                r.json(),
              )) as Metadata;
              const pieceType = meta.attributes.find(
                (a) => a.trait_type === 'Piece Type',
              )?.value;
              tokenObject[token.id.toString()] = { ...token, tokenMeta: meta };
            }
            console.log(tokenObject);
            setClosetPieces(tokenObject);

            const ownedTokens = await closet.getTokensByWallet(signerAddr);
            for (const token of ownedTokens) {
              const id = token.id.toString();
              token.id.toString();
              if (tokenObject[id]) {
                setOwnedItems((o) => ({
                  ...o,
                  [id]: { ...token, tokenMeta: tokenObject[id].tokenMeta },
                }));
              }
            }
          }
        } catch (err) {
          console.error(err);
        }
        setLoading((l) => ({ ...l, tokens: false }));
      }
    })();
  }, [signer, contract, signerAddr, closet]);

  // Get the metadata for those tokens and store them in state
  useEffect(() => {
    (async () => {
      // Get token URI from contract then fetch token metadata from IFPS
      if (Array.isArray(signerTokens)) {
        setLoading((l) => ({ ...l, metadata: true }));
        const tempMetas = [];
        for (const token of signerTokens) {
          const uri = await contract?.tokenURI(token);
          if (!uri?.includes('ipfs')) break;
          const hash = uri?.split('//')[1];
          if (hash) {
            const meta: Metadata = await fetch(
              `https://gateway.pinata.cloud/ipfs/${hash}`,
            ).then((res) => res.json());

            if (meta) {
              tempMetas.push(meta);
            }
          }
        }

        // Set state with slightly simplified metadata
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
      if (canvas) {
        canvas.clear();
        if (rat) {
          const layers: [string, string][] = [];
          rat.properties.forEach((val, key) => {
            if (val !== 'none') {
              layers.push([key, val]);
            }
          });
          for (const [key, val] of layers) {
            if (key !== 'background' || !hideBackground) {
              const img = await new Promise<fabric.Image>((resolve) => {
                fabric.Image.fromURL(
                  val.startsWith('data:')
                    ? val
                    : `${RAT_PIECES_PREFIX}${key}-${val
                        .toLowerCase()
                        .replace(/ /g, '-')}.png`,
                  resolve,
                );
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
    [canvas, hideBackground],
  );

  const calculatePercentage = (n: number, d: number): number => {
    let perc: number = 0;
    if (n >= 0 && d > 0) {
      if (n > d || n === d) {
        perc = 1;
      } else {
        perc = n / d;
      }
    }

    perc = perc >= 0 && perc < 1 ? Math.round(perc * 10000) / 100 : 100;

    return perc;
  };

  const getBase64Image = (file: Blob): Promise<any | Error> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  useEffect(() => {
    if (!currentRat) {
      setLoadedTokens([]);
    }
    handleChangeRat(currentRat);
  }, [hideBackground, currentRat, handleChangeRat]);

  const tryOnClothes = (pieceType: string, piece: string) => {
    if (currentRat) {
      if (
        piece === '##REMOVE##' ||
        currentRat.properties.get(pieceType) === piece
      ) {
        if (!(piece === '##REMOVE##' && !oldClothes.get(pieceType))) {
          currentRat.properties.set(
            pieceType,
            oldClothes.get(pieceType) ?? 'none',
          );
          handleChangeRat(currentRat);
        }
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
        }
        currentRat.properties.set(pieceType, piece);
        handleChangeRat(currentRat);
      }
    }
  };

  useEffect(() => {
    let load = true;
    if (loadedTokens.length >= totalClosetPieces) {
      load = false;
    }
    setLoading((l) => ({ ...l, pieces: load }));

    setTokenProgress(
      calculatePercentage(loadedTokens.length, totalClosetPieces),
    );
  }, [loadedTokens, totalClosetPieces]);

  return (
    <ClosetContext.Provider
      value={{
        canvas,
        setCanvas,
        loading,
        rats,
        signerTokens,
        hideBackground,
        setHideBackground,
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
        loadedTokens,
        setLoadedTokens,
      }}>
      {children}
    </ClosetContext.Provider>
  );
};
