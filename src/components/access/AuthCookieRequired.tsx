import { Box, Center, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { FC, useContext } from 'react';
import Login from '~/components/access/Login';
import { EthersContext } from '~/components/context/EthersContext';
import { Connect } from '~/components/shared/Connect';
import { ADMINS } from '~/config/env';

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
