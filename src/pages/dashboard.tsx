import { useEffect } from 'react';

import { Can } from '../components/Can';
import { useAuth } from '../contexts/AuthContext';
import { setupAPIClient } from '../services/api';
import { api } from '../services/apiClient';
import { withSSRAuth } from '../utils/withSSRAuth';

export default function Dashboard() {
  const { user, signOut } = useAuth();

  useEffect(() => {
    api.get('me').then(console.log);
  });

  return (
    <>
      <h1>Dashboard: {user?.email}</h1>

      <button type="button" onClick={signOut}>
        Sign out
      </button>

      <Can permissions={['metrics.list']}>
        <h2>Métricas</h2>
      </Can>
    </>
  );
}

export const getServerSideProps = withSSRAuth(async ctx => {
  const serverSideAPIClient = setupAPIClient(ctx);

  const { data } = await serverSideAPIClient.get('me');

  console.log(data);

  return {
    props: {},
  };
});
