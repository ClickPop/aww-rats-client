import { LayoutDashboard } from '~/components/backtalk/LayoutDashboard';
import { NextPage } from 'next';
import { Dashboard } from '~/components/backtalk/Dashboard';
import AuthCookieRequired from '~/components/access/AuthCookieRequired';
import BacktalkLogin from '~/components/access/BacktalkLogin';

const BacktalkPage: NextPage = () => {
  return (
    <LayoutDashboard>
      <AuthCookieRequired fallback={<BacktalkLogin />}>
        <Dashboard />
      </AuthCookieRequired>
    </LayoutDashboard>
  );
};

export default BacktalkPage;
