import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Stethoscope,
} from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ToastBanner } from '../components/ui/ToastBanner';
import type {
  FollowUpRecord,
  StakeholderAccount,
  VeterinaryCaseRecord,
} from '../types/gosetu';

interface VetWorkspacePageProps {
  account: StakeholderAccount;
  vetId: string;
  cases: VeterinaryCaseRecord[];
  followUps: FollowUpRecord[];
  onNavigate: (navId: string) => void;
  onOpenCase: (caseId: string) => void;
  toastMessage: string | null;
  onDismissToast: () => void;
}

export function VetWorkspacePage({
  account,
  vetId,
  cases,
  followUps,
  onNavigate,
  onOpenCase,
  toastMessage,
  onDismissToast,
}: VetWorkspacePageProps) {
  const myCases = cases.filter((c) => c.assignedVetId === vetId);
  const newlyAssigned = myCases.filter((c) => c.status === 'Assigned');
  const inConsultation = myCases.filter(
    (c) => c.status === 'In Consultation' || c.status === 'Follow-up Required'
  );
  const resolvedOrClosed = myCases.filter(
    (c) => c.status === 'Resolved' || c.status === 'Closed'
  );

  const myCaseIds = new Set(myCases.map((c) => c.caseId));
  const relatedFollowUps = followUps.filter((f) => myCaseIds.has(f.caseId));
  const dueFollowUps = relatedFollowUps.filter((f) => f.status === 'Due');
  const overdueFollowUps = relatedFollowUps.filter(
    (f) => f.status === 'Overdue'
  );

  return (
    <div className="space-y-6">
      <ToastBanner message={toastMessage} onDismiss={onDismissToast} />

      <div className="flex flex-col gap-4 border-b border-[#E2E6E1] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium text-[#52796F]">
            Tuesday, 17 November 2026 · {account.territoryOrUnit}
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-[#1A1F1C]">
            Clinical Caseload — {account.fullName}
          </h1>
          <p className="mt-1 text-xs text-[#4F5A53]">
            Review assigned cases, enter clinical examinations and treatment
            plans, schedule follow-ups, and close recovered cases.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('veterinary-cases')}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#163C2B] px-4 text-xs font-semibold text-white hover:bg-[#102D20] self-start sm:self-auto whitespace-nowrap shrink-0"
        >
          <Stethoscope className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Open Assigned Cases</span>
        </button>
      </div>

      {/* Vet Dashboard Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="rounded-lg border border-[#E2E6E1] bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4F5A53]">
            <ClipboardList className="h-4 w-4 text-[#163C2B]" aria-hidden="true" />
            <span>Assigned Cases</span>
          </div>
          <p className="mt-3 font-display text-2xl font-semibold text-[#1A1F1C] tabular-nums">
            {myCases.length}
          </p>
        </div>

        <div className="rounded-lg border border-[#E2E6E1] bg-white p-4 shadow-xs">
          <p className="text-xs font-semibold text-[#4F5A53]">New Cases</p>
          <p className="mt-3 font-display text-2xl font-semibold text-[#1D4E73] tabular-nums">
            {newlyAssigned.length}
          </p>
          <p className="mt-1 text-[11px] text-[#626E66]">Awaiting consult</p>
        </div>

        <div className="rounded-lg border border-[#E2E6E1] bg-white p-4 shadow-xs">
          <p className="text-xs font-semibold text-[#4F5A53]">In Consultation</p>
          <p className="mt-3 font-display text-2xl font-semibold text-[#163C2B] tabular-nums">
            {inConsultation.length}
          </p>
          <p className="mt-1 text-[11px] text-[#626E66]">Active care</p>
        </div>

        <div className="rounded-lg border border-[#E2E6E1] bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4F5A53]">
            <CalendarClock className="h-4 w-4 text-[#92400E]" aria-hidden="true" />
            <span>Follow-ups Due</span>
          </div>
          <p className="mt-3 font-display text-2xl font-semibold text-[#92400E] tabular-nums">
            {dueFollowUps.length}
          </p>
        </div>

        <div className="rounded-lg border border-[#E2E6E1] bg-white p-4 shadow-xs">
          <p className="text-xs font-semibold text-[#4F5A53]">Overdue Follow-ups</p>
          <p className="mt-3 font-display text-2xl font-semibold text-[#B91C1C] tabular-nums">
            {overdueFollowUps.length}
          </p>
        </div>

        <div className="rounded-lg border border-[#E2E6E1] bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4F5A53]">
            <CheckCircle2 className="h-4 w-4 text-[#166534]" aria-hidden="true" />
            <span>Resolved / Closed</span>
          </div>
          <p className="mt-3 font-display text-2xl font-semibold text-[#166534] tabular-nums">
            {resolvedOrClosed.length}
          </p>
        </div>
      </div>

      {/* Assigned Cases & Follow-up Reviews */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-[#E2E6E1] bg-white shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E2E6E1] px-5 py-4">
            <h2 className="font-display text-base font-semibold text-[#1A1F1C]">
              Active Clinical Queue
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('veterinary-cases')}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#163C2B] hover:underline"
            >
              <span>All cases</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="divide-y divide-[#ECEFEA]">
            {myCases.map((c) => (
              <button
                key={c.caseId}
                type="button"
                onClick={() => onOpenCase(c.caseId)}
                className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[#FAFBF9]"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono font-semibold text-[#163C2B]">
                      {c.caseId}
                    </span>
                    <span className="text-[#C2CBC3]">·</span>
                    <span className="font-semibold text-[#1A1F1C]">
                      {c.farmerName} ({c.village})
                    </span>
                    <span className="text-[#C2CBC3]">·</span>
                    <span className="font-mono text-[#4F5A53]">
                      {c.animalTag}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-[#4F5A53]">{c.concernSummary}</p>
                  <p className="mt-1 text-[11px] text-[#626E66]">
                    Last updated {c.lastUpdated}
                  </p>
                </div>
                <StatusBadge status={c.status} compact />
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[#E2E6E1] bg-white shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E2E6E1] px-5 py-4">
            <h2 className="font-display text-base font-semibold text-[#1A1F1C]">
              Follow-ups Linked to Your Cases
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('follow-ups')}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#163C2B] hover:underline"
            >
              <span>Follow-up schedule</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="divide-y divide-[#ECEFEA]">
            {relatedFollowUps.length === 0 ? (
              <p className="px-5 py-8 text-xs text-[#626E66]">
                No follow-ups scheduled for your assigned cases.
              </p>
            ) : (
              relatedFollowUps.map((fu) => (
                <button
                  key={fu.followUpId}
                  type="button"
                  onClick={() => onOpenCase(fu.caseId)}
                  className="flex w-full items-start justify-between gap-4 px-5 py-3.5 text-left hover:bg-[#FAFBF9]"
                >
                  <div className="text-xs">
                    <p className="font-semibold text-[#1A1F1C]">
                      {fu.caseId} · {fu.farmerName} ({fu.animalTag})
                    </p>
                    <p className="mt-0.5 text-[#4F5A53]">{fu.instructionNote}</p>
                    <p className="mt-1 text-[11px] text-[#626E66]">
                      Officer: {fu.assignedPerson} · Due {fu.dueDate}
                    </p>
                  </div>
                  <StatusBadge status={fu.status} compact />
                </button>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
