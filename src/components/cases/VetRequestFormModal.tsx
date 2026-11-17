import { X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import type {
  AnimalRecord,
  FarmerRecord,
  UserRole,
  VeterinaryCaseRecord,
} from '../../types/gosetu';

interface VetRequestFormModalProps {
  open: boolean;
  role: UserRole;
  reporterName: string;
  lockedFarmerId?: string;
  farmers: FarmerRecord[];
  animals: AnimalRecord[];
  existingCases: VeterinaryCaseRecord[];
  onClose: () => void;
  onSubmit: (newCase: VeterinaryCaseRecord) => void;
}

export function VetRequestFormModal({
  open,
  role,
  reporterName,
  lockedFarmerId,
  farmers,
  animals,
  existingCases,
  onClose,
  onSubmit,
}: VetRequestFormModalProps) {
  const initialFarmerId = lockedFarmerId ?? farmers[0]?.farmerId ?? '';
  const [farmerId, setFarmerId] = useState(initialFarmerId);
  const [animalId, setAnimalId] = useState('');
  const [priority, setPriority] = useState<'Routine' | 'Priority' | 'Urgent'>('Priority');
  const [concernSummary, setConcernSummary] = useState('');
  const [fieldObservations, setFieldObservations] = useState('');
  const [error, setError] = useState<string | null>(null);

  const farmerAnimals = animals.filter((a) => a.farmerId === farmerId);

  useEffect(() => {
    if (!open) return;
    const fId = lockedFarmerId ?? farmers[0]?.farmerId ?? '';
    setFarmerId(fId);
    const matching = animals.filter((a) => a.farmerId === fId);
    setAnimalId(matching[0]?.animalId ?? '');
    setPriority('Priority');
    setConcernSummary('');
    setFieldObservations('');
    setError(null);
  }, [open, lockedFarmerId, farmers, animals]);

  const handleFarmerChange = (nextFarmerId: string) => {
    setFarmerId(nextFarmerId);
    const matching = animals.filter((a) => a.farmerId === nextFarmerId);
    setAnimalId(matching[0]?.animalId ?? '');
  };

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const generateNextId = () => {
    const maxNum = existingCases.reduce((max, c) => {
      const num = parseInt(c.caseId.split('-').pop() ?? '0', 10);
      return Number.isNaN(num) ? max : Math.max(max, num);
    }, 842);
    return `REQ-2026-0${maxNum + 1}`;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!farmerId || !animalId || !concernSummary.trim()) {
      setError('Select a farmer, animal, and describe the health concern.');
      return;
    }

    const farmer = farmers.find((f) => f.farmerId === farmerId);
    const animal = animals.find((a) => a.animalId === animalId);
    if (!farmer || !animal) {
      setError('Selected farmer or animal is invalid.');
      return;
    }

    const nowLabel = '17 Nov 2026 · Just now';
    const caseId = generateNextId();

    const record: VeterinaryCaseRecord = {
      caseId,
      requestDate: '17 Nov 2026',
      submittedTime: 'Just now',
      farmerId: farmer.farmerId,
      farmerName: farmer.fullName,
      village: farmer.village,
      animalId: animal.animalId,
      animalTag: animal.earTag,
      speciesBreed: `${animal.animalType} · ${animal.breed}`,
      concernSummary: concernSummary.trim(),
      fieldObservations: fieldObservations.trim() || undefined,
      reportedBy:
        role === 'farmer'
          ? `${farmer.fullName} (Farmer)`
          : role === 'field_officer'
            ? `${reporterName} (Officer)`
            : `${reporterName} (Admin)`,
      reportedByRole: role,
      assignedVetId: null,
      assignedVet: null,
      priority,
      status: 'Submitted',
      lastUpdated: nowLabel,
      timeline: [
        {
          id: `EVT-${Date.now()}`,
          timestamp: nowLabel,
          actor: reporterName,
          role:
            role === 'farmer'
              ? 'Farmer'
              : role === 'field_officer'
                ? 'Field Officer'
                : 'Organization Administrator',
          title: 'Veterinary assistance request submitted',
          detail: concernSummary.trim(),
        },
      ],
    };

    onSubmit(record);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1F1C]/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="vet-request-title"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-lg border border-[#E2E6E1] bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#E2E6E1] px-6 py-4">
          <div>
            <h2
              id="vet-request-title"
              className="font-display text-lg font-semibold text-[#1A1F1C]"
            >
              Request Veterinary Assistance
            </h2>
            <p className="mt-0.5 text-xs text-[#626E66]">
              Submit an animal health concern for administrative review and
              veterinarian assignment.
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

        <form onSubmit={handleSubmit} className="space-y-4 p-6" noValidate>
          {error && (
            <div
              role="alert"
              className="rounded-md border border-[#F3C6C6] bg-[#FEF5F5] px-3 py-2 text-xs text-[#991B1B]"
            >
              {error}
            </div>
          )}

          {!lockedFarmerId && (
            <div>
              <label
                htmlFor="req-farmer"
                className="block text-xs font-semibold text-[#3D4640]"
              >
                Farmer <span className="text-[#B91C1C]">*</span>
              </label>
              <select
                id="req-farmer"
                value={farmerId}
                onChange={(e) => handleFarmerChange(e.target.value)}
                className="mt-1.5 h-10 w-full rounded-md border border-[#D4DBD4] bg-white px-3 text-sm text-[#1A1F1C]"
              >
                {farmers.map((f) => (
                  <option key={f.farmerId} value={f.farmerId}>
                    {f.fullName} ({f.village}) · {f.farmerId}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label
              htmlFor="req-animal"
              className="block text-xs font-semibold text-[#3D4640]"
            >
              Select Animal <span className="text-[#B91C1C]">*</span>
            </label>
            <select
              id="req-animal"
              value={animalId}
              onChange={(e) => setAnimalId(e.target.value)}
              className="mt-1.5 h-10 w-full rounded-md border border-[#D4DBD4] bg-white px-3 text-sm text-[#1A1F1C]"
            >
              {farmerAnimals.length === 0 ? (
                <option value="">No registered animals for this farmer</option>
              ) : (
                farmerAnimals.map((a) => (
                  <option key={a.animalId} value={a.animalId}>
                    {a.nameOrLabel} ({a.earTag}) · {a.animalType} · {a.breed}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="req-priority"
              className="block text-xs font-semibold text-[#3D4640]"
            >
              Urgency / Priority
            </label>
            <select
              id="req-priority"
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value as 'Routine' | 'Priority' | 'Urgent')
              }
              className="mt-1.5 h-10 w-full rounded-md border border-[#D4DBD4] bg-white px-3 text-sm text-[#1A1F1C]"
            >
              <option value="Routine">Routine (Standard review)</option>
              <option value="Priority">Priority (Needs same-day review)</option>
              <option value="Urgent">Urgent (Immediate veterinary attention)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="req-concern"
              className="block text-xs font-semibold text-[#3D4640]"
            >
              Animal Health Concern <span className="text-[#B91C1C]">*</span>
            </label>
            <textarea
              id="req-concern"
              rows={3}
              value={concernSummary}
              onChange={(e) => setConcernSummary(e.target.value)}
              placeholder="Describe what you observed (e.g. reduced appetite, milk drop, fever, limping)"
              className="mt-1.5 w-full rounded-md border border-[#D4DBD4] bg-white px-3 py-2 text-sm text-[#1A1F1C] placeholder:text-[#7E8981] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
            />
          </div>

          {role !== 'farmer' && (
            <div>
              <label
                htmlFor="req-observations"
                className="block text-xs font-semibold text-[#3D4640]"
              >
                Field Observations (Optional)
              </label>
              <textarea
                id="req-observations"
                rows={2}
                value={fieldObservations}
                onChange={(e) => setFieldObservations(e.target.value)}
                placeholder="Observable signs, shed conditions, or temperature recorded on-site"
                className="mt-1.5 w-full rounded-md border border-[#D4DBD4] bg-white px-3 py-2 text-sm text-[#1A1F1C] placeholder:text-[#7E8981] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 border-t border-[#ECEFEA] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-[#D4DBD4] bg-white px-4 py-2 text-xs font-medium text-[#3D4640] hover:bg-[#F1F3F0]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={farmerAnimals.length === 0}
              className="rounded-md bg-[#163C2B] px-5 py-2 text-xs font-semibold text-white hover:bg-[#102D20] disabled:opacity-50"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
