import { Download } from 'lucide-react';
import type {
  AnimalRecord,
  FarmVisitRecord,
  FarmerRecord,
  FieldOfficerOption,
  FollowUpRecord,
  VeterinarianRecord,
  VeterinaryCaseRecord,
  VeterinaryCaseStatus,
} from '../types/gosetu';

interface ReportsPageProps {
  farmers: FarmerRecord[];
  animals: AnimalRecord[];
  officers: FieldOfficerOption[];
  veterinarians: VeterinarianRecord[];
  visits: FarmVisitRecord[];
  cases: VeterinaryCaseRecord[];
  followUps: FollowUpRecord[];
}

const ALL_CASE_STATUSES: VeterinaryCaseStatus[] = [
  'Submitted',
  'Under Review',
  'Assigned',
  'In Consultation',
  'Follow-up Required',
  'Resolved',
  'Closed',
  'Cancelled',
];

export function ReportsPage({
  farmers,
  animals,
  officers,
  veterinarians,
  visits,
  cases,
  followUps,
}: ReportsPageProps) {
  const completedVisits = visits.filter((v) => v.status === 'Completed').length;
  const resolvedOrClosed = cases.filter(
    (c) => c.status === 'Resolved' || c.status === 'Closed'
  ).length;
  const overdueFollowUps = followUps.filter((f) => f.status === 'Overdue').length;

  const handleExportCsv = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Total Farmers', String(farmers.length)],
      ['Total Registered Animals', String(animals.length)],
      ['Active Field Officers', String(officers.length)],
      ['Total Farm Visits', String(visits.length)],
      ['Completed Farm Visits', String(completedVisits)],
      ['Total Veterinary Cases', String(cases.length)],
      ['Resolved or Closed Cases', String(resolvedOrClosed)],
      ['Total Follow-ups', String(followUps.length)],
      ['Overdue Follow-ups', String(overdueFollowUps)],
    ];

    const csv = rows.map((r) => r.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'gosetu_operational_report_2026-11-17.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-[#E2E6E1] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1A1F1C]">
            Operational Reports
          </h1>
          <p className="mt-1 text-xs text-[#4F5A53]">
            Cooperative-wide summary across farmer registry, field visit
            execution, veterinary caseloads, and follow-up compliance.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#163C2B] px-4 text-xs font-semibold text-white hover:bg-[#102D20] self-start sm:self-auto whitespace-nowrap shrink-0"
        >
          <Download className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Export CSV Summary</span>
        </button>
      </div>

      {/* High-Level Operational Ratios */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-[#E2E6E1] bg-white p-4 shadow-xs">
          <p className="text-xs font-semibold text-[#4F5A53]">
            Registered Herd Ratio
          </p>
          <p className="mt-2 font-display text-2xl font-semibold text-[#1A1F1C] tabular-nums">
            {farmers.length > 0 ? (animals.length / farmers.length).toFixed(1) : '0.0'}
          </p>
          <p className="mt-1 text-xs text-[#626E66]">
            Avg animals per enrolled farmer
          </p>
        </div>

        <div className="rounded-lg border border-[#E2E6E1] bg-white p-4 shadow-xs">
          <p className="text-xs font-semibold text-[#4F5A53]">
            Visit Completion Rate
          </p>
          <p className="mt-2 font-display text-2xl font-semibold text-[#163C2B] tabular-nums">
            {visits.length > 0
              ? `${Math.round((completedVisits / visits.length) * 100)}%`
              : '0%'}
          </p>
          <p className="mt-1 text-xs text-[#626E66] tabular-nums">
            {completedVisits} of {visits.length} scheduled visits completed
          </p>
        </div>

        <div className="rounded-lg border border-[#E2E6E1] bg-white p-4 shadow-xs">
          <p className="text-xs font-semibold text-[#4F5A53]">
            Case Resolution Rate
          </p>
          <p className="mt-2 font-display text-2xl font-semibold text-[#166534] tabular-nums">
            {cases.length > 0
              ? `${Math.round((resolvedOrClosed / cases.length) * 100)}%`
              : '0%'}
          </p>
          <p className="mt-1 text-xs text-[#626E66] tabular-nums">
            {resolvedOrClosed} of {cases.length} cases resolved or closed
          </p>
        </div>

        <div className="rounded-lg border border-[#E2E6E1] bg-white p-4 shadow-xs">
          <p className="text-xs font-semibold text-[#4F5A53]">
            Overdue Follow-ups
          </p>
          <p className="mt-2 font-display text-2xl font-semibold text-[#B91C1C] tabular-nums">
            {overdueFollowUps}
          </p>
          <p className="mt-1 text-xs text-[#626E66] tabular-nums">
            Out of {followUps.length} total scheduled follow-ups
          </p>
        </div>
      </div>

      {/* Tables: Case Status Breakdown & Sub-Cluster Officer Summary */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs">
          <h2 className="font-display text-base font-semibold text-[#1A1F1C]">
            Case Volume by Status
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E2E6E1] text-[#4F5A53]">
                <tr>
                  <th className="py-2 font-semibold">Case Status</th>
                  <th className="py-2 text-right font-semibold">Count</th>
                  <th className="py-2 text-right font-semibold">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECEFEA]">
                {ALL_CASE_STATUSES.map((status) => {
                  const count = cases.filter((c) => c.status === status).length;
                  const share =
                    cases.length > 0 ? Math.round((count / cases.length) * 100) : 0;
                  return (
                    <tr key={status}>
                      <td className="py-2.5 font-medium text-[#1A1F1C]">
                        {status}
                      </td>
                      <td className="py-2.5 text-right font-mono tabular-nums text-[#1A1F1C]">
                        {count}
                      </td>
                      <td className="py-2.5 text-right font-mono tabular-nums text-[#626E66]">
                        {share}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs">
          <h2 className="font-display text-base font-semibold text-[#1A1F1C]">
            Veterinarian Caseload Distribution
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#E2E6E1] text-[#4F5A53]">
                <tr>
                  <th className="py-2 font-semibold">Veterinarian</th>
                  <th className="py-2 text-right font-semibold">Active</th>
                  <th className="py-2 text-right font-semibold">Resolved / Closed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECEFEA]">
                {veterinarians.map((vet) => {
                  const assigned = cases.filter((c) => c.assignedVetId === vet.id);
                  const closed = assigned.filter(
                    (c) => c.status === 'Resolved' || c.status === 'Closed'
                  ).length;
                  const active = assigned.length - closed;
                  return (
                    <tr key={vet.id}>
                      <td className="py-2.5">
                        <div className="font-semibold text-[#1A1F1C]">
                          {vet.name}
                        </div>
                        <div className="text-[11px] text-[#626E66]">
                          {vet.clusters.join(', ')}
                        </div>
                      </td>
                      <td className="py-2.5 text-right font-mono tabular-nums text-[#163C2B]">
                        {active}
                      </td>
                      <td className="py-2.5 text-right font-mono tabular-nums text-[#166534]">
                        {closed}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
