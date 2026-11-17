import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  MapPin,
  Phone,
  Plus,
  ShieldAlert,
  Stethoscope,
  Trash2,
  UserCheck,
} from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { ActivityTimeline } from '../ui/ActivityTimeline';
import { ConfirmationDialog } from '../ui/ConfirmationDialog';
import { StatusBadge } from '../ui/StatusBadge';
import { ToastBanner } from '../ui/ToastBanner';
import type {
  AnimalRecord,
  ConsultationDetails,
  FarmerRecord,
  FollowUpRecord,
  MedicationEntry,
  UserRole,
  VeterinaryCaseRecord,
  VeterinaryCaseStatus,
} from '../../types/gosetu';

interface CaseDossierViewProps {
  role: UserRole;
  vetName?: string;
  caseRecord: VeterinaryCaseRecord;
  farmer: FarmerRecord | null;
  animal: AnimalRecord | null;
  previousCases: VeterinaryCaseRecord[];
  caseFollowUps: FollowUpRecord[];
  onBack: () => void;
  onOpenAssignVet?: (caseRecord: VeterinaryCaseRecord) => void;
  onMarkUnderReview?: (caseId: string) => void;
  onSaveConsultation: (
    caseId: string,
    consultation: ConsultationDetails,
    nextStatus: VeterinaryCaseStatus
  ) => void;
  onScheduleFollowUp: (
    caseId: string,
    dueDateIso: string,
    instructionNote: string
  ) => void;
  onCloseCase: (caseId: string) => void;
  toastMessage: string | null;
  onDismissToast: () => void;
}

