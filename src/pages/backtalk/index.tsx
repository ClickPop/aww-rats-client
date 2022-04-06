import { LayoutDashboard } from '~/components/backtalk/LayoutDashboard';
import { NextPage } from 'next';
import { Dashboard } from '~/components/backtalk/Dashboard';

const BacktalkPage: NextPage = () => {
  return (
    <LayoutDashboard>
      <Dashboard />
    </LayoutDashboard>
  );
};

export default BacktalkPage;
