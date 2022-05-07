import { LayoutDashboard } from '~/components/backtalk/LayoutDashboard';
import { NextPage } from 'next';
import { Dashboard } from '~/components/backtalk/Dashboard';
import AuthCookieRequired from 'common/components/access/AuthCookieRequired';
import Homepage from '~/components/backtalk/homepage/Homepage';

const BacktalkPage: NextPage = () => {
  return (
    <AuthCookieRequired fallback={<Homepage />}>
      <LayoutDashboard>
        <Dashboard />
      </LayoutDashboard>
    </AuthCookieRequired>
  );
};

export default BacktalkPage;
