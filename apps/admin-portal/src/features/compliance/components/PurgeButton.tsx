import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface PurgeButtonProps {
  onClick: () => void;
  loading: boolean;
  variant?: 'danger' | 'secondary';
}

export function PurgeButton({ onClick, loading, variant = 'danger' }: PurgeButtonProps) {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      loading={loading}
    >
      <svg className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
      Execute Hard Purge
    </Button>
  );
}