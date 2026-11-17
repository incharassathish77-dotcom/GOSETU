import {
  ArrowUpRight,
  CalendarClock,
  ClipboardPlus,
  PawPrint,
  Stethoscope,
  UserRound,
  Users,
} from 'lucide-react';
import type { DashboardMetric, MetricIconKey } from '../../types/gosetu';

interface DashboardMetricCardProps {
  metric: DashboardMetric;
  onSelect?: (targetNavId: string) => void;
}

const METRIC_ICON_MAP: Record<MetricIconKey, typeof Users> = {
  farmers: Users,
  animals: PawPrint,
  officers: UserRound,
  requests: ClipboardPlus,
  cases: Stethoscope,
  followups: CalendarClock,
};

const TONE_CLASSES: Record<
  DashboardMetric['tone'],
  { iconBg: string; iconText: string; valueText: string }
> = {
  forest: {
    iconBg: 'bg-[#EDF2EE]',
    iconText: 'text-[#163C2B]',
    valueText: 'text-[#1A1F1C]',
  },
  sage: {
    iconBg: 'bg-[#EEF3F0]',
    iconText: 'text-[#52796F]',
    valueText: 'text-[#1A1F1C]',
  },
  amber: {
    iconBg: 'bg-[#FEF6E7]',
    iconText: 'text-[#92400E]',
    valueText: 'text-[#92400E]',
  },
  crimson: {
    iconBg: 'bg-[#FEF2F2]',
    iconText: 'text-[#B91C1C]',
    valueText: 'text-[#B91C1C]',
  },
};

export function DashboardMetricCard({ metric, onSelect }: DashboardMetricCardProps) {
  const isInteractive = Boolean(metric.targetNavId && onSelect);
  const Icon = METRIC_ICON_MAP[metric.iconKey];
  const tone = TONE_CLASSES[metric.tone];

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${tone.iconBg} ${tone.iconText}`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </div>
          <span className="text-xs font-semibold text-[#4F5A53] leading-snug">
            {metric.label}
          </span>
        </div>

        {isInteractive && (
          <ArrowUpRight
            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#8A968E] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#163C2B]"
            aria-hidden="true"
          />
        )}
      </div>

      <div className="mt-4">
        <div
          className={`font-display text-3xl font-semibold tracking-tight tabular-nums ${tone.valueText}`}
        >
          {metric.value.toLocaleString('en-IN')}
        </div>
        <p
          className="mt-1.5 text-xs text-[#626E66] truncate"
          title={metric.description}
        >
          {metric.description}
        </p>
      </div>
    </>
  );

  if (isInteractive) {
    return (
      <button
        type="button"
        onClick={() => metric.targetNavId && onSelect?.(metric.targetNavId)}
        className="group flex w-full flex-col justify-between rounded-lg border border-[#E2E6E1] bg-white p-4 text-left shadow-xs transition-colors hover:border-[#C2CBC3] hover:bg-[#FAFBF9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C2B]"
      >
        {content}
      </button>
    );
  }

  return (
    <div className="flex flex-col justify-between rounded-lg border border-[#E2E6E1] bg-white p-4 shadow-xs">
      {content}
    </div>
  );
}
