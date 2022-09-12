import { BigNumber, BigNumberish } from 'ethers';
import { Rat, Closet } from 'smart-contracts/src/types/index';
import { ICanvasOptions } from 'fabric/fabric-impl';
import { Dispatch, SetStateAction } from 'react';
import { SingleValue } from 'react-select';
import {
  GetClosetDataSubscription,
  GetRatsSubscription,
} from '~/schema/generated';
import { UserTokenStructOutput } from 'smart-contracts/src/types/typechain/src/contracts/Closet';
export * from '~/types/game';

export interface ReducerAction {
  type: string;
  payload?: unknown;
}

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

export interface Metadata extends Record<string, unknown> {
  image: string;
  name: string;
  description: string;
  attributes: OpenSeaAttribute[];
}

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

export type RatWithMeta = {
  id: BigNumberish;
  meta: Metadata;
};

export interface EthersContextType {
  contract?: Rat;
  closet?: Closet;
  signerAddr?: string;
  isLoggedIn: boolean;
  isLoggedInBacktalk: boolean;
  setLoggedIn: Dispatch<SetStateAction<boolean>>;
  setLoggedInBacktalk: Dispatch<SetStateAction<boolean>>;
  authLoading: boolean;
  backtalkAuthLoading: boolean;
}

export interface ClosetContextType {
  canvas: CombinedCanvasNullable;
  setCanvas: Dispatch<SetStateAction<CombinedCanvasNullable>>;
  loading: ClosetLoading;
  rats: Array<RatToken>;
  currentRat: RatToken | null;
  hidePiece: Record<string, boolean>;
  setHidePiece: Dispatch<SetStateAction<Record<string, boolean>>>;
  cart: ClosetCartState;
  cartDispatch: Dispatch<ClosetCartAction>;
  tryOnClothes: (pieceType: PieceTypeUnion, piece: string) => void;
  closetPieces: Map<string, Map<string, ClosetTokenWithMeta>>;
  handleChangeRat: (rat: SingleValue<SelectRat>) => Promise<void>;
  getBase64Image: (file: Blob) => Promise<any | Error>;
  itemMinted: (pieceType: string, piece: string) => void;
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
  rats: boolean;
  closet: boolean;
  mirror: boolean;
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

export enum FilterShowEnum {
  All = 'all',
  Owned = 'owned',
  Unowned = 'unowned',
}

export enum FilterTypeEnum {
  All = 'all',
  Background = 'background',
  Tail = 'tail',
  Ears = 'ears',
  Pet = 'pet',
  Hand = 'hand',
  Color = 'color',
  Markings = 'markings',
  Head = 'head',
  Generation = 'generation',
  Snout = 'snout',
  Torso = 'torso',
  Shirt = 'shirt',
  Eyes = 'eyes',
  Glasses = 'glasses',
  Accessory = 'accessory',
  Hat = 'hat',
}

export type PieceTypeUnion =
  | 'background'
  | 'tail'
  | 'ears'
  | 'pet'
  | 'hand'
  | 'color'
  | 'markings'
  | 'generation'
  | 'snout'
  | 'torso'
  | 'shirt'
  | 'eyes'
  | 'glasses'
  | 'hat';

export type PieceTypes = Exclude<FilterTypeEnum, typeof FilterTypeEnum.All>;

export type RattributeUnion = 'cuteness' | 'cunning' | 'rattitude';
export type ClosetTokenWithMeta = UserTokenStructOutput &
  Record<RattributeUnion, number | undefined> &
  Pick<Metadata, 'name' | 'image' | 'description'> & {
    piece_type: PieceTypeUnion;
    minted: BigNumber;
    sponsor?: string;
    sponsor_url?: string;
    collection?: string;
  };

export type RatToken = Pick<Metadata, 'name' | 'image' | 'description'> & {
  id: string;
} & Record<PieceTypeUnion, string | undefined> &
  Record<RattributeUnion, number>;

export type SelectRat = {
  label: string;
  value: string;
  rat: RatToken;
};

export interface NetworkSwitchError {
  state: string;
  message: string;
  error?: any;
}

export interface ChainCurrency {
  name: string;
  symbol: string;
  decimals: number;
}
export interface ChainData {
  id: number;
  name: string;
  nativeCurrency: ChainCurrency | null;
  rpc: string[] | string;
  scan: string[] | string;
}
