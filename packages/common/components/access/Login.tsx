import { Button } from '@chakra-ui/react';
import { FC, useContext } from 'react';
import { EthersContext } from '../../components/context/EthersContext';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSwitchNetwork } from 'wagmi';

interface Props {
  login?: boolean;
  chain?: number;
}

const Login: FC<Props> = ({ login, chain }) => {
  const { handleLogin, isLoggedIn, authLoading } = useContext(EthersContext);
  const account = useAccount();
  const { switchNetwork } = useSwitchNetwork();

  if (chain && !!account?.connector?.chains?.find((c) => c.id === chain)) {
    return (
      <Button onClick={() => !!switchNetwork && switchNetwork(chain)}>
        Looks like you're on the wrong network. Click here to switch.
      </Button>
    );
  }

  if (login && account && !isLoggedIn) {
    return (
      <Button isLoading={authLoading} onClick={handleLogin}>
        Login
      </Button>
    );
  }

  return (
    <ConnectButton
      showBalance={false}
      accountStatus='address'
      chainStatus='icon'
    />
  );
};

export default Login;
