import { GetServerSideProps } from 'next';
import { FormEvent, useState } from 'react';

import { useAuth } from '../contexts/AuthContext';
import { withSSRGuest } from '../utils/withSSRGuest';

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

export const getServerSideProps: GetServerSideProps = withSSRGuest(
  async ctx => {
    return {
      props: {},
    };
  }
);
