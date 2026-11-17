import { ArrowLeftRight, MapPin, Phone, UserRound, X } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { ToastBanner } from '../components/ui/ToastBanner';
import type {
  FarmVisitRecord,
  FarmerRecord,
  FieldOfficerOption,
  FollowUpRecord,
} from '../types/gosetu';

interface FieldOfficersPageProps {
  officers: FieldOfficerOption[];
  farmers: FarmerRecord[];
  visits: FarmVisitRecord[];
  followUps: FollowUpRecord[];
  onReassignFarmer: (farmerId: string, newOfficerId: string) => void;
  onOpenFarmerProfile: (farmerId: string) => void;
  toastMessage: string | null;
  onDismissToast: () => void;
}

export function FieldOfficersPage({
  officers,
  farmers,
  visits,
  followUps,
  onReassignFarmer,
  onOpenFarmerProfile,
  toastMessage,
  onDismissToast,
}: FieldOfficersPageProps) {
  const [selectedOfficerId, setSelectedOfficerId] = useState<string | null>(null);
  const [reassignOpen, setReassignOpen] = useState(false);
  const [targetFarmerId, setTargetFarmerId] = useState(farmers[0]?.farmerId ?? '');
  const [targetOfficerId, setTargetOfficerId] = useState(officers[0]?.id ?? '');

  const selectedOfficer =
    officers.find((o) => o.id === selectedOfficerId) ?? null;

  const handleOpenReassign = (defaultOfficerId?: string) => {
    const f = farmers[0];
    if (f) setTargetFarmerId(f.farmerId);
    setTargetOfficerId(defaultOfficerId ?? officers[0]?.id ?? '');
    setReassignOpen(true);
  };

  const handleSubmitReassign = (e: FormEvent) => {
    e.preventDefault();
    if (!targetFarmerId || !targetOfficerId) return;
    onReassignFarmer(targetFarmerId, targetOfficerId);
    setReassignOpen(false);
  };

  return (
    <div className="space-y-6">
      <ToastBanner message={toastMessage} onDismiss={onDismissToast} />

      <div className="flex flex-col gap-4 border-b border-[#E2E6E1] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1A1F1C]">
            Field Officer Management
          </h1>
          <p className="mt-1 text-xs text-[#4F5A53]">
            Manage field officer sub-clusters, workload coverage, and farmer
            assignments.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleOpenReassign()}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#163C2B] px-4 text-xs font-semibold text-white hover:bg-[#102D20] self-start sm:self-auto whitespace-nowrap shrink-0"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Assign / Reassign Farmer</span>
        </button>
      </div>

      {/* Officers Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {officers.map((officer) => {
          const assignedFarmers = farmers.filter(
            (f) => f.assignedOfficerId === officer.id
          );
          const pendingVisits = visits.filter(
            (v) =>
              v.fieldOfficerId === officer.id &&
              (v.status === 'Scheduled' || v.status === 'In Progress')
          );
          const openFollowUps = followUps.filter(
            (fu) =>
              fu.assignedOfficerId === officer.id &&
              fu.status !== 'Completed' &&
              fu.status !== 'Cancelled'
          );

          return (
            <div
              key={officer.id}
              className="flex flex-col justify-between rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#EDF2EE] text-[#163C2B]">
                      <UserRound className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="font-display text-base font-semibold text-[#1A1F1C]">
                        {officer.name}
                      </h2>
                      <p className="font-mono text-[11px] text-[#626E66]">
                        {officer.id} · {officer.subCluster}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-md border border-[#C6E4CE] bg-[#ECF6EF] px-2 py-0.5 text-[11px] font-medium text-[#166534]">
                    {officer.status}
                  </span>
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-[#4F5A53]">
                  <p className="flex items-center gap-1.5 font-mono">
                    <Phone className="h-3.5 w-3.5 text-[#52796F]" aria-hidden="true" />
                    <span>{officer.phone}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[#52796F]" aria-hidden="true" />
                    <span>Villages: {officer.villages.join(', ')}</span>
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 rounded-md border border-[#ECEFEA] bg-[#FAFBF9] p-3 text-center">
                  <div>
                    <p className="font-display text-lg font-semibold text-[#1A1F1C] tabular-nums">
                      {assignedFarmers.length}
                    </p>
                    <p className="text-[11px] text-[#626E66]">Farmers</p>
                  </div>
                  <div>
                    <p className="font-display text-lg font-semibold text-[#1A1F1C] tabular-nums">
                      {pendingVisits.length}
                    </p>
                    <p className="text-[11px] text-[#626E66]">Active Visits</p>
                  </div>
                  <div>
                    <p className="font-display text-lg font-semibold text-[#92400E] tabular-nums">
                      {openFollowUps.length}
                    </p>
                    <p className="text-[11px] text-[#626E66]">Follow-ups</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 border-t border-[#ECEFEA] pt-4">
                <button
                  type="button"
                  onClick={() => setSelectedOfficerId(officer.id)}
                  className="flex-1 rounded-md border border-[#D7DDD7] bg-white py-1.5 text-xs font-medium text-[#163C2B] hover:bg-[#EDF2EE]"
                >
                  View Roster ({assignedFarmers.length})
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenReassign(officer.id)}
                  className="rounded-md border border-[#D7DDD7] bg-white px-3 py-1.5 text-xs font-medium text-[#3D4640] hover:bg-[#F1F3F0]"
                >
                  Assign
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Officer Roster Drawer / Modal */}
      {selectedOfficer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1F1C]/45 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedOfficerId(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg border border-[#E2E6E1] bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#ECEFEA] pb-4">
              <div>
                <h3 className="font-display text-base font-semibold text-[#1A1F1C]">
                  {selectedOfficer.name} — Assigned Farmers
                </h3>
                <p className="mt-0.5 text-xs text-[#626E66]">
                  {selectedOfficer.subCluster} ({selectedOfficer.villages.join(', ')})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOfficerId(null)}
                aria-label="Close"
                className="rounded p-1 text-[#626E66] hover:bg-[#F1F3F0]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 divide-y divide-[#ECEFEA]">
              {farmers
                .filter((f) => f.assignedOfficerId === selectedOfficer.id)
                .map((f) => (
                  <div
                    key={f.farmerId}
                    className="flex items-center justify-between py-2.5 text-xs"
                  >
                    <div>
                      <p className="font-semibold text-[#1A1F1C]">
                        {f.fullName}{' '}
                        <span className="font-mono font-normal text-[#626E66]">
                          ({f.farmerId})
                        </span>
                      </p>
                      <p className="text-[11px] text-[#626E66]">
                        {f.village} · +91 {f.phone}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOfficerId(null);
                        onOpenFarmerProfile(f.farmerId);
                      }}
                      className="text-xs font-medium text-[#163C2B] hover:underline"
                    >
                      Profile
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Reassign Farmer Modal */}
      {reassignOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1F1C]/45 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setReassignOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-lg border border-[#E2E6E1] bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#ECEFEA] pb-3">
              <h3 className="font-display text-base font-semibold text-[#1A1F1C]">
                Assign Farmer to Field Officer
              </h3>
              <button
                type="button"
                onClick={() => setReassignOpen(false)}
                aria-label="Close"
                className="rounded p-1 text-[#626E66] hover:bg-[#F1F3F0]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSubmitReassign} className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="reassign-farmer"
                  className="block text-xs font-semibold text-[#3D4640]"
                >
                  Select Farmer
                </label>
                <select
                  id="reassign-farmer"
                  value={targetFarmerId}
                  onChange={(e) => setTargetFarmerId(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-md border border-[#D4DBD4] bg-white px-3 text-sm text-[#1A1F1C]"
                >
                  {farmers.map((f) => (
                    <option key={f.farmerId} value={f.farmerId}>
                      {f.fullName} ({f.village}) — Current: {f.assignedOfficerName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="reassign-officer"
                  className="block text-xs font-semibold text-[#3D4640]"
                >
                  Target Field Officer
                </label>
                <select
                  id="reassign-officer"
                  value={targetOfficerId}
                  onChange={(e) => setTargetOfficerId(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-md border border-[#D4DBD4] bg-white px-3 text-sm text-[#1A1F1C]"
                >
                  {officers.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.subCluster})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 border-t border-[#ECEFEA] pt-4">
                <button
                  type="button"
                  onClick={() => setReassignOpen(false)}
                  className="rounded-md border border-[#D4DBD4] bg-white px-4 py-2 text-xs font-medium text-[#3D4640]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-[#163C2B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#102D20]"
                >
                  Update Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
