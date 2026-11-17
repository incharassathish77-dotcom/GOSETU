import {
  ArrowLeft,
  CalendarDays,
  Eye,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Tag,
  UserRound,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ActivityTimeline } from '../components/ui/ActivityTimeline';
import { DataTable, type DataTableColumn } from '../components/ui/DataTable';
import { Pagination } from '../components/ui/Pagination';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ToastBanner } from '../components/ui/ToastBanner';
import type {
  AnimalHealthStatus,
  AnimalRecord,
  AnimalType,
  FarmerRecord,
  FollowUpRecord,
  VeterinaryCaseRecord,
} from '../types/gosetu';
import { AnimalHealthBadge } from './FarmersPage';

interface AnimalsPageProps {
  animals: AnimalRecord[];
  farmers: FarmerRecord[];
  cases: VeterinaryCaseRecord[];
  followUps: FollowUpRecord[];
  globalSearch: string;
  selectedAnimalId: string | null;
  onSelectAnimalId: (animalId: string | null) => void;
  onOpenNewAnimal: () => void;
  onOpenEditAnimal: (animal: AnimalRecord) => void;
  onOpenFarmerProfile: (farmerId: string) => void;
  onOpenCaseDossier?: (caseId: string) => void;
  toastMessage: string | null;
  onDismissToast: () => void;
}

const PAGE_SIZE = 8;

