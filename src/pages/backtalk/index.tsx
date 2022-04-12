import { LayoutDashboard } from '~/components/backtalk/LayoutDashboard';
import { NextPage } from 'next';
import { Dashboard } from '~/components/backtalk/Dashboard';
import AuthCookieRequired from '~/components/access/AuthCookieRequired';
import Homepage from '~/components/backtalk/Homepage';

const BacktalkPage: NextPage = () => {
  return (
    <AuthCookieRequired isBacktalk fallback={<Homepage />}>
      <LayoutDashboard>
        <Dashboard />
      </LayoutDashboard>
    </AuthCookieRequired>
  );
};

export default BacktalkPage;
