import { useSignerAddress } from 'common/hooks/useSignerAddress';
import { useContext, useEffect, useState } from 'react';
import { ContractsContext } from '~/components/context/ContractsContext';
import { RatToken, Metadata } from '~/types';

export const useLoadRats = () => {
  const signerAddr = useSignerAddress();
  const { rat } = useContext(ContractsContext);
  const [rats, setRats] = useState<RatToken[]>([]);
  const [ratsLoading, setRatsLoading] = useState(false);
  const [ratsLoaded, setRatsLoaded] = useState(false);
  const [ratsError, setRatsError] = useState<Error | null>(null);

  useEffect(() => {
    const loadRats = async () => {
      setRatsLoading(true);
      try {
        if (!ratsLoaded && rat && signerAddr) {
          const rats = await rat.getTokensByOwner(signerAddr);
          const meta = await Promise.all<RatToken>(
            rats.map((r) =>
              rat
                .tokenURI(r)
                .then((uri) =>
                  fetch(
                    `https://awwrats.infura-ipfs.io/ipfs/${uri.replace(
                      'ipfs://',
                      '',
                    )}`,
                  ),
                )
                .then((res) => res.json())
                .then((data: Metadata) =>
                  data.attributes.reduce<RatToken>(
                    (prev, curr) => {
                      if (curr.trait_type) {
                        //Typescript is upset about this...
                        //@ts-ignore
                        prev[curr.trait_type.toLowerCase() as keyof RatToken] =
                          curr.value;
                      }
                      return prev;
                    },
                    {
                      ...data,
                      attributes: undefined,
                      id: r.toString(),
                    } as unknown as RatToken,
                  ),
                ),
            ),
          );
          setRats(meta);
          setRatsLoaded(true);
        }
      } catch (err) {
        console.error(err);
        setRatsError(err as Error);
      }
      setRatsLoading(false);
    };

    loadRats();
  }, [rat, signerAddr, ratsLoaded]);

  return {
    rats,
    ratsLoading,
    ratsError,
  };
};
