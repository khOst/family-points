import { cn } from '../../utils/cn';

interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
  showZero?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'red' | 'blue' | 'green' | 'yellow' | 'purple';
  className?: string;
  children?: React.ReactNode;
}

export function NotificationBadge({
  count,
  maxCount = 99,
  showZero = false,
  size = 'md',
  color = 'red',
  className,
  children,
}: NotificationBadgeProps) {
  const shouldShow = count > 0 || showZero;
  
  if (!shouldShow) {
    return <>{children}</>;
  }

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();

  const sizeClasses = {
    sm: 'h-4 w-4 text-xs min-w-4',
    md: 'h-5 w-5 text-xs min-w-5',
    lg: 'h-6 w-6 text-sm min-w-6',
  };

  const colorClasses = {
    red: 'bg-red-500 text-white',
    blue: 'bg-blue-500 text-white', 
    green: 'bg-green-500 text-white',
    yellow: 'bg-yellow-500 text-white',
    purple: 'bg-purple-500 text-white',
  };

  const badgeComponent = (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full font-medium leading-none',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
    >
      {displayCount}
    </span>
  );

  // If children are provided, render as a positioned badge
  if (children) {
    return (
      <div className="relative inline-block">
        {children}
        <span
          className={cn(
            'absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full font-medium leading-none',
            sizeClasses[size],
            colorClasses[color],
            className
          )}
        >
          {displayCount}
        </span>
      </div>
    );
  }

  return badgeComponent;
}