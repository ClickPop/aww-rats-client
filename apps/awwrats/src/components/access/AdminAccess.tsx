import { Center } from '@chakra-ui/react';
import React, { FC, useContext } from 'react';
import { EthersContext } from 'common/components/context/EthersContext';
import { useSignerAddress } from 'common/hooks/useSignerAddress';
import Login from 'common/components/access/Login';

const AdminAccess: FC = ({ children }) => {
  const signerAddr = useSignerAddress();
  if (!signerAddr) {
    return (
      <Center py={20}>
        <Login />
      </Center>
    );
  }

  return <>{children}</>;
};

export default AdminAccess;
