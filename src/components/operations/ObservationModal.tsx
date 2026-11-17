import { ShieldAlert, X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import type { AnimalRecord, FarmVisitRecord, VisitObservation } from '../../types/gosetu';

interface ObservationModalProps {
  open: boolean;
  visit: FarmVisitRecord | null;
  farmerAnimals: AnimalRecord[];
  officerName: string;
  onClose: () => void;
  onSave: (
    visitId: string,
    observation: VisitObservation,
    raiseVetRequest: boolean
  ) => void;
}

export function ObservationModal({
  open,
  visit,
  farmerAnimals,
  officerName,
  onClose,
  onSave,
}: ObservationModalProps) {
  const [animalId, setAnimalId] = useState('');
  const [farmerConcern, setFarmerConcern] = useState('');
  const [observableSymptoms, setObservableSymptoms] = useState('');
  const [appetiteAndYieldNote, setAppetiteAndYieldNote] = useState('');
  const [temperatureNote, setTemperatureNote] = useState('');
  const [raiseVetRequest, setRaiseVetRequest] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setAnimalId(farmerAnimals[0]?.animalId ?? '');
    setFarmerConcern('');
    setObservableSymptoms('');
    setAppetiteAndYieldNote('');
    setTemperatureNote('');
    setRaiseVetRequest(false);
    setError(null);
  }, [open, farmerAnimals]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open || !visit) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!animalId || !farmerConcern.trim() || !observableSymptoms.trim()) {
      setError(
        'Select an animal and enter both the farmer-reported concern and your visible field observations.'
      );
      return;
    }

    const animal = farmerAnimals.find((a) => a.animalId === animalId);
    if (!animal) return;

    const observation: VisitObservation = {
      id: `OBS-${Date.now().toString().slice(-4)}`,
      animalId: animal.animalId,
      animalTag: animal.earTag,
      animalName: animal.nameOrLabel,
      farmerConcern: farmerConcern.trim(),
      observableSymptoms: observableSymptoms.trim(),
      appetiteAndYieldNote:
        appetiteAndYieldNote.trim() || 'Normal feed and water intake observed.',
      temperatureNote: temperatureNote.trim() || 'Not measured on-site',
      recordedAt: '17 Nov 2026 · Just now',
      recordedBy: officerName,
    };

    onSave(visit.visitId, observation, raiseVetRequest);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1F1C]/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="obs-modal-title"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-lg border border-[#E2E6E1] bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#E2E6E1] px-6 py-4">
          <div>
            <h2
              id="obs-modal-title"
              className="font-display text-lg font-semibold text-[#1A1F1C]"
            >
              Record Field Observation · {visit.visitId}
            </h2>
            <p className="mt-0.5 text-xs text-[#626E66]">
              Farm: {visit.farmerName} ({visit.village})
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
          {/* Role Policy Reminder */}
          <div className="flex items-start gap-2.5 rounded-md border border-[#E2E6E1] bg-[#FAFBF9] px-3.5 py-2.5 text-xs text-[#4F5A53]">
            <ShieldAlert
              className="mt-0.5 h-4 w-4 shrink-0 text-[#2D6A4F]"
              aria-hidden="true"
            />
            <span>
              Field Officer scope: record observable symptoms and farmer
              concerns only. Clinical diagnosis and prescriptions are handled
              exclusively by a Veterinarian.
            </span>
          </div>

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
              htmlFor="obs-animal"
              className="block text-xs font-semibold text-[#3D4640]"
            >
              Select Animal <span className="text-[#B91C1C]">*</span>
            </label>
            <select
              id="obs-animal"
              value={animalId}
              onChange={(e) => setAnimalId(e.target.value)}
              className="mt-1.5 h-10 w-full rounded-md border border-[#D4DBD4] bg-white px-3 text-sm text-[#1A1F1C] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
            >
              {farmerAnimals.map((a) => (
                <option key={a.animalId} value={a.animalId}>
                  {a.nameOrLabel} ({a.earTag}) · {a.animalType} · {a.breed}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="obs-concern"
              className="block text-xs font-semibold text-[#3D4640]"
            >
              Farmer-Reported Concern <span className="text-[#B91C1C]">*</span>
            </label>
            <textarea
              id="obs-concern"
              rows={2}
              value={farmerConcern}
              onChange={(e) => setFarmerConcern(e.target.value)}
              placeholder="What did the farmer notice or report?"
              className="mt-1.5 w-full rounded-md border border-[#D4DBD4] bg-white px-3 py-2 text-sm text-[#1A1F1C] placeholder:text-[#7E8981] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
            />
          </div>

          <div>
            <label
              htmlFor="obs-symptoms"
              className="block text-xs font-semibold text-[#3D4640]"
            >
              Observable Physical Signs <span className="text-[#B91C1C]">*</span>
            </label>
            <textarea
              id="obs-symptoms"
              rows={2}
              value={observableSymptoms}
              onChange={(e) => setObservableSymptoms(e.target.value)}
              placeholder="e.g. Udder swelling, limping, nasal discharge, posture lethargy"
              className="mt-1.5 w-full rounded-md border border-[#D4DBD4] bg-white px-3 py-2 text-sm text-[#1A1F1C] placeholder:text-[#7E8981] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="obs-appetite"
                className="block text-xs font-semibold text-[#3D4640]"
              >
                Appetite &amp; Milk Yield Note
              </label>
              <input
                id="obs-appetite"
                type="text"
                value={appetiteAndYieldNote}
                onChange={(e) => setAppetiteAndYieldNote(e.target.value)}
                placeholder="e.g. Reduced fodder; yield down 20%"
                className="mt-1.5 h-10 w-full rounded-md border border-[#D4DBD4] bg-white px-3 text-sm text-[#1A1F1C] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
              />
            </div>

            <div>
              <label
                htmlFor="obs-temp"
                className="block text-xs font-semibold text-[#3D4640]"
              >
                Observed Temperature (if checked)
              </label>
              <input
                id="obs-temp"
                type="text"
                value={temperatureNote}
                onChange={(e) => setTemperatureNote(e.target.value)}
                placeholder="e.g. 102.6 °F"
                className="mt-1.5 h-10 w-full rounded-md border border-[#D4DBD4] bg-white px-3 text-sm text-[#1A1F1C] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
              />
            </div>
          </div>

          <label className="flex items-start gap-2.5 rounded-md border border-[#E2E6E1] bg-[#F7F8F6] px-3.5 py-3 text-xs text-[#1A1F1C] cursor-pointer">
            <input
              type="checkbox"
              checked={raiseVetRequest}
              onChange={(e) => setRaiseVetRequest(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[#B8C2BA] text-[#163C2B] focus:ring-[#163C2B]"
            />
            <span>
              <span className="font-semibold">
                Submit Veterinary Assistance Request immediately
              </span>
              <span className="mt-0.5 block text-[11px] text-[#626E66]">
                Routes this observation directly to the Organization
                Administrator queue for veterinarian assignment.
              </span>
            </span>
          </label>

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
              Save Observation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