export function AnimalsPage({
  animals,
  farmers,
  cases,
  followUps,
  globalSearch,
  selectedAnimalId,
  onSelectAnimalId,
  onOpenNewAnimal,
  onOpenEditAnimal,
  onOpenFarmerProfile,
  onOpenCaseDossier,
  toastMessage,
  onDismissToast,
}: AnimalsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | AnimalType>('ALL');
  const [healthFilter, setHealthFilter] = useState<'ALL' | AnimalHealthStatus>('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  const farmerMap = useMemo(() => {
    const map = new Map<string, FarmerRecord>();
    for (const f of farmers) {
      map.set(f.farmerId, f);
    }
    return map;
  }, [farmers]);

  const combinedQuery = (searchQuery || globalSearch).trim().toLowerCase();

  const filteredAnimals = useMemo(() => {
    return animals.filter((a) => {
      if (typeFilter !== 'ALL' && a.animalType !== typeFilter) return false;
      if (healthFilter !== 'ALL' && a.healthStatus !== healthFilter) return false;
      if (!combinedQuery) return true;
      const owner = farmerMap.get(a.farmerId);
      return (
        a.animalId.toLowerCase().includes(combinedQuery) ||
        a.earTag.toLowerCase().includes(combinedQuery) ||
        a.nameOrLabel.toLowerCase().includes(combinedQuery) ||
        a.breed.toLowerCase().includes(combinedQuery) ||
        (owner?.fullName.toLowerCase().includes(combinedQuery) ?? false) ||
        (owner?.village.toLowerCase().includes(combinedQuery) ?? false)
      );
    });
  }, [animals, farmerMap, typeFilter, healthFilter, combinedQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [combinedQuery, typeFilter, healthFilter]);

  const paginatedAnimals = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredAnimals.slice(start, start + PAGE_SIZE);
  }, [filteredAnimals, currentPage]);

  const selectedAnimal = useMemo(
    () => animals.find((a) => a.animalId === selectedAnimalId) ?? null,
    [animals, selectedAnimalId]
  );

  const resetFilters = () => {
    setSearchQuery('');
    setTypeFilter('ALL');
    setHealthFilter('ALL');
    setCurrentPage(1);
  };

  // --- Animal Profile View ---
  if (selectedAnimal) {
    const owner = farmerMap.get(selectedAnimal.farmerId) ?? null;
    const matchingCases = cases.filter(
      (c) =>
        c.animalId === selectedAnimal.animalId ||
        c.animalTag.toUpperCase() === selectedAnimal.earTag.toUpperCase()
    );
    const matchingFollowUps = followUps.filter(
      (f) =>
        f.animalId === selectedAnimal.animalId ||
        f.animalTag.toUpperCase() === selectedAnimal.earTag.toUpperCase()
    );

    return (
      <div className="space-y-6">
        <ToastBanner message={toastMessage} onDismiss={onDismissToast} />

        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-[#E2E6E1] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => onSelectAnimalId(null)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#163C2B] hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Back to Animal Registry</span>
            </button>

            <div className="mt-2 flex flex-wrap items-center gap-2.5">
              <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1A1F1C]">
                {selectedAnimal.nameOrLabel}
              </h1>
              <span className="font-mono text-xs font-semibold text-[#163C2B]">
                {selectedAnimal.earTag}
              </span>
              <AnimalHealthBadge status={selectedAnimal.healthStatus} />
            </div>
            <p className="mt-1 text-xs text-[#626E66]">
              Animal ID: <span className="font-mono">{selectedAnimal.animalId}</span>
              <span className="mx-2 text-[#C2CBC3]" aria-hidden="true">
                ·
              </span>
              {selectedAnimal.animalType} · {selectedAnimal.breed}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {owner && (
              <button
                type="button"
                onClick={() => onOpenFarmerProfile(owner.farmerId)}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#D7DDD7] bg-white px-3.5 text-xs font-medium text-[#3D4640] hover:bg-[#F1F3F0] whitespace-nowrap shrink-0"
              >
                <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                <span>View Owner Profile</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onOpenEditAnimal(selectedAnimal)}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#163C2B] px-4 text-xs font-semibold text-white hover:bg-[#102D20] whitespace-nowrap shrink-0"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Edit Animal</span>
            </button>
          </div>
        </div>

        {/* Biological Profile & Owner Card */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs lg:col-span-2">
            <h2 className="font-display text-base font-semibold text-[#1A1F1C]">
              Animal Identification &amp; Biological Profile
            </h2>

            <dl className="mt-4 grid grid-cols-2 gap-4 text-xs sm:grid-cols-3">
              <div>
                <dt className="text-[#626E66]">Ear Tag</dt>
                <dd className="mt-1 flex items-center gap-1.5 font-mono font-semibold text-[#163C2B]">
                  <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{selectedAnimal.earTag}</span>
                </dd>
              </div>
              <div>
                <dt className="text-[#626E66]">Animal Type</dt>
                <dd className="mt-1 font-medium text-[#1A1F1C]">
                  {selectedAnimal.animalType}
                </dd>
              </div>
              <div>
                <dt className="text-[#626E66]">Breed</dt>
                <dd className="mt-1 font-medium text-[#1A1F1C]">
                  {selectedAnimal.breed}
                </dd>
              </div>
              <div>
                <dt className="text-[#626E66]">Gender</dt>
                <dd className="mt-1 font-medium text-[#1A1F1C]">
                  {selectedAnimal.gender}
                </dd>
              </div>
              <div>
                <dt className="text-[#626E66]">Age</dt>
                <dd className="mt-1 font-medium text-[#1A1F1C] tabular-nums">
                  {selectedAnimal.ageYears} yrs {selectedAnimal.ageMonths} mos
                </dd>
              </div>
              <div>
                <dt className="text-[#626E66]">Lactation / Stage</dt>
                <dd className="mt-1 font-medium text-[#1A1F1C]">
                  {selectedAnimal.lactationStage}
                </dd>
              </div>
              <div>
                <dt className="text-[#626E66]">Registered On</dt>
                <dd className="mt-1 flex items-center gap-1.5 text-[#1A1F1C] tabular-nums">
                  <CalendarDays
                    className="h-3.5 w-3.5 text-[#52796F]"
                    aria-hidden="true"
                  />
                  <span>{selectedAnimal.registeredDate}</span>
                </dd>
              </div>
              <div>
                <dt className="text-[#626E66]">Last Checked</dt>
                <dd className="mt-1 text-[#1A1F1C] tabular-nums">
                  {selectedAnimal.lastCheckedDate}
                </dd>
              </div>
              <div>
                <dt className="text-[#626E66]">Health Record</dt>
                <dd className="mt-1">
                  <AnimalHealthBadge status={selectedAnimal.healthStatus} />
                </dd>
              </div>
              {selectedAnimal.notes && (
                <div className="col-span-2 sm:col-span-3">
                  <dt className="text-[#626E66]">Identification &amp; Care Notes</dt>
                  <dd className="mt-1 rounded-md border border-[#ECEFEA] bg-[#FAFBF9] p-3 text-[#4F5A53]">
                    {selectedAnimal.notes}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {/* Owner Card */}
          <section className="flex flex-col justify-between rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs">
            <div>
              <h2 className="font-display text-base font-semibold text-[#1A1F1C]">
                Registered Owner
              </h2>
              {owner ? (
                <div className="mt-4 space-y-3 text-xs">
                  <div>
                    <p className="text-sm font-semibold text-[#1A1F1C]">
                      {owner.fullName}
                    </p>
                    <p className="font-mono text-[11px] text-[#52796F]">
                      {owner.farmerId}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#4F5A53]">
                    <MapPin className="h-3.5 w-3.5 text-[#52796F]" aria-hidden="true" />
                    <span>
                      {owner.village} · {owner.subCluster}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[#4F5A53]">
                    <Phone className="h-3.5 w-3.5 text-[#52796F]" aria-hidden="true" />
                    <span>+91 {owner.phone}</span>
                  </div>
                  <div className="border-t border-[#ECEFEA] pt-3">
                    <span className="text-[#626E66]">Assigned Field Officer</span>
                    <p className="mt-0.5 font-medium text-[#1A1F1C]">
                      {owner.assignedOfficerName}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-xs text-[#626E66]">
                  Owner record unavailable.
                </p>
              )}
            </div>

            {owner && (
              <button
                type="button"
                onClick={() => onOpenFarmerProfile(owner.farmerId)}
                className="mt-5 w-full rounded-md border border-[#D7DDD7] bg-white py-2 text-xs font-medium text-[#163C2B] hover:bg-[#EDF2EE]"
              >
                Open Farmer Profile
              </button>
            )}
          </section>
        </div>

        {/* Veterinary History & Follow-ups */}
        <section className="rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs">
          <div className="flex flex-col gap-1 border-b border-[#ECEFEA] pb-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-base font-semibold text-[#1A1F1C]">
                Veterinary Case &amp; Follow-up History
              </h2>
              <p className="text-xs text-[#626E66]">
                Linked requests and follow-up activities for ear tag{' '}
                <span className="font-mono">{selectedAnimal.earTag}</span>.
              </p>
            </div>
            <span className="text-[11px] text-[#626E66]">
              Live cooperative clinical &amp; follow-up records
            </span>
          </div>

          {matchingCases.length === 0 && matchingFollowUps.length === 0 ? (
            <p className="py-6 text-xs text-[#626E66]">
              No active veterinary cases or follow-ups recorded for this animal.
            </p>
          ) : (
            <div className="mt-4 space-y-5">
              {matchingCases.map((c) => (
                <div
                  key={c.caseId}
                  className="rounded-md border border-[#ECEFEA] bg-[#FAFBF9] p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs">
                      {onOpenCaseDossier ? (
                        <button
                          type="button"
                          onClick={() => onOpenCaseDossier(c.caseId)}
                          className="font-mono font-semibold text-[#163C2B] hover:underline"
                        >
                          {c.caseId}
                        </button>
                      ) : (
                        <span className="font-mono font-semibold text-[#163C2B]">
                          {c.caseId}
                        </span>
                      )}
                      <span className="text-[#626E66]">· {c.requestDate}</span>
                    </div>
                    <StatusBadge status={c.status} compact />
                  </div>
                  <p className="mt-2 text-xs font-medium text-[#1A1F1C]">
                    {c.concernSummary}
                  </p>
                  {c.consultation && (
                    <div className="mt-2 rounded border border-[#E2E6E1] bg-white p-2.5 text-xs text-[#4F5A53]">
                      <span className="font-semibold text-[#1A1F1C]">
                        Diagnosis:
                      </span>{' '}
                      {c.consultation.diagnosis} ·{' '}
                      <span className="font-semibold text-[#1A1F1C]">
                        Treatment:
                      </span>{' '}
                      {c.consultation.treatmentPlan}
                    </div>
                  )}
                  <div className="mt-4 border-t border-[#E2E6E1] pt-3">
                    <ActivityTimeline events={c.timeline} />
                  </div>
                </div>
              ))}

              {matchingFollowUps.map((f) => (
                <div
                  key={f.followUpId}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#ECEFEA] bg-white px-4 py-3 text-xs"
                >
                  <div>
                    <span className="font-mono font-medium text-[#1A1F1C]">
                      {f.followUpId}
                    </span>
                    <span className="mx-2 text-[#C2CBC3]">·</span>
                    <span className="text-[#4F5A53]">{f.instructionNote}</span>
                    <p className="mt-0.5 text-[11px] text-[#626E66]">
                      Assigned: {f.assignedPerson} · Due {f.dueDate}
                    </p>
                  </div>
                  <StatusBadge status={f.status} compact />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    );
  }

  // --- Animal Listing Table View ---
  const columns: DataTableColumn<AnimalRecord>[] = [
    {
      key: 'animalId',
      header: 'Animal ID / Ear Tag',
      render: (row) => (
        <div>
          <div className="font-mono text-xs font-semibold text-[#163C2B] tabular-nums">
            {row.earTag}
          </div>
          <div className="mt-0.5 font-mono text-[11px] text-[#626E66]">
            {row.animalId}
          </div>
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Animal Name',
      render: (row) => (
        <div>
          <div className="text-xs font-semibold text-[#1A1F1C]">
            {row.nameOrLabel}
          </div>
          <div className="mt-0.5 text-[11px] text-[#626E66]">
            {row.gender} · {row.lactationStage}
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Animal Type',
      render: (row) => (
        <span className="text-xs font-medium text-[#1A1F1C]">
          {row.animalType}
        </span>
      ),
    },
    {
      key: 'breed',
      header: 'Breed',
      render: (row) => <span className="text-xs text-[#3D4640]">{row.breed}</span>,
    },
    {
      key: 'age',
      header: 'Age',
      render: (row) => (
        <span className="font-mono text-xs text-[#3D4640] tabular-nums">
          {row.ageYears}y {row.ageMonths}m
        </span>
      ),
    },
    {
      key: 'farmer',
      header: 'Farmer Name',
      render: (row) => {
        const owner = farmerMap.get(row.farmerId);
        return owner ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenFarmerProfile(owner.farmerId);
            }}
            className="text-left hover:underline"
          >
            <div className="text-xs font-semibold text-[#163C2B]">
              {owner.fullName}
            </div>
            <div className="text-[11px] text-[#626E66]">{owner.village}</div>
          </button>
        ) : (
          <span className="text-xs text-[#626E66]">{row.farmerId}</span>
        );
      },
    },
    {
      key: 'health',
      header: 'Health Record',
      render: (row) => <AnimalHealthBadge status={row.healthStatus} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (row) => (
        <div
          className="inline-flex items-center gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => onSelectAnimalId(row.animalId)}
            className="inline-flex items-center gap-1 rounded-md border border-[#D7DDD7] bg-white px-2.5 py-1 text-xs font-medium text-[#163C2B] hover:bg-[#EDF2EE]"
          >
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            <span>View</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenEditAnimal(row)}
            aria-label={`Edit ${row.nameOrLabel}`}
            className="inline-flex items-center rounded-md border border-[#D7DDD7] bg-white p-1.5 text-[#4F5A53] hover:bg-[#F1F3F0] hover:text-[#1A1F1C]"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <ToastBanner message={toastMessage} onDismiss={onDismissToast} />

      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-[#E2E6E1] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1A1F1C]">
            Animal Management
          </h1>
          <p className="mt-1 text-xs text-[#4F5A53]">
            Registered livestock ear-tag directory ({animals.length} animals),
            breed details, and current health record status.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewAnimal}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#163C2B] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#102D20] self-start sm:self-auto whitespace-nowrap shrink-0"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Register Animal</span>
        </button>
      </div>

      {/* Table Card */}
      <section className="rounded-lg border border-[#E2E6E1] bg-white shadow-xs">
        <div className="border-b border-[#E2E6E1] p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            <div className="md:col-span-6">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by ear tag, animal name, breed, or farmer..."
                aria-label="Search animals"
                className="h-9 w-full rounded-md border border-[#D7DDD7] bg-white px-3 text-sm text-[#1A1F1C] placeholder:text-[#7E8981] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value as 'ALL' | AnimalType)
                }
                aria-label="Filter by animal type"
                className="h-9 w-full rounded-md border border-[#D7DDD7] bg-white px-2.5 text-xs font-medium text-[#1A1F1C] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
              >
                <option value="ALL">All Animal Types</option>
                <option value="Cattle">Cattle</option>
                <option value="Buffalo">Buffalo</option>
                <option value="Goat">Goat</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                value={healthFilter}
                onChange={(e) =>
                  setHealthFilter(e.target.value as 'ALL' | AnimalHealthStatus)
                }
                aria-label="Filter by health record"
                className="h-9 w-full rounded-md border border-[#D7DDD7] bg-white px-2.5 text-xs font-medium text-[#1A1F1C] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
              >
                <option value="ALL">All Health Records</option>
                <option value="Healthy">Healthy</option>
                <option value="Under Care">Under Care</option>
                <option value="Follow-up">Follow-up</option>
              </select>
            </div>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={paginatedAnimals}
          rowKey={(row) => row.animalId}
          onRowClick={(row) => onSelectAnimalId(row.animalId)}
          emptyTitle="No matching animals found"
          emptyDescription="Adjust your search query or animal type/health filters to view livestock records."
          emptyActionLabel="Reset filters"
          onEmptyAction={resetFilters}
        />

        <div className="border-t border-[#ECEFEA] bg-[#FAFBF9] px-5 py-3">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredAnimals.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>
    </div>
  );
}
