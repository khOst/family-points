import { LoadingSpinner } from './LoadingSpinner';
import { cn } from '../../utils/cn';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingState({ 
  message = 'Loading...', 
  size = 'md', 
  className 
}: LoadingStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-8', className)}>
      <LoadingSpinner size={size} className="mb-3" />
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
}