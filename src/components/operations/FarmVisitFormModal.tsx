import { X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import type {
  FarmVisitRecord,
  FarmerRecord,
  FieldOfficerOption,
} from '../../types/gosetu';

interface FarmVisitFormModalProps {
  open: boolean;
  farmers: FarmerRecord[];
  fieldOfficers: FieldOfficerOption[];
  existingVisits: FarmVisitRecord[];
  onClose: () => void;
  onSave: (visit: FarmVisitRecord) => void;
}

export function FarmVisitFormModal({
  open,
  farmers,
  fieldOfficers,
  existingVisits,
  onClose,
  onSave,
}: FarmVisitFormModalProps) {
  const activeFarmers = farmers.filter((f) => f.status === 'Active');
  const [farmerId, setFarmerId] = useState(activeFarmers[0]?.farmerId ?? '');
  const [officerId, setOfficerId] = useState(
    activeFarmers[0]?.assignedOfficerId ?? fieldOfficers[0]?.id ?? ''
  );
  const [scheduledDate, setScheduledDate] = useState('2026-11-18');
  const [scheduledTime, setScheduledTime] = useState('10:00 AM');
  const [purpose, setPurpose] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const first = activeFarmers[0] ?? farmers[0];
    if (first) {
      setFarmerId(first.farmerId);
      setOfficerId(first.assignedOfficerId);
    }
    setScheduledDate('2026-11-18');
    setScheduledTime('10:00 AM');
    setPurpose('');
    setError(null);
  }, [open, farmers]);

  const handleFarmerChange = (nextId: string) => {
    setFarmerId(nextId);
    const found = farmers.find((f) => f.farmerId === nextId);
    if (found) {
      setOfficerId(found.assignedOfficerId);
    }
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

  const formatDisplayDate = (isoDate: string) => {
    const parsed = new Date(`${isoDate}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) return isoDate;
    return parsed.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const generateNextVisitId = () => {
    const maxNum = existingVisits.reduce((max, v) => {
      const n = parseInt(v.visitId.replace('VST-', ''), 10);
      return Number.isNaN(n) ? max : Math.max(max, n);
    }, 4106);
    return `VST-${maxNum + 1}`;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!farmerId || !officerId || !scheduledDate || !purpose.trim()) {
      setError('Complete farmer, field officer, date, and visit purpose.');
      return;
    }

    const farmer = farmers.find((f) => f.farmerId === farmerId);
    const officer = fieldOfficers.find((o) => o.id === officerId);
    if (!farmer || !officer) {
      setError('Selected farmer or officer is invalid.');
      return;
    }

    const newVisit: FarmVisitRecord = {
      visitId: generateNextVisitId(),
      farmerId: farmer.farmerId,
      farmerName: farmer.fullName,
      location: farmer.address,
      village: farmer.village,
      subCluster: farmer.subCluster,
      fieldOfficerId: officer.id,
      fieldOfficer: officer.name,
      scheduledDate: formatDisplayDate(scheduledDate),
      scheduledTime,
      purpose: purpose.trim(),
      status: 'Scheduled',
      observations: [],
    };

    onSave(newVisit);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1F1C]/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="visit-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-lg border border-[#E2E6E1] bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#E2E6E1] px-6 py-4">
          <div>
            <h2
              id="visit-modal-title"
              className="font-display text-lg font-semibold text-[#1A1F1C]"
            >
              Schedule Farm Visit
            </h2>
            <p className="mt-0.5 text-xs text-[#626E66]">
              Assign a field officer visit for routine herd checks or follow-ups.
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

          <div>
            <label
              htmlFor="visit-farmer"
              className="block text-xs font-semibold text-[#3D4640]"
            >
              Farmer &amp; Farm Location <span className="text-[#B91C1C]">*</span>
            </label>
            <select
              id="visit-farmer"
              value={farmerId}
              onChange={(e) => handleFarmerChange(e.target.value)}
              className="mt-1.5 h-10 w-full rounded-md border border-[#D4DBD4] bg-white px-3 text-sm text-[#1A1F1C] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
            >
              {farmers.map((f) => (
                <option key={f.farmerId} value={f.farmerId}>
                  {f.fullName} ({f.village}) · {f.farmerId}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="visit-officer"
              className="block text-xs font-semibold text-[#3D4640]"
            >
              Assigned Field Officer <span className="text-[#B91C1C]">*</span>
            </label>
            <select
              id="visit-officer"
              value={officerId}
              onChange={(e) => setOfficerId(e.target.value)}
              className="mt-1.5 h-10 w-full rounded-md border border-[#D4DBD4] bg-white px-3 text-sm text-[#1A1F1C] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
            >
              {fieldOfficers.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name} · {o.subCluster}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="visit-date"
                className="block text-xs font-semibold text-[#3D4640]"
              >
                Scheduled Date <span className="text-[#B91C1C]">*</span>
              </label>
              <input
                id="visit-date"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="mt-1.5 h-10 w-full rounded-md border border-[#D4DBD4] bg-white px-3 text-sm text-[#1A1F1C] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
              />
            </div>

            <div>
              <label
                htmlFor="visit-time"
                className="block text-xs font-semibold text-[#3D4640]"
              >
                Time Slot
              </label>
              <select
                id="visit-time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="mt-1.5 h-10 w-full rounded-md border border-[#D4DBD4] bg-white px-3 text-sm text-[#1A1F1C] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
              >
                <option value="08:30 AM">08:30 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="visit-purpose"
              className="block text-xs font-semibold text-[#3D4640]"
            >
              Visit Purpose <span className="text-[#B91C1C]">*</span>
            </label>
            <textarea
              id="visit-purpose"
              rows={2}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Routine herd inspection, ear-tag verification, or follow-up check"
              className="mt-1.5 w-full rounded-md border border-[#D4DBD4] bg-white px-3 py-2 text-sm text-[#1A1F1C] placeholder:text-[#7E8981] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
            />
          </div>

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
              className="rounded-md bg-[#163C2B] px-5 py-2 text-xs font-semibold text-white hover:bg-[#102D20]"
            >
              Schedule Visit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
