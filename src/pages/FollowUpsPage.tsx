import { CheckCircle2, Eye, X } from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import { DataTable, type DataTableColumn } from '../components/ui/DataTable';
import { Pagination } from '../components/ui/Pagination';
import { SearchFilterBar } from '../components/ui/SearchFilterBar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { ToastBanner } from '../components/ui/ToastBanner';
import type { FollowUpRecord, FollowUpStatus, UserRole } from '../types/gosetu';

interface FollowUpsPageProps {
  role: UserRole;
  officerId?: string;
  followUps: FollowUpRecord[];
  globalSearch: string;
  onUpdateFollowUpStatus: (
    followUpId: string,
    officerUpdateNote: string
  ) => void;
  onOpenCaseDossier: (caseId: string) => void;
  toastMessage: string | null;
  onDismissToast: () => void;
}

const FOLLOW_UP_STATUS_OPTIONS: { value: 'ALL' | FollowUpStatus; label: string }[] = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'Overdue', label: 'Overdue' },
  { value: 'Due', label: 'Due' },
  { value: 'Scheduled', label: 'Scheduled' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Cancelled', label: 'Cancelled' },
];

const PAGE_SIZE = 7;

export function FollowUpsPage({
  role,
  officerId,
  followUps,
  globalSearch,
  onUpdateFollowUpStatus,
  onOpenCaseDossier,
  toastMessage,
  onDismissToast,
}: FollowUpsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | FollowUpStatus>('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  const [updatingItem, setUpdatingItem] = useState<FollowUpRecord | null>(null);
  const [updateNote, setUpdateNote] = useState('');
  const [updateError, setUpdateError] = useState<string | null>(null);

  const scopedFollowUps = useMemo(() => {
    if (role === 'field_officer' && officerId) {
      return followUps.filter((f) => f.assignedOfficerId === officerId);
    }
    return followUps;
  }, [followUps, role, officerId]);

  const combinedQuery = (searchQuery || globalSearch).trim().toLowerCase();

  const filtered = useMemo(() => {
    return scopedFollowUps.filter((f) => {
      if (statusFilter !== 'ALL' && f.status !== statusFilter) return false;
      if (!combinedQuery) return true;
      return (
        f.followUpId.toLowerCase().includes(combinedQuery) ||
        f.caseId.toLowerCase().includes(combinedQuery) ||
        f.farmerName.toLowerCase().includes(combinedQuery) ||
        f.animalTag.toLowerCase().includes(combinedQuery) ||
        f.assignedPerson.toLowerCase().includes(combinedQuery)
      );
    });
  }, [scopedFollowUps, statusFilter, combinedQuery]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('ALL');
    setCurrentPage(1);
  };

  const handleOpenUpdateModal = (item: FollowUpRecord) => {
    setUpdatingItem(item);
    setUpdateNote('');
    setUpdateError(null);
  };

  const handleSubmitUpdate = (e: FormEvent) => {
    e.preventDefault();
    if (!updatingItem) return;
    if (!updateNote.trim()) {
      setUpdateError('Enter your field verification observation before completing.');
      return;
    }
    onUpdateFollowUpStatus(updatingItem.followUpId, updateNote.trim());
    setUpdatingItem(null);
  };

  const columns: DataTableColumn<FollowUpRecord>[] = [
    {
      key: 'id',
      header: 'Follow-up / Case ID',
      render: (row) => (
        <div>
          <span className="font-mono text-xs font-semibold text-[#1A1F1C]">
            {row.followUpId}
          </span>
          <div className="mt-0.5 font-mono text-[11px] text-[#163C2B]">
            {row.caseId}
          </div>
        </div>
      ),
    },
    {
      key: 'farmerAnimal',
      header: 'Farmer & Animal',
      render: (row) => (
        <div>
          <div className="text-xs font-semibold text-[#1A1F1C]">
            {row.farmerName}
          </div>
          <div className="mt-0.5 font-mono text-[11px] text-[#4F5A53]">
            {row.animalTag}
          </div>
        </div>
      ),
    },
    {
      key: 'instruction',
      header: 'Veterinary Follow-up Instruction',
      render: (row) => (
        <div className="max-w-xs text-xs">
          <p className="text-[#1A1F1C]">{row.instructionNote}</p>
          {row.officerUpdateNote && (
            <p className="mt-1 text-[11px] text-[#166534]">
              Officer update: {row.officerUpdateNote}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'assigned',
      header: 'Assigned Officer',
      render: (row) => (
        <span className="text-xs text-[#3D4640]">{row.assignedPerson}</span>
      ),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (row) => (
        <span className="text-xs text-[#1A1F1C] tabular-nums">
          {row.dueDate}
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
          {role === 'field_officer' &&
            (row.status === 'Due' ||
              row.status === 'Overdue' ||
              row.status === 'Scheduled') && (
              <button
                type="button"
                onClick={() => handleOpenUpdateModal(row)}
                className="inline-flex items-center gap-1 rounded-md bg-[#163C2B] px-2.5 py-1 text-xs font-medium text-white hover:bg-[#102D20]"
              >
                <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                <span>Complete</span>
              </button>
            )}

          <button
            type="button"
            onClick={() => onOpenCaseDossier(row.caseId)}
            className="inline-flex items-center gap-1 rounded-md border border-[#D7DDD7] bg-white px-2.5 py-1 text-xs font-medium text-[#163C2B] hover:bg-[#EDF2EE]"
          >
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Case</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <ToastBanner message={toastMessage} onDismiss={onDismissToast} />

      <div className="border-b border-[#E2E6E1] pb-5">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1A1F1C]">
          {role === 'field_officer'
            ? 'Assigned Follow-ups'
            : role === 'veterinarian'
              ? 'Follow-up Schedule & Review'
              : 'Follow-up Monitoring'}
        </h1>
        <p className="mt-1 text-xs text-[#4F5A53]">
          {role === 'field_officer'
            ? 'Verify post-consultation instructions during farm checks and record completion updates.'
            : role === 'veterinarian'
              ? 'Monitor scheduled follow-ups, review field officer updates, and close recovered cases.'
              : 'Track scheduled, due, overdue, and completed post-treatment follow-up activities.'}
        </p>
      </div>

      <section className="rounded-lg border border-[#E2E6E1] bg-white shadow-xs">
        <div className="border-b border-[#E2E6E1] p-4 sm:p-5">
          <SearchFilterBar
            searchQuery={searchQuery}
            onSearchChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            searchPlaceholder="Search by Follow-up ID, Case ID, farmer, or ear tag..."
            filterValue={statusFilter}
            onFilterChange={(val) => {
              setStatusFilter(val as 'ALL' | FollowUpStatus);
              setCurrentPage(1);
            }}
            filterOptions={FOLLOW_UP_STATUS_OPTIONS}
            filterLabel="Follow-up Status"
            secondaryAction={
              combinedQuery || statusFilter !== 'ALL'
                ? { label: 'Reset filters', onClick: resetFilters }
                : undefined
            }
          />
        </div>

        <DataTable
          columns={columns}
          data={paginated}
          rowKey={(row) => row.followUpId}
          onRowClick={(row) => onOpenCaseDossier(row.caseId)}
          emptyTitle="No matching follow-ups"
          emptyDescription="Adjust your search or status filter to view follow-up tasks."
          emptyActionLabel="Reset filters"
          onEmptyAction={resetFilters}
        />

        <div className="border-t border-[#ECEFEA] bg-[#FAFBF9] px-5 py-3">
          <Pagination
            currentPage={currentPage}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </div>
      </section>

      {/* Field Officer Follow-up Update Modal */}
      {updatingItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1F1C]/45 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setUpdatingItem(null)}
        >
          <div
            className="w-full max-w-md rounded-lg border border-[#E2E6E1] bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-[#ECEFEA] pb-3">
              <div>
                <h2 className="font-display text-base font-semibold text-[#1A1F1C]">
                  Complete Follow-up · {updatingItem.followUpId}
                </h2>
                <p className="mt-0.5 text-xs text-[#626E66]">
                  {updatingItem.farmerName} ({updatingItem.animalTag})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setUpdatingItem(null)}
                aria-label="Close modal"
                className="rounded p-1 text-[#626E66] hover:bg-[#F1F3F0]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSubmitUpdate} className="mt-4 space-y-4">
              <div className="rounded-md border border-[#ECEFEA] bg-[#FAFBF9] p-3 text-xs text-[#4F5A53]">
                <span className="font-semibold text-[#1A1F1C]">
                  Vet Instruction:
                </span>{' '}
                {updatingItem.instructionNote}
              </div>

              {updateError && (
                <p className="text-xs font-medium text-[#B91C1C]">
                  {updateError}
                </p>
              )}

              <div>
                <label
                  htmlFor="fu-update-note"
                  className="block text-xs font-semibold text-[#3D4640]"
                >
                  Field Officer Verification Note{' '}
                  <span className="text-[#B91C1C]">*</span>
                </label>
                <textarea
                  id="fu-update-note"
                  rows={3}
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  placeholder="Document observed recovery, appetite, temperature, or CMT result for veterinarian review"
                  className="mt-1.5 w-full rounded-md border border-[#D4DBD4] bg-white px-3 py-2 text-sm text-[#1A1F1C]"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-[#ECEFEA] pt-4">
                <button
                  type="button"
                  onClick={() => setUpdatingItem(null)}
                  className="rounded-md border border-[#D4DBD4] bg-white px-4 py-2 text-xs font-medium text-[#3D4640]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-[#163C2B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#102D20]"
                >
                  Submit Follow-up Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
