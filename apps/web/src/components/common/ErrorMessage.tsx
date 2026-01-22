import { AlertCircle } from 'lucide-react';
  import { Button } from '@/components/ui/button';

  interface ErrorMessageProps {
    message: string;
    onRetry?: () => void;
  }

  export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center     
  mb-4">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>     
        <p className="text-gray-600 mb-4">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline">
            Try Again
          </Button>
        )}
      </div>
    );
  }