import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Eye,
  MapPin,
  PawPrint,
  Pencil,
  Phone,
  Plus,
  UserRound,
  XCircle,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { DataTable, type DataTableColumn } from '../components/ui/DataTable';
import { Pagination } from '../components/ui/Pagination';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ToastBanner } from '../components/ui/ToastBanner';
import { VILLAGE_CLUSTER_OPTIONS } from '../data/mockPhase2Data';
import type {
  AnimalRecord,
  FarmVisitRecord,
  FarmerRecord,
  FarmerStatus,
  FieldOfficerOption,
  VeterinaryCaseRecord,
} from '../types/gosetu';

interface FarmersPageProps {
  farmers: FarmerRecord[];
  animals: AnimalRecord[];
  officers: FieldOfficerOption[];
  visits: FarmVisitRecord[];
  cases: VeterinaryCaseRecord[];
  globalSearch: string;
  selectedFarmerId: string | null;
  onSelectFarmerId: (farmerId: string | null) => void;
  onOpenNewFarmer: () => void;
  onOpenEditFarmer: (farmer: FarmerRecord) => void;
  onOpenNewAnimalForFarmer: (farmerId: string) => void;
  onOpenAnimalProfile: (animalId: string) => void;
  onOpenCaseDossier?: (caseId: string) => void;
  toastMessage: string | null;
  onDismissToast: () => void;
}

const PAGE_SIZE = 7;

