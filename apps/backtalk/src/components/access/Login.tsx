import Login from 'common/components/access/Login';
import { FC } from 'react';
import {
  BacktalkLoginMutation,
  useBacktalkLoginMutation,
} from '~/schema/generated';

const BacktalkLogin: FC = ({ children }) => {
  const [login, { loading, error }] = useBacktalkLoginMutation();
  return (
    <Login<BacktalkLoginMutation>
      login={login}
      loading={loading}
      error={error}
      checkFunc={(returnData, signer) =>
        returnData?.data?.login?.wallet === signer
      }>
      {children}
    </Login>
  );
};

export default BacktalkLogin;
