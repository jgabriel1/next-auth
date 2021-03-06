import {
  createContext,
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import Router, { useRouter } from 'next/router';
import { api } from '../services/apiClient';

type SessionsResponse = {
  permissions: string[];
  roles: string[];
  token: string;
  refreshToken: string;
};

type User = {
  email: string;
  permissions: string[];
  roles: string[];
};

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  user: User;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

let authChannel: BroadcastChannel;

export function signOut() {
  destroyCookie(undefined, '@nextauth:token');
  destroyCookie(undefined, '@nextauth:refreshToken');

  authChannel?.postMessage('signOut');

  Router.push('/');
}

export const AuthProvider: FunctionComponent = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  const signIn = async ({ email, password }: SignInCredentials) => {
    try {
      const { data } = await api.post<SessionsResponse>('sessions', {
        email,
        password,
      });

      const { permissions, roles, token, refreshToken } = data;

      setCookie(undefined, '@nextauth:token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      setCookie(undefined, '@nextauth:refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      setUser({ email, permissions, roles });

      api.defaults.headers['Authorization'] = `Bearer ${token}`;

      router.push('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    authChannel = new BroadcastChannel('@nextauth:authChannel');

    authChannel.onmessage = message => {
      switch (message.data) {
        case 'signOut':
          signOut();
          break;
        default:
          break;
      }
    };
  }, []);

  useEffect(() => {
    const { '@nextauth:token': token } = parseCookies();

    if (token) {
      api
        .get<User>('me')
        .then(r => {
          const { email, permissions, roles } = r.data;

          setUser({ email, permissions, roles });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        isAuthenticated,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
