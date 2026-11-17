import { X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import {
  FIELD_OFFICER_OPTIONS,
  VILLAGE_CLUSTER_OPTIONS,
} from '../../data/mockPhase2Data';
import type { FarmerRecord, FarmerStatus } from '../../types/gosetu';

interface FarmerFormModalProps {
  open: boolean;
  initialFarmer: FarmerRecord | null;
  existingFarmers: FarmerRecord[];
  onClose: () => void;
  onSave: (farmer: FarmerRecord, isEdit: boolean) => void;
}

interface FieldErrors {
  fullName?: string;
  phone?: string;
  alternatePhone?: string;
  village?: string;
  address?: string;
  assignedOfficerId?: string;
}

export function FarmerFormModal({
  open,
  initialFarmer,
  existingFarmers,
  onClose,
  onSave,
}: FarmerFormModalProps) {
  const isEdit = Boolean(initialFarmer);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [village, setVillage] = useState(VILLAGE_CLUSTER_OPTIONS[0].village);
  const [address, setAddress] = useState('');
  const [assignedOfficerId, setAssignedOfficerId] = useState(
    FIELD_OFFICER_OPTIONS[0].id
  );
  const [status, setStatus] = useState<FarmerStatus>('Active');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (!open) return;
    if (initialFarmer) {
      setFullName(initialFarmer.fullName);
      setPhone(initialFarmer.phone);
      setAlternatePhone(initialFarmer.alternatePhone ?? '');
      setVillage(initialFarmer.village);
      setAddress(initialFarmer.address);
      setAssignedOfficerId(initialFarmer.assignedOfficerId);
      setStatus(initialFarmer.status);
      setNotes(initialFarmer.notes ?? '');
    } else {
      setFullName('');
      setPhone('');
      setAlternatePhone('');
      setVillage(VILLAGE_CLUSTER_OPTIONS[0].village);
      setAddress('');
      setAssignedOfficerId(FIELD_OFFICER_OPTIONS[0].id);
      setStatus('Active');
      setNotes('');
    }
    setErrors({});
  }, [open, initialFarmer]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const selectedCluster =
    VILLAGE_CLUSTER_OPTIONS.find((v) => v.village === village)?.subCluster ??
    'Baramati North';

  const validate = (): boolean => {
    const nextErrors: FieldErrors = {};
    const cleanPhone = phone.replace(/\D/g, '');
    const cleanAlt = alternatePhone.replace(/\D/g, '');

    if (!fullName.trim() || fullName.trim().length < 3) {
      nextErrors.fullName = 'Enter the farmer’s full name (at least 3 characters).';
    }
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      nextErrors.phone = 'Enter a valid 10-digit mobile number starting with 6–9.';
    } else {
      const duplicate = existingFarmers.find(
        (f) => f.phone === cleanPhone && f.farmerId !== initialFarmer?.farmerId
      );
      if (duplicate) {
        nextErrors.phone = `This mobile number is already linked to ${duplicate.fullName} (${duplicate.farmerId}).`;
      }
    }

    if (alternatePhone.trim() && !/^[6-9]\d{9}$/.test(cleanAlt)) {
      nextErrors.alternatePhone = 'Alternate number must be a valid 10-digit mobile number.';
    }

    if (!village.trim()) {
      nextErrors.village = 'Select a cooperative village.';
    }
    if (!address.trim() || address.trim().length < 5) {
      nextErrors.address = 'Enter a house, ward, or shed location address.';
    }
    if (!assignedOfficerId) {
      nextErrors.assignedOfficerId = 'Assign a primary field officer.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const generateNextFarmerId = () => {
    const maxNum = existingFarmers.reduce((max, item) => {
      const num = parseInt(item.farmerId.replace('FRM-', ''), 10);
      return Number.isNaN(num) ? max : Math.max(max, num);
    }, 1114);
    return `FRM-${maxNum + 1}`;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const officer =
      FIELD_OFFICER_OPTIONS.find((o) => o.id === assignedOfficerId) ??
      FIELD_OFFICER_OPTIONS[0];

    const record: FarmerRecord = {
      farmerId: initialFarmer?.farmerId ?? generateNextFarmerId(),
      fullName: fullName.trim(),
      phone: phone.replace(/\D/g, ''),
      alternatePhone: alternatePhone.trim()
        ? alternatePhone.replace(/\D/g, '')
        : undefined,
      village,
      subCluster: selectedCluster,
      address: address.trim(),
      assignedOfficerId: officer.id,
      assignedOfficerName: officer.name,
      registeredSince: initialFarmer?.registeredSince ?? '17 Nov 2026',
      status,
      notes: notes.trim() || undefined,
    };

    onSave(record, isEdit);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1F1C]/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="farmer-form-title"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-[#E2E6E1] bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E2E6E1] bg-white px-6 py-4">
          <div>
            <h2
              id="farmer-form-title"
              className="font-display text-lg font-semibold text-[#1A1F1C]"
            >
              {isEdit ? `Edit Farmer · ${initialFarmer?.farmerId}` : 'Register New Farmer'}
            </h2>
            <p className="mt-0.5 text-xs text-[#626E66]">
              Fields marked with <span className="text-[#B91C1C]">*</span> are required for cooperative enrollment.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close farmer form"
            className="rounded-md p-1.5 text-[#626E66] hover:bg-[#F1F3F0] hover:text-[#1A1F1C]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6" noValidate>
          {/* Section 1: Personal & Contact */}
          <div>
            <h3 className="text-xs font-semibold tracking-wide text-[#2D6A4F]">
              1. Farmer Identity &amp; Contact
            </h3>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="farmer-full-name"
                  className="block text-xs font-semibold text-[#3D4640]"
                >
                  Full Name <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="farmer-full-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Balasaheb Deshmukh"
                  className="mt-1.5 h-10 w-full rounded-md border border-[#D4DBD4] bg-white px-3 text-sm text-[#1A1F1C] placeholder:text-[#7E8981] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
                />
                {errors.fullName && (
                  <p className="mt-1 text-xs text-[#B91C1C]">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="farmer-phone"
                  className="block text-xs font-semibold text-[#3D4640]"
                >
                  Primary Contact Number <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="farmer-phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit mobile number"
                  className="mt-1.5 h-10 w-full rounded-md border border-[#D4DBD4] bg-white px-3 font-mono text-sm text-[#1A1F1C] placeholder:font-sans placeholder:text-[#7E8981] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-[#B91C1C]">{errors.phone}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="farmer-alt-phone"
                  className="block text-xs font-semibold text-[#3D4640]"
                >
                  Alternate Contact Number
                </label>
                <input
                  id="farmer-alt-phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={alternatePhone}
                  onChange={(e) => setAlternatePhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="Optional 10-digit number"
                  className="mt-1.5 h-10 w-full rounded-md border border-[#D4DBD4] bg-white px-3 font-mono text-sm text-[#1A1F1C] placeholder:font-sans placeholder:text-[#7E8981] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
                />
                {errors.alternatePhone && (
                  <p className="mt-1 text-xs text-[#B91C1C]">{errors.alternatePhone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Location & Field Officer Assignment */}
          <div className="border-t border-[#ECEFEA] pt-5">
            <h3 className="text-xs font-semibold tracking-wide text-[#2D6A4F]">
              2. Village Location &amp; Field Officer Assignment
            </h3>
            <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="farmer-village"
                  className="block text-xs font-semibold text-[#3D4640]"
                >
                  Village <span className="text-[#B91C1C]">*</span>
                </label>
                <select
                  id="farmer-village"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-md border border-[#D4DBD4] bg-white px-3 text-sm text-[#1A1F1C] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
                >
                  {VILLAGE_CLUSTER_OPTIONS.map((opt) => (
                    <option key={opt.village} value={opt.village}>
                      {opt.village} ({opt.subCluster})
                    </option>
                  ))}
                </select>
                {errors.village && (
                  <p className="mt-1 text-xs text-[#B91C1C]">{errors.village}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="farmer-officer"
                  className="block text-xs font-semibold text-[#3D4640]"
                >
                  Assigned Field Officer <span className="text-[#B91C1C]">*</span>
                </label>
                <select
                  id="farmer-officer"
                  value={assignedOfficerId}
                  onChange={(e) => setAssignedOfficerId(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-md border border-[#D4DBD4] bg-white px-3 text-sm text-[#1A1F1C] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
                >
                  {FIELD_OFFICER_OPTIONS.map((officer) => (
                    <option key={officer.id} value={officer.id}>
                      {officer.name} · {officer.subCluster}
                    </option>
                  ))}
                </select>
                {errors.assignedOfficerId && (
                  <p className="mt-1 text-xs text-[#B91C1C]">
                    {errors.assignedOfficerId}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="farmer-address"
                  className="block text-xs font-semibold text-[#3D4640]"
                >
                  Farm / Shed Address <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="farmer-address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ward, landmark, or dairy collection road"
                  className="mt-1.5 h-10 w-full rounded-md border border-[#D4DBD4] bg-white px-3 text-sm text-[#1A1F1C] placeholder:text-[#7E8981] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
                />
                {errors.address && (
                  <p className="mt-1 text-xs text-[#B91C1C]">{errors.address}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="farmer-status"
                  className="block text-xs font-semibold text-[#3D4640]"
                >
                  Membership Status
                </label>
                <select
                  id="farmer-status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as FarmerStatus)}
                  className="mt-1.5 h-10 w-full rounded-md border border-[#D4DBD4] bg-white px-3 text-sm text-[#1A1F1C] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="farmer-subcluster"
                  className="block text-xs font-semibold text-[#3D4640]"
                >
                  Sub-Cluster (Auto-mapped)
                </label>
                <input
                  id="farmer-subcluster"
                  type="text"
                  readOnly
                  value={selectedCluster}
                  className="mt-1.5 h-10 w-full rounded-md border border-[#E2E6E1] bg-[#F7F8F6] px-3 text-sm text-[#4F5A53]"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="farmer-notes"
                  className="block text-xs font-semibold text-[#3D4640]"
                >
                  Operational Notes
                </label>
                <textarea
                  id="farmer-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional notes on dairy shed access or herd notes"
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
              {isEdit ? 'Save Farmer Changes' : 'Register Farmer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
