import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export function Spinner({
  size = 'md',
  label,
  className
}: SpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          'rounded-full animate-spin',
          // Size variants
          {
            'h-4 w-4 border-2': size === 'sm',
            'h-8 w-8 border-2': size === 'md',
            'h-12 w-12 border-[2.5px]': size === 'lg'
          },
          // Default color styling that can be overridden by className
          'border-gray-400 border-t-white',
          className
        )}
      />
      {label && (
        <span className="text-sm text-gray-600">
          {label}
        </span>
      )}
    </div>
  );
}

// Add custom Tailwind animation
const customStyles = `
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 0.8s linear infinite;
}
`;

// Add styles to the document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = customStyles;
  document.head.appendChild(styleSheet);
}

export default Spinner;