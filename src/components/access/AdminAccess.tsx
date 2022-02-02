import { Box, Center, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { FC, useContext } from 'react';
import { EthersContext } from '~/components/context/EthersContext';
import { Connect } from '~/components/shared/Connect';
import { ADMINS } from '~/config/env';

const AdminAccess: FC = ({ children }) => {
  const { signerAddr } = useContext(EthersContext);
  const isAdmin = signerAddr ? ADMINS.includes(signerAddr) : false;
  if (!signerAddr) {
    return (
      <Center py={20}>
        <Connect />
      </Center>
    );
  }

  if (!isAdmin) {
    return (
      <Center py={20}>
        <Text color='white'>Account is not an admin</Text>
      </Center>
    );
  }

  return <>{children}</>;
};

export default AdminAccess;
