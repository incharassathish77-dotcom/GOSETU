import {
  CalendarDays,
  CheckCircle2,
  ClipboardPlus,
  Eye,
  MapPin,
  Play,
  Plus,
  X,
  XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { ConfirmationDialog } from '../components/ui/ConfirmationDialog';
import { DataTable, type DataTableColumn } from '../components/ui/DataTable';
import { Pagination } from '../components/ui/Pagination';
import { SearchFilterBar } from '../components/ui/SearchFilterBar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ToastBanner } from '../components/ui/ToastBanner';
import type {
  AnimalRecord,
  FarmVisitRecord,
  FarmVisitStatus,
  UserRole,
} from '../types/gosetu';

interface FarmVisitsPageProps {
  role: UserRole;
  officerId?: string;
  visits: FarmVisitRecord[];
  animals: AnimalRecord[];
  globalSearch: string;
  onOpenScheduleVisit?: () => void;
  onStartVisit: (visitId: string) => void;
  onCompleteVisit: (visitId: string) => void;
  onCancelVisit: (visitId: string) => void;
  onOpenObservationModal: (visit: FarmVisitRecord) => void;
  toastMessage: string | null;
  onDismissToast: () => void;
}

const STATUS_OPTIONS: { value: 'ALL' | FarmVisitStatus; label: string }[] = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'Scheduled', label: 'Scheduled' },
  { value: 'In Progress', label: 'In Progress' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' },
];

const PAGE_SIZE = 7;

