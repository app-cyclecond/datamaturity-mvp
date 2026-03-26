'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent';
  text?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
};

const colorClasses = {
  primary: 'border-primary-600',
  secondary: 'border-secondary-600',
  accent: 'border-accent-600',
};

export function LoadingSpinner({
  size = 'md',
  color = 'primary',
  text,
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div
          className={`${sizeClasses[size]} rounded-full border-4 border-gray-200 animate-spin`}
        />
        <div
          className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-4 border-transparent ${colorClasses[color]} border-t-4 animate-spin`}
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
        />
      </div>
      {text && <p className="text-sm text-neutral-600 animate-pulse">{text}</p>}
    </div>
  );
}
