import { Box } from '@chakra-ui/react';
import React, { FC, useContext } from 'react';
import Login from '~/components/access/Login';
import { EthersContext } from '~/components/context/EthersContext';

const AuthCookieRequired: FC = ({ children }) => {
  const { isLoggedIn } = useContext(EthersContext);

  if (!isLoggedIn) {
    return (
      <Box w='fit-content' mx='auto'>
        <Login />
      </Box>
    );
  }

  return <>{children}</>;
};

export default AuthCookieRequired;
