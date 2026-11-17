import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { STAKEHOLDER_ACCOUNTS } from '../data/mockPhase1Data';
import type { StakeholderAccount, UserRole } from '../types/gosetu';

interface LoginPageProps {
  onLoginSuccess: (account: StakeholderAccount) => void;
}

const LOGIN_PHOTO_URL = '/src/assets/images/gosetu_login_field_care_1794909992970.jpg';

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const activeCandidate =
    STAKEHOLDER_ACCOUNTS.find((a) => a.role === selectedRole) ??
    STAKEHOLDER_ACCOUNTS[0];

  const [email, setEmail] = useState(activeCandidate.email);
  const [password, setPassword] = useState('GosetuDemo@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleSelectRole = (role: UserRole) => {
    const candidate = STAKEHOLDER_ACCOUNTS.find((a) => a.role === role);
    if (!candidate) return;
    setSelectedRole(role);
    setEmail(candidate.email);
    setPassword('GosetuDemo@2026');
    setErrorMessage(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Enter both your organizational email address and password.');
      return;
    }

    if (!email.includes('@')) {
      setErrorMessage('Enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    window.setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess(activeCandidate);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-[#F7F8F6] text-[#1A1F1C] lg:grid lg:grid-cols-12">
      {/* Left Documentary Brand Panel */}
      <div className="relative hidden overflow-hidden bg-[#102D20] lg:col-span-5 lg:flex lg:flex-col lg:justify-between">
        {!imageError && (
          <img
            src={LOGIN_PHOTO_URL}
            alt="Veterinarian and field officer examining dairy cattle at a cooperative farm"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        )}

        <div
          className="absolute inset-0 bg-gradient-to-t from-[#0C2117]/95 via-[#102D20]/65 to-[#102D20]/45"
          aria-hidden="true"
        />

        {/* Brand Mark */}
        <div className="relative z-10 p-10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-white/25 bg-[#163C2B] text-white">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3v18" />
                <path d="M5 9c0-3 3.5-5 7-5s7 2 7 5" />
                <path d="M6 15c1.5 2 3.8 3 6 3s4.5-1 6-3" />
              </svg>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-xl font-bold tracking-tight text-white">
                GOSETU
              </span>
              <span className="text-sm font-medium text-[#C4D7CC]">गोसेतु</span>
            </div>
          </div>
        </div>

        {/* Institutional Copy */}
        <div className="relative z-10 p-10">
          <p className="text-xs font-semibold tracking-wide text-[#C4D7CC]">
            Connecting Care. Protecting Livestock.
          </p>
          <h1 className="mt-3 max-w-md font-display text-3xl font-semibold leading-tight text-white [text-wrap:balance]">
            Coordinated field operations and veterinary care for dairy cooperatives.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[#D8E3DC]">
            Centralize farmer and animal registries, field officer farm visits,
            veterinary case routing, and clinical follow-ups in one structured system.
          </p>

          <div className="mt-8 border-t border-white/15 pt-5 text-xs text-[#C4D7CC]">
            <span>Phase 1 Prototype</span>
            <span className="mx-2" aria-hidden="true">
              ·
            </span>
            <span>Role-Based Access Architecture</span>
          </div>
        </div>
      </div>

      {/* Right Authentication Workspace */}
      <div className="flex min-h-screen flex-col justify-center px-4 py-10 sm:px-8 lg:col-span-7 lg:px-16">
        <div className="mx-auto w-full max-w-lg">
          {/* Mobile Brand Lockup */}
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#163C2B] text-white">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 3v18" />
                <path d="M5 9c0-3 3.5-5 7-5s7 2 7 5" />
                <path d="M6 15c1.5 2 3.8 3 6 3s4.5-1 6-3" />
              </svg>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-lg font-bold text-[#163C2B]">
                  GOSETU
                </span>
                <span className="text-xs font-medium text-[#52796F]">गोसेतु</span>
              </div>
              <p className="text-xs text-[#626E66]">
                Connecting Care. Protecting Livestock.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-[#E2E6E1] bg-white p-6 shadow-xs sm:p-8">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-[#1A1F1C]">
                Sign in to GOSETU
              </h2>
              <p className="mt-1.5 text-sm text-[#4F5A53]">
                Select a stakeholder role below to explore the role-based login
                flow and Phase 1 workspace.
              </p>
            </div>

            {/* Role Selector */}
            <div className="mt-6">
              <span className="block text-xs font-semibold text-[#3D4640]">
                Stakeholder Role (Prototype Access)
              </span>
              <div
                className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2"
                role="radiogroup"
                aria-label="Select stakeholder role"
              >
                {STAKEHOLDER_ACCOUNTS.map((candidate) => {
                  const isSelected = candidate.role === selectedRole;
                  return (
                    <button
                      key={candidate.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => handleSelectRole(candidate.role)}
                      className={`flex flex-col items-start rounded-md border px-3.5 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C2B] ${
                        isSelected
                          ? 'border-[#163C2B] bg-[#EDF2EE] text-[#163C2B]'
                          : 'border-[#E2E6E1] bg-white text-[#3D4640] hover:border-[#C2CBC3] hover:bg-[#FAFBF9]'
                      }`}
                    >
                      <span className="text-xs font-semibold">
                        {candidate.roleLabel}
                      </span>
                      <span className="mt-0.5 w-full truncate text-[11px] text-[#626E66]">
                        {candidate.fullName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Role Scope Summary */}
            <div className="mt-4 rounded-md border border-[#E2E6E1] bg-[#FAFBF9] px-3.5 py-3">
              <div className="flex items-start gap-2">
                <ShieldCheck
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#2D6A4F]"
                  aria-hidden="true"
                />
                <div className="text-xs leading-relaxed text-[#4F5A53]">
                  <span className="font-semibold text-[#1A1F1C]">
                    {activeCandidate.roleLabel} Scope:
                  </span>{' '}
                  {activeCandidate.accessScopeSummary}
                </div>
              </div>
            </div>

            {/* Credentials Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              {errorMessage && (
                <div
                  role="alert"
                  className="rounded-md border border-[#F3C6C6] bg-[#FEF5F5] px-3.5 py-2.5 text-xs font-medium text-[#991B1B]"
                >
                  {errorMessage}
                </div>
              )}

              <div>
                <label
                  htmlFor="login-email"
                  className="block text-xs font-semibold text-[#3D4640]"
                >
                  Organization Email
                </label>
                <div className="relative mt-1.5">
                  <Mail
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#626E66]"
                    aria-hidden="true"
                  />
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 w-full rounded-md border border-[#D4DBD4] bg-white pl-9 pr-3 text-sm text-[#1A1F1C] placeholder:text-[#7E8981] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
                    placeholder="name@organization.org"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-semibold text-[#3D4640]"
                  >
                    Password
                  </label>
                  <span className="text-[11px] text-[#626E66]">
                    Pre-filled for Phase 1 demo
                  </span>
                </div>
                <div className="relative mt-1.5">
                  <Lock
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#626E66]"
                    aria-hidden="true"
                  />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 w-full rounded-md border border-[#D4DBD4] bg-white pl-9 pr-10 text-sm text-[#1A1F1C] placeholder:text-[#7E8981] focus:border-[#163C2B] focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-[#626E66] hover:bg-[#F1F3F0] hover:text-[#1A1F1C]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#163C2B] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#102D20] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C2B] disabled:opacity-65"
              >
                <span>
                  {isSubmitting
                    ? 'Signing in...'
                    : `Sign in as ${activeCandidate.roleLabel}`}
                </span>
                {!isSubmitting && (
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </form>
          </div>

          <p className="mt-4 text-center text-xs text-[#626E66]">
            Prototype environment using simulated cooperative records. Backend
            authentication and database persistence are deferred beyond Phase 1.
          </p>
        </div>
      </div>
    </div>
  );
}
