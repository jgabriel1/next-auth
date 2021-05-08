import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { parseCookies } from 'nookies';

export const withSSRAuth = <P>(
  fn: GetServerSideProps<P>
): GetServerSideProps<P> => {
  return async (ctx: GetServerSidePropsContext) => {
    const cookies = parseCookies(ctx);

    if (!cookies.hasOwnProperty('@nextauth:token')) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return fn(ctx);
  };
};
