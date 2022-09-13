import { useAccount } from 'wagmi';

export const useSignerAddress = () => {
  const { address } = useAccount();
  return address;
};
