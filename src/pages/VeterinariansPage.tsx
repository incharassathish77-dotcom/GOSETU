import { HeartPulse, MapPin, Phone } from 'lucide-react';
import type { VeterinarianRecord, VeterinaryCaseRecord } from '../types/gosetu';

interface VeterinariansPageProps {
  veterinarians: VeterinarianRecord[];
  cases: VeterinaryCaseRecord[];
  onOpenCase: (caseId: string) => void;
}

export function VeterinariansPage({
  veterinarians,
  cases,
  onOpenCase,
}: VeterinariansPageProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-[#E2E6E1] pb-5">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1A1F1C]">
          Veterinarian Management
        </h1>
        <p className="mt-1 text-xs text-[#4F5A53]">
          Panel veterinarians, clinical specializations, sub-cluster coverage,
          and current assigned caseloads.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {veterinarians.map((vet) => {
          const vetCases = cases.filter((c) => c.assignedVetId === vet.id);
          const activeCases = vetCases.filter(
            (c) =>
              c.status !== 'Closed' &&
              c.status !== 'Resolved' &&
              c.status !== 'Cancelled'
          );
          const completedCases = vetCases.filter(
            (c) => c.status === 'Resolved' || c.status === 'Closed'
          );

          const availTone =
            vet.availability === 'Available'
              ? 'border-[#C6E4CE] bg-[#ECF6EF] text-[#166534]'
              : vet.availability === 'In Field'
                ? 'border-[#C5D8E8] bg-[#EDF3F8] text-[#1D4E73]'
                : 'border-[#DCE0DC] bg-[#F4F5F4] text-[#525D56]';

          return (
            <section
              key={vet.id}
              className="flex flex-col justify-between rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#EDF2EE] text-[#163C2B]">
                      <HeartPulse className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="font-display text-base font-semibold text-[#1A1F1C]">
                        {vet.name}
                      </h2>
                      <p className="text-[11px] text-[#626E66]">
                        {vet.qualification}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-md border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${availTone}`}
                  >
                    {vet.availability}
                  </span>
                </div>

                <p className="mt-3 text-xs font-medium text-[#163C2B]">
                  {vet.specialization}
                </p>

                <div className="mt-3 space-y-1.5 text-xs text-[#4F5A53]">
                  <p className="flex items-center gap-1.5 font-mono">
                    <Phone className="h-3.5 w-3.5 text-[#52796F]" aria-hidden="true" />
                    <span>{vet.phone}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[#52796F]" aria-hidden="true" />
                    <span>{vet.clusters.join(', ')}</span>
                  </p>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-md border border-[#ECEFEA] bg-[#FAFBF9] p-3 text-center">
                  <div>
                    <p className="font-display text-lg font-semibold text-[#1A1F1C] tabular-nums">
                      {activeCases.length}
                    </p>
                    <p className="text-[11px] text-[#626E66]">Active Cases</p>
                  </div>
                  <div>
                    <p className="font-display text-lg font-semibold text-[#166534] tabular-nums">
                      {completedCases.length}
                    </p>
                    <p className="text-[11px] text-[#626E66]">Resolved / Closed</p>
                  </div>
                </div>

                {activeCases.length > 0 && (
                  <div className="mt-4 border-t border-[#ECEFEA] pt-3">
                    <p className="text-[11px] font-semibold text-[#626E66]">
                      Current Assigned Cases
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {activeCases.map((c) => (
                        <li key={c.caseId}>
                          <button
                            type="button"
                            onClick={() => onOpenCase(c.caseId)}
                            className="flex w-full items-center justify-between rounded border border-[#ECEFEA] bg-white px-2.5 py-1.5 text-left text-xs hover:bg-[#F7F8F6]"
                          >
                            <span className="font-mono font-medium text-[#163C2B]">
                              {c.caseId}
                            </span>
                            <span className="truncate text-[#4F5A53]">
                              {c.farmerName} · {c.status}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
