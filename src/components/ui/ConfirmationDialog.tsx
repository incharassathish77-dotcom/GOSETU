import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'primary' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'primary',
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1F1C]/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="w-full max-w-md rounded-lg border border-[#E2E6E1] bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <h2
            id="confirm-dialog-title"
            className="font-display text-base font-semibold text-[#1A1F1C]"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close dialog"
            className="rounded p-1 text-[#626E66] hover:bg-[#F1F3F0] hover:text-[#1A1F1C]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-[#4F5A53]">
          {description}
        </p>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-[#D4DBD4] bg-white px-4 py-2 text-xs font-medium text-[#3D4640] transition-colors hover:bg-[#F1F3F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C2B] whitespace-nowrap shrink-0"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-md px-4 py-2 text-xs font-medium text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 whitespace-nowrap shrink-0 ${
              tone === 'danger'
                ? 'bg-[#B91C1C] hover:bg-[#991B1B] focus-visible:outline-[#B91C1C]'
                : 'bg-[#163C2B] hover:bg-[#102D20] focus-visible:outline-[#163C2B]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
