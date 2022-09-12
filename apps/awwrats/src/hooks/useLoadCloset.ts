import { useSignerAddress } from 'common/hooks/useSignerAddress';
import { BigNumber } from 'ethers';
import { useContext, useEffect, useState } from 'react';
import {
  TokenStructOutput,
  TokenWithIdStructOutput,
  UserTokenStructOutput,
} from 'smart-contracts/src/types/typechain/src/contracts/Closet';
import { ContractsContext } from '~/components/context/ContractsContext';
import { ClosetTokenWithMeta, Metadata } from '~/types';

const isToken = (arg: any): arg is TokenStructOutput =>
  typeof arg === 'object' &&
  typeof arg.name === 'string' &&
  BigNumber.isBigNumber(arg.cost) &&
  BigNumber.isBigNumber(arg.maxTokens) &&
  BigNumber.isBigNumber(arg.maxPerWallet) &&
  typeof arg.active === 'boolean' &&
  typeof arg.revShareAddress === 'string' &&
  Array.isArray(arg.revShareAmount) &&
  arg.revShareAmount.every((e: unknown) => BigNumber.isBigNumber(e));

const isActiveToken = (arg: any): arg is TokenWithIdStructOutput =>
  typeof arg === 'object' &&
  BigNumber.isBigNumber(arg.id) &&
  isToken(arg.token) &&
  !arg.amount;

export const useLoadCloset = () => {
  const signerAddr = useSignerAddress();
  const { closet } = useContext(ContractsContext);
  const [closetPieces, setClosetPieces] = useState<
    Map<string, Map<string, ClosetTokenWithMeta>>
  >(new Map());
  const [closetLoaded, setClosetLoaded] = useState(false);
  const [closetLoading, setClosetLoading] = useState(false);
  const [closetError, setClosetError] = useState<Error | null>(null);

  const itemMinted = (pieceType: string, piece: string) => {
    setClosetPieces((curr) => {
      const token = curr.get(pieceType)?.get(piece);
      console.log(pieceType, piece, token, curr);
      if (!!token) {
        token.amount = token.amount.add(1);
        token[1] = token[1].add(1);
        token.minted = token.minted.add(1);
        curr.get(pieceType)?.set(piece, token);
        if (curr.get('sponsored')?.has(piece)) {
          curr.get('sponsored')?.set(piece, token);
        }
      }
      return new Map(curr);
    });
  };

  useEffect(() => {
    const loadCloset = async () => {
      setClosetLoading(true);
      try {
        if (!closetLoaded && closet && signerAddr) {
          const owner = await closet.owner();
          const activeTokens = await closet.getActiveTokens();
          const userTokens = await closet.getTokensByWallet(signerAddr);
          const allTokens = [...activeTokens, ...userTokens];
          const tokenIds = Array.from(
            new Set(allTokens.map((t) => t.id.toString())),
          );
          const mintedPromises = tokenIds.map((id) =>
            closet
              .totalSupply(id)
              .then<[string, BigNumber]>((supply) => [id, supply]),
          );
          const minted = await Promise.all(mintedPromises).then((data) =>
            data.reduce((prev, curr) => {
              prev.set(curr[0], curr[1]);
              return prev;
            }, new Map<string, BigNumber>()),
          );
          const tokenMap = allTokens.reduce((prev, curr) => {
            const tmp = {} as UserTokenStructOutput;
            Object.assign(tmp, curr);
            if (isActiveToken(curr)) {
              tmp.amount = BigNumber.from(0);
              tmp[1] = BigNumber.from(0);
              tmp[2] = curr[1];
            }
            prev.set(tmp.id.toString(), tmp);
            return prev;
          }, new Map<string, UserTokenStructOutput>());
          const promises = tokenIds
            .filter((id) => Number(id) > 0)
            .map((id) =>
              fetch(`/closet/tokens/${id}.json`)
                .then((res) => res.json() as Promise<Metadata>)
                .then((meta) => {
                  const token = tokenMap.get(id);
                  let tmp = {} as ClosetTokenWithMeta;
                  Object.assign(tmp, token);
                  if (!!token) {
                    tmp.minted = minted.get(id) ?? BigNumber.from(0);
                    tmp.name = meta.name;
                    tmp.image = meta.image;
                    tmp.description = meta.description;
                    meta.attributes.forEach((a) => {
                      if (a.trait_type) {
                        //HACK: I am not sure why it considers the value type of this key to be `never`
                        //@ts-ignore
                        tmp[
                          a.trait_type
                            .toLowerCase()
                            .replaceAll(' ', '_') as keyof ClosetTokenWithMeta
                        ] = a.value;
                      }
                    });
                  }
                  return tmp ?? null;
                }),
            );
          const meta = await Promise.all(promises).then((meta) =>
            meta
              .filter((m) => m !== null)
              .reduce((prev, curr) => {
                if (!!curr) {
                  const pieceType = curr.piece_type;
                  if (typeof pieceType === 'string') {
                    if (prev.has(pieceType)) {
                      prev.get(pieceType)?.set(curr.id.toString(), curr);
                    } else {
                      prev.set(
                        pieceType,
                        new Map([[curr.id.toString(), curr]]),
                      );
                    }

                    if (
                      curr.token.revShareAddress !== owner &&
                      curr.token.revShareAddress !==
                        '0x38882F37879aE3d53100F90651Df448960dB4975'
                    ) {
                      if (prev.has('sponsored')) {
                        prev.get('sponsored')?.set(curr.id.toString(), curr);
                      } else {
                        prev.set(
                          'sponsored',
                          new Map([[curr.id.toString(), curr]]),
                        );
                      }
                    }
                  }
                }

                return prev;
              }, new Map<string, Map<string, ClosetTokenWithMeta>>()),
          );
          setClosetPieces(meta);
          setClosetLoaded(true);
        }
      } catch (err) {
        console.error(err);
        setClosetError(err as Error);
      }
      setClosetLoading(false);
    };

    loadCloset();
  }, [closet, signerAddr, closetLoaded]);

  return {
    closetPieces,
    closetLoading,
    closetError,
    itemMinted,
  };
};
