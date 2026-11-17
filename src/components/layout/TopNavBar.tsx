import { ArrowLeftRight, Bell, ChevronDown, Menu, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { STAKEHOLDER_ACCOUNTS } from '../../data/mockPhase1Data';
import type { StakeholderAccount, UserRole } from '../../types/gosetu';

interface TopNavBarProps {
  account: StakeholderAccount;
  activePageTitle: string;
  globalSearch: string;
  onGlobalSearchChange: (value: string) => void;
  unreadCount: number;
  onOpenMobileMenu: () => void;
  onOpenNotifications: () => void;
  onSwitchRole: (role: UserRole) => void;
  onRequestSignOut: () => void;
}

export function TopNavBar({
  account,
  activePageTitle,
  globalSearch,
  onGlobalSearchChange,
  unreadCount,
  onOpenMobileMenu,
  onOpenNotifications,
  onSwitchRole,
  onRequestSignOut,
}: TopNavBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-[#E2E6E1] bg-white px-4 sm:px-6">
      {/* Left: Mobile Trigger + Breadcrumb & Current Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#E2E6E1] text-[#3D4640] hover:bg-[#F1F3F0] lg:hidden"
        >
          <Menu className="h-4 w-4" aria-hidden="true" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm min-w-0">
          <span className="hidden md:inline font-medium text-[#626E66] whitespace-nowrap">
            GOSETU
          </span>
          <span className="hidden md:inline text-[#C2CBC3]" aria-hidden="true">
            /
          </span>
          <span className="hidden sm:inline font-medium text-[#626E66] whitespace-nowrap">
            {account.roleLabel}
          </span>
          <span className="hidden sm:inline text-[#C2CBC3]" aria-hidden="true">
            /
          </span>
          <span className="truncate font-display font-semibold text-[#1A1F1C]">
            {activePageTitle}
          </span>
        </nav>
      </div>

      {/* Right: Global Search + Notifications + Profile Dropdown */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Global Search */}
        <div className="relative hidden md:block w-56 lg:w-64">
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#626E66]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={globalSearch}
            onChange={(e) => onGlobalSearchChange(e.target.value)}
            placeholder="Search farmer, ear tag, case ID..."
            aria-label="Global search"
            className="h-9 w-full rounded-md border border-[#E2E6E1] bg-[#FAFBF9] pl-8 pr-7 text-xs text-[#1A1F1C] placeholder:text-[#7E8981] transition-colors focus:border-[#163C2B] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#163C2B]"
          />
          {globalSearch && (
            <button
              type="button"
              onClick={() => onGlobalSearchChange('')}
              aria-label="Clear global search"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-1 text-[#626E66] hover:bg-[#ECEFEA] hover:text-[#1A1F1C]"
            >
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Notifications Button */}
        <button
          type="button"
          onClick={onOpenNotifications}
          aria-label={`Notifications (${unreadCount} unread)`}
          className="relative inline-flex h-9 items-center gap-2 rounded-md border border-[#E2E6E1] bg-white px-2.5 text-xs font-medium text-[#3D4640] transition-colors hover:bg-[#F7F8F6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C2B] whitespace-nowrap shrink-0"
        >
          <Bell className="h-4 w-4 text-[#4F5A53]" aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="inline-flex h-4 min-w-4 items-center justify-center rounded bg-[#163C2B] px-1 font-mono text-[10px] font-medium text-white tabular-nums">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile & Role Switcher Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            className="flex h-9 items-center gap-2.5 rounded-md border border-[#E2E6E1] bg-white pl-2 pr-2.5 text-left transition-colors hover:bg-[#F7F8F6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#163C2B]"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-[#163C2B] font-display text-[11px] font-semibold text-white">
              {account.initials}
            </span>
            <div className="hidden lg:block leading-tight">
              <p className="text-xs font-semibold text-[#1A1F1C] whitespace-nowrap">
                {account.fullName}
              </p>
              <p className="text-[10px] text-[#626E66] whitespace-nowrap">
                {account.roleLabel}
              </p>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-[#626E66]" aria-hidden="true" />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-72 rounded-lg border border-[#E2E6E1] bg-white py-2 shadow-lg"
            >
              <div className="border-b border-[#ECEFEA] px-4 py-2.5">
                <p className="text-xs font-semibold text-[#1A1F1C]">
                  {account.fullName}
                </p>
                <p className="mt-0.5 text-[11px] text-[#626E66] truncate">
                  {account.email}
                </p>
              </div>

              <div className="px-3 py-2">
                <div className="flex items-center gap-1.5 px-1.5 pb-1.5 text-[11px] font-semibold text-[#626E66]">
                  <ArrowLeftRight className="h-3 w-3" aria-hidden="true" />
                  <span>Switch Stakeholder Role</span>
                </div>
                <div className="space-y-0.5">
                  {STAKEHOLDER_ACCOUNTS.map((candidate) => {
                    const isCurrent = candidate.role === account.role;
                    return (
                      <button
                        key={candidate.id}
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setMenuOpen(false);
                          if (!isCurrent) {
                            onSwitchRole(candidate.role);
                          }
                        }}
                        className={`flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left text-xs transition-colors ${
                          isCurrent
                            ? 'bg-[#EDF2EE] font-semibold text-[#163C2B]'
                            : 'text-[#3D4640] hover:bg-[#F4F6F4]'
                        }`}
                      >
                        <span>{candidate.roleLabel}</span>
                        {isCurrent && (
                          <span className="text-[11px] font-medium text-[#2D6A4F]">
                            Active
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-[#ECEFEA] px-3 pt-2">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onRequestSignOut();
                  }}
                  className="w-full rounded-md px-2.5 py-2 text-left text-xs font-medium text-[#B91C1C] transition-colors hover:bg-[#FEF2F2]"
                >
                  Logout to Sign In Screen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
