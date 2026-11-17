import { X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { BREEDS_BY_TYPE } from '../../data/mockPhase2Data';
import type {
  AnimalGender,
  AnimalHealthStatus,
  AnimalRecord,
  AnimalType,
  FarmerRecord,
  LactationStage,
} from '../../types/gosetu';

interface AnimalFormModalProps {
  open: boolean;
  initialAnimal: AnimalRecord | null;
  prefilledFarmerId?: string;
  lockFarmerSelection?: boolean;
  farmers: FarmerRecord[];
  existingAnimals: AnimalRecord[];
  onClose: () => void;
  onSave: (animal: AnimalRecord, isEdit: boolean) => void;
}

interface FieldErrors {
  farmerId?: string;
  earTag?: string;
  nameOrLabel?: string;
  breed?: string;
  age?: string;
}

export function AnimalFormModal({
  open,
  initialAnimal,
  prefilledFarmerId,
  lockFarmerSelection = false,
  farmers,
  existingAnimals,
  onClose,
  onSave,
}: AnimalFormModalProps) {
  const isEdit = Boolean(initialAnimal);

  const [farmerId, setFarmerId] = useState('');
  const [earTag, setEarTag] = useState('');
  const [nameOrLabel, setNameOrLabel] = useState('');
  const [animalType, setAnimalType] = useState<AnimalType>('Cattle');
  const [breed, setBreed] = useState(BREEDS_BY_TYPE.Cattle[0]);
  const [gender, setGender] = useState<AnimalGender>('Female');
  const [ageYears, setAgeYears] = useState('3');
  const [ageMonths, setAgeMonths] = useState('0');
  const [lactationStage, setLactationStage] = useState<LactationStage>('Milking');
  const [healthStatus, setHealthStatus] = useState<AnimalHealthStatus>('Healthy');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (!open) return;
    if (initialAnimal) {
      setFarmerId(initialAnimal.farmerId);
      setEarTag(initialAnimal.earTag);
      setNameOrLabel(initialAnimal.nameOrLabel);
      setAnimalType(initialAnimal.animalType);
      setBreed(initialAnimal.breed);
      setGender(initialAnimal.gender);
      setAgeYears(String(initialAnimal.ageYears));
      setAgeMonths(String(initialAnimal.ageMonths));
      setLactationStage(initialAnimal.lactationStage);
      setHealthStatus(initialAnimal.healthStatus);
      setNotes(initialAnimal.notes ?? '');
    } else {
      const defaultFarmerId = prefilledFarmerId ?? farmers[0]?.farmerId ?? '';
      setFarmerId(defaultFarmerId);
      setEarTag('IN-MH-');
      setNameOrLabel('');
      setAnimalType('Cattle');
      setBreed(BREEDS_BY_TYPE.Cattle[0]);
      setGender('Female');
      setAgeYears('3');
      setAgeMonths('0');
      setLactationStage('Milking');
      setHealthStatus('Healthy');
      setNotes('');
    }
    setErrors({});
  }, [open, initialAnimal, prefilledFarmerId, farmers]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleTypeChange = (nextType: AnimalType) => {
    setAnimalType(nextType);
    const validBreeds = BREEDS_BY_TYPE[nextType];
    if (!validBreeds.includes(breed)) {
      setBreed(validBreeds[0]);
    }
  };

  const handleGenderChange = (nextGender: AnimalGender) => {
    setGender(nextGender);
    if (nextGender === 'Male') {
      setLactationStage('Not Applicable');
    } else if (lactationStage === 'Not Applicable') {
      setLactationStage('Milking');
    }
  };

  const validate = (): boolean => {
    const nextErrors: FieldErrors = {};
    const cleanTag = earTag.trim().toUpperCase();
    const yrs = Number(ageYears);
    const mos = Number(ageMonths);

    if (!farmerId) {
      nextErrors.farmerId = 'Select the farmer who owns this animal.';
    }
    if (!cleanTag || cleanTag.length < 6) {
      nextErrors.earTag = 'Enter a valid ear-tag identifier (e.g. IN-MH-449310).';
    } else {
      const duplicate = existingAnimals.find(
        (a) =>
          a.earTag.toUpperCase() === cleanTag &&
          a.animalId !== initialAnimal?.animalId
      );
      if (duplicate) {
        nextErrors.earTag = `Ear tag ${cleanTag} is already registered to ${duplicate.nameOrLabel} (${duplicate.animalId}).`;
      }
    }

    if (!nameOrLabel.trim() || nameOrLabel.trim().length < 2) {
      nextErrors.nameOrLabel = 'Enter an animal name or local shed label.';
    }
    if (!breed) {
      nextErrors.breed = 'Select a breed.';
    }
    if (
      Number.isNaN(yrs) ||
      Number.isNaN(mos) ||
      yrs < 0 ||
      yrs > 25 ||
      mos < 0 ||
      mos > 11 ||
      (yrs === 0 && mos === 0)
    ) {
      nextErrors.age = 'Enter a valid age (years 0–25, months 0–11, not both zero).';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const generateNextAnimalId = () => {
    const maxNum = existingAnimals.reduce((max, item) => {
      const num = parseInt(item.animalId.replace('ANM-', ''), 10);
      return Number.isNaN(num) ? max : Math.max(max, num);
    }, 3076);
    return `ANM-${maxNum + 1}`;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const record: AnimalRecord = {
      animalId: initialAnimal?.animalId ?? generateNextAnimalId(),
      earTag: earTag.trim().toUpperCase(),
      nameOrLabel: nameOrLabel.trim(),
      farmerId,
      animalType,
      breed,
      gender,
      ageYears: Number(ageYears),
      ageMonths: Number(ageMonths),
      lactationStage,
      healthStatus,
      registeredDate: initialAnimal?.registeredDate ?? '17 Nov 2026',
      lastCheckedDate: initialAnimal?.lastCheckedDate ?? '17 Nov 2026',
      notes: notes.trim() || undefined,
    };

    onSave(record, isEdit);
  };

  const availableBreeds = BREEDS_BY_TYPE[animalType];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1F1C]/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="animal-form-title"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-[#E2E6E1] bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E2E6E1] bg-white px-6 py-4">
          <div>
            <h2
              id="animal-form-title"
              className="font-display text-lg font-semibold text-[#1A1F1C]"
            >
              {isEdit
                ? `Edit Animal · ${initialAnimal?.earTag}`
                : 'Register Livestock Animal'}
            </h2>
            <p className="mt-0.5 text-xs text-[#626E66]">
              Fields marked with <span className="text-[#B91C1C]">*</span> are required for ear-tag registration.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close animal form"
            className="rounded-md p-1.5 text-[#626E66] hover:bg-[#F1F3F0] hover:text-[#1A1F1C]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6" noValidate>
          {/* Section 1: Ownership & Ear Tag */}
          <div>
            <h3 className="text-xs font-semibold tracking-wide text-[#2D6A4F]">
              1. Farmer Ownership &amp; Identification
            </h3>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="animal-farmer"
                  className="block text-xs font-semibold text-[#3D4640]"
                >
                  Linked Farmer <span className="text-[#B91C1C]">*</span>
                </label>
                <select
                  id="animal-farmer"
                  value={farmerId}
                  disabled={lockFarmerSelection}
                  onChange={(e) => setFarmerId(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-md border border-[#D4DBD4] bg-white px-3 text-sm text-[#1A1F1C] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B] disabled:bg-[#F7F8F6] disabled:text-[#4F5A53]"
                >
                  {farmers.map((f) => (
                    <option key={f.farmerId} value={f.farmerId}>
                      {f.fullName} ({f.farmerId}) · {f.village}
                    </option>
                  ))}
                </select>
                {errors.farmerId && (
                  <p className="mt-1 text-xs text-[#B91C1C]">{errors.farmerId}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="animal-ear-tag"
                  className="block text-xs font-semibold text-[#3D4640]"
                >
                  Ear Tag / Identification <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="animal-ear-tag"
                  type="text"
                  value={earTag}
                  onChange={(e) => setEarTag(e.target.value)}
                  placeholder="e.g. IN-MH-449310"
                  className="mt-1.5 h-10 w-full rounded-md border border-[#D4DBD4] bg-white px-3 font-mono text-sm uppercase text-[#1A1F1C] placeholder:font-sans placeholder:normal-case placeholder:text-[#7E8981] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
                />
                {errors.earTag && (
                  <p className="mt-1 text-xs text-[#B91C1C]">{errors.earTag}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="animal-name"
                  className="block text-xs font-semibold text-[#3D4640]"
                >
                  Animal Name / Local Label <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="animal-name"
                  type="text"
                  value={nameOrLabel}
                  onChange={(e) => setNameOrLabel(e.target.value)}
                  placeholder="e.g. Gauri or Shed-A2"
                  className="mt-1.5 h-10 w-full rounded-md border border-[#D4DBD4] bg-white px-3 text-sm text-[#1A1F1C] placeholder:text-[#7E8981] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
                />
                {errors.nameOrLabel && (
                  <p className="mt-1 text-xs text-[#B91C1C]">{errors.nameOrLabel}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Biological & Dairy Details */}
          <div className="border-t border-[#ECEFEA] pt-5">
            <h3 className="text-xs font-semibold tracking-wide text-[#2D6A4F]">
              2. Species, Breed &amp; Biological Profile
            </h3>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="animal-type"
                  className="block text-xs font-semibold text-[#3D4640]"
                >
                  Animal Type <span className="text-[#B91C1C]">*</span>
                </label>
                <select
                  id="animal-type"
                  value={animalType}
                  onChange={(e) => handleTypeChange(e.target.value as AnimalType)}
                  className="mt-1.5 h-10 w-full rounded-md border border-[#D4DBD4] bg-white px-3 text-sm text-[#1A1F1C] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
                >
                  <option value="Cattle">Cattle</option>
                  <option value="Buffalo">Buffalo</option>
                  <option value="Goat">Goat</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="animal-breed"
                  className="block text-xs font-semibold text-[#3D4640]"
                >
                  Breed <span className="text-[#B91C1C]">*</span>
                </label>
                <select
                  id="animal-breed"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-md border border-[#D4DBD4] bg-white px-3 text-sm text-[#1A1F1C] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
                >
                  {availableBreeds.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                {errors.breed && (
                  <p className="mt-1 text-xs text-[#B91C1C]">{errors.breed}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="animal-gender"
                  className="block text-xs font-semibold text-[#3D4640]"
                >
                  Gender
                </label>
                <select
                  id="animal-gender"
                  value={gender}
                  onChange={(e) => handleGenderChange(e.target.value as AnimalGender)}
                  className="mt-1.5 h-10 w-full rounded-md border border-[#D4DBD4] bg-white px-3 text-sm text-[#1A1F1C] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="animal-lactation"
                  className="block text-xs font-semibold text-[#3D4640]"
                >
                  Lactation / Stage
                </label>
                <select
                  id="animal-lactation"
                  value={lactationStage}
                  disabled={gender === 'Male'}
                  onChange={(e) =>
                    setLactationStage(e.target.value as LactationStage)
                  }
                  className="mt-1.5 h-10 w-full rounded-md border border-[#D4DBD4] bg-white px-3 text-sm text-[#1A1F1C] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B] disabled:bg-[#F7F8F6] disabled:text-[#626E66]"
                >
                  <option value="Milking">Milking</option>
                  <option value="Dry">Dry</option>
                  <option value="Pregnant">Pregnant</option>
                  <option value="Heifer / Calf">Heifer / Calf</option>
                  <option value="Not Applicable">Not Applicable</option>
                </select>
              </div>

              <div>
                <span className="block text-xs font-semibold text-[#3D4640]">
                  Age (Years &amp; Months) <span className="text-[#B91C1C]">*</span>
                </span>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="animal-age-years" className="sr-only">
                      Years
                    </label>
                    <div className="relative">
                      <input
                        id="animal-age-years"
                        type="number"
                        min={0}
                        max={25}
                        value={ageYears}
                        onChange={(e) => setAgeYears(e.target.value)}
                        className="h-10 w-full rounded-md border border-[#D4DBD4] bg-white pl-3 pr-10 font-mono text-sm text-[#1A1F1C] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
                      />
                      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-[#626E66]">
                        yrs
                      </span>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="animal-age-months" className="sr-only">
                      Months
                    </label>
                    <div className="relative">
                      <input
                        id="animal-age-months"
                        type="number"
                        min={0}
                        max={11}
                        value={ageMonths}
                        onChange={(e) => setAgeMonths(e.target.value)}
                        className="h-10 w-full rounded-md border border-[#D4DBD4] bg-white pl-3 pr-10 font-mono text-sm text-[#1A1F1C] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
                      />
                      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] text-[#626E66]">
                        mos
                      </span>
                    </div>
                  </div>
                </div>
                {errors.age && (
                  <p className="mt-1 text-xs text-[#B91C1C]">{errors.age}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="animal-health"
                  className="block text-xs font-semibold text-[#3D4640]"
                >
                  Current Health Record
                </label>
                <select
                  id="animal-health"
                  value={healthStatus}
                  onChange={(e) =>
                    setHealthStatus(e.target.value as AnimalHealthStatus)
                  }
                  className="mt-1.5 h-10 w-full rounded-md border border-[#D4DBD4] bg-white px-3 text-sm text-[#1A1F1C] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
                >
                  <option value="Healthy">Healthy</option>
                  <option value="Under Care">Under Care</option>
                  <option value="Follow-up">Follow-up</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="animal-notes"
                  className="block text-xs font-semibold text-[#3D4640]"
                >
                  Identification &amp; Herd Notes
                </label>
                <textarea
                  id="animal-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional distinctive markings, vaccination batch, or care context"
                  className="mt-1.5 w-full rounded-md border border-[#D4DBD4] bg-white px-3 py-2 text-sm text-[#1A1F1C] placeholder:text-[#7E8981] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-[#ECEFEA] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-[#D4DBD4] bg-white px-4 py-2 text-xs font-medium text-[#3D4640] transition-colors hover:bg-[#F1F3F0] whitespace-nowrap shrink-0"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-[#163C2B] px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#102D20] whitespace-nowrap shrink-0"
            >
              {isEdit ? 'Save Animal Changes' : 'Register Animal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
