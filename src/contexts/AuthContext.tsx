import { createContext, FunctionComponent, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { api } from '../services/api';

type SessionsResponse = {
  permissions: string[];
  roles: string[];
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
  isAuthenticated: boolean;
  user: User;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

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

      const { permissions, roles } = data;

      setUser({ email, permissions, roles });

      router.push('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
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
