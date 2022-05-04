import { Center } from '@chakra-ui/react';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Admin } from '~/components/game/admin/Admin';
const AdminAccess = dynamic(() => import('~/components/access/AdminAccess'), {
  ssr: false,
});
import { LayoutNoFooter } from '~/components/layout/LayoutNoFooter';

const AdminPage: NextPage = () => {
  return (
    <LayoutNoFooter className='min-h-screen bg-gray-800'>
      <AdminAccess>
        <Center pt={20} color='white'>
          <Admin />
        </Center>
      </AdminAccess>
    </LayoutNoFooter>
  );
};

export default AdminPage;
