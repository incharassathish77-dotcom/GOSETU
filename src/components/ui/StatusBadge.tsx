import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
  RefreshCw,
  Stethoscope,
  UserCheck,
  XCircle,
} from 'lucide-react';
import type { AnyEntityStatus } from '../../types/gosetu';

interface StatusBadgeProps {
  status: AnyEntityStatus;
  compact?: boolean;
}

const STATUS_STYLE_MAP: Record<
  AnyEntityStatus,
  {
    bg: string;
    text: string;
    border: string;
    Icon: typeof Clock;
  }
> = {
  // Farm Visits
  Scheduled: {
    bg: 'bg-[#F1F5F3]',
    text: 'text-[#2D4F3E]',
    border: 'border-[#D5E0D9]',
    Icon: Clock,
  },
  'In Progress': {
    bg: 'bg-[#EBF3EE]',
    text: 'text-[#163C2B]',
    border: 'border-[#BFD3C6]',
    Icon: RefreshCw,
  },
  Completed: {
    bg: 'bg-[#ECF6EF]',
    text: 'text-[#166534]',
    border: 'border-[#C6E4CE]',
    Icon: CheckCircle2,
  },
  Cancelled: {
    bg: 'bg-[#F4F5F4]',
    text: 'text-[#525D56]',
    border: 'border-[#DCE0DC]',
    Icon: XCircle,
  },

  // Veterinary Requests and Cases
  Submitted: {
    bg: 'bg-[#F2F4F7]',
    text: 'text-[#344054]',
    border: 'border-[#D0D5DD]',
    Icon: FileText,
  },
  'Under Review': {
    bg: 'bg-[#FEF6E7]',
    text: 'text-[#92400E]',
    border: 'border-[#F3D9A6]',
    Icon: Eye,
  },
  Assigned: {
    bg: 'bg-[#EDF3F8]',
    text: 'text-[#1D4E73]',
    border: 'border-[#C5D8E8]',
    Icon: UserCheck,
  },
  'In Consultation': {
    bg: 'bg-[#E9F3ED]',
    text: 'text-[#163C2B]',
    border: 'border-[#BBD3C4]',
    Icon: Stethoscope,
  },
  'Follow-up Required': {
    bg: 'bg-[#FEF6E7]',
    text: 'text-[#92400E]',
    border: 'border-[#F3D9A6]',
    Icon: RefreshCw,
  },
  Resolved: {
    bg: 'bg-[#ECF6EF]',
    text: 'text-[#166534]',
    border: 'border-[#C6E4CE]',
    Icon: CheckCircle2,
  },
  Closed: {
    bg: 'bg-[#F1F3F0]',
    text: 'text-[#4F5A53]',
    border: 'border-[#D9DED8]',
    Icon: CheckCircle2,
  },

  // Follow-ups
  Due: {
    bg: 'bg-[#FEF6E7]',
    text: 'text-[#92400E]',
    border: 'border-[#F3D9A6]',
    Icon: Clock,
  },
  Overdue: {
    bg: 'bg-[#FEF2F2]',
    text: 'text-[#B91C1C]',
    border: 'border-[#F8CACA]',
    Icon: AlertCircle,
  },
};

export function StatusBadge({ status, compact = false }: StatusBadgeProps) {
  const style = STATUS_STYLE_MAP[status];
  const Icon = style.Icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium whitespace-nowrap shrink-0 ${
        compact ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      } ${style.bg} ${style.text} ${style.border}`}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
}
