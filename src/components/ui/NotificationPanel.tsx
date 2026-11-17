import { BellOff, CheckCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { NotificationItem } from '../../types/gosetu';
import { EmptyState } from './StateViews';

interface NotificationPanelProps {
  open: boolean;
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export function NotificationPanel({
  open,
  notifications,
  onClose,
  onMarkRead,
  onMarkAllRead,
}: NotificationPanelProps) {
  const [filterMode, setFilterMode] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const visibleItems =
    filterMode === 'unread'
      ? notifications.filter((n) => n.unread)
      : notifications;

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#1A1F1C]/30"
      role="dialog"
      aria-modal="true"
      aria-label="Notifications"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-md flex-col border-l border-[#E2E6E1] bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#E2E6E1] px-5 py-4">
          <div>
            <h2 className="font-display text-base font-semibold text-[#1A1F1C]">
              Notifications
            </h2>
            <p className="mt-0.5 text-xs text-[#626E66]">
              {unreadCount > 0
                ? `${unreadCount} unread operational updates`
                : 'All operational updates reviewed'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notifications panel"
            className="rounded-md p-1.5 text-[#626E66] hover:bg-[#F1F3F0] hover:text-[#1A1F1C]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex items-center justify-between border-b border-[#E2E6E1] bg-[#FAFBF9] px-5 py-2.5">
          <div className="flex items-center gap-1 rounded-md bg-[#ECEFEA] p-0.5">
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                filterMode === 'all'
                  ? 'bg-white text-[#1A1F1C] shadow-xs'
                  : 'text-[#525E56] hover:text-[#1A1F1C]'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterMode('unread')}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                filterMode === 'unread'
                  ? 'bg-white text-[#1A1F1C] shadow-xs'
                  : 'text-[#525E56] hover:text-[#1A1F1C]'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllRead}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#163C2B] hover:underline whitespace-nowrap shrink-0"
            >
              <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Mark all read
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#ECEFEA]">
          {visibleItems.length === 0 ? (
            <EmptyState
              title="No unread notifications"
              description="You have reviewed all current case queue and follow-up alerts."
              icon={<BellOff className="h-5 w-5" aria-hidden="true" />}
              actionLabel={filterMode === 'unread' ? 'Show all notifications' : undefined}
              onAction={filterMode === 'unread' ? () => setFilterMode('all') : undefined}
            />
          ) : (
            visibleItems.map((item) => (
              <div
                key={item.id}
                className={`px-5 py-4 transition-colors ${
                  item.unread ? 'bg-[#F6FAF7]' : 'bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs text-[#626E66]">
                  <span className="font-medium text-[#2D6A4F]">{item.category}</span>
                  <span className="tabular-nums">{item.timestamp}</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-[#1A1F1C]">
                  {item.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#4F5A53]">
                  {item.detail}
                </p>
                {item.unread && (
                  <button
                    type="button"
                    onClick={() => onMarkRead(item.id)}
                    className="mt-2.5 text-xs font-medium text-[#163C2B] hover:underline"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
