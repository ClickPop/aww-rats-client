import { useEffect, useState } from 'react';
import { SIGNER_MESSAGE } from 'common/env';
import { UseAuthHook } from 'types';
import { useSignMessage, useAccount } from 'wagmi';

export const useAuth: UseAuthHook = (
  checkAuth,
  login,
  checkLogin,
  signerMsg,
) => {
  const { signMessageAsync } = useSignMessage();
  const { data: account } = useAccount();

  const handleLogin = async () => {
    const wallet = account?.address;
    if (wallet && login) {
      try {
        const msg = await signMessageAsync({
          message: signerMsg ?? SIGNER_MESSAGE,
        });
        const res = await login({
          variables: {
            wallet,
            msg,
          },
        });
        if (checkLogin && checkLogin(res, wallet)) {
          setLoggedIn(true);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const { loading: authLoading, data: authData } = checkAuth({
    fetchPolicy: 'network-only',
  });

  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(
      !!(
        authData?.checkAuth?.role === 'user' &&
        account?.address === authData?.checkAuth?.id
      ),
    );
  }, [account?.address, authData?.checkAuth]);

  return {
    handleLogin,
    isLoggedIn,
    setLoggedIn,
  };
};