export function FarmVisitsPage({
  role,
  officerId,
  visits,
  animals,
  globalSearch,
  onOpenScheduleVisit,
  onStartVisit,
  onCompleteVisit,
  onCancelVisit,
  onOpenObservationModal,
  toastMessage,
  onDismissToast,
}: FarmVisitsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | FarmVisitStatus>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);
  const [cancelTargetId, setCancelTargetId] = useState<string | null>(null);

  const scopedVisits = useMemo(() => {
    if (role === 'field_officer' && officerId) {
      return visits.filter((v) => v.fieldOfficerId === officerId);
    }
    return visits;
  }, [visits, role, officerId]);

  const combinedQuery = (searchQuery || globalSearch).trim().toLowerCase();

  const filteredVisits = useMemo(() => {
    return scopedVisits.filter((v) => {
      if (statusFilter !== 'ALL' && v.status !== statusFilter) return false;
      if (!combinedQuery) return true;
      return (
        v.visitId.toLowerCase().includes(combinedQuery) ||
        v.farmerName.toLowerCase().includes(combinedQuery) ||
        v.village.toLowerCase().includes(combinedQuery) ||
        v.fieldOfficer.toLowerCase().includes(combinedQuery) ||
        v.purpose.toLowerCase().includes(combinedQuery)
      );
    });
  }, [scopedVisits, statusFilter, combinedQuery]);

  const paginatedVisits = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredVisits.slice(start, start + PAGE_SIZE);
  }, [filteredVisits, currentPage]);

  const selectedVisit =
    scopedVisits.find((v) => v.visitId === selectedVisitId) ?? null;

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setCurrentPage(1);
  };

  const columns: DataTableColumn<FarmVisitRecord>[] = [
    {
      key: 'visitId',
      header: 'Visit ID',
      render: (row) => (
        <span className="font-mono text-xs font-medium text-[#1A1F1C] tabular-nums">
          {row.visitId}
        </span>
      ),
    },
    {
      key: 'farmer',
      header: 'Farmer & Location',
      render: (row) => (
        <div>
          <div className="text-xs font-semibold text-[#1A1F1C]">
            {row.farmerName}
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-[11px] text-[#626E66]">
            <MapPin className="h-3 w-3 text-[#52796F]" aria-hidden="true" />
            <span>{row.village}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'officer',
      header: 'Field Officer',
      render: (row) => (
        <span className="text-xs text-[#3D4640]">{row.fieldOfficer}</span>
      ),
    },
    {
      key: 'schedule',
      header: 'Scheduled Date',
      render: (row) => (
        <div className="text-xs tabular-nums">
          <div className="text-[#1A1F1C]">{row.scheduledDate}</div>
          <div className="text-[11px] text-[#626E66]">{row.scheduledTime}</div>
        </div>
      ),
    },
    {
      key: 'observations',
      header: 'Observations',
      render: (row) => (
        <span className="font-mono text-xs text-[#4F5A53] tabular-nums">
          {row.observations.length} logged
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} compact />,
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
            onClick={() => setSelectedVisitId(row.visitId)}
            className="inline-flex items-center gap-1 rounded-md border border-[#D7DDD7] bg-white px-2.5 py-1 text-xs font-medium text-[#163C2B] hover:bg-[#EDF2EE]"
          >
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Details</span>
          </button>
          {role === 'field_officer' && row.status === 'Scheduled' && (
            <button
              type="button"
              onClick={() => onStartVisit(row.visitId)}
              className="inline-flex items-center gap-1 rounded-md bg-[#163C2B] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#102D20]"
            >
              <Play className="h-3 w-3" aria-hidden="true" />
              <span>Start</span>
            </button>
          )}
          {role === 'field_officer' && row.status === 'In Progress' && (
            <button
              type="button"
              onClick={() => onOpenObservationModal(row)}
              className="inline-flex items-center gap-1 rounded-md bg-[#163C2B] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#102D20]"
            >
              <ClipboardPlus className="h-3 w-3" aria-hidden="true" />
              <span>Observe</span>
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
            {role === 'field_officer' ? 'Assigned Farm Visits' : 'Farm Visit Management'}
          </h1>
          <p className="mt-1 text-xs text-[#4F5A53]">
            {role === 'field_officer'
              ? 'Execute scheduled farm visits, document observable animal signs, and submit veterinary requests.'
              : 'Schedule cooperative farm visits, track field officer progress, and review logged observations.'}
          </p>
        </div>

        {role === 'admin' && onOpenScheduleVisit && (
          <button
            type="button"
            onClick={onOpenScheduleVisit}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#163C2B] px-4 text-xs font-semibold text-white hover:bg-[#102D20] self-start sm:self-auto whitespace-nowrap shrink-0"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Schedule Farm Visit</span>
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
            searchPlaceholder="Search by Visit ID, farmer, village, or officer..."
            filterValue={statusFilter}
            onFilterChange={(val) => {
              setStatusFilter(val as 'ALL' | FarmVisitStatus);
              setCurrentPage(1);
            }}
            filterOptions={STATUS_OPTIONS}
            filterLabel="Visit Status"
            secondaryAction={
              combinedQuery || statusFilter !== 'ALL'
                ? { label: 'Reset filters', onClick: resetFilters }
                : undefined
            }
          />
        </div>

        <DataTable
          columns={columns}
          data={paginatedVisits}
          rowKey={(row) => row.visitId}
          onRowClick={(row) => setSelectedVisitId(row.visitId)}
          emptyTitle="No matching farm visits"
          emptyDescription="Adjust your search or visit status filter."
          emptyActionLabel="Reset filters"
          onEmptyAction={resetFilters}
        />

        <div className="border-t border-[#ECEFEA] bg-[#FAFBF9] px-5 py-3">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredVisits.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>

      {/* Visit Detail Modal */}
      {selectedVisit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1F1C]/45 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedVisitId(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-[#E2E6E1] bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#ECEFEA] pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-semibold text-[#163C2B]">
                    {selectedVisit.visitId}
                  </span>
                  <StatusBadge status={selectedVisit.status} compact />
                </div>
                <h2 className="mt-1.5 font-display text-lg font-semibold text-[#1A1F1C]">
                  {selectedVisit.farmerName} — {selectedVisit.village}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVisitId(null)}
                aria-label="Close visit details"
                className="rounded p-1 text-[#626E66] hover:bg-[#F1F3F0]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <dl className="mt-4 grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
              <div>
                <dt className="text-[#626E66]">Assigned Field Officer</dt>
                <dd className="mt-0.5 font-semibold text-[#1A1F1C]">
                  {selectedVisit.fieldOfficer}
                </dd>
              </div>
              <div>
                <dt className="text-[#626E66]">Scheduled Slot</dt>
                <dd className="mt-0.5 flex items-center gap-1.5 text-[#1A1F1C] tabular-nums">
                  <CalendarDays className="h-3.5 w-3.5 text-[#52796F]" aria-hidden="true" />
                  <span>
                    {selectedVisit.scheduledDate} · {selectedVisit.scheduledTime}
                  </span>
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[#626E66]">Farm Address</dt>
                <dd className="mt-0.5 text-[#1A1F1C]">
                  {selectedVisit.location} ({selectedVisit.subCluster})
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[#626E66]">Visit Purpose</dt>
                <dd className="mt-1 rounded-md border border-[#ECEFEA] bg-[#FAFBF9] p-3 text-[#1A1F1C]">
                  {selectedVisit.purpose}
                </dd>
              </div>
            </dl>

            {/* Recorded Animal Observations */}
            <div className="mt-5 border-t border-[#ECEFEA] pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-[#1A1F1C]">
                  Field Observations ({selectedVisit.observations.length})
                </h3>
                {role === 'field_officer' &&
                  (selectedVisit.status === 'Scheduled' ||
                    selectedVisit.status === 'In Progress') &&
                  animals.some((a) => a.farmerId === selectedVisit.farmerId) && (
                    <button
                      type="button"
                      onClick={() => onOpenObservationModal(selectedVisit)}
                      className="inline-flex items-center gap-1 rounded-md bg-[#163C2B] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#102D20]"
                    >
                      <ClipboardPlus className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Record Observation</span>
                    </button>
                  )}
              </div>

              {selectedVisit.observations.length === 0 ? (
                <p className="mt-2 text-xs text-[#626E66]">
                  No animal observations have been logged for this visit yet.
                </p>
              ) : (
                <div className="mt-3 space-y-3">
                  {selectedVisit.observations.map((obs) => (
                    <div
                      key={obs.id}
                      className="rounded-md border border-[#E2E6E1] bg-[#FAFBF9] p-3.5 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold text-[#163C2B]">
                          {obs.animalName}{' '}
                          <span className="font-mono font-normal">
                            ({obs.animalTag})
                          </span>
                        </span>
                        <span className="text-[11px] text-[#626E66]">
                          {obs.recordedAt}
                        </span>
                      </div>
                      <p className="mt-1.5 text-[#1A1F1C]">
                        <span className="font-semibold">Farmer Concern:</span>{' '}
                        {obs.farmerConcern}
                      </p>
                      <p className="mt-1 text-[#4F5A53]">
                        <span className="font-semibold text-[#1A1F1C]">
                          Observable Signs:
                        </span>{' '}
                        {obs.observableSymptoms}
                      </p>
                      <p className="mt-1 text-[11px] text-[#626E66]">
                        Appetite/Yield: {obs.appetiteAndYieldNote} · Temp:{' '}
                        {obs.temperatureNote}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Workflow Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-[#ECEFEA] pt-4">
              <div className="flex flex-wrap items-center gap-2">
                {role === 'field_officer' && selectedVisit.status === 'Scheduled' && (
                  <button
                    type="button"
                    onClick={() => onStartVisit(selectedVisit.visitId)}
                    className="inline-flex items-center gap-1.5 rounded-md bg-[#163C2B] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#102D20]"
                  >
                    <Play className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Start Visit</span>
                  </button>
                )}

                {role === 'field_officer' &&
                  selectedVisit.status === 'In Progress' && (
                    <button
                      type="button"
                      onClick={() => onCompleteVisit(selectedVisit.visitId)}
                      className="inline-flex items-center gap-1.5 rounded-md bg-[#166534] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#14532D]"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Complete Visit</span>
                    </button>
                  )}

                {role === 'admin' &&
                  (selectedVisit.status === 'Scheduled' ||
                    selectedVisit.status === 'In Progress') && (
                    <button
                      type="button"
                      onClick={() => setCancelTargetId(selectedVisit.visitId)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-[#F3C6C6] bg-white px-3.5 py-2 text-xs font-medium text-[#B91C1C] hover:bg-[#FEF2F2]"
                    >
                      <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Cancel Visit</span>
                    </button>
                  )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedVisitId(null)}
                className="rounded-md border border-[#D7DDD7] bg-white px-4 py-2 text-xs font-medium text-[#3D4640] hover:bg-[#F1F3F0]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationDialog
        open={Boolean(cancelTargetId)}
        title="Cancel scheduled farm visit?"
        description="Cancelling this visit will update its status to Cancelled and notify the assigned field officer."
        confirmLabel="Cancel Visit"
        cancelLabel="Keep Visit"
        tone="danger"
        onConfirm={() => {
          if (cancelTargetId) {
            onCancelVisit(cancelTargetId);
            setCancelTargetId(null);
            setSelectedVisitId(null);
          }
        }}
        onCancel={() => setCancelTargetId(null)}
      />
    </div>
  );
}
