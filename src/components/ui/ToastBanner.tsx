import { CheckCircle2, X } from 'lucide-react';

interface ToastBannerProps {
  message: string | null;
  onDismiss: () => void;
}

export function ToastBanner({ message, onDismiss }: ToastBannerProps) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-between gap-3 rounded-lg border border-[#BBD8C3] bg-[#ECF6EF] px-4 py-3 text-xs font-medium text-[#166534] shadow-xs"
    >
      <div className="flex items-center gap-2.5">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#166534]" aria-hidden="true" />
        <span>{message}</span>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="rounded p-1 text-[#166534] transition-colors hover:bg-[#D9EFE0]"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
