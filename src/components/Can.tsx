import { useCan } from '../hooks/useCan';

type CanProps = {
  permissions?: string[];
  roles?: string[];
};

export const Can: React.FC<CanProps> = ({ children, permissions, roles }) => {
  const canSeeComponent = useCan({ permissions, roles });

  if (!canSeeComponent) return null;

  return <>{children}</>;
};
