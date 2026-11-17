import {
  ArrowRight,
  CalendarDays,
  Eye,
  MapPin,
  Plus,
  RefreshCw,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { ActivityTimeline } from '../components/ui/ActivityTimeline';
import { DashboardMetricCard } from '../components/ui/DashboardMetricCard';
import { DataTable, type DataTableColumn } from '../components/ui/DataTable';
import { Pagination } from '../components/ui/Pagination';
import { SearchFilterBar } from '../components/ui/SearchFilterBar';
import { StatusBadge } from '../components/ui/StatusBadge';
import type {
  CaseStatusBreakdownItem,
  DashboardMetric,
  FarmVisitRecord,
  FarmVisitStatus,
  FieldOfficerOption,
  FollowUpRecord,
  FollowUpStatus,
  StakeholderAccount,
  TimeframeOption,
  VeterinaryCaseRecord,
  VeterinaryCaseStatus,
} from '../types/gosetu';

interface AdminDashboardPageProps {
  account: StakeholderAccount;
  globalSearch: string;
  onClearGlobalSearch: () => void;
  onNavigateModule: (navId: string) => void;
  totalFarmersCount: number;
  totalAnimalsCount: number;
  officers: FieldOfficerOption[];
  visits: FarmVisitRecord[];
  cases: VeterinaryCaseRecord[];
  followUps: FollowUpRecord[];
  onQuickRegisterFarmer: () => void;
  onOpenCaseDossier: (caseId: string) => void;
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

const OVERVIEW_STATUS_META: {
  status: VeterinaryCaseStatus;
  barColorClass: string;
}[] = [
  { status: 'Submitted', barColorClass: 'bg-[#64748B]' },
  { status: 'Under Review', barColorClass: 'bg-[#D97706]' },
  { status: 'Assigned', barColorClass: 'bg-[#2563EB]' },
  { status: 'In Consultation', barColorClass: 'bg-[#1B4D38]' },
  { status: 'Follow-up Required', barColorClass: 'bg-[#B45309]' },
  { status: 'Resolved', barColorClass: 'bg-[#16A34A]' },
  { status: 'Closed', barColorClass: 'bg-[#52796F]' },
];

const PAGE_SIZE = 5;

export function AdminDashboardPage({
  account,
  globalSearch,
  onClearGlobalSearch,
  onNavigateModule,
  totalFarmersCount,
  totalAnimalsCount,
  officers,
  visits,
  cases,
  followUps,
  onQuickRegisterFarmer,
  onOpenCaseDossier,
}: AdminDashboardPageProps) {
  const [timeframe, setTimeframe] = useState<TimeframeOption>('today');
  const [localSearch, setLocalSearch] = useState('');
  const [caseStatusFilter, setCaseStatusFilter] = useState<'ALL' | VeterinaryCaseStatus>(
    'ALL'
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedCase, setSelectedCase] = useState<VeterinaryCaseRecord | null>(null);

  const [visitFilter, setVisitFilter] = useState<'ALL' | FarmVisitStatus>('ALL');
  const [followUpFilter, setFollowUpFilter] = useState<'ALL' | FollowUpStatus>('ALL');

  const pendingRequestsCount = cases.filter(
    (c) => c.status === 'Submitted' || c.status === 'Under Review'
  ).length;
  const submittedCount = cases.filter((c) => c.status === 'Submitted').length;
  const underReviewCount = cases.filter((c) => c.status === 'Under Review').length;
  const activeCasesCount = cases.filter(
    (c) =>
      c.status === 'Assigned' ||
      c.status === 'In Consultation' ||
      c.status === 'Follow-up Required'
  ).length;
  const overdueFollowUpsCount = followUps.filter(
    (f) => f.status === 'Overdue'
  ).length;
  const activeOfficersCount = officers.filter((o) => o.status === 'Active').length;

  const metrics: DashboardMetric[] = useMemo(() => {
    const scopeLabel =
      timeframe === 'today'
        ? 'Today’s cooperative queue'
        : timeframe === '7d'
          ? '7-day cooperative activity'
          : '30-day cooperative records';

    return [
      {
        id: 'total-farmers',
        label: 'Total Farmers',
        value: totalFarmersCount,
        description: `Enrolled cooperative members · ${scopeLabel}`,
        iconKey: 'farmers',
        tone: 'forest',
        targetNavId: 'farmers',
      },
      {
        id: 'total-animals',
        label: 'Total Registered Animals',
        value: totalAnimalsCount,
        description: 'Ear-tagged livestock linked to farmers',
        iconKey: 'animals',
        tone: 'forest',
        targetNavId: 'animals',
      },
      {
        id: 'active-officers',
        label: 'Active Field Officers',
        value: activeOfficersCount,
        description: `${officers.length} officers covering all sub-clusters`,
        iconKey: 'officers',
        tone: 'sage',
        targetNavId: 'field-officers',
      },
      {
        id: 'pending-requests',
        label: 'Pending Veterinary Requests',
        value: pendingRequestsCount,
        description: `${submittedCount} submitted · ${underReviewCount} under review`,
        iconKey: 'requests',
        tone: 'amber',
        targetNavId: 'veterinary-requests',
      },
      {
        id: 'active-cases',
        label: 'Active Veterinary Cases',
        value: activeCasesCount,
        description: 'Assigned, in consultation, or in follow-up',
        iconKey: 'cases',
        tone: 'forest',
        targetNavId: 'veterinary-cases',
      },
      {
        id: 'overdue-followups',
        label: 'Overdue Follow-ups',
        value: overdueFollowUpsCount,
        description: 'Past scheduled due date · officer update needed',
        iconKey: 'followups',
        tone: 'crimson',
        targetNavId: 'follow-ups',
      },
    ];
  }, [
    timeframe,
    totalFarmersCount,
    totalAnimalsCount,
    activeOfficersCount,
    officers.length,
    pendingRequestsCount,
    submittedCount,
    underReviewCount,
    activeCasesCount,
    overdueFollowUpsCount,
  ]);

  const caseStatusOverview: CaseStatusBreakdownItem[] = useMemo(() => {
    const total = Math.max(1, cases.length);
    return OVERVIEW_STATUS_META.map((meta) => {
      const count = cases.filter((c) => c.status === meta.status).length;
      return {
        status: meta.status,
        count,
        percentage: Math.round((count / total) * 100),
        barColorClass: meta.barColorClass,
      };
    });
  }, [cases]);

  const combinedQuery = (localSearch || globalSearch).trim().toLowerCase();

  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      if (caseStatusFilter !== 'ALL' && item.status !== caseStatusFilter) {
        return false;
      }
      if (!combinedQuery) return true;
      return (
        item.caseId.toLowerCase().includes(combinedQuery) ||
        item.farmerName.toLowerCase().includes(combinedQuery) ||
        item.village.toLowerCase().includes(combinedQuery) ||
        item.animalTag.toLowerCase().includes(combinedQuery) ||
        item.concernSummary.toLowerCase().includes(combinedQuery)
      );
    });
  }, [cases, combinedQuery, caseStatusFilter]);

  const paginatedCases = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredCases.slice(start, start + PAGE_SIZE);
  }, [filteredCases, currentPage]);

  const filteredVisits = useMemo(() => {
    return visits.filter((item) => {
      if (visitFilter !== 'ALL' && item.status !== visitFilter) return false;
      if (!combinedQuery) return true;
      return (
        item.farmerName.toLowerCase().includes(combinedQuery) ||
        item.fieldOfficer.toLowerCase().includes(combinedQuery) ||
        item.location.toLowerCase().includes(combinedQuery) ||
        item.village.toLowerCase().includes(combinedQuery)
      );
    });
  }, [visits, visitFilter, combinedQuery]);

  const filteredFollowUps = useMemo(() => {
    return followUps.filter((item) => {
      if (followUpFilter !== 'ALL' && item.status !== followUpFilter) return false;
      if (!combinedQuery) return true;
      return (
        item.caseId.toLowerCase().includes(combinedQuery) ||
        item.farmerName.toLowerCase().includes(combinedQuery) ||
        item.animalTag.toLowerCase().includes(combinedQuery) ||
        item.assignedPerson.toLowerCase().includes(combinedQuery)
      );
    });
  }, [followUps, followUpFilter, combinedQuery]);

  const clusterOperations = useMemo(() => {
    return officers.slice(0, 4).map((officer) => {
      const officerVisits = visits.filter((v) => v.fieldOfficerId === officer.id);
      const completedVisits = officerVisits.filter(
        (v) => v.status === 'Completed'
      ).length;
      const pendingVisits = officerVisits.filter(
        (v) => v.status === 'Scheduled' || v.status === 'In Progress'
      ).length;
      const observationsSubmitted = officerVisits.reduce(
        (sum, v) => sum + v.observations.length,
        0
      );
      return {
        clusterName: officer.subCluster,
        officerName: officer.name,
        completedVisits,
        pendingVisits,
        totalScheduled: completedVisits + pendingVisits,
        observationsSubmitted,
      };
    });
  }, [officers, visits]);

  const totalCompletedClusterVisits = clusterOperations.reduce(
    (sum, item) => sum + item.completedVisits,
    0
  );
  const totalScheduledClusterVisits = clusterOperations.reduce(
    (sum, item) => sum + item.totalScheduled,
    0
  );

  const handleSimulatedRefresh = () => {
    setIsRefreshing(true);
    window.setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  };

  const resetCaseFilters = () => {
    setLocalSearch('');
    onClearGlobalSearch();
    setCaseStatusFilter('ALL');
    setCurrentPage(1);
  };

  const handleFilterStatusFromOverview = (status: VeterinaryCaseStatus) => {
    setCaseStatusFilter((prev) => (prev === status ? 'ALL' : status));
    setCurrentPage(1);
  };

  const caseColumns: DataTableColumn<VeterinaryCaseRecord>[] = [
    {
      key: 'requestId',
      header: 'Request ID',
      render: (row) => (
        <span className="font-mono text-xs font-medium text-[#1A1F1C] tabular-nums">
          {row.caseId}
        </span>
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
          <div className="mt-0.5 text-[11px] text-[#626E66]">{row.village}</div>
        </div>
      ),
    },
    {
      key: 'animal',
      header: 'Animal Identification',
      render: (row) => (
        <div>
          <div className="font-mono text-xs font-medium text-[#163C2B] tabular-nums">
            {row.animalTag}
          </div>
          <div className="mt-0.5 text-[11px] text-[#4F5A53]">
            {row.speciesBreed}
          </div>
        </div>
      ),
    },
    {
      key: 'requestDate',
      header: 'Request Date',
      render: (row) => (
        <div>
          <div className="text-xs text-[#1A1F1C] tabular-nums">
            {row.requestDate}
          </div>
          <div className="mt-0.5 text-[11px] text-[#626E66] tabular-nums">
            {row.submittedTime}
          </div>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (row) => {
        const tone =
          row.priority === 'Urgent'
            ? 'text-[#B91C1C] bg-[#FEF2F2] border-[#F8CACA]'
            : row.priority === 'Priority'
              ? 'text-[#92400E] bg-[#FEF6E7] border-[#F3D9A6]'
              : 'text-[#4F5A53] bg-[#F4F6F4] border-[#E2E6E1]';
        return (
          <span
            className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${tone}`}
          >
            {row.priority}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} compact />,
    },
    {
      key: 'actions',
      header: 'Action',
      align: 'right',
      render: (row) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedCase(row);
          }}
          className="inline-flex items-center gap-1.5 rounded-md border border-[#D7DDD7] bg-white px-2.5 py-1 text-xs font-medium text-[#163C2B] transition-colors hover:bg-[#EDF2EE] whitespace-nowrap shrink-0"
        >
          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
          <span>View</span>
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col gap-4 border-b border-[#E2E6E1] pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-medium text-[#52796F]">
            Tuesday, 17 November 2026
            <span className="mx-2 text-[#C2CBC3]" aria-hidden="true">
              ·
            </span>
            {account.organization}
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-[#1A1F1C]">
            Welcome back, {account.fullName}
          </h1>
          <p className="mt-1 text-xs text-[#4F5A53]">
            {officers.length} sub-clusters active · {pendingRequestsCount} pending
            requests and {overdueFollowUpsCount} overdue follow-ups need
            coordination today.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div
            className="inline-flex items-center rounded-md border border-[#E2E6E1] bg-white p-0.5"
            role="group"
            aria-label="Dashboard timeframe"
          >
            {(
              [
                { id: 'today', label: 'Today' },
                { id: '7d', label: 'Last 7 Days' },
                { id: '30d', label: 'Last 30 Days' },
              ] as const
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setTimeframe(option.id)}
                className={`rounded px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  timeframe === option.id
                    ? 'bg-[#163C2B] text-white'
                    : 'text-[#4F5A53] hover:text-[#1A1F1C]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSimulatedRefresh}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#D7DDD7] bg-white px-3 text-xs font-medium text-[#3D4640] transition-colors hover:bg-[#F1F3F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C2B] whitespace-nowrap shrink-0"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={onQuickRegisterFarmer}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#163C2B] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#102D20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C2B] whitespace-nowrap shrink-0"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Register Farmer</span>
          </button>
        </div>
      </div>

      {/* 6 Summary Cards */}
      <section aria-label="Organization summary metrics">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric) => (
            <DashboardMetricCard
              key={metric.id}
              metric={metric}
              onSelect={onNavigateModule}
            />
          ))}
        </div>
      </section>

      {/* Section 1: Veterinary Case Overview */}
      <section
        aria-labelledby="case-overview-heading"
        className="rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2
              id="case-overview-heading"
              className="font-display text-base font-semibold text-[#1A1F1C]"
            >
              Veterinary Case Overview
            </h2>
            <p className="mt-0.5 text-xs text-[#626E66]">
              Distribution of current cooperative caseload by status. Select a
              status bar to filter the requests table below.
            </p>
          </div>
          <span className="font-mono text-xs font-medium text-[#163C2B] tabular-nums">
            {cases.length} Active &amp; Recent Cases
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-7">
          {caseStatusOverview.map((item) => {
            const isSelected = caseStatusFilter === item.status;
            return (
              <button
                key={item.status}
                type="button"
                onClick={() => handleFilterStatusFromOverview(item.status)}
                aria-pressed={isSelected}
                className={`flex flex-col justify-between rounded-md border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#163C2B] ${
                  isSelected
                    ? 'border-[#163C2B] bg-[#EDF2EE]'
                    : 'border-[#ECEFEA] bg-[#FAFBF9] hover:border-[#C2CBC3] hover:bg-white'
                }`}
              >
                <span className="text-[11px] font-medium text-[#4F5A53] truncate">
                  {item.status}
                </span>
                <div className="mt-2 flex items-baseline justify-between gap-2">
                  <span className="font-display text-xl font-semibold text-[#1A1F1C] tabular-nums">
                    {item.count}
                  </span>
                  <span className="font-mono text-[11px] text-[#626E66] tabular-nums">
                    {item.percentage}%
                  </span>
                </div>
                <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-[#E2E6E1]">
                  <div
                    className={`h-full rounded-full ${item.barColorClass}`}
                    style={{ width: `${Math.max(12, item.percentage * 3.5)}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 2: Recent Veterinary Requests */}
      <section
        aria-labelledby="recent-requests-heading"
        className="rounded-lg border border-[#E2E6E1] bg-white shadow-xs"
      >
        <div className="border-b border-[#E2E6E1] px-5 py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2
                id="recent-requests-heading"
                className="font-display text-base font-semibold text-[#1A1F1C]"
              >
                Recent Veterinary Requests
              </h2>
              <p className="mt-0.5 text-xs text-[#626E66]">
                Incoming health concerns requiring review, veterinarian assignment,
                or ongoing case coordination.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateModule('veterinary-requests')}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#163C2B] hover:underline self-start sm:self-auto"
            >
              <span>Manage all requests</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4">
            <SearchFilterBar
              searchQuery={localSearch}
              onSearchChange={(val) => {
                setLocalSearch(val);
                setCurrentPage(1);
              }}
              searchPlaceholder="Search by Request ID, farmer, village, or ear tag..."
              filterValue={caseStatusFilter}
              onFilterChange={(val) => {
                setCaseStatusFilter(val as 'ALL' | VeterinaryCaseStatus);
                setCurrentPage(1);
              }}
              filterOptions={CASE_STATUS_OPTIONS}
              filterLabel="Status"
              secondaryAction={
                combinedQuery || caseStatusFilter !== 'ALL'
                  ? { label: 'Reset filters', onClick: resetCaseFilters }
                  : undefined
              }
            />
          </div>
        </div>

        <DataTable
          columns={caseColumns}
          data={paginatedCases}
          rowKey={(row) => row.caseId}
          onRowClick={(row) => setSelectedCase(row)}
          isLoading={isRefreshing}
          emptyTitle="No matching veterinary requests"
          emptyDescription="No sample requests match your current search or status filter."
          emptyActionLabel="Reset filters"
          onEmptyAction={resetCaseFilters}
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

      {/* Sections 3 & 4: Upcoming Farm Visits & Follow-up Monitoring */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
        {/* Section 3: Upcoming Farm Visits */}
        <section
          aria-labelledby="upcoming-visits-heading"
          className="flex flex-col rounded-lg border border-[#E2E6E1] bg-white shadow-xs"
        >
          <div className="flex flex-col gap-3 border-b border-[#E2E6E1] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2
                id="upcoming-visits-heading"
                className="font-display text-base font-semibold text-[#1A1F1C]"
              >
                Upcoming Farm Visits
              </h2>
              <p className="mt-0.5 text-xs text-[#626E66]">
                Scheduled field officer inspections and active farm visits
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-md bg-[#F1F3F0] p-0.5 self-start sm:self-auto">
              {(['ALL', 'Scheduled', 'In Progress', 'Completed'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setVisitFilter(st)}
                  className={`rounded px-2.5 py-1 text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                    visitFilter === st
                      ? 'bg-white text-[#1A1F1C] shadow-xs'
                      : 'text-[#525E56] hover:text-[#1A1F1C]'
                  }`}
                >
                  {st === 'ALL' ? 'All' : st}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 divide-y divide-[#ECEFEA]">
            {filteredVisits.map((visit) => (
              <div
                key={visit.visitId}
                className="flex items-start justify-between gap-4 px-5 py-3.5"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="font-semibold text-[#1A1F1C]">
                      {visit.farmerName}
                    </span>
                    <span className="text-[#C2CBC3]" aria-hidden="true">
                      ·
                    </span>
                    <span className="text-[#4F5A53]">
                      Officer: {visit.fieldOfficer}
                    </span>
                  </div>
                  <p className="text-xs text-[#4F5A53]">{visit.purpose}</p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#626E66]">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-[#52796F]" aria-hidden="true" />
                      <span>{visit.location}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 tabular-nums">
                      <CalendarDays
                        className="h-3 w-3 text-[#52796F]"
                        aria-hidden="true"
                      />
                      <span>{visit.scheduledDate}</span>
                    </span>
                  </div>
                </div>
                <StatusBadge status={visit.status} compact />
              </div>
            ))}
          </div>

          <div className="border-t border-[#ECEFEA] bg-[#FAFBF9] px-5 py-3 text-right">
            <button
              type="button"
              onClick={() => onNavigateModule('farm-visits')}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#163C2B] hover:underline"
            >
              <span>Open Farm Visits schedule</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </section>

        {/* Section 4: Follow-up Monitoring */}
        <section
          aria-labelledby="followups-monitoring-heading"
          className="flex flex-col rounded-lg border border-[#E2E6E1] bg-white shadow-xs"
        >
          <div className="flex flex-col gap-3 border-b border-[#E2E6E1] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2
                id="followups-monitoring-heading"
                className="font-display text-base font-semibold text-[#1A1F1C]"
              >
                Follow-up Monitoring
              </h2>
              <p className="mt-0.5 text-xs text-[#626E66]">
                Post-consultation check-ins assigned across field officers
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-md bg-[#F1F3F0] p-0.5 self-start sm:self-auto">
              {(['ALL', 'Overdue', 'Due', 'Scheduled'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFollowUpFilter(st)}
                  className={`rounded px-2.5 py-1 text-[11px] font-medium transition-colors whitespace-nowrap shrink-0 ${
                    followUpFilter === st
                      ? 'bg-white text-[#1A1F1C] shadow-xs'
                      : 'text-[#525E56] hover:text-[#1A1F1C]'
                  }`}
                >
                  {st === 'ALL' ? 'All' : st}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 divide-y divide-[#ECEFEA]">
            {filteredFollowUps.map((item) => (
              <div
                key={item.followUpId}
                className="flex items-start justify-between gap-4 px-5 py-3.5"
              >
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="font-mono font-medium text-[#1A1F1C] tabular-nums">
                      {item.caseId}
                    </span>
                    <span className="text-[#C2CBC3]" aria-hidden="true">
                      ·
                    </span>
                    <span className="font-semibold text-[#1A1F1C]">
                      {item.farmerName}
                    </span>
                    <span className="text-[#C2CBC3]" aria-hidden="true">
                      ·
                    </span>
                    <span className="font-mono text-[#163C2B] tabular-nums">
                      {item.animalTag}
                    </span>
                  </div>
                  <p className="text-xs text-[#4F5A53]">{item.instructionNote}</p>
                  <p className="text-[11px] text-[#626E66]">
                    Assigned: {item.assignedPerson}
                    <span className="mx-1.5 text-[#C2CBC3]" aria-hidden="true">
                      ·
                    </span>
                    Follow-up Date:{' '}
                    <span className="font-medium tabular-nums">{item.dueDate}</span>
                  </p>
                </div>
                <StatusBadge status={item.status} compact />
              </div>
            ))}
          </div>

          <div className="border-t border-[#ECEFEA] bg-[#FAFBF9] px-5 py-3 text-right">
            <button
              type="button"
              onClick={() => onNavigateModule('follow-ups')}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#163C2B] hover:underline"
            >
              <span>Open Follow-up Monitoring</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </section>
      </div>

      {/* Section 5: Field Operations Overview */}
      <section
        aria-labelledby="field-ops-heading"
        className="rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2
              id="field-ops-heading"
              className="font-display text-base font-semibold text-[#1A1F1C]"
            >
              Field Operations Overview
            </h2>
            <p className="mt-0.5 text-xs text-[#626E66]">
              Completed versus pending farm visits and observation submissions by
              sub-cluster.
            </p>
          </div>
          <span className="font-mono text-xs font-medium text-[#163C2B] tabular-nums">
            {totalCompletedClusterVisits} / {totalScheduledClusterVisits} Scheduled
            Visits Completed
          </span>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {clusterOperations.map((cluster) => {
            const pct =
              cluster.totalScheduled > 0
                ? Math.round(
                    (cluster.completedVisits / cluster.totalScheduled) * 100
                  )
                : 0;
            return (
              <div
                key={cluster.clusterName}
                className="rounded-md border border-[#ECEFEA] bg-[#FAFBF9] p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-semibold text-[#1A1F1C]">
                      {cluster.clusterName}
                    </h3>
                    <p className="mt-0.5 text-[11px] text-[#626E66]">
                      Officer: {cluster.officerName}
                    </p>
                  </div>
                  <span className="font-mono text-xs font-semibold text-[#163C2B] tabular-nums">
                    {pct}%
                  </span>
                </div>

                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#E2E6E1]">
                  <div
                    className="h-full rounded-full bg-[#2D6A4F]"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-[#4F5A53] tabular-nums">
                  <span>{cluster.completedVisits} completed</span>
                  <span>{cluster.pendingVisits} pending</span>
                </div>
                <p className="mt-1 text-[11px] text-[#626E66] tabular-nums">
                  {cluster.observationsSubmitted} animal observations logged
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Case Details & Activity Timeline Preview Modal */}
      {selectedCase && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1F1C]/45 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="case-preview-title"
          onClick={() => setSelectedCase(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-lg border border-[#E2E6E1] bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#ECEFEA] pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-[#163C2B]">
                    {selectedCase.caseId}
                  </span>
                  <StatusBadge status={selectedCase.status} compact />
                </div>
                <h3
                  id="case-preview-title"
                  className="mt-1.5 font-display text-base font-semibold text-[#1A1F1C]"
                >
                  {selectedCase.farmerName} — {selectedCase.village}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                aria-label="Close case preview"
                className="rounded p-1 text-[#626E66] hover:bg-[#F1F3F0] hover:text-[#1A1F1C]"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
              <div>
                <dt className="text-[#626E66]">Animal Identification</dt>
                <dd className="mt-0.5 font-mono font-medium text-[#1A1F1C]">
                  {selectedCase.animalTag}
                </dd>
              </div>
              <div>
                <dt className="text-[#626E66]">Species &amp; Breed</dt>
                <dd className="mt-0.5 font-medium text-[#1A1F1C]">
                  {selectedCase.speciesBreed}
                </dd>
              </div>
              <div>
                <dt className="text-[#626E66]">Reported By</dt>
                <dd className="mt-0.5 font-medium text-[#1A1F1C]">
                  {selectedCase.reportedBy}
                </dd>
              </div>
              <div>
                <dt className="text-[#626E66]">Assigned Veterinarian</dt>
                <dd className="mt-0.5 font-medium text-[#1A1F1C]">
                  {selectedCase.assignedVet ?? 'Unassigned (Awaiting triage)'}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[#626E66]">Reported Health Concern</dt>
                <dd className="mt-1 rounded-md border border-[#ECEFEA] bg-[#FAFBF9] p-3 text-xs leading-relaxed text-[#1A1F1C]">
                  {selectedCase.concernSummary}
                </dd>
              </div>
            </dl>

            {/* Activity Timeline */}
            <div className="mt-5 border-t border-[#ECEFEA] pt-4">
              <h4 className="mb-3 text-xs font-semibold text-[#1A1F1C]">
                Case Activity Timeline
              </h4>
              <ActivityTimeline events={selectedCase.timeline} />
            </div>

            <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#ECEFEA] pt-4">
              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                className="rounded-md border border-[#D7DDD7] bg-white px-4 py-2 text-xs font-medium text-[#3D4640] hover:bg-[#F1F3F0]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const id = selectedCase.caseId;
                  setSelectedCase(null);
                  onOpenCaseDossier(id);
                }}
                className="rounded-md bg-[#163C2B] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#102D20] whitespace-nowrap shrink-0"
              >
                Open Full Case Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
