import { Center, Text } from '@chakra-ui/react';
import { FC, ReactElement, useContext } from 'react';
import { EthersContext } from '../context/EthersContext';

type Props = {
  fallback: ReactElement;
};

const AuthCookieRequired: FC<Props> = ({ children, fallback }) => {
  const { isLoggedIn } = useContext(EthersContext);

  if (!isLoggedIn) {
    return fallback;
  }

  return <>{children}</>;
};

export default AuthCookieRequired;
