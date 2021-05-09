import { GetServerSideProps } from 'next';
import { destroyCookie, parseCookies } from 'nookies';
import { AuthTokenError } from '../services/errors/AuthTokenError';

export const withSSRAuth = <P>(
  fn: GetServerSideProps<P>
): GetServerSideProps<P> => {
  return async ctx => {
    const cookies = parseCookies(ctx);

    if (!cookies.hasOwnProperty('@nextauth:token')) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    try {
      return await fn(ctx);
    } catch (err) {
      if (err instanceof AuthTokenError) {
        destroyCookie(ctx, '@nextauth:token');
        destroyCookie(ctx, '@nextauth:refreshToken');

        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }
    }
  };
};
