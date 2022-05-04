import { Center, Text } from '@chakra-ui/react';
import { FC, ReactElement, useContext } from 'react';
import { EthersContext } from 'common/components/context/EthersContext';

type Props = {
  fallback: ReactElement;
};

const AuthCookieRequired: FC<Props> = ({ children, fallback }) => {
  const { isLoggedIn, authLoading } = useContext(EthersContext);

  if (authLoading) {
    return (
      <Center py={20}>
        <Text>Loading...</Text>
      </Center>
    );
  }

  if (!isLoggedIn) {
    return fallback;
  }

  return <>{children}</>;
};

export default AuthCookieRequired;
