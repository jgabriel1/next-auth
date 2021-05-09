import { useEffect } from 'react';

import { useAuth } from '../contexts/AuthContext';
import { useCan } from '../hooks/useCan';
import { setupAPIClient } from '../services/api';
import { api } from '../services/apiClient';
import { withSSRAuth } from '../utils/withSSRAuth';

export default function Dashboard() {
  const { user } = useAuth();

  const canSeeMetrics = useCan({
    permissions: ['metrics.list'],
  });

  useEffect(() => {
    api.get('me').then(console.log);
  });

  return (
    <>
      <h1>Dashboard: {user?.email}</h1>
      {canSeeMetrics && <h2>Métricas</h2>}
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
