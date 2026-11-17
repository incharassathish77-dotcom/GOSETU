import type { ActivityEvent } from '../../types/gosetu';

interface ActivityTimelineProps {
  events: ActivityEvent[];
}

export function ActivityTimeline({ events }: ActivityTimelineProps) {
  if (events.length === 0) {
    return (
      <p className="text-xs text-[#626E66]">
        No workflow events recorded yet.
      </p>
    );
  }

  return (
    <ol className="relative space-y-4 border-l border-[#D7DDD7] pl-4">
      {events.map((event) => (
        <li key={event.id} className="relative">
          <span
            className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full border border-white bg-[#163C2B]"
            aria-hidden="true"
          />
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#626E66]">
            <span>
              <span className="font-semibold text-[#1A1F1C]">{event.actor}</span>
              <span className="mx-1.5 text-[#C2CBC3]" aria-hidden="true">
                ·
              </span>
              <span>{event.role}</span>
            </span>
            <span className="font-mono tabular-nums">{event.timestamp}</span>
          </div>
          <p className="mt-0.5 text-xs font-semibold text-[#1A1F1C]">
            {event.title}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-[#4F5A53]">
            {event.detail}
          </p>
        </li>
      ))}
    </ol>
  );
}
