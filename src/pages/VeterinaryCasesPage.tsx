import { Eye, Plus, UserCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { CaseDossierView } from '../components/cases/CaseDossierView';
import { DataTable, type DataTableColumn } from '../components/ui/DataTable';
import { Pagination } from '../components/ui/Pagination';
import { SearchFilterBar } from '../components/ui/SearchFilterBar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ToastBanner } from '../components/ui/ToastBanner';
import type {
  AnimalRecord,
  ConsultationDetails,
  FarmerRecord,
  FollowUpRecord,
  UserRole,
  VeterinaryCaseRecord,
  VeterinaryCaseStatus,
} from '../types/gosetu';

interface VeterinaryCasesPageProps {
  mode: 'requests' | 'cases' | 'consultations';
  role: UserRole;
  currentVetId?: string;
  currentVetName?: string;
  currentFarmerId?: string;
  cases: VeterinaryCaseRecord[];
  farmers: FarmerRecord[];
  animals: AnimalRecord[];
  followUps: FollowUpRecord[];
  globalSearch: string;
  selectedCaseId: string | null;
  onSelectCaseId: (caseId: string | null) => void;
  onOpenNewRequest?: () => void;
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

const CASE_STATUS_OPTIONS: { value: 'ALL' | VeterinaryCaseStatus; label: string }[] = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'Submitted', label: 'Submitted' },
  { value: 'Under Review', label: 'Under Review' },
  { value: 'Assigned', label: 'Assigned' },
  { value: 'In Consultation', label: 'In Consultation' },
  { value: 'Follow-up Required', label: 'Follow-up Required' },
  { value: 'Resolved', label: 'Resolved' },
  { value: 'Closed', label: 'Closed' },
  { value: 'Cancelled', label: 'Cancelled' },
];

const PAGE_SIZE = 7;

