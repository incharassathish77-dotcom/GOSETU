import {
  ArrowLeft,
  ArrowRight,
  ClipboardPlus,
  MapPin,
  PawPrint,
  Phone,
  Plus,
  Tag,
  UserRound,
} from 'lucide-react';
import { useState } from 'react';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ToastBanner } from '../components/ui/ToastBanner';
import type {
  AnimalRecord,
  FarmerRecord,
  FollowUpRecord,
  VeterinaryCaseRecord,
} from '../types/gosetu';
import { AnimalHealthBadge, FarmerStatusBadge } from './FarmersPage';

interface FarmerPortalPageProps {
  activeNavId: string;
  farmer: FarmerRecord;
  animals: AnimalRecord[];
  cases: VeterinaryCaseRecord[];
  followUps: FollowUpRecord[];
  onNavigate: (navId: string) => void;
  onRegisterAnimal: () => void;
  onOpenNewRequest: () => void;
  onOpenCaseDossier: (caseId: string) => void;
  toastMessage: string | null;
  onDismissToast: () => void;
}

export function FarmerPortalPage({
  activeNavId,
  farmer,
  animals,
  cases,
  followUps,
  onNavigate,
  onRegisterAnimal,
  onOpenNewRequest,
  onOpenCaseDossier,
  toastMessage,
  onDismissToast,
}: FarmerPortalPageProps) {
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);

  const myAnimals = animals.filter((a) => a.farmerId === farmer.farmerId);
  const myRequests = cases.filter((c) => c.farmerId === farmer.farmerId);
  const myFollowUps = followUps.filter(
    (f) => f.farmerId === farmer.farmerId && f.status !== 'Completed'
  );

  const selectedAnimal =
    myAnimals.find((a) => a.animalId === selectedAnimalId) ?? null;

  // Animal Detail sub-view inside Farmer Portal
  if (selectedAnimal && activeNavId === 'animals') {
    return (
      <div className="space-y-6">
        <ToastBanner message={toastMessage} onDismiss={onDismissToast} />

        <div className="border-b border-[#E2E6E1] pb-4">
          <button
            type="button"
            onClick={() => setSelectedAnimalId(null)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#163C2B] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Back to My Livestock</span>
          </button>

          <div className="mt-2 flex flex-wrap items-center gap-2.5">
            <h1 className="font-display text-2xl font-semibold text-[#1A1F1C]">
              {selectedAnimal.nameOrLabel}
            </h1>
            <span className="font-mono text-xs font-semibold text-[#163C2B]">
              {selectedAnimal.earTag}
            </span>
            <AnimalHealthBadge status={selectedAnimal.healthStatus} />
          </div>
        </div>

        <div className="rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs">
          <dl className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-3">
            <div>
              <dt className="text-[#626E66]">Type &amp; Breed</dt>
              <dd className="mt-1 font-semibold text-[#1A1F1C]">
                {selectedAnimal.animalType} · {selectedAnimal.breed}
              </dd>
            </div>
            <div>
              <dt className="text-[#626E66]">Age &amp; Gender</dt>
              <dd className="mt-1 text-[#1A1F1C]">
                {selectedAnimal.ageYears}y {selectedAnimal.ageMonths}m ·{' '}
                {selectedAnimal.gender}
              </dd>
            </div>
            <div>
              <dt className="text-[#626E66]">Lactation Stage</dt>
              <dd className="mt-1 text-[#1A1F1C]">
                {selectedAnimal.lactationStage}
              </dd>
            </div>
            <div>
              <dt className="text-[#626E66]">Last Checked</dt>
              <dd className="mt-1 text-[#1A1F1C] tabular-nums">
                {selectedAnimal.lastCheckedDate}
              </dd>
            </div>
            {selectedAnimal.notes && (
              <div className="col-span-2 sm:col-span-3">
                <dt className="text-[#626E66]">Care Notes</dt>
                <dd className="mt-1 rounded-md border border-[#ECEFEA] bg-[#FAFBF9] p-3 text-[#4F5A53]">
                  {selectedAnimal.notes}
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-5 border-t border-[#ECEFEA] pt-4">
            <button
              type="button"
              onClick={onOpenNewRequest}
              className="inline-flex items-center gap-2 rounded-md bg-[#163C2B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#102D20]"
            >
              <ClipboardPlus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Request Veterinary Assistance</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // My Profile View
  if (activeNavId === 'profile') {
    return (
      <div className="space-y-6">
        <div className="border-b border-[#E2E6E1] pb-5">
          <h1 className="font-display text-2xl font-semibold text-[#1A1F1C]">
            My Farmer Profile
          </h1>
          <p className="mt-1 text-xs text-[#4F5A53]">
            Cooperative membership details and assigned field officer contact.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-semibold text-[#1A1F1C]">
                Personal &amp; Shed Details
              </h2>
              <FarmerStatusBadge status={farmer.status} />
            </div>

            <dl className="mt-4 space-y-3 text-xs">
              <div>
                <dt className="text-[#626E66]">Farmer Name &amp; ID</dt>
                <dd className="mt-0.5 font-semibold text-[#1A1F1C]">
                  {farmer.fullName} ·{' '}
                  <span className="font-mono text-[#52796F]">
                    {farmer.farmerId}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-[#626E66]">Mobile Number</dt>
                <dd className="mt-0.5 flex items-center gap-1.5 font-mono text-[#1A1F1C]">
                  <Phone className="h-3.5 w-3.5 text-[#52796F]" aria-hidden="true" />
                  <span>+91 {farmer.phone}</span>
                </dd>
              </div>
              <div>
                <dt className="text-[#626E66]">Village &amp; Address</dt>
                <dd className="mt-0.5 flex items-start gap-1.5 text-[#1A1F1C]">
                  <MapPin
                    className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#52796F]"
                    aria-hidden="true"
                  />
                  <span>
                    {farmer.address} ({farmer.village} · {farmer.subCluster})
                  </span>
                </dd>
              </div>
            </dl>
          </section>

          <section className="rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs">
            <h2 className="font-display text-base font-semibold text-[#1A1F1C]">
              Assigned Field Officer
            </h2>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#EDF2EE] text-[#163C2B]">
                <UserRound className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A1F1C]">
                  {farmer.assignedOfficerName}
                </p>
                <p className="text-xs text-[#626E66]">
                  {farmer.subCluster} · {farmer.assignedOfficerId}
                </p>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-[#4F5A53]">
              Your field officer conducts scheduled farm visits, records animal
              observations, and assists with follow-up checks prescribed by the
              cooperative veterinarian.
            </p>
          </section>
        </div>
      </div>
    );
  }

  // My Livestock View
  if (activeNavId === 'animals') {
    return (
      <div className="space-y-6">
        <ToastBanner message={toastMessage} onDismiss={onDismissToast} />

        <div className="flex flex-col gap-4 border-b border-[#E2E6E1] pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-[#1A1F1C]">
              My Livestock ({myAnimals.length})
            </h1>
            <p className="mt-1 text-xs text-[#4F5A53]">
              Ear-tagged animals registered under {farmer.fullName} ({farmer.village}).
            </p>
          </div>
          <button
            type="button"
            onClick={onRegisterAnimal}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#163C2B] px-4 text-xs font-semibold text-white hover:bg-[#102D20] self-start sm:self-auto"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Register Animal</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myAnimals.map((animal) => (
            <button
              key={animal.animalId}
              type="button"
              onClick={() => setSelectedAnimalId(animal.animalId)}
              className="flex flex-col justify-between rounded-lg border border-[#E2E6E1] bg-white p-4 text-left shadow-xs transition-colors hover:border-[#C2CBC3] hover:bg-[#FAFBF9]"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-display text-base font-semibold text-[#1A1F1C]">
                      {animal.nameOrLabel}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 font-mono text-xs text-[#163C2B]">
                      <Tag className="h-3 w-3" aria-hidden="true" />
                      <span>{animal.earTag}</span>
                    </p>
                  </div>
                  <AnimalHealthBadge status={animal.healthStatus} />
                </div>
                <p className="mt-3 text-xs text-[#4F5A53]">
                  {animal.animalType} · {animal.breed}
                </p>
                <p className="mt-1 text-[11px] text-[#626E66]">
                  {animal.ageYears}y {animal.ageMonths}m · {animal.lactationStage}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-[#ECEFEA] pt-3 text-xs font-medium text-[#163C2B]">
                <span>View Animal Details</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Farmer Home Dashboard Overview (Phase 2)
  return (
    <div className="space-y-6">
      <ToastBanner message={toastMessage} onDismiss={onDismissToast} />

      <div className="flex flex-col gap-4 border-b border-[#E2E6E1] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium text-[#52796F]">
            {farmer.village} · Member #{farmer.farmerId}
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold text-[#1A1F1C]">
            Namaste, {farmer.fullName}
          </h1>
          <p className="mt-1 text-xs text-[#4F5A53]">
            View your registered livestock and track cooperative veterinary care.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewRequest}
          className="inline-flex h-10 items-center gap-2 rounded-md bg-[#163C2B] px-4 text-xs font-semibold text-white hover:bg-[#102D20] self-start sm:self-auto"
        >
          <ClipboardPlus className="h-4 w-4" aria-hidden="true" />
          <span>Request Veterinary Assistance</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => onNavigate('animals')}
          className="rounded-lg border border-[#E2E6E1] bg-white p-4 text-left shadow-xs hover:border-[#C2CBC3]"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4F5A53]">
            <PawPrint className="h-4 w-4 text-[#163C2B]" aria-hidden="true" />
            <span>Registered Livestock</span>
          </div>
          <p className="mt-3 font-display text-3xl font-semibold text-[#1A1F1C] tabular-nums">
            {myAnimals.length}
          </p>
          <p className="mt-1 text-xs text-[#626E66]">
            Tap to view ear tags &amp; health status
          </p>
        </button>

        <div className="rounded-lg border border-[#E2E6E1] bg-white p-4 shadow-xs">
          <p className="text-xs font-semibold text-[#4F5A53]">Active Requests</p>
          <p className="mt-3 font-display text-3xl font-semibold text-[#1A1F1C] tabular-nums">
            {myRequests.length}
          </p>
          <p className="mt-1 text-xs text-[#626E66]">
            Submitted for veterinary coordination
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('profile')}
          className="rounded-lg border border-[#E2E6E1] bg-white p-4 text-left shadow-xs hover:border-[#C2CBC3]"
        >
          <p className="text-xs font-semibold text-[#4F5A53]">
            Assigned Field Officer
          </p>
          <p className="mt-3 text-base font-semibold text-[#1A1F1C]">
            {farmer.assignedOfficerName}
          </p>
          <p className="mt-1 text-xs text-[#626E66]">{farmer.subCluster}</p>
        </button>
      </div>

      {/* Livestock Quick List */}
      <section className="rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-[#1A1F1C]">
            My Registered Animals
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('animals')}
            className="text-xs font-medium text-[#163C2B] hover:underline"
          >
            View all
          </button>
        </div>

        <div className="mt-4 divide-y divide-[#ECEFEA]">
          {myAnimals.map((animal) => (
            <div
              key={animal.animalId}
              className="flex items-center justify-between gap-3 py-3 text-xs"
            >
              <div>
                <p className="font-semibold text-[#1A1F1C]">
                  {animal.nameOrLabel}{' '}
                  <span className="font-mono font-normal text-[#163C2B]">
                    ({animal.earTag})
                  </span>
                </p>
                <p className="mt-0.5 text-[#626E66]">
                  {animal.animalType} · {animal.breed} · {animal.lactationStage}
                </p>
              </div>
              <AnimalHealthBadge status={animal.healthStatus} />
            </div>
          ))}
        </div>
      </section>

      {/* Recent Requests & Follow-up Instructions */}
      {myRequests.length > 0 && (
        <section className="rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-[#1A1F1C]">
              Recent Veterinary Requests
            </h2>
            <button
              type="button"
              onClick={() => onNavigate('veterinary-requests')}
              className="text-xs font-medium text-[#163C2B] hover:underline"
            >
              View all requests
            </button>
          </div>
          <div className="mt-3 divide-y divide-[#ECEFEA]">
            {myRequests.map((req) => (
              <button
                key={req.caseId}
                type="button"
                onClick={() => onOpenCaseDossier(req.caseId)}
                className="flex w-full flex-wrap items-center justify-between gap-3 py-3 text-left text-xs hover:bg-[#FAFBF9]"
              >
                <div>
                  <p className="font-mono font-semibold text-[#163C2B]">
                    {req.caseId} · {req.animalTag}
                  </p>
                  <p className="mt-0.5 text-[#4F5A53]">{req.concernSummary}</p>
                  {req.consultation?.veterinaryInstructions && (
                    <p className="mt-1 text-[11px] text-[#166534]">
                      Vet Care Note: {req.consultation.veterinaryInstructions}
                    </p>
                  )}
                </div>
                <StatusBadge status={req.status} compact />
              </button>
            ))}
          </div>
        </section>
      )}

      {myFollowUps.length > 0 && (
        <section className="rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs">
          <h2 className="font-display text-base font-semibold text-[#1A1F1C]">
            Upcoming Care &amp; Follow-up Instructions
          </h2>
          <div className="mt-3 divide-y divide-[#ECEFEA]">
            {myFollowUps.map((fu) => (
              <div
                key={fu.followUpId}
                className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs"
              >
                <div>
                  <p className="font-semibold text-[#1A1F1C]">
                    {fu.animalTag} · Due {fu.dueDate}
                  </p>
                  <p className="mt-0.5 text-[#4F5A53]">{fu.instructionNote}</p>
                </div>
                <StatusBadge status={fu.status} compact />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
