import { X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import type { VeterinarianRecord, VeterinaryCaseRecord } from '../../types/gosetu';

interface AssignVetModalProps {
  open: boolean;
  caseRecord: VeterinaryCaseRecord | null;
  veterinarians: VeterinarianRecord[];
  allCases: VeterinaryCaseRecord[];
  onClose: () => void;
  onAssign: (caseId: string, vet: VeterinarianRecord, note: string) => void;
}

export function AssignVetModal({
  open,
  caseRecord,
  veterinarians,
  allCases,
  onClose,
  onAssign,
}: AssignVetModalProps) {
  const [selectedVetId, setSelectedVetId] = useState(veterinarians[0]?.id ?? '');
  const [assignmentNote, setAssignmentNote] = useState('');

  useEffect(() => {
    if (!open) return;
    setSelectedVetId(caseRecord?.assignedVetId ?? veterinarians[0]?.id ?? '');
    setAssignmentNote('');
  }, [open, caseRecord, veterinarians]);

  if (!open || !caseRecord) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const vet = veterinarians.find((v) => v.id === selectedVetId);
    if (!vet) return;
    onAssign(caseRecord.caseId, vet, assignmentNote.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1F1C]/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="assign-vet-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg border border-[#E2E6E1] bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-[#ECEFEA] pb-4">
          <div>
            <h2
              id="assign-vet-title"
              className="font-display text-base font-semibold text-[#1A1F1C]"
            >
              Assign Veterinarian · {caseRecord.caseId}
            </h2>
            <p className="mt-0.5 text-xs text-[#626E66]">
              {caseRecord.farmerName} ({caseRecord.village}) · {caseRecord.animalTag}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded p-1 text-[#626E66] hover:bg-[#F1F3F0]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <span className="block text-xs font-semibold text-[#3D4640]">
              Select Panel Veterinarian
            </span>
            <div className="mt-2 space-y-2">
              {veterinarians.map((vet) => {
                const activeCount = allCases.filter(
                  (c) =>
                    c.assignedVetId === vet.id &&
                    c.status !== 'Closed' &&
                    c.status !== 'Cancelled'
                ).length;
                const isSelected = vet.id === selectedVetId;
                return (
                  <label
                    key={vet.id}
                    className={`flex cursor-pointer items-start justify-between rounded-md border p-3 text-xs transition-colors ${
                      isSelected
                        ? 'border-[#163C2B] bg-[#EDF2EE]'
                        : 'border-[#E2E6E1] bg-white hover:bg-[#FAFBF9]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="radio"
                        name="assign-vet"
                        checked={isSelected}
                        onChange={() => setSelectedVetId(vet.id)}
                        className="mt-0.5 text-[#163C2B] focus:ring-[#163C2B]"
                      />
                      <div>
                        <p className="font-semibold text-[#1A1F1C]">{vet.name}</p>
                        <p className="text-[11px] text-[#4F5A53]">
                          {vet.specialization}
                        </p>
                        <p className="mt-0.5 text-[11px] text-[#626E66]">
                          Clusters: {vet.clusters.join(', ')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono text-[11px] font-semibold text-[#163C2B] tabular-nums">
                        {activeCount} active
                      </span>
                      <p className="text-[10px] text-[#626E66]">{vet.availability}</p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="assign-note"
              className="block text-xs font-semibold text-[#3D4640]"
            >
              Admin Triage Note (Optional)
            </label>
            <textarea
              id="assign-note"
              rows={2}
              value={assignmentNote}
              onChange={(e) => setAssignmentNote(e.target.value)}
              placeholder="Priority instructions or cluster coordination note for the veterinarian"
              className="mt-1.5 w-full rounded-md border border-[#D4DBD4] bg-white px-3 py-2 text-sm text-[#1A1F1C] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
            />
          </div>

          <div className="flex justify-end gap-2.5 border-t border-[#ECEFEA] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-[#D4DBD4] bg-white px-4 py-2 text-xs font-medium text-[#3D4640]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-[#163C2B] px-5 py-2 text-xs font-semibold text-white hover:bg-[#102D20]"
            >
              Confirm Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