export function VeterinaryCasesPage({
  mode,
  role,
  currentVetId,
  currentVetName,
  currentFarmerId,
  cases,
  farmers,
  animals,
  followUps,
  globalSearch,
  selectedCaseId,
  onSelectCaseId,
  onOpenNewRequest,
  onOpenAssignVet,
  onMarkUnderReview,
  onSaveConsultation,
  onScheduleFollowUp,
  onCloseCase,
  toastMessage,
  onDismissToast,
}: VeterinaryCasesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | VeterinaryCaseStatus>(
    'ALL'
  );
  const [currentPage, setCurrentPage] = useState(1);

  const scopedCases = useMemo(() => {
    if (role === 'farmer' && currentFarmerId) {
      return cases.filter((c) => c.farmerId === currentFarmerId);
    }
    if (role === 'veterinarian' && currentVetId) {
      return cases.filter((c) => c.assignedVetId === currentVetId);
    }
    if (role === 'admin' && mode === 'requests') {
      return cases.filter(
        (c) =>
          c.status === 'Submitted' ||
          c.status === 'Under Review' ||
          c.assignedVetId === null ||
          c.caseId.startsWith('REQ-')
      );
    }
    return cases;
  }, [cases, role, currentFarmerId, currentVetId, mode]);

  const combinedQuery = (searchQuery || globalSearch).trim().toLowerCase();

  const filteredCases = useMemo(() => {
    return scopedCases.filter((c) => {
      if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
      if (!combinedQuery) return true;
      return (
        c.caseId.toLowerCase().includes(combinedQuery) ||
        c.farmerName.toLowerCase().includes(combinedQuery) ||
        c.village.toLowerCase().includes(combinedQuery) ||
        c.animalTag.toLowerCase().includes(combinedQuery) ||
        c.concernSummary.toLowerCase().includes(combinedQuery) ||
        (c.assignedVet?.toLowerCase().includes(combinedQuery) ?? false)
      );
    });
  }, [scopedCases, statusFilter, combinedQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [combinedQuery, statusFilter, mode]);

  const paginatedCases = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredCases.slice(start, start + PAGE_SIZE);
  }, [filteredCases, currentPage]);

  const selectedCase = cases.find((c) => c.caseId === selectedCaseId) ?? null;

  if (selectedCase) {
    const farmer =
      farmers.find((f) => f.farmerId === selectedCase.farmerId) ?? null;
    const animal =
      animals.find((a) => a.animalId === selectedCase.animalId) ?? null;
    const previousCases = cases.filter(
      (c) =>
        c.animalId === selectedCase.animalId &&
        c.caseId !== selectedCase.caseId
    );
    const caseFollowUps = followUps.filter(
      (f) => f.caseId === selectedCase.caseId
    );

    return (
      <CaseDossierView
        role={role}
        vetName={currentVetName}
        caseRecord={selectedCase}
        farmer={farmer}
        animal={animal}
        previousCases={previousCases}
        caseFollowUps={caseFollowUps}
        onBack={() => onSelectCaseId(null)}
        onOpenAssignVet={onOpenAssignVet}
        onMarkUnderReview={onMarkUnderReview}
        onSaveConsultation={onSaveConsultation}
        onScheduleFollowUp={onScheduleFollowUp}
        onCloseCase={onCloseCase}
        toastMessage={toastMessage}
        onDismissToast={onDismissToast}
      />
    );
  }

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setCurrentPage(1);
  };

  const titleText =
    role === 'farmer'
      ? 'My Veterinary Requests'
      : role === 'veterinarian'
        ? mode === 'consultations'
          ? 'Clinical Consultations'
          : 'Assigned Veterinary Cases'
        : mode === 'requests'
          ? 'Veterinary Assistance Requests'
          : 'Veterinary Case Management';

  const subtitleText =
    role === 'farmer'
      ? 'Submit animal health concerns and track veterinary updates and follow-up care.'
      : role === 'veterinarian'
        ? 'Review assigned cases, enter clinical examinations and treatment plans, and manage case closure.'
        : mode === 'requests'
          ? 'Review incoming assistance requests and assign cases to panel veterinarians.'
          : 'Monitor full clinical case lifecycle from triage through consultation, follow-up, and closure.';

  const columns: DataTableColumn<VeterinaryCaseRecord>[] = [
    {
      key: 'caseId',
      header: 'Case ID',
      render: (row) => (
        <div>
          <span className="font-mono text-xs font-semibold text-[#163C2B] tabular-nums">
            {row.caseId}
          </span>
          <div className="mt-0.5 text-[11px] text-[#626E66]">{row.priority}</div>
        </div>
      ),
    },
    {
      key: 'farmer',
      header: 'Farmer',
      render: (row) => (
        <div>
          <div className="text-xs font-semibold text-[#1A1F1C]">
            {row.farmerName}
          </div>
          <div className="text-[11px] text-[#626E66]">{row.village}</div>
        </div>
      ),
    },
    {
      key: 'animal',
      header: 'Animal',
      render: (row) => (
        <div>
          <div className="font-mono text-xs font-medium text-[#163C2B]">
            {row.animalTag}
          </div>
          <div className="text-[11px] text-[#4F5A53]">{row.speciesBreed}</div>
        </div>
      ),
    },
    {
      key: 'requestDate',
      header: 'Request Date',
      render: (row) => (
        <span className="text-xs text-[#3D4640] tabular-nums">
          {row.requestDate}
        </span>
      ),
    },
    {
      key: 'vet',
      header: 'Assigned Veterinarian',
      render: (row) =>
        row.assignedVet ? (
          <span className="text-xs font-medium text-[#1A1F1C]">
            {row.assignedVet}
          </span>
        ) : (
          <span className="text-xs font-medium text-[#92400E]">Unassigned</span>
        ),
    },
    {
      key: 'status',
      header: 'Current Status',
      render: (row) => <StatusBadge status={row.status} compact />,
    },
    {
      key: 'lastUpdated',
      header: 'Last Updated',
      render: (row) => (
        <span className="text-[11px] text-[#626E66] tabular-nums">
          {row.lastUpdated}
        </span>
      ),
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
            onClick={() => onSelectCaseId(row.caseId)}
            className="inline-flex items-center gap-1 rounded-md border border-[#D7DDD7] bg-white px-2.5 py-1 text-xs font-medium text-[#163C2B] hover:bg-[#EDF2EE]"
          >
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Open</span>
          </button>

          {role === 'admin' &&
            !row.assignedVetId &&
            row.status !== 'Closed' &&
            row.status !== 'Cancelled' &&
            onOpenAssignVet && (
              <button
                type="button"
                onClick={() => onOpenAssignVet(row)}
                className="inline-flex items-center gap-1 rounded-md bg-[#163C2B] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#102D20]"
              >
                <UserCheck className="h-3 w-3" aria-hidden="true" />
                <span>Assign</span>
              </button>
            )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <ToastBanner message={toastMessage} onDismiss={onDismissToast} />

      <div className="flex flex-col gap-4 border-b border-[#E2E6E1] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1A1F1C]">
            {titleText}
          </h1>
          <p className="mt-1 text-xs text-[#4F5A53]">{subtitleText}</p>
        </div>

        {role !== 'veterinarian' && onOpenNewRequest && (
          <button
            type="button"
            onClick={onOpenNewRequest}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#163C2B] px-4 text-xs font-semibold text-white hover:bg-[#102D20] self-start sm:self-auto whitespace-nowrap shrink-0"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Request Veterinary Assistance</span>
          </button>
        )}
      </div>

      <section className="rounded-lg border border-[#E2E6E1] bg-white shadow-xs">
        <div className="border-b border-[#E2E6E1] p-4 sm:p-5">
          <SearchFilterBar
            searchQuery={searchQuery}
            onSearchChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            searchPlaceholder="Search by Case ID, farmer, ear tag, or veterinarian..."
            filterValue={statusFilter}
            onFilterChange={(val) => {
              setStatusFilter(val as 'ALL' | VeterinaryCaseStatus);
              setCurrentPage(1);
            }}
            filterOptions={CASE_STATUS_OPTIONS}
            filterLabel="Case Status"
            secondaryAction={
              combinedQuery || statusFilter !== 'ALL'
                ? { label: 'Reset filters', onClick: resetFilters }
                : undefined
            }
          />
        </div>

        <DataTable
          columns={columns}
          data={paginatedCases}
          rowKey={(row) => row.caseId}
          onRowClick={(row) => onSelectCaseId(row.caseId)}
          emptyTitle="No matching cases"
          emptyDescription="No requests or cases match your current search or filter."
          emptyActionLabel="Reset filters"
          onEmptyAction={resetFilters}
        />

        <div className="border-t border-[#ECEFEA] bg-[#FAFBF9] px-5 py-3">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredCases.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>
    </div>
  );
}
