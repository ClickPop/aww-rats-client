import { Box, Center, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { FC, useContext } from 'react';
import { EthersContext } from '~/components/context/EthersContext';
import { Connect } from '~/components/shared/Connect';

const AdminAccess: FC = ({ children }) => {
  const { signerAddr } = useContext(EthersContext);

  if (!signerAddr) {
    return (
      <Center py={20}>
        <Connect />
      </Center>
    );
  }

  return <>{children}</>;
};

export default AdminAccess;
