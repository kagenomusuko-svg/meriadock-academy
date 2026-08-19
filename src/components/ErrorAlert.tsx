import { AlertCircle } from 'lucide-react';

interface ErrorAlertProps {
  title?: string;
  message: string;
  onClose?: () => void;
}

export function ErrorAlert({ title = 'Error', message, onClose }: ErrorAlertProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="text-red-600 mt-0.5" size={20} />
        <div className="flex-1">
          <h3 className="font-medium text-red-900">{title}</h3>
          <p className="text-sm text-red-700 mt-1">{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-red-600 hover:text-red-900"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
}
