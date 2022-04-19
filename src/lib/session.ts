import { GetServerSidePropsContext } from 'next';

export const checkCookie = (ctx: GetServerSidePropsContext): boolean =>
  !!ctx.req.cookies['backtalk-wallet'];