export function FarmersPage({
  farmers,
  animals,
  officers,
  visits,
  cases,
  globalSearch,
  selectedFarmerId,
  onSelectFarmerId,
  onOpenNewFarmer,
  onOpenEditFarmer,
  onOpenNewAnimalForFarmer,
  onOpenAnimalProfile,
  onOpenCaseDossier,
  toastMessage,
  onDismissToast,
}: FarmersPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [villageFilter, setVillageFilter] = useState('ALL');
  const [officerFilter, setOfficerFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | FarmerStatus>('ALL');
  const [sortBy, setSortBy] = useState<'id' | 'name'>('id');
  const [currentPage, setCurrentPage] = useState(1);

  const animalCountByFarmer = useMemo(() => {
    const map = new Map<string, number>();
    for (const animal of animals) {
      map.set(animal.farmerId, (map.get(animal.farmerId) ?? 0) + 1);
    }
    return map;
  }, [animals]);

  const combinedQuery = (searchQuery || globalSearch).trim().toLowerCase();

  const filteredFarmers = useMemo(() => {
    const list = farmers.filter((f) => {
      if (villageFilter !== 'ALL' && f.village !== villageFilter) return false;
      if (officerFilter !== 'ALL' && f.assignedOfficerId !== officerFilter) {
        return false;
      }
      if (statusFilter !== 'ALL' && f.status !== statusFilter) return false;
      if (!combinedQuery) return true;
      return (
        f.farmerId.toLowerCase().includes(combinedQuery) ||
        f.fullName.toLowerCase().includes(combinedQuery) ||
        f.phone.includes(combinedQuery) ||
        f.village.toLowerCase().includes(combinedQuery) ||
        f.assignedOfficerName.toLowerCase().includes(combinedQuery)
      );
    });

    return [...list].sort((a, b) =>
      sortBy === 'name'
        ? a.fullName.localeCompare(b.fullName)
        : a.farmerId.localeCompare(b.farmerId)
    );
  }, [farmers, villageFilter, officerFilter, statusFilter, combinedQuery, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [combinedQuery, villageFilter, officerFilter, statusFilter]);

  const paginatedFarmers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredFarmers.slice(start, start + PAGE_SIZE);
  }, [filteredFarmers, currentPage]);

  const selectedFarmer = useMemo(
    () => farmers.find((f) => f.farmerId === selectedFarmerId) ?? null,
    [farmers, selectedFarmerId]
  );

  const resetFilters = () => {
    setSearchQuery('');
    setVillageFilter('ALL');
    setOfficerFilter('ALL');
    setStatusFilter('ALL');
    setCurrentPage(1);
  };

  // --- Farmer Profile View ---
  if (selectedFarmer) {
    const farmerAnimals = animals.filter(
      (a) => a.farmerId === selectedFarmer.farmerId
    );
    const linkedCases = cases.filter(
      (c) => c.farmerId === selectedFarmer.farmerId
    );
    const linkedVisits = visits.filter(
      (v) => v.farmerId === selectedFarmer.farmerId
    );

    return (
      <div className="space-y-6">
        <ToastBanner message={toastMessage} onDismiss={onDismissToast} />

        {/* Back & Actions Bar */}
        <div className="flex flex-col gap-4 border-b border-[#E2E6E1] pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => onSelectFarmerId(null)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#163C2B] hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Back to Farmers Directory</span>
            </button>

            <div className="mt-2 flex flex-wrap items-center gap-2.5">
              <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1A1F1C]">
                {selectedFarmer.fullName}
              </h1>
              <span className="font-mono text-xs font-medium text-[#52796F]">
                {selectedFarmer.farmerId}
              </span>
              <FarmerStatusBadge status={selectedFarmer.status} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => onOpenEditFarmer(selectedFarmer)}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#D7DDD7] bg-white px-3.5 text-xs font-medium text-[#3D4640] transition-colors hover:bg-[#F1F3F0] whitespace-nowrap shrink-0"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Edit Farmer</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenNewAnimalForFarmer(selectedFarmer.farmerId)}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#163C2B] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#102D20] whitespace-nowrap shrink-0"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Register Animal</span>
            </button>
          </div>
        </div>

        {/* Profile Overview Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Farmer Profile Card */}
          <section
            aria-labelledby="farmer-details-heading"
            className="rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs lg:col-span-2"
          >
            <h2
              id="farmer-details-heading"
              className="font-display text-base font-semibold text-[#1A1F1C]"
            >
              Farmer &amp; Location Details
            </h2>

            <dl className="mt-4 grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
              <div>
                <dt className="text-[#626E66]">Primary Contact</dt>
                <dd className="mt-1 flex items-center gap-1.5 font-mono font-medium text-[#1A1F1C]">
                  <Phone className="h-3.5 w-3.5 text-[#52796F]" aria-hidden="true" />
                  <span>+91 {selectedFarmer.phone}</span>
                </dd>
              </div>

              <div>
                <dt className="text-[#626E66]">Alternate Contact</dt>
                <dd className="mt-1 font-mono text-[#1A1F1C]">
                  {selectedFarmer.alternatePhone
                    ? `+91 ${selectedFarmer.alternatePhone}`
                    : 'Not recorded'}
                </dd>
              </div>

              <div>
                <dt className="text-[#626E66]">Village &amp; Sub-Cluster</dt>
                <dd className="mt-1 flex items-center gap-1.5 font-medium text-[#1A1F1C]">
                  <MapPin className="h-3.5 w-3.5 text-[#52796F]" aria-hidden="true" />
                  <span>
                    {selectedFarmer.village} · {selectedFarmer.subCluster}
                  </span>
                </dd>
              </div>

              <div>
                <dt className="text-[#626E66]">Member Since</dt>
                <dd className="mt-1 flex items-center gap-1.5 text-[#1A1F1C] tabular-nums">
                  <CalendarDays
                    className="h-3.5 w-3.5 text-[#52796F]"
                    aria-hidden="true"
                  />
                  <span>{selectedFarmer.registeredSince}</span>
                </dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-[#626E66]">Farm / Shed Address</dt>
                <dd className="mt-1 text-[#1A1F1C]">{selectedFarmer.address}</dd>
              </div>

              {selectedFarmer.notes && (
                <div className="sm:col-span-2">
                  <dt className="text-[#626E66]">Operational Notes</dt>
                  <dd className="mt-1 rounded-md border border-[#ECEFEA] bg-[#FAFBF9] p-3 text-[#4F5A53]">
                    {selectedFarmer.notes}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {/* Assigned Officer Card */}
          <section
            aria-labelledby="assigned-officer-heading"
            className="flex flex-col justify-between rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs"
          >
            <div>
              <h2
                id="assigned-officer-heading"
                className="font-display text-base font-semibold text-[#1A1F1C]"
              >
                Assigned Field Officer
              </h2>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#EDF2EE] text-[#163C2B]">
                  <UserRound className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1A1F1C]">
                    {selectedFarmer.assignedOfficerName}
                  </p>
                  <p className="text-xs text-[#626E66]">
                    {selectedFarmer.assignedOfficerId} · {selectedFarmer.subCluster}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-[#ECEFEA] pt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#626E66]">Registered Livestock</span>
                <span className="font-display text-lg font-semibold text-[#163C2B] tabular-nums">
                  {farmerAnimals.length}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Registered Livestock Section */}
        <section
          aria-labelledby="farmer-livestock-heading"
          className="rounded-lg border border-[#E2E6E1] bg-white shadow-xs"
        >
          <div className="flex flex-col gap-2 border-b border-[#E2E6E1] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2
                id="farmer-livestock-heading"
                className="font-display text-base font-semibold text-[#1A1F1C]"
              >
                Registered Livestock ({farmerAnimals.length})
              </h2>
              <p className="mt-0.5 text-xs text-[#626E66]">
                Select any animal to open its full ear-tag profile and care history.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onOpenNewAnimalForFarmer(selectedFarmer.farmerId)}
              className="inline-flex items-center gap-1.5 rounded-md border border-[#D7DDD7] bg-white px-3 py-1.5 text-xs font-medium text-[#163C2B] hover:bg-[#EDF2EE] self-start sm:self-auto"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Add Animal</span>
            </button>
          </div>

          {farmerAnimals.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <PawPrint
                className="mx-auto h-7 w-7 text-[#8A968E]"
                aria-hidden="true"
              />
              <p className="mt-2 text-sm font-semibold text-[#1A1F1C]">
                No animals registered yet
              </p>
              <p className="mt-1 text-xs text-[#626E66]">
                Register cattle, buffalo, or goats under {selectedFarmer.fullName}’s profile.
              </p>
              <button
                type="button"
                onClick={() => onOpenNewAnimalForFarmer(selectedFarmer.farmerId)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-[#163C2B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#102D20]"
              >
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Register First Animal</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#ECEFEA]">
              {farmerAnimals.map((animal) => (
                <div
                  key={animal.animalId}
                  className="flex flex-col gap-3 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-mono font-semibold text-[#163C2B] tabular-nums">
                        {animal.earTag}
                      </span>
                      <span className="font-semibold text-[#1A1F1C]">
                        {animal.nameOrLabel}
                      </span>
                      <span className="text-[#C2CBC3]" aria-hidden="true">
                        ·
                      </span>
                      <span className="text-[#4F5A53]">
                        {animal.animalType} ({animal.breed})
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#626E66]">
                      {animal.gender} · {animal.ageYears}y {animal.ageMonths}m ·{' '}
                      {animal.lactationStage} · Last checked {animal.lastCheckedDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    <AnimalHealthBadge status={animal.healthStatus} />
                    <button
                      type="button"
                      onClick={() => onOpenAnimalProfile(animal.animalId)}
                      className="inline-flex items-center gap-1 rounded-md border border-[#D7DDD7] bg-white px-2.5 py-1 text-xs font-medium text-[#163C2B] hover:bg-[#EDF2EE]"
                    >
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Profile</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Historical Context: Recent Visits & Cases */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs">
            <h2 className="font-display text-sm font-semibold text-[#1A1F1C]">
              Recent Farm Visits ({linkedVisits.length})
            </h2>
            {linkedVisits.length === 0 ? (
              <p className="mt-3 text-xs text-[#626E66]">
                No recent scheduled or completed farm visits recorded.
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-[#ECEFEA]">
                {linkedVisits.map((v) => (
                  <li
                    key={v.visitId}
                    className="flex items-start justify-between gap-3 py-2.5 text-xs"
                  >
                    <div>
                      <p className="font-medium text-[#1A1F1C]">{v.purpose}</p>
                      <p className="mt-0.5 text-[11px] text-[#626E66]">
                        {v.fieldOfficer} · {v.scheduledDate}
                      </p>
                    </div>
                    <StatusBadge status={v.status} compact />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs">
            <h2 className="font-display text-sm font-semibold text-[#1A1F1C]">
              Recent Veterinary Requests ({linkedCases.length})
            </h2>
            {linkedCases.length === 0 ? (
              <p className="mt-3 text-xs text-[#626E66]">
                No veterinary assistance requests logged for this farmer.
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-[#ECEFEA]">
                {linkedCases.map((c) => (
                  <li
                    key={c.caseId}
                    className="flex items-start justify-between gap-3 py-2.5 text-xs"
                  >
                    <div>
                      {onOpenCaseDossier ? (
                        <button
                          type="button"
                          onClick={() => onOpenCaseDossier(c.caseId)}
                          className="font-mono font-medium text-[#163C2B] hover:underline"
                        >
                          {c.caseId} · {c.animalTag}
                        </button>
                      ) : (
                        <p className="font-mono font-medium text-[#163C2B]">
                          {c.caseId} · {c.animalTag}
                        </p>
                      )}
                      <p className="mt-0.5 text-[#4F5A53]">{c.concernSummary}</p>
                    </div>
                    <StatusBadge status={c.status} compact />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    );
  }

  // --- Farmer Directory Listing View ---
  const columns: DataTableColumn<FarmerRecord>[] = [
    {
      key: 'farmerId',
      header: 'Farmer ID',
      render: (row) => (
        <span className="font-mono text-xs font-medium text-[#1A1F1C] tabular-nums">
          {row.farmerId}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Farmer Name',
      render: (row) => (
        <div>
          <div className="text-xs font-semibold text-[#1A1F1C]">
            {row.fullName}
          </div>
          <div className="mt-0.5 text-[11px] text-[#626E66]">
            Since {row.registeredSince}
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Contact Number',
      render: (row) => (
        <span className="font-mono text-xs text-[#3D4640] tabular-nums">
          +91 {row.phone}
        </span>
      ),
    },
    {
      key: 'village',
      header: 'Village',
      render: (row) => (
        <div>
          <div className="text-xs font-medium text-[#1A1F1C]">{row.village}</div>
          <div className="mt-0.5 text-[11px] text-[#626E66]">
            {row.subCluster}
          </div>
        </div>
      ),
    },
    {
      key: 'animals',
      header: 'Registered Animals',
      align: 'right',
      render: (row) => {
        const count = animalCountByFarmer.get(row.farmerId) ?? 0;
        return (
          <span className="font-mono text-xs font-semibold text-[#163C2B] tabular-nums">
            {count}
          </span>
        );
      },
    },
    {
      key: 'officer',
      header: 'Assigned Field Officer',
      render: (row) => (
        <span className="text-xs text-[#3D4640]">{row.assignedOfficerName}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <FarmerStatusBadge status={row.status} />,
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
            onClick={() => onSelectFarmerId(row.farmerId)}
            title="View farmer profile"
            className="inline-flex items-center gap-1 rounded-md border border-[#D7DDD7] bg-white px-2.5 py-1 text-xs font-medium text-[#163C2B] hover:bg-[#EDF2EE]"
          >
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            <span>View</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenEditFarmer(row)}
            title="Edit farmer"
            aria-label={`Edit ${row.fullName}`}
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

      {/* Page Header */}
      <div className="flex flex-col gap-4 border-b border-[#E2E6E1] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1A1F1C]">
            Farmer Management
          </h1>
          <p className="mt-1 text-xs text-[#4F5A53]">
            Cooperative farmer registry ({farmers.length} members), village
            mapping, and field officer assignments.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewFarmer}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#163C2B] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#102D20] self-start sm:self-auto whitespace-nowrap shrink-0"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Register Farmer</span>
        </button>
      </div>

      {/* Directory Table Card */}
      <section className="rounded-lg border border-[#E2E6E1] bg-white shadow-xs">
        <div className="border-b border-[#E2E6E1] p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
            <div className="md:col-span-5">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Farmer ID, name, phone, or village..."
                aria-label="Search farmers"
                className="h-9 w-full rounded-md border border-[#D7DDD7] bg-white px-3 text-sm text-[#1A1F1C] placeholder:text-[#7E8981] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
              />
            </div>

            <div className="md:col-span-2">
              <select
                value={villageFilter}
                onChange={(e) => setVillageFilter(e.target.value)}
                aria-label="Filter by village"
                className="h-9 w-full rounded-md border border-[#D7DDD7] bg-white px-2.5 text-xs font-medium text-[#1A1F1C] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
              >
                <option value="ALL">All Villages</option>
                {VILLAGE_CLUSTER_OPTIONS.map((v) => (
                  <option key={v.village} value={v.village}>
                    {v.village}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <select
                value={officerFilter}
                onChange={(e) => setOfficerFilter(e.target.value)}
                aria-label="Filter by field officer"
                className="h-9 w-full rounded-md border border-[#D7DDD7] bg-white px-2.5 text-xs font-medium text-[#1A1F1C] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
              >
                <option value="ALL">All Officers</option>
                {officers.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3 flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as 'ALL' | FarmerStatus)
                }
                aria-label="Filter by status"
                className="h-9 flex-1 rounded-md border border-[#D7DDD7] bg-white px-2.5 text-xs font-medium text-[#1A1F1C] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
              >
                <option value="ALL">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              <button
                type="button"
                onClick={() => setSortBy((prev) => (prev === 'id' ? 'name' : 'id'))}
                className="h-9 rounded-md border border-[#D7DDD7] bg-white px-3 text-xs font-medium text-[#3D4640] hover:bg-[#F1F3F0] whitespace-nowrap shrink-0"
              >
                Sort: {sortBy === 'id' ? 'ID' : 'Name'}
              </button>
            </div>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={paginatedFarmers}
          rowKey={(row) => row.farmerId}
          onRowClick={(row) => onSelectFarmerId(row.farmerId)}
          emptyTitle="No matching farmers found"
          emptyDescription="Adjust your search query or village/officer filters to view farmer records."
          emptyActionLabel="Reset filters"
          onEmptyAction={resetFilters}
        />

        <div className="border-t border-[#ECEFEA] bg-[#FAFBF9] px-5 py-3">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredFarmers.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>
    </div>
  );
}

export function FarmerStatusBadge({ status }: { status: FarmerStatus }) {
  return status === 'Active' ? (
    <span className="inline-flex items-center gap-1 rounded-md border border-[#C6E4CE] bg-[#ECF6EF] px-2 py-0.5 text-[11px] font-medium text-[#166534] whitespace-nowrap">
      <CheckCircle2 className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span>Active</span>
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-md border border-[#DCE0DC] bg-[#F4F5F4] px-2 py-0.5 text-[11px] font-medium text-[#525D56] whitespace-nowrap">
      <XCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span>Inactive</span>
    </span>
  );
}

export function AnimalHealthBadge({
  status,
}: {
  status: AnimalRecord['healthStatus'];
}) {
  if (status === 'Healthy') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-[#C6E4CE] bg-[#ECF6EF] px-2 py-0.5 text-[11px] font-medium text-[#166534] whitespace-nowrap">
        <span>Healthy</span>
      </span>
    );
  }
  if (status === 'Under Care') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-[#C5D8E8] bg-[#EDF3F8] px-2 py-0.5 text-[11px] font-medium text-[#1D4E73] whitespace-nowrap">
        <span>Under Care</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-[#F3D9A6] bg-[#FEF6E7] px-2 py-0.5 text-[11px] font-medium text-[#92400E] whitespace-nowrap">
      <span>Follow-up</span>
    </span>
  );
}
