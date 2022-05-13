import { useAccount } from 'wagmi';

export const useSignerAddress = () => {
  const { data } = useAccount();
  return data?.address;
};
