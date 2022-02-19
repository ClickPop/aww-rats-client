import { ethers, BigNumber } from 'ethers';
import React, { useContext, useState, FC } from 'react';
import { ClosetContext } from '~/components/context/ClosetContext';
import { EthersContext } from '~/components/context/EthersContext';
import {
  ClosetTokenWithMeta,
  LOADING_STATE,
  ERC20,
  ClosetUserTokenWithMeta,
} from '~/types';
import ERC20ABI from 'smart-contracts/artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json';
import { CheeseLoader } from '~/components/shared/CheeseLoader';
import { GetClosetDataQuery } from '~/schema/generated';

type Props = {
  piece: GetClosetDataQuery['closet_pieces'][0];
  tokenMaxReached: boolean;
  noMaxTokens: boolean;
  walletMaxReached: boolean;
  noWalletMax: boolean;
};

export const ClosetMintButton: FC<Props> = ({
  piece,
  tokenMaxReached,
  walletMaxReached,
  noMaxTokens,
  noWalletMax,
}) => {
  const { closet, signer, provider, signerAddr } = useContext(EthersContext);
  const [loading, setLoading] = useState<LOADING_STATE>(null);

  const canMint =
    (!tokenMaxReached || noMaxTokens) &&
    (!walletMaxReached || noWalletMax) &&
    piece.active;

  const approveWeth = async () => {
    if (closet && signer && signerAddr && provider) {
      setLoading('INITIAL');
      const wethAddr = await closet.erc20();
      console.log(wethAddr);
      const weth = new ethers.Contract(wethAddr, ERC20ABI.abi, signer) as ERC20;
      const cost = piece.cost;
      const allowance = await weth.allowance(signerAddr, closet.address);
      if (cost.gt(0) && allowance < cost) {
        setLoading('APPROVAL');
        const bal: BigNumber = await weth.balanceOf(await signer.getAddress());
        if (bal.lt(cost)) {
          const err = `Insufficient WETH. Cost is ${ethers.utils.formatEther(
            cost,
          )}. Wallet balance at address ${signerAddr} is ${bal}`;
          throw new Error(err);
        }
        await weth.approve(closet.address, cost).then((t) => t.wait());
      }
    }
  };

  const handleMint = async () => {
    if (closet) {
      try {
        await approveWeth();
        setLoading('TOKEN');
        await closet.mint(piece.id, 1).then((t) => t.wait());
      } catch (err) {
        console.error(err);
      }
      setLoading(null);
    }
  };

  const handleButtonContent = () => {
    switch (true) {
      case tokenMaxReached && !noMaxTokens:
        return 'View on OpenSea';
      case walletMaxReached && !noWalletMax:
        return 'Max Owned';
      case !piece.active:
        return 'Unavailable';
      case piece.cost > 0:
        return <>Buy Now</>;
      case piece.cost === 0:
        return 'Free';
      default:
        return null;
    }
  };

  return !loading ? (
    <button
      className={
        canMint
          ? `text-gray-800 bg-light hover:bg-yellow-300 p-2 block w-full duration-300`
          : 'text-gray-400 bg-gray-800 p-2 block w-full cursor-not-allowed'
      }
      disabled={!canMint}
      onClick={handleMint}>
      {handleButtonContent()}
    </button>
  ) : (
    <CheeseLoader className='h-6 w-6 relative' />
  );
};
