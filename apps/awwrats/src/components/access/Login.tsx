import Login from 'common/components/access/Login';
import { FC } from 'react';
import { LoginMutation, useLoginMutation } from '~/schema/generated';

const AwwRatsLogin: FC = ({ children }) => {
  const [login, { loading, error }] = useLoginMutation();
  return (
    <Login<LoginMutation>
      login={login}
      loading={loading}
      error={error}
      checkFunc={(returnData, signer) =>
        returnData?.data?.login?.id === signer
      }>
      {children}
    </Login>
  );
};

export default AwwRatsLogin;