export function CaseDossierView({
  role,
  vetName = 'Dr. Kavita Nair',
  caseRecord,
  farmer,
  animal,
  previousCases,
  caseFollowUps,
  onBack,
  onOpenAssignVet,
  onMarkUnderReview,
  onSaveConsultation,
  onScheduleFollowUp,
  onCloseCase,
  toastMessage,
  onDismissToast,
}: CaseDossierViewProps) {
  const isVet = role === 'veterinarian';
  const canEditClinical =
    isVet &&
    caseRecord.status !== 'Closed' &&
    caseRecord.status !== 'Cancelled';

  const [editingClinical, setEditingClinical] = useState(
    isVet && !caseRecord.consultation && caseRecord.status !== 'Closed'
  );
  const [vitalNotes, setVitalNotes] = useState(
    caseRecord.consultation?.vitalNotes ?? ''
  );
  const [examFindings, setExamFindings] = useState(
    caseRecord.consultation?.examFindings ?? ''
  );
  const [diagnosis, setDiagnosis] = useState(
    caseRecord.consultation?.diagnosis ?? ''
  );
  const [treatmentPlan, setTreatmentPlan] = useState(
    caseRecord.consultation?.treatmentPlan ?? ''
  );
  const [medications, setMedications] = useState<MedicationEntry[]>(
    caseRecord.consultation?.medications ?? [
      { name: '', dosage: '', duration: '' },
    ]
  );
  const [veterinaryInstructions, setVeterinaryInstructions] = useState(
    caseRecord.consultation?.veterinaryInstructions ?? ''
  );
  const [targetOutcomeStatus, setTargetOutcomeStatus] = useState<
    'In Consultation' | 'Follow-up Required' | 'Resolved'
  >('In Consultation');
  const [clinicalError, setClinicalError] = useState<string | null>(null);

  // Follow-up scheduling form (Veterinarian)
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [followUpDueDate, setFollowUpDueDate] = useState('2026-11-19');
  const [followUpInstruction, setFollowUpInstruction] = useState('');
  const [followUpError, setFollowUpError] = useState<string | null>(null);

  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);

  useEffect(() => {
    setVitalNotes(caseRecord.consultation?.vitalNotes ?? '');
    setExamFindings(caseRecord.consultation?.examFindings ?? '');
    setDiagnosis(caseRecord.consultation?.diagnosis ?? '');
    setTreatmentPlan(caseRecord.consultation?.treatmentPlan ?? '');
    setMedications(
      caseRecord.consultation?.medications.length
        ? caseRecord.consultation.medications
        : [{ name: '', dosage: '', duration: '' }]
    );
    setVeterinaryInstructions(
      caseRecord.consultation?.veterinaryInstructions ?? ''
    );
    setEditingClinical(
      isVet &&
        !caseRecord.consultation &&
        caseRecord.status !== 'Closed' &&
        caseRecord.status !== 'Cancelled'
    );
    setClinicalError(null);
  }, [caseRecord, isVet]);

  const handleAddMedicationRow = () => {
    setMedications((prev) => [...prev, { name: '', dosage: '', duration: '' }]);
  };

  const handleRemoveMedicationRow = (idx: number) => {
    setMedications((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateMedication = (
    idx: number,
    field: keyof MedicationEntry,
    value: string
  ) => {
    setMedications((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );
  };

  const handleSubmitConsultation = (e: FormEvent) => {
    e.preventDefault();
    setClinicalError(null);
    if (!examFindings.trim() || !diagnosis.trim() || !treatmentPlan.trim()) {
      setClinicalError(
        'Enter clinical examination findings, diagnosis, and treatment plan.'
      );
      return;
    }

    const cleanedMeds = medications.filter((m) => m.name.trim().length > 0);

    const consultation: ConsultationDetails = {
      examDate: '17 Nov 2026 · Just now',
      vitalNotes: vitalNotes.trim() || 'Recorded during consultation',
      examFindings: examFindings.trim(),
      diagnosis: diagnosis.trim(),
      treatmentPlan: treatmentPlan.trim(),
      medications: cleanedMeds,
      veterinaryInstructions:
        veterinaryInstructions.trim() ||
        'Monitor feed intake, hydration, and milk yield daily.',
      recordedByVet: vetName,
    };

    onSaveConsultation(caseRecord.caseId, consultation, targetOutcomeStatus);
    setEditingClinical(false);
  };

  const handleSubmitFollowUp = (e: FormEvent) => {
    e.preventDefault();
    setFollowUpError(null);
    if (!followUpDueDate || !followUpInstruction.trim()) {
      setFollowUpError('Select a due date and enter follow-up instructions.');
      return;
    }
    onScheduleFollowUp(
      caseRecord.caseId,
      followUpDueDate,
      followUpInstruction.trim()
    );
    setFollowUpOpen(false);
    setFollowUpInstruction('');
  };

  return (
    <div className="space-y-6">
      <ToastBanner message={toastMessage} onDismiss={onDismissToast} />

      {/* Top Header */}
      <div className="flex flex-col gap-4 border-b border-[#E2E6E1] pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#163C2B] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Back to Cases List</span>
          </button>

          <div className="mt-2 flex flex-wrap items-center gap-2.5">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1A1F1C]">
              <span className="font-mono">{caseRecord.caseId}</span>
            </h1>
            <StatusBadge status={caseRecord.status} />
            <span className="rounded border border-[#E2E6E1] bg-white px-2 py-0.5 text-xs font-medium text-[#4F5A53]">
              {caseRecord.priority} Priority
            </span>
          </div>
          <p className="mt-1 text-xs text-[#626E66]">
            Submitted {caseRecord.requestDate} ({caseRecord.submittedTime}) by{' '}
            {caseRecord.reportedBy}
          </p>
        </div>

        {/* Role-gated Case Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {role === 'admin' &&
            caseRecord.status === 'Submitted' &&
            onMarkUnderReview && (
              <button
                type="button"
                onClick={() => onMarkUnderReview(caseRecord.caseId)}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#D7DDD7] bg-white px-3.5 text-xs font-medium text-[#3D4640] hover:bg-[#F1F3F0]"
              >
                <span>Mark Under Review</span>
              </button>
            )}

          {role === 'admin' &&
            caseRecord.status !== 'Closed' &&
            caseRecord.status !== 'Cancelled' &&
            onOpenAssignVet && (
              <button
                type="button"
                onClick={() => onOpenAssignVet(caseRecord)}
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#163C2B] px-4 text-xs font-semibold text-white hover:bg-[#102D20]"
              >
                <UserCheck className="h-3.5 w-3.5" aria-hidden="true" />
                <span>
                  {caseRecord.assignedVet
                    ? 'Reassign Veterinarian'
                    : 'Assign Veterinarian'}
                </span>
              </button>
            )}

          {canEditClinical && (
            <>
              <button
                type="button"
                onClick={() => setFollowUpOpen((prev) => !prev)}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#D7DDD7] bg-white px-3.5 text-xs font-medium text-[#163C2B] hover:bg-[#EDF2EE]"
              >
                <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Schedule Follow-up</span>
              </button>

              <button
                type="button"
                onClick={() => setCloseConfirmOpen(true)}
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#163C2B] px-4 text-xs font-semibold text-white hover:bg-[#102D20]"
              >
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Close Case</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Inline Follow-up Scheduling Drawer (Veterinarian only) */}
      {canEditClinical && followUpOpen && (
        <form
          onSubmit={handleSubmitFollowUp}
          className="rounded-lg border border-[#BFD3C6] bg-[#F7FAF8] p-5 shadow-xs"
        >
          <h2 className="font-display text-sm font-semibold text-[#163C2B]">
            Schedule Follow-up Activity for Field Officer
          </h2>
          <p className="mt-0.5 text-xs text-[#4F5A53]">
            Assigns a post-consultation check to{' '}
            <span className="font-semibold">
              {farmer?.assignedOfficerName ?? 'Assigned Field Officer'}
            </span>{' '}
            and updates case status to Follow-up Required.
          </p>

          {followUpError && (
            <p className="mt-2 text-xs font-medium text-[#B91C1C]">
              {followUpError}
            </p>
          )}

          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="fu-due-date"
                className="block text-xs font-semibold text-[#3D4640]"
              >
                Follow-up Date
              </label>
              <input
                id="fu-due-date"
                type="date"
                value={followUpDueDate}
                onChange={(e) => setFollowUpDueDate(e.target.value)}
                className="mt-1.5 h-9 w-full rounded-md border border-[#D4DBD4] bg-white px-3 text-xs text-[#1A1F1C]"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="fu-instruction"
                className="block text-xs font-semibold text-[#3D4640]"
              >
                Field Officer Verification Instruction
              </label>
              <input
                id="fu-instruction"
                type="text"
                value={followUpInstruction}
                onChange={(e) => setFollowUpInstruction(e.target.value)}
                placeholder="e.g. Check temperature, appetite restoration, and CMT strip reading"
                className="mt-1.5 h-9 w-full rounded-md border border-[#D4DBD4] bg-white px-3 text-xs text-[#1A1F1C]"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setFollowUpOpen(false)}
              className="rounded-md border border-[#D4DBD4] bg-white px-3.5 py-1.5 text-xs font-medium text-[#3D4640]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-[#163C2B] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#102D20]"
            >
              Confirm Follow-up Schedule
            </button>
          </div>
        </form>
      )}

      {/* 1. Case Info + 2. Farmer Info + 3. Animal Info */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs">
          <h2 className="font-display text-sm font-semibold text-[#1A1F1C]">
            1. Case Information
          </h2>
          <dl className="mt-3 space-y-2.5 text-xs">
            <div className="flex justify-between gap-2">
              <dt className="text-[#626E66]">Case ID</dt>
              <dd className="font-mono font-semibold text-[#1A1F1C]">
                {caseRecord.caseId}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-[#626E66]">Assigned Veterinarian</dt>
              <dd className="font-semibold text-[#163C2B]">
                {caseRecord.assignedVet ?? 'Unassigned'}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-[#626E66]">Reported By</dt>
              <dd className="text-[#1A1F1C]">{caseRecord.reportedBy}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-[#626E66]">Last Updated</dt>
              <dd className="text-[#1A1F1C] tabular-nums">
                {caseRecord.lastUpdated}
              </dd>
            </div>
          </dl>
        </section>

        <section className="rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs">
          <h2 className="font-display text-sm font-semibold text-[#1A1F1C]">
            2. Farmer Information
          </h2>
          <dl className="mt-3 space-y-2 text-xs">
            <div>
              <dt className="text-[#626E66]">Farmer Name</dt>
              <dd className="mt-0.5 font-semibold text-[#1A1F1C]">
                {farmer?.fullName ?? caseRecord.farmerName} (
                <span className="font-mono text-[#52796F]">
                  {caseRecord.farmerId}
                </span>
                )
              </dd>
            </div>
            <div className="flex items-center gap-1.5 text-[#4F5A53]">
              <MapPin className="h-3.5 w-3.5 text-[#52796F]" aria-hidden="true" />
              <span>
                {caseRecord.village}
                {farmer ? ` · ${farmer.subCluster}` : ''}
              </span>
            </div>
            {farmer && (
              <div className="flex items-center gap-1.5 font-mono text-[#4F5A53]">
                <Phone className="h-3.5 w-3.5 text-[#52796F]" aria-hidden="true" />
                <span>+91 {farmer.phone}</span>
              </div>
            )}
            {farmer && (
              <div className="pt-1 text-[11px] text-[#626E66]">
                Field Officer: {farmer.assignedOfficerName}
              </div>
            )}
          </dl>
        </section>

        <section className="rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs">
          <h2 className="font-display text-sm font-semibold text-[#1A1F1C]">
            3. Animal Information
          </h2>
          <dl className="mt-3 space-y-2 text-xs">
            <div>
              <dt className="text-[#626E66]">Animal &amp; Ear Tag</dt>
              <dd className="mt-0.5 font-semibold text-[#1A1F1C]">
                {animal?.nameOrLabel ?? 'Registered Animal'} ·{' '}
                <span className="font-mono text-[#163C2B]">
                  {caseRecord.animalTag}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-[#626E66]">Species &amp; Breed</dt>
              <dd className="mt-0.5 text-[#1A1F1C]">{caseRecord.speciesBreed}</dd>
            </div>
            {animal && (
              <div>
                <dt className="text-[#626E66]">Age &amp; Lactation</dt>
                <dd className="mt-0.5 text-[#1A1F1C]">
                  {animal.ageYears}y {animal.ageMonths}m · {animal.gender} ·{' '}
                  {animal.lactationStage}
                </dd>
              </div>
            )}
          </dl>
        </section>
      </div>

      {/* 4. Reported Health Concern + 5. Field Officer Observations + 6. Previous History */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs">
          <h2 className="font-display text-sm font-semibold text-[#1A1F1C]">
            4. Reported Health Concern
          </h2>
          <p className="mt-3 rounded-md border border-[#ECEFEA] bg-[#FAFBF9] p-3 text-xs leading-relaxed text-[#1A1F1C]">
            {caseRecord.concernSummary}
          </p>
        </section>

        <section className="rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs">
          <h2 className="font-display text-sm font-semibold text-[#1A1F1C]">
            5. Field Officer Observations
          </h2>
          <p className="mt-3 rounded-md border border-[#ECEFEA] bg-[#FAFBF9] p-3 text-xs leading-relaxed text-[#4F5A53]">
            {caseRecord.fieldObservations ??
              'No separate field officer observation notes attached to this request.'}
          </p>
        </section>

        <section className="rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs">
          <h2 className="font-display text-sm font-semibold text-[#1A1F1C]">
            6. Previous Veterinary History ({previousCases.length})
          </h2>
          {previousCases.length === 0 ? (
            <p className="mt-3 text-xs text-[#626E66]">
              No prior veterinary cases on record for {caseRecord.animalTag}.
            </p>
          ) : (
            <ul className="mt-3 space-y-2 text-xs">
              {previousCases.map((prev) => (
                <li
                  key={prev.caseId}
                  className="rounded border border-[#ECEFEA] bg-[#FAFBF9] p-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-[#163C2B]">
                      {prev.caseId}
                    </span>
                    <StatusBadge status={prev.status} compact />
                  </div>
                  <p className="mt-1 text-[#4F5A53]">
                    {prev.consultation?.diagnosis ?? prev.concernSummary}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* 7 & 8. Clinical Examination + Diagnosis & Treatment Documentation */}
      <section className="rounded-lg border border-[#E2E6E1] bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-3 border-b border-[#ECEFEA] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <Stethoscope className="h-4 w-4 text-[#163C2B]" aria-hidden="true" />
            <div>
              <h2 className="font-display text-base font-semibold text-[#1A1F1C]">
                7 &amp; 8. Clinical Examination, Diagnosis &amp; Treatment Documentation
              </h2>
              <p className="text-xs text-[#626E66]">
                Clinical assessments and treatment decisions are entered exclusively
                by licensed Veterinarians.
              </p>
            </div>
          </div>

          {canEditClinical && !editingClinical && (
            <button
              type="button"
              onClick={() => setEditingClinical(true)}
              className="rounded-md border border-[#D7DDD7] bg-white px-3.5 py-1.5 text-xs font-medium text-[#163C2B] hover:bg-[#EDF2EE] self-start sm:self-auto"
            >
              {caseRecord.consultation
                ? 'Update Consultation'
                : 'Record Consultation'}
            </button>
          )}
        </div>

        {!isVet && (
          <div className="mt-4 flex items-center gap-2 rounded-md border border-[#E2E6E1] bg-[#FAFBF9] px-3.5 py-2.5 text-xs text-[#4F5A53]">
            <ShieldAlert className="h-4 w-4 shrink-0 text-[#52796F]" aria-hidden="true" />
            <span>
              Read-only clinical summary. Only the assigned Veterinarian can
              create or modify diagnoses and prescriptions.
            </span>
          </div>
        )}

        {editingClinical && canEditClinical ? (
          <form onSubmit={handleSubmitConsultation} className="mt-5 space-y-5">
            {clinicalError && (
              <div
                role="alert"
                className="rounded-md border border-[#F3C6C6] bg-[#FEF5F5] px-3.5 py-2.5 text-xs text-[#991B1B]"
              >
                {clinicalError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="clin-vitals"
                  className="block text-xs font-semibold text-[#3D4640]"
                >
                  7. Vital Signs &amp; Examination Vitals
                </label>
                <input
                  id="clin-vitals"
                  type="text"
                  value={vitalNotes}
                  onChange={(e) => setVitalNotes(e.target.value)}
                  placeholder="e.g. Temp 102.4 °F · Pulse 74 bpm · Rumen motility normal"
                  className="mt-1.5 h-10 w-full rounded-md border border-[#D4DBD4] bg-white px-3 text-sm text-[#1A1F1C]"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="clin-findings"
                  className="block text-xs font-semibold text-[#3D4640]"
                >
                  Clinical Examination Findings{' '}
                  <span className="text-[#B91C1C]">*</span>
                </label>
                <textarea
                  id="clin-findings"
                  rows={2}
                  value={examFindings}
                  onChange={(e) => setExamFindings(e.target.value)}
                  placeholder="Physical examination findings, affected system, CMT/palpation results"
                  className="mt-1.5 w-full rounded-md border border-[#D4DBD4] bg-white px-3 py-2 text-sm text-[#1A1F1C]"
                />
              </div>

              <div>
                <label
                  htmlFor="clin-diagnosis"
                  className="block text-xs font-semibold text-[#3D4640]"
                >
                  8. Clinical Diagnosis <span className="text-[#B91C1C]">*</span>
                </label>
                <input
                  id="clin-diagnosis"
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="e.g. Acute Clinical Mastitis (Left Rear)"
                  className="mt-1.5 h-10 w-full rounded-md border border-[#D4DBD4] bg-white px-3 text-sm text-[#1A1F1C]"
                />
              </div>

              <div>
                <label
                  htmlFor="clin-status"
                  className="block text-xs font-semibold text-[#3D4640]"
                >
                  Update Case Status
                </label>
                <select
                  id="clin-status"
                  value={targetOutcomeStatus}
                  onChange={(e) =>
                    setTargetOutcomeStatus(
                      e.target.value as
                        | 'In Consultation'
                        | 'Follow-up Required'
                        | 'Resolved'
                    )
                  }
                  className="mt-1.5 h-10 w-full rounded-md border border-[#D4DBD4] bg-white px-3 text-sm text-[#1A1F1C]"
                >
                  <option value="In Consultation">In Consultation</option>
                  <option value="Follow-up Required">Follow-up Required</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="clin-treatment"
                  className="block text-xs font-semibold text-[#3D4640]"
                >
                  Treatment Plan <span className="text-[#B91C1C]">*</span>
                </label>
                <textarea
                  id="clin-treatment"
                  rows={2}
                  value={treatmentPlan}
                  onChange={(e) => setTreatmentPlan(e.target.value)}
                  placeholder="Therapeutic protocol and supportive care plan"
                  className="mt-1.5 w-full rounded-md border border-[#D4DBD4] bg-white px-3 py-2 text-sm text-[#1A1F1C]"
                />
              </div>
            </div>

            {/* Medications Table */}
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#3D4640]">
                  Prescribed Medications
                </span>
                <button
                  type="button"
                  onClick={handleAddMedicationRow}
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#163C2B] hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Add Medication</span>
                </button>
              </div>

              <div className="mt-2 space-y-2">
                {medications.map((med, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 gap-2 sm:grid-cols-12"
                  >
                    <input
                      type="text"
                      value={med.name}
                      onChange={(e) =>
                        handleUpdateMedication(idx, 'name', e.target.value)
                      }
                      placeholder="Medication name"
                      aria-label="Medication name"
                      className="h-9 rounded-md border border-[#D4DBD4] bg-white px-3 text-xs sm:col-span-5"
                    />
                    <input
                      type="text"
                      value={med.dosage}
                      onChange={(e) =>
                        handleUpdateMedication(idx, 'dosage', e.target.value)
                      }
                      placeholder="Dosage & route (e.g. 15 mL IM)"
                      aria-label="Medication dosage"
                      className="h-9 rounded-md border border-[#D4DBD4] bg-white px-3 text-xs sm:col-span-4"
                    />
                    <div className="flex items-center gap-1.5 sm:col-span-3">
                      <input
                        type="text"
                        value={med.duration}
                        onChange={(e) =>
                          handleUpdateMedication(idx, 'duration', e.target.value)
                        }
                        placeholder="Duration"
                        aria-label="Medication duration"
                        className="h-9 flex-1 rounded-md border border-[#D4DBD4] bg-white px-3 text-xs"
                      />
                      {medications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMedicationRow(idx)}
                          aria-label="Remove medication"
                          className="rounded p-1.5 text-[#626E66] hover:bg-[#FEF2F2] hover:text-[#B91C1C]"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label
                htmlFor="clin-instructions"
                className="block text-xs font-semibold text-[#3D4640]"
              >
                Veterinary Instructions for Farmer &amp; Field Officer
              </label>
              <textarea
                id="clin-instructions"
                rows={2}
                value={veterinaryInstructions}
                onChange={(e) => setVeterinaryInstructions(e.target.value)}
                placeholder="Feeding, hygiene, isolation, or monitoring guidance"
                className="mt-1.5 w-full rounded-md border border-[#D4DBD4] bg-white px-3 py-2 text-sm text-[#1A1F1C]"
              />
            </div>

            <div className="flex justify-end gap-2.5 border-t border-[#ECEFEA] pt-4">
              {caseRecord.consultation && (
                <button
                  type="button"
                  onClick={() => setEditingClinical(false)}
                  className="rounded-md border border-[#D4DBD4] bg-white px-4 py-2 text-xs font-medium text-[#3D4640]"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="rounded-md bg-[#163C2B] px-5 py-2 text-xs font-semibold text-white hover:bg-[#102D20]"
              >
                Save Clinical Consultation
              </button>
            </div>
          </form>
        ) : caseRecord.consultation ? (
          <div className="mt-5 space-y-4 text-xs">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <span className="text-[#626E66]">Examination Date &amp; Vet</span>
                <p className="mt-0.5 font-semibold text-[#1A1F1C]">
                  {caseRecord.consultation.examDate} ·{' '}
                  {caseRecord.consultation.recordedByVet}
                </p>
              </div>
              <div>
                <span className="text-[#626E66]">Vital Notes</span>
                <p className="mt-0.5 font-mono text-[#1A1F1C]">
                  {caseRecord.consultation.vitalNotes}
                </p>
              </div>
              <div>
                <span className="text-[#626E66]">Clinical Examination Findings</span>
                <p className="mt-1 rounded-md border border-[#ECEFEA] bg-[#FAFBF9] p-3 leading-relaxed text-[#1A1F1C]">
                  {caseRecord.consultation.examFindings}
                </p>
              </div>
              <div>
                <span className="text-[#626E66]">Diagnosis</span>
                <p className="mt-1 rounded-md border border-[#ECEFEA] bg-[#EDF2EE] p-3 font-semibold text-[#163C2B]">
                  {caseRecord.consultation.diagnosis}
                </p>
              </div>
            </div>

            <div>
              <span className="text-[#626E66]">Treatment Plan</span>
              <p className="mt-1 text-[#1A1F1C] leading-relaxed">
                {caseRecord.consultation.treatmentPlan}
              </p>
            </div>

            {caseRecord.consultation.medications.length > 0 && (
              <div>
                <span className="text-[#626E66]">Medication Details</span>
                <div className="mt-1.5 overflow-x-auto rounded-md border border-[#E2E6E1]">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-[#E2E6E1] bg-[#FAFBF9] text-[#4F5A53]">
                      <tr>
                        <th className="px-3 py-2 font-semibold">Medication</th>
                        <th className="px-3 py-2 font-semibold">Dosage</th>
                        <th className="px-3 py-2 font-semibold">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ECEFEA]">
                      {caseRecord.consultation.medications.map((m, idx) => (
                        <tr key={idx}>
                          <td className="px-3 py-2 font-medium text-[#1A1F1C]">
                            {m.name}
                          </td>
                          <td className="px-3 py-2 text-[#4F5A53]">{m.dosage}</td>
                          <td className="px-3 py-2 font-mono text-[#4F5A53]">
                            {m.duration}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div>
              <span className="text-[#626E66]">Veterinary Care Instructions</span>
              <p className="mt-1 rounded-md border border-[#ECEFEA] bg-[#FAFBF9] p-3 text-[#1A1F1C]">
                {caseRecord.consultation.veterinaryInstructions}
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-4 text-xs text-[#626E66]">
            Clinical examination and diagnosis have not yet been entered for
            this case.
          </p>
        )}
      </section>

      {/* 9. Follow-up Schedule & 10. Case Activity Timeline */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#ECEFEA] pb-3">
            <h2 className="font-display text-sm font-semibold text-[#1A1F1C]">
              9. Follow-up Schedule ({caseFollowUps.length})
            </h2>
          </div>
          {caseFollowUps.length === 0 ? (
            <p className="mt-4 text-xs text-[#626E66]">
              No follow-up visits scheduled for this case.
            </p>
          ) : (
            <div className="mt-3 space-y-3">
              {caseFollowUps.map((fu) => (
                <div
                  key={fu.followUpId}
                  className="rounded-md border border-[#ECEFEA] bg-[#FAFBF9] p-3.5 text-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono font-semibold text-[#163C2B]">
                      {fu.followUpId} · Due {fu.dueDate}
                    </span>
                    <StatusBadge status={fu.status} compact />
                  </div>
                  <p className="mt-1.5 text-[#1A1F1C]">{fu.instructionNote}</p>
                  <p className="mt-1 text-[11px] text-[#626E66]">
                    Assigned Officer: {fu.assignedPerson}
                  </p>
                  {fu.officerUpdateNote && (
                    <p className="mt-2 rounded border border-[#D5E0D9] bg-white p-2 text-[11px] text-[#166534]">
                      Officer Update ({fu.completedAt}): {fu.officerUpdateNote}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs">
          <h2 className="border-b border-[#ECEFEA] pb-3 font-display text-sm font-semibold text-[#1A1F1C]">
            10. Case Activity Timeline
          </h2>
          <div className="mt-4">
            <ActivityTimeline events={caseRecord.timeline} />
          </div>
        </section>
      </div>

      <ConfirmationDialog
        open={closeConfirmOpen}
        title="Close veterinary case?"
        description={`Closing ${caseRecord.caseId} confirms clinical care is complete and marks ${caseRecord.animalTag} as Healthy. Closed cases remain in permanent animal history.`}
        confirmLabel="Close Case"
        cancelLabel="Cancel"
        onConfirm={() => {
          setCloseConfirmOpen(false);
          onCloseCase(caseRecord.caseId);
        }}
        onCancel={() => setCloseConfirmOpen(false)}
      />
    </div>
  );
}
