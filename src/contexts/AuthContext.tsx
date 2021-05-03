import { createContext, FunctionComponent, useContext } from 'react';

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: FunctionComponent = ({ children }) => {
  const isAuthenticated = false;

  const signIn = async ({ email, password }: SignInCredentials) => {
    console.log({
      email,
      password,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
