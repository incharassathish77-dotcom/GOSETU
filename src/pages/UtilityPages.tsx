import { CheckCircle2, HelpCircle, Phone, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { STAKEHOLDER_ACCOUNTS } from '../data/mockPhase1Data';
import type { StakeholderAccount } from '../types/gosetu';

interface UtilityPageProps {
  mode: 'settings' | 'help';
  account: StakeholderAccount;
}

export function UtilityPages({ mode, account }: UtilityPageProps) {
  const [overdueAlertsEnabled, setOverdueAlertsEnabled] = useState(true);
  const [urgentCaseAlertsEnabled, setUrgentCaseAlertsEnabled] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  if (mode === 'help') {
    return (
      <div className="space-y-6">
        <div className="border-b border-[#E2E6E1] pb-5">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1A1F1C]">
            Help &amp; Operational Support
          </h1>
          <p className="mt-1 text-xs text-[#4F5A53]">
            Workflow reference and cooperative coordination support for{' '}
            {account.organization}.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#1A1F1C]">
              <HelpCircle className="h-4 w-4 text-[#163C2B]" aria-hidden="true" />
              <span>End-to-End Care Coordination Workflow</span>
            </div>
            <ol className="mt-4 space-y-2.5 text-xs text-[#3D4640]">
              <li>
                <span className="font-semibold text-[#1A1F1C]">
                  1. Registry Onboarding:
                </span>{' '}
                Administrators register cooperative farmers, tag livestock, and
                assign a primary Field Officer.
              </li>
              <li>
                <span className="font-semibold text-[#1A1F1C]">
                  2. Farm Visits &amp; Observations:
                </span>{' '}
                Field Officers execute scheduled visits, record observable signs,
                and submit Veterinary Assistance Requests when needed.
              </li>
              <li>
                <span className="font-semibold text-[#1A1F1C]">
                  3. Triage &amp; Case Assignment:
                </span>{' '}
                Administrators review incoming requests and assign them to a
                panel Veterinarian.
              </li>
              <li>
                <span className="font-semibold text-[#1A1F1C]">
                  4. Consultation &amp; Follow-up:
                </span>{' '}
                Veterinarians record clinical findings, diagnosis, medications,
                and schedule Field Officer follow-ups before closing cases.
              </li>
            </ol>
          </section>

          <section className="rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs">
            <h2 className="font-display text-sm font-semibold text-[#1A1F1C]">
              Cooperative Coordination Desk
            </h2>
            <div className="mt-4 space-y-3 text-xs text-[#4F5A53]">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#52796F]" aria-hidden="true" />
                <span>
                  Cluster Operations Helpline:{' '}
                  <span className="font-mono font-semibold text-[#1A1F1C]">
                    +91 2112 240 890
                  </span>
                </span>
              </p>
              <p>
                Working Hours: 07:00 AM – 08:00 PM IST (Daily Cooperative Support)
              </p>
              <p className="rounded-md border border-[#ECEFEA] bg-[#FAFBF9] p-3">
                For urgent post-calving or acute livestock emergencies, flag
                Veterinary Assistance Requests as{' '}
                <span className="font-semibold text-[#B91C1C]">Urgent</span>{' '}
                priority for immediate Administrator dispatch.
              </p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-[#E2E6E1] pb-5">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-[#1A1F1C]">
          Workspace Settings &amp; Role Governance
        </h1>
        <p className="mt-1 text-xs text-[#4F5A53]">
          Manage notification preferences and review GOSETU role permission
          boundaries.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs">
          <h2 className="font-display text-base font-semibold text-[#1A1F1C]">
            Notification Preferences
          </h2>

          <div className="mt-4 space-y-3">
            <label className="flex items-center justify-between gap-4 rounded-md border border-[#ECEFEA] bg-[#FAFBF9] p-3.5 text-xs cursor-pointer">
              <div>
                <p className="font-semibold text-[#1A1F1C]">
                  Urgent Veterinary Request Alerts
                </p>
                <p className="mt-0.5 text-[#626E66]">
                  Surface immediate notifications when Urgent requests arrive
                </p>
              </div>
              <input
                type="checkbox"
                checked={urgentCaseAlertsEnabled}
                onChange={(e) => {
                  setUrgentCaseAlertsEnabled(e.target.checked);
                  setSavedNotice(true);
                }}
                className="h-4 w-4 rounded border-[#B8C2BA] text-[#163C2B]"
              />
            </label>

            <label className="flex items-center justify-between gap-4 rounded-md border border-[#ECEFEA] bg-[#FAFBF9] p-3.5 text-xs cursor-pointer">
              <div>
                <p className="font-semibold text-[#1A1F1C]">
                  Overdue Follow-up Escalations
                </p>
                <p className="mt-0.5 text-[#626E66]">
                  Flag follow-up visits past their scheduled due date
                </p>
              </div>
              <input
                type="checkbox"
                checked={overdueAlertsEnabled}
                onChange={(e) => {
                  setOverdueAlertsEnabled(e.target.checked);
                  setSavedNotice(true);
                }}
                className="h-4 w-4 rounded border-[#B8C2BA] text-[#163C2B]"
              />
            </label>

            {savedNotice && (
              <p className="inline-flex items-center gap-1.5 text-xs font-medium text-[#166534]">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Preferences updated for current session.</span>
              </p>
            )}
          </div>
        </section>

        <section className="rounded-lg border border-[#E2E6E1] bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#163C2B]" aria-hidden="true" />
            <h2 className="font-display text-base font-semibold text-[#1A1F1C]">
              PRD Role Governance Matrix
            </h2>
          </div>

          <div className="mt-4 space-y-3">
            {STAKEHOLDER_ACCOUNTS.map((s) => (
              <div
                key={s.id}
                className="rounded-md border border-[#ECEFEA] bg-[#FAFBF9] p-3 text-xs"
              >
                <p className="font-semibold text-[#1A1F1C]">{s.roleLabel}</p>
                <p className="mt-0.5 text-[#4F5A53]">{s.restrictionsNote}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
