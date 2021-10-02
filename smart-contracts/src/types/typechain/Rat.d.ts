/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface RatInterface extends ethers.utils.Interface {
  functions: {
    "approve(address,uint256)": FunctionFragment;
    "balanceOf(address)": FunctionFragment;
    "burnToken(uint256)": FunctionFragment;
    "burnedTokens(uint256)": FunctionFragment;
    "canMint()": FunctionFragment;
    "contractURI()": FunctionFragment;
    "cost()": FunctionFragment;
    "createToken()": FunctionFragment;
    "defaultMaxTokensPerWallet()": FunctionFragment;
    "defaultTokenURI()": FunctionFragment;
    "erc20()": FunctionFragment;
    "getApproved(uint256)": FunctionFragment;
    "getBurnedTokens()": FunctionFragment;
    "getBurnedTokensByOwner(address)": FunctionFragment;
    "getTokenOwners()": FunctionFragment;
    "getTokensByOwner(address)": FunctionFragment;
    "isApprovedForAll(address,address)": FunctionFragment;
    "maxTokens()": FunctionFragment;
    "maxTokensPerWallet(address)": FunctionFragment;
    "name()": FunctionFragment;
    "numTokens()": FunctionFragment;
    "owner()": FunctionFragment;
    "ownerOf(uint256)": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "safeTransferFrom(address,address,uint256)": FunctionFragment;
    "setApprovalForAll(address,bool)": FunctionFragment;
    "setContractURI(string)": FunctionFragment;
    "setCost(uint256)": FunctionFragment;
    "setERC20Address(address)": FunctionFragment;
    "setMaxTokens(uint32)": FunctionFragment;
    "setMaxTokensPerWallet(address,uint32)": FunctionFragment;
    "setMintingStatus(bool)": FunctionFragment;
    "setWalletBan(address,bool)": FunctionFragment;
    "storeAsset(uint256,string)": FunctionFragment;
    "supportsInterface(bytes4)": FunctionFragment;
    "symbol()": FunctionFragment;
    "tokenOwners(uint256)": FunctionFragment;
    "tokenURI(uint256)": FunctionFragment;
    "transferFrom(address,address,uint256)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "walletBans(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "approve",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "balanceOf", values: [string]): string;
  encodeFunctionData(
    functionFragment: "burnToken",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "burnedTokens",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "canMint", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "contractURI",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "cost", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "createToken",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "defaultMaxTokensPerWallet",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "defaultTokenURI",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "erc20", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "getApproved",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getBurnedTokens",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getBurnedTokensByOwner",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "getTokenOwners",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getTokensByOwner",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "isApprovedForAll",
    values: [string, string]
  ): string;
  encodeFunctionData(functionFragment: "maxTokens", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "maxTokensPerWallet",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(functionFragment: "numTokens", values?: undefined): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "ownerOf",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "safeTransferFrom",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setApprovalForAll",
    values: [string, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "setContractURI",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setCost",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setERC20Address",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setMaxTokens",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setMaxTokensPerWallet",
    values: [string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setMintingStatus",
    values: [boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "setWalletBan",
    values: [string, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "storeAsset",
    values: [BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "tokenOwners",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "tokenURI",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom",
    values: [string, string, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "walletBans", values: [string]): string;

  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "burnToken", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "burnedTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "canMint", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "contractURI",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "cost", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "createToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "defaultMaxTokensPerWallet",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "defaultTokenURI",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "erc20", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getApproved",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getBurnedTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getBurnedTokensByOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTokenOwners",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTokensByOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isApprovedForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "maxTokens", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "maxTokensPerWallet",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "numTokens", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "ownerOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "safeTransferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setApprovalForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setContractURI",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setCost", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setERC20Address",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMaxTokens",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMaxTokensPerWallet",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setMintingStatus",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setWalletBan",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "storeAsset", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "tokenOwners",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "tokenURI", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "walletBans", data: BytesLike): Result;

  events: {
    "Approval(address,address,uint256)": EventFragment;
    "ApprovalForAll(address,address,bool)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "TokenBurned(uint256,address)": EventFragment;
    "TokenMinted(uint256)": EventFragment;
    "TokenTransferred(uint256,address,address,uint256[],uint256[],address[])": EventFragment;
    "Transfer(address,address,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Approval"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "ApprovalForAll"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TokenBurned"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TokenMinted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "TokenTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Transfer"): EventFragment;
}

export class Rat extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: RatInterface;

  functions: {
    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    balanceOf(owner: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    burnToken(
      id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    burnedTokens(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    canMint(overrides?: CallOverrides): Promise<[boolean]>;

    contractURI(overrides?: CallOverrides): Promise<[string]>;

    cost(overrides?: CallOverrides): Promise<[BigNumber]>;

    createToken(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    defaultMaxTokensPerWallet(overrides?: CallOverrides): Promise<[number]>;

    defaultTokenURI(overrides?: CallOverrides): Promise<[string]>;

    erc20(overrides?: CallOverrides): Promise<[string]>;

    getApproved(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    getBurnedTokens(overrides?: CallOverrides): Promise<[BigNumber[]]>;

    getBurnedTokensByOwner(
      user: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;

    getTokenOwners(overrides?: CallOverrides): Promise<[string[]]>;

    getTokensByOwner(
      user: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber[]]>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    maxTokens(overrides?: CallOverrides): Promise<[number]>;

    maxTokensPerWallet(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<[number]>;

    name(overrides?: CallOverrides): Promise<[string]>;

    numTokens(overrides?: CallOverrides): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    ownerOf(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setContractURI(
      newContractURI: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setCost(
      newCost: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setERC20Address(
      newAddr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setMaxTokens(
      newMax: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setMaxTokensPerWallet(
      wallet: string,
      max: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setMintingStatus(
      status: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setWalletBan(
      wallet: string,
      banned: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    storeAsset(
      id: BigNumberish,
      uri: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    symbol(overrides?: CallOverrides): Promise<[string]>;

    tokenOwners(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    tokenURI(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[string]>;

    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    walletBans(arg0: string, overrides?: CallOverrides): Promise<[boolean]>;
  };

  approve(
    to: string,
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  balanceOf(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

  burnToken(
    id: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  burnedTokens(
    arg0: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  canMint(overrides?: CallOverrides): Promise<boolean>;

  contractURI(overrides?: CallOverrides): Promise<string>;

  cost(overrides?: CallOverrides): Promise<BigNumber>;

  createToken(
    overrides?: PayableOverrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  defaultMaxTokensPerWallet(overrides?: CallOverrides): Promise<number>;

  defaultTokenURI(overrides?: CallOverrides): Promise<string>;

  erc20(overrides?: CallOverrides): Promise<string>;

  getApproved(
    tokenId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<string>;

  getBurnedTokens(overrides?: CallOverrides): Promise<BigNumber[]>;

  getBurnedTokensByOwner(
    user: string,
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  getTokenOwners(overrides?: CallOverrides): Promise<string[]>;

  getTokensByOwner(
    user: string,
    overrides?: CallOverrides
  ): Promise<BigNumber[]>;

  isApprovedForAll(
    owner: string,
    operator: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  maxTokens(overrides?: CallOverrides): Promise<number>;

  maxTokensPerWallet(arg0: string, overrides?: CallOverrides): Promise<number>;

  name(overrides?: CallOverrides): Promise<string>;

  numTokens(overrides?: CallOverrides): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  ownerOf(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "safeTransferFrom(address,address,uint256)"(
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "safeTransferFrom(address,address,uint256,bytes)"(
    from: string,
    to: string,
    tokenId: BigNumberish,
    _data: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setApprovalForAll(
    operator: string,
    approved: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setContractURI(
    newContractURI: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setCost(
    newCost: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setERC20Address(
    newAddr: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setMaxTokens(
    newMax: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setMaxTokensPerWallet(
    wallet: string,
    max: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setMintingStatus(
    status: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setWalletBan(
    wallet: string,
    banned: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  storeAsset(
    id: BigNumberish,
    uri: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  supportsInterface(
    interfaceId: BytesLike,
    overrides?: CallOverrides
  ): Promise<boolean>;

  symbol(overrides?: CallOverrides): Promise<string>;

  tokenOwners(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

  tokenURI(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

  transferFrom(
    from: string,
    to: string,
    tokenId: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  walletBans(arg0: string, overrides?: CallOverrides): Promise<boolean>;

  callStatic: {
    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    balanceOf(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

    burnToken(id: BigNumberish, overrides?: CallOverrides): Promise<void>;

    burnedTokens(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    canMint(overrides?: CallOverrides): Promise<boolean>;

    contractURI(overrides?: CallOverrides): Promise<string>;

    cost(overrides?: CallOverrides): Promise<BigNumber>;

    createToken(overrides?: CallOverrides): Promise<void>;

    defaultMaxTokensPerWallet(overrides?: CallOverrides): Promise<number>;

    defaultTokenURI(overrides?: CallOverrides): Promise<string>;

    erc20(overrides?: CallOverrides): Promise<string>;

    getApproved(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<string>;

    getBurnedTokens(overrides?: CallOverrides): Promise<BigNumber[]>;

    getBurnedTokensByOwner(
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    getTokenOwners(overrides?: CallOverrides): Promise<string[]>;

    getTokensByOwner(
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber[]>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    maxTokens(overrides?: CallOverrides): Promise<number>;

    maxTokensPerWallet(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<number>;

    name(overrides?: CallOverrides): Promise<string>;

    numTokens(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    ownerOf(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      _data: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    setContractURI(
      newContractURI: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setCost(newCost: BigNumberish, overrides?: CallOverrides): Promise<void>;

    setERC20Address(newAddr: string, overrides?: CallOverrides): Promise<void>;

    setMaxTokens(
      newMax: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setMaxTokensPerWallet(
      wallet: string,
      max: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setMintingStatus(status: boolean, overrides?: CallOverrides): Promise<void>;

    setWalletBan(
      wallet: string,
      banned: boolean,
      overrides?: CallOverrides
    ): Promise<void>;

    storeAsset(
      id: BigNumberish,
      uri: string,
      overrides?: CallOverrides
    ): Promise<void>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<boolean>;

    symbol(overrides?: CallOverrides): Promise<string>;

    tokenOwners(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

    tokenURI(tokenId: BigNumberish, overrides?: CallOverrides): Promise<string>;

    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;

    walletBans(arg0: string, overrides?: CallOverrides): Promise<boolean>;
  };

  filters: {
    Approval(
      owner?: string | null,
      approved?: string | null,
      tokenId?: BigNumberish | null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { owner: string; approved: string; tokenId: BigNumber }
    >;

    ApprovalForAll(
      owner?: string | null,
      operator?: string | null,
      approved?: null
    ): TypedEventFilter<
      [string, string, boolean],
      { owner: string; operator: string; approved: boolean }
    >;

    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    TokenBurned(
      tokenId?: null,
      tokenOwner?: null
    ): TypedEventFilter<
      [BigNumber, string],
      { tokenId: BigNumber; tokenOwner: string }
    >;

    TokenMinted(
      tokenId?: null
    ): TypedEventFilter<[BigNumber], { tokenId: BigNumber }>;

    TokenTransferred(
      tokenId?: null,
      newOwner?: null,
      oldOwner?: null,
      newOwnerTokens?: null,
      oldOwnerTokens?: null,
      tokenOwners?: null
    ): TypedEventFilter<
      [BigNumber, string, string, BigNumber[], BigNumber[], string[]],
      {
        tokenId: BigNumber;
        newOwner: string;
        oldOwner: string;
        newOwnerTokens: BigNumber[];
        oldOwnerTokens: BigNumber[];
        tokenOwners: string[];
      }
    >;

    Transfer(
      from?: string | null,
      to?: string | null,
      tokenId?: BigNumberish | null
    ): TypedEventFilter<
      [string, string, BigNumber],
      { from: string; to: string; tokenId: BigNumber }
    >;
  };

  estimateGas: {
    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    balanceOf(owner: string, overrides?: CallOverrides): Promise<BigNumber>;

    burnToken(
      id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    burnedTokens(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    canMint(overrides?: CallOverrides): Promise<BigNumber>;

    contractURI(overrides?: CallOverrides): Promise<BigNumber>;

    cost(overrides?: CallOverrides): Promise<BigNumber>;

    createToken(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    defaultMaxTokensPerWallet(overrides?: CallOverrides): Promise<BigNumber>;

    defaultTokenURI(overrides?: CallOverrides): Promise<BigNumber>;

    erc20(overrides?: CallOverrides): Promise<BigNumber>;

    getApproved(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getBurnedTokens(overrides?: CallOverrides): Promise<BigNumber>;

    getBurnedTokensByOwner(
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getTokenOwners(overrides?: CallOverrides): Promise<BigNumber>;

    getTokensByOwner(
      user: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    maxTokens(overrides?: CallOverrides): Promise<BigNumber>;

    maxTokensPerWallet(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    name(overrides?: CallOverrides): Promise<BigNumber>;

    numTokens(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    ownerOf(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setContractURI(
      newContractURI: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setCost(
      newCost: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setERC20Address(
      newAddr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setMaxTokens(
      newMax: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setMaxTokensPerWallet(
      wallet: string,
      max: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setMintingStatus(
      status: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setWalletBan(
      wallet: string,
      banned: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    storeAsset(
      id: BigNumberish,
      uri: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    symbol(overrides?: CallOverrides): Promise<BigNumber>;

    tokenOwners(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    tokenURI(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    walletBans(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    approve(
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    balanceOf(
      owner: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    burnToken(
      id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    burnedTokens(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    canMint(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    contractURI(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    cost(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    createToken(
      overrides?: PayableOverrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    defaultMaxTokensPerWallet(
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    defaultTokenURI(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    erc20(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getApproved(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getBurnedTokens(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getBurnedTokensByOwner(
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getTokenOwners(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getTokensByOwner(
      user: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    isApprovedForAll(
      owner: string,
      operator: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    maxTokens(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    maxTokensPerWallet(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    name(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    numTokens(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    ownerOf(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "safeTransferFrom(address,address,uint256)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "safeTransferFrom(address,address,uint256,bytes)"(
      from: string,
      to: string,
      tokenId: BigNumberish,
      _data: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setApprovalForAll(
      operator: string,
      approved: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setContractURI(
      newContractURI: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setCost(
      newCost: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setERC20Address(
      newAddr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setMaxTokens(
      newMax: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setMaxTokensPerWallet(
      wallet: string,
      max: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setMintingStatus(
      status: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setWalletBan(
      wallet: string,
      banned: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    storeAsset(
      id: BigNumberish,
      uri: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    supportsInterface(
      interfaceId: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    tokenOwners(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    tokenURI(
      tokenId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    transferFrom(
      from: string,
      to: string,
      tokenId: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    walletBans(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
