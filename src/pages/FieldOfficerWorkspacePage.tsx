import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  ClipboardPlus,
  MapPin,
  PawPrint,
  Phone,
  Play,
  ShieldAlert,
  UserRound,
} from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ToastBanner } from '../components/ui/ToastBanner';
import type {
  AnimalRecord,
  FarmVisitRecord,
  FarmerRecord,
  FollowUpRecord,
  StakeholderAccount,
} from '../types/gosetu';
import { AnimalHealthBadge, FarmerStatusBadge } from './FarmersPage';

interface FieldOfficerWorkspacePageProps {
  activeNavId: string;
  account: StakeholderAccount;
  officerId: string;
  farmers: FarmerRecord[];
  animals: AnimalRecord[];
  visits: FarmVisitRecord[];
  followUps: FollowUpRecord[];
  onNavigate: (navId: string) => void;
  onStartVisit: (visitId: string) => void;
  onOpenObservationModal: (visit: FarmVisitRecord) => void;
  onOpenNewRequest: () => void;
  toastMessage: string | null;
  onDismissToast: () => void;
}

export function FieldOfficerWorkspacePage({
  activeNavId,
  account,
  officerId,
  farmers,
  animals,
  visits,
  followUps,
  onNavigate,
  onStartVisit,
  onOpenObservationModal,
  onOpenNewRequest,
  toastMessage,
  onDismissToast,
}: FieldOfficerWorkspacePageProps) {
  const myFarmers = farmers.filter((f) => f.assignedOfficerId === officerId);
  const myVisits = visits.filter((v) => v.fieldOfficerId === officerId);
  const pendingVisits = myVisits.filter(
    (v) => v.status === 'Scheduled' || v.status === 'In Progress'
  );
  const completedVisits = myVisits.filter((v) => v.status === 'Completed');
  const myFollowUps = followUps.filter((f) => f.assignedOfficerId === officerId);
  const dueOrOverdueFollowUps = myFollowUps.filter(
    (f) => f.status === 'Due' || f.status === 'Overdue'
  );

  // Assigned Farmers Sub-view
  if (activeNavId === 'assigned-farmers') {
    return (
      <div className="space-y-6">
        <ToastBanner message={toastMessage} onDismiss={onDismissToast} />

        <div className="flex flex-col gap-4 border-b border-[#E2E6E1] pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1A1F1C]">
              Assigned Farmers ({myFarmers.length})
            </h1>
            <p className="mt-1 text-xs text-[#4F5A53]">
              Farmers and registered livestock assigned to {account.fullName} (
              {account.territoryOrUnit}).
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenNewRequest}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#163C2B] px-4 text-xs font-semibold text-white hover:bg-[#102D20] self-start sm:self-auto"
          >
            <ClipboardPlus className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Submit Veterinary Request</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {myFarmers.map((farmer) => {
            const farmerAnimals = animals.filter(
              (a) => a.farmerId === farmer.farmerId
            );
            return (
              <section
                key={farmer.farmerId}
                className="rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-display text-base font-semibold text-[#1A1F1C]">
                        {farmer.fullName}
                      </h2>
                      <span className="font-mono text-xs text-[#52796F]">
                        {farmer.farmerId}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#4F5A53]">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#52796F]" aria-hidden="true" />
                        <span>{farmer.village}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 font-mono">
                        <Phone className="h-3.5 w-3.5 text-[#52796F]" aria-hidden="true" />
                        <span>+91 {farmer.phone}</span>
                      </span>
                    </div>
                  </div>
                  <FarmerStatusBadge status={farmer.status} />
                </div>

                <div className="mt-4 border-t border-[#ECEFEA] pt-3">
                  <p className="text-[11px] font-semibold text-[#626E66]">
                    Registered Animals ({farmerAnimals.length})
                  </p>
                  {farmerAnimals.length === 0 ? (
                    <p className="mt-1 text-xs text-[#626E66]">
                      No animals registered yet.
                    </p>
                  ) : (
                    <div className="mt-2 space-y-2">
                      {farmerAnimals.map((a) => (
                        <div
                          key={a.animalId}
                          className="flex items-center justify-between rounded border border-[#ECEFEA] bg-[#FAFBF9] px-3 py-2 text-xs"
                        >
                          <div>
                            <span className="font-semibold text-[#1A1F1C]">
                              {a.nameOrLabel}
                            </span>{' '}
                            <span className="font-mono text-[#163C2B]">
                              ({a.earTag})
                            </span>
                            <span className="ml-2 text-[#626E66]">
                              {a.animalType} · {a.breed}
                            </span>
                          </div>
                          <AnimalHealthBadge status={a.healthStatus} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    );
  }

  // Field Officer Operational Dashboard
  return (
    <div className="space-y-6">
      <ToastBanner message={toastMessage} onDismiss={onDismissToast} />

      <div className="flex flex-col gap-4 border-b border-[#E2E6E1] pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-medium text-[#52796F]">
            Tuesday, 17 November 2026 · {account.territoryOrUnit}
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-[#1A1F1C]">
            Field Operations — {account.fullName}
          </h1>
          <p className="mt-1 text-xs text-[#4F5A53]">
            Execute assigned farm visits, document observable animal conditions,
            and complete follow-up verifications.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewRequest}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#163C2B] px-4 text-xs font-semibold text-white hover:bg-[#102D20] self-start lg:self-auto whitespace-nowrap shrink-0"
        >
          <ClipboardPlus className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Submit Veterinary Request</span>
        </button>
      </div>

      {/* Role Scope Notice */}
      <div className="flex items-start gap-2.5 rounded-lg border border-[#E2E6E1] bg-white px-4 py-3 text-xs text-[#4F5A53]">
        <ShieldAlert
          className="mt-0.5 h-4 w-4 shrink-0 text-[#2D6A4F]"
          aria-hidden="true"
        />
        <span>
          <span className="font-semibold text-[#1A1F1C]">
            Observation &amp; Coordination Scope:
          </span>{' '}
          Field Officers record farm visit observations and submit veterinary
          assistance requests. Clinical diagnosis and prescriptions are
          restricted to Veterinarians.
        </span>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <button
          type="button"
          onClick={() => onNavigate('assigned-farmers')}
          className="rounded-lg border border-[#E2E6E1] bg-white p-4 text-left shadow-xs hover:border-[#C2CBC3]"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4F5A53]">
            <UserRound className="h-4 w-4 text-[#163C2B]" aria-hidden="true" />
            <span>Assigned Farmers</span>
          </div>
          <p className="mt-3 font-display text-2xl font-semibold text-[#1A1F1C] tabular-nums">
            {myFarmers.length}
          </p>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('farm-visits')}
          className="rounded-lg border border-[#E2E6E1] bg-white p-4 text-left shadow-xs hover:border-[#C2CBC3]"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4F5A53]">
            <ClipboardList className="h-4 w-4 text-[#163C2B]" aria-hidden="true" />
            <span>Total Visits</span>
          </div>
          <p className="mt-3 font-display text-2xl font-semibold text-[#1A1F1C] tabular-nums">
            {myVisits.length}
          </p>
        </button>

        <div className="rounded-lg border border-[#E2E6E1] bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4F5A53]">
            <PawPrint className="h-4 w-4 text-[#92400E]" aria-hidden="true" />
            <span>Pending / Active</span>
          </div>
          <p className="mt-3 font-display text-2xl font-semibold text-[#92400E] tabular-nums">
            {pendingVisits.length}
          </p>
        </div>

        <div className="rounded-lg border border-[#E2E6E1] bg-white p-4 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4F5A53]">
            <CheckCircle2 className="h-4 w-4 text-[#166534]" aria-hidden="true" />
            <span>Completed Visits</span>
          </div>
          <p className="mt-3 font-display text-2xl font-semibold text-[#166534] tabular-nums">
            {completedVisits.length}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('follow-ups')}
          className="rounded-lg border border-[#E2E6E1] bg-white p-4 text-left shadow-xs hover:border-[#C2CBC3]"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4F5A53]">
            <CalendarClock className="h-4 w-4 text-[#B91C1C]" aria-hidden="true" />
            <span>Due Follow-ups</span>
          </div>
          <p className="mt-3 font-display text-2xl font-semibold text-[#B91C1C] tabular-nums">
            {dueOrOverdueFollowUps.length}
          </p>
        </button>
      </div>

      {/* Active Visits & Follow-ups */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-[#E2E6E1] bg-white shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E2E6E1] px-5 py-4">
            <h2 className="font-display text-base font-semibold text-[#1A1F1C]">
              Active &amp; Upcoming Farm Visits
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('farm-visits')}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#163C2B] hover:underline"
            >
              <span>All visits</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="divide-y divide-[#ECEFEA]">
            {pendingVisits.length === 0 ? (
              <p className="px-5 py-8 text-xs text-[#626E66]">
                All scheduled farm visits have been completed.
              </p>
            ) : (
              pendingVisits.map((visit) => (
                <div
                  key={visit.visitId}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono font-semibold text-[#163C2B]">
                        {visit.visitId}
                      </span>
                      <StatusBadge status={visit.status} compact />
                    </div>
                    <p className="mt-1 text-sm font-semibold text-[#1A1F1C]">
                      {visit.farmerName} ({visit.village})
                    </p>
                    <p className="mt-0.5 text-xs text-[#4F5A53]">
                      {visit.purpose} · {visit.scheduledDate} {visit.scheduledTime}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {visit.status === 'Scheduled' ? (
                      <button
                        type="button"
                        onClick={() => onStartVisit(visit.visitId)}
                        className="inline-flex items-center gap-1 rounded-md bg-[#163C2B] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#102D20]"
                      >
                        <Play className="h-3 w-3" aria-hidden="true" />
                        <span>Start Visit</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onOpenObservationModal(visit)}
                        className="inline-flex items-center gap-1 rounded-md bg-[#163C2B] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#102D20]"
                      >
                        <ClipboardPlus className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Record Observation</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="rounded-lg border border-[#E2E6E1] bg-white shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E2E6E1] px-5 py-4">
            <h2 className="font-display text-base font-semibold text-[#1A1F1C]">
              Assigned Follow-up Tasks
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('follow-ups')}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#163C2B] hover:underline"
            >
              <span>Update follow-ups</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="divide-y divide-[#ECEFEA]">
            {myFollowUps.map((fu) => (
              <div
                key={fu.followUpId}
                className="flex items-start justify-between gap-3 px-5 py-3.5 text-xs"
              >
                <div>
                  <p className="font-semibold text-[#1A1F1C]">
                    {fu.farmerName} ·{' '}
                    <span className="font-mono text-[#163C2B]">
                      {fu.animalTag}
                    </span>
                  </p>
                  <p className="mt-0.5 text-[#4F5A53]">{fu.instructionNote}</p>
                  <p className="mt-1 text-[11px] text-[#626E66]">
                    Case {fu.caseId} · Due {fu.dueDate}
                  </p>
                </div>
                <StatusBadge status={fu.status} compact />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
