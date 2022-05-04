import { Center } from '@chakra-ui/react';
import React, { FC, useContext } from 'react';
import { EthersContext } from 'common/components/context/EthersContext';
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
