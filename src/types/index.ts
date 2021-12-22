import { JsonRpcSigner } from '@ethersproject/providers/lib/json-rpc-provider';
import { BigNumber, providers } from 'ethers';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { Rat, Closet } from 'smart-contracts/src/types/index';
import { SetStateAction } from 'react-transition-group/node_modules/@types/react';
import { ICanvasOptions } from 'fabric/fabric-impl';
import { Dispatch } from 'react';
import { SingleValue } from 'react-select';

export * from 'smart-contracts/src/types';

export type UseEthersHook = () => EthersState;

export type EthersState = {
  provider?: Web3Provider;
  signer?: JsonRpcSigner;
  network?: providers.Network;
  connected?: boolean;
  account?: string;
};

export type LOADING_STATE =
  | 'INITIAL'
  | 'APPROVAL'
  | 'TOKEN'
  | 'GENERATOR'
  | 'METADATA'
  | null;

export type GeneratorResponse = {
  status: 'success' | 'error';
  error?: unknown;
  data?: GeneratorSuccessData;
};

type GeneratorSuccessData = {
  status: string;
  tokenId: string;
  tokenUri: string;
  txHash: string;
};

export type Metadata = {
  image: string;
  name: string;
  description: string;
  attributes: OpenSeaAttribute[];
};

export type OpenSeaAttribute = {
  trait_type?: string;
  display_type?:
    | 'string'
    | 'number'
    | 'boost_percentage'
    | 'boost_number'
    | 'date';
  value: string | number;
  max_value?: number;
};

export interface EthersContextType extends EthersState {
  contract?: Rat;
  closet?: Closet;
  connectToMetamask: () => void;
  signerAddr?: string;
}

export interface ClosetContextType {
  canvas: CombinedCanvasNullable;
  setCanvas: Dispatch<SetStateAction<CombinedCanvasNullable>>;
  loading: ClosetLoading;
  tokenProgress: number;
  signerTokens: BigNumber[];
  rats: Array<SimplifiedMetadata | null>;
  currentRat: SimplifiedMetadata | null;
  hidePiece: Record<string, boolean>;
  setHidePiece: Dispatch<SetStateAction<Record<string, boolean>>>;
  cart: ClosetCartState;
  cartDispatch: Dispatch<ClosetCartAction>;
  tryOnClothes: (pieceType: string, piece: string) => void;
  closetPieces: Record<string, ClosetTokenWithMeta>;
  sponsoredPieces: Record<string, ClosetTokenWithMeta>;
  ownedItems: Record<string, ClosetUserTokenWithMeta>;
  setOwnedItems: Dispatch<
    SetStateAction<Record<string, ClosetUserTokenWithMeta>>
  >;
  handleChangeRat: (
    rat: SingleValue<SimplifiedMetadata | null>,
  ) => Promise<void>;
  getBase64Image: (file: Blob) => Promise<any | Error>;
  loadedTokenImages: string[];
  setLoadedTokenImages: Dispatch<SetStateAction<string[]>>;
  tokenCounts: {
    minted: Record<string, BigNumber>;
    owned: Record<string, BigNumber>;
  };
  setTokenCounts: Dispatch<
    SetStateAction<{
      minted: Record<string, BigNumber>;
      owned: Record<string, BigNumber>;
    }>
  >;
}

export type CombinedCanvas = fabric.StaticCanvas | fabric.Canvas;

export type CombinedCanvasNullable = CombinedCanvas | null;

export type CanvasOpts = {
  canvasType: 'Canvas' | 'StaticCanvas';
  element: string | HTMLCanvasElement | null;
  canvasOptions?: ICanvasOptions;
  scaledSize?: {
    height?: number;
    width?: number;
  };
  onMount?: (canvas: CombinedCanvas) => void;
};

export type MoralisTokensResponse = {
  status: string;
  total: number;
  page: number;
  page_size: number;
  result: MoralisTokenMeta[];
};

interface BaseMoralisMeta {
  token_address: string;
  token_id: string;
  name: string;
  symbol: string;
  contract_type: string;
  token_uri?: string;
  synced_at?: string;
  amount?: string;
}

export interface MoralisTokenMeta extends BaseMoralisMeta {
  metadata?: string;
}

export interface ParsedMoralisTokenMeta extends BaseMoralisMeta {
  metadata: {
    image: string;
    [key: string]: unknown;
  };
}

export interface ReactSelectOption {
  label: string;
  value: string;
}

export interface SimplifiedMetadata {
  label: string;
  value: string;
  properties: Map<string, string>;
}

export interface ClosetLoading {
  tokens: boolean;
  metadata: boolean;
  mirror: boolean;
  pieces: boolean;
}

export type ClosetCartItem = {
  id: BigNumber;
  amount: BigNumber;
};

export type ClosetCartState = Record<string, BigNumber>;

export type ClosetCartAction =
  | { type: 'addItem'; payload: ClosetCartItem }
  | { type: 'changeAmount'; payload: ClosetCartItem }
  | { type: 'clearCart' };

export type ClosetToken = {
  name: string;
  cost: BigNumber;
  maxTokens: BigNumber;
  maxPerWallet: BigNumber;
  active: boolean;
  revShareAddress: string;
  revShareAmount: [BigNumber, BigNumber];
};

export type ClosetTokenWithId = {
  id: BigNumber;
  token: ClosetToken;
};

export interface ClosetUserToken extends ClosetTokenWithId {
  amount: BigNumber;
}

export interface ClosetTokenWithMeta extends ClosetTokenWithId {
  tokenMeta: Metadata;
}

export interface ClosetUserTokenWithMeta extends ClosetUserToken {
  tokenMeta: Metadata;
}
