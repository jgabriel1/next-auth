import { FormEvent, useState } from 'react';

import { useAuth } from '../contexts/AuthContext';

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
