import { GetServerSideProps } from 'next';
import { parseCookies } from 'nookies';
import { FormEvent, useEffect, useState } from 'react';

import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

import styles from '../styles/Home.module.css';

export default function Home() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const data = { email, password };

    signIn(data);
  };

  useEffect(() => {
    api.get('me').then(console.log);
  }, []);

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button type="submit">Entrar</button>
    </form>
  );
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const cookies = parseCookies(ctx);

  if (cookies.hasOwnProperty('@nextauth:token')) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
