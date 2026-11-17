import {
  CalendarClock,
  ChartNoAxesCombined,
  ClipboardList,
  ClipboardPlus,
  HeartPulse,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  PawPrint,
  Settings,
  Stethoscope,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import type { NavItemConfig, StakeholderAccount } from '../../types/gosetu';

interface SidebarNavProps {
  account: StakeholderAccount;
  navItems: NavItemConfig[];
  activeNavId: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSelectNav: (id: string) => void;
  onRequestSignOut: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const ICON_MAP: Record<string, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  farmers: Users,
  'assigned-farmers': Users,
  animals: PawPrint,
  'field-officers': UserRound,
  'farm-visits': ClipboardList,
  'veterinary-requests': ClipboardPlus,
  'veterinary-cases': Stethoscope,
  veterinarians: HeartPulse,
  'follow-ups': CalendarClock,
  reports: ChartNoAxesCombined,
  profile: UserRound,
};

export function SidebarNav({
  account,
  navItems,
  activeNavId,
  collapsed,
  onToggleCollapse,
  onSelectNav,
  onRequestSignOut,
  mobileOpen,
  onCloseMobile,
}: SidebarNavProps) {
  const sections: { title: string; items: NavItemConfig[] }[] = [];
  for (const item of navItems) {
    const existing = sections.find((s) => s.title === item.section);
    if (existing) {
      existing.items.push(item);
    } else {
      sections.push({ title: item.section, items: [item] });
    }
  }

  const renderSidebarBody = (isCollapsedDesktop: boolean) => (
    <div className="flex h-full flex-col border-r border-[#E2E6E1] bg-white">
      {/* Top Brand Header */}
      <div
        className={`flex h-16 shrink-0 items-center border-b border-[#E2E6E1] ${
          isCollapsedDesktop ? 'justify-center px-2' : 'justify-between px-4'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#163C2B] text-white">
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
          {!isCollapsedDesktop && (
            <div className="min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-base font-bold tracking-tight text-[#163C2B] leading-none">
                  GOSETU
                </span>
                <span className="text-[11px] font-medium text-[#52796F]">
                  गोसेतु
                </span>
              </div>
              <p className="mt-1 truncate text-[10px] text-[#626E66]">
                Connecting Care. Protecting Livestock.
              </p>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        {!isCollapsedDesktop && (
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
            className="hidden rounded-md p-1.5 text-[#626E66] transition-colors hover:bg-[#F1F3F0] hover:text-[#1A1F1C] lg:inline-flex"
          >
            <PanelLeftClose className="h-4 w-4" aria-hidden="true" />
          </button>
        )}

        {/* Mobile Close Button */}
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close navigation menu"
          className="rounded-md p-1.5 text-[#626E66] hover:bg-[#F1F3F0] lg:hidden"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Expand button when collapsed on desktop */}
      {isCollapsedDesktop && (
        <div className="hidden justify-center border-b border-[#ECEFEA] py-2 lg:flex">
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label="Expand sidebar"
            title="Expand sidebar"
            className="rounded-md p-1.5 text-[#626E66] transition-colors hover:bg-[#F1F3F0] hover:text-[#1A1F1C]"
          >
            <PanelLeftOpen className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Organization Strip (expanded only) */}
      {!isCollapsedDesktop && (
        <div className="border-b border-[#ECEFEA] bg-[#FAFBF9] px-4 py-2.5">
          <p className="truncate text-xs font-semibold text-[#1A1F1C]">
            {account.organization}
          </p>
          <p className="mt-0.5 truncate text-[11px] text-[#626E66]">
            {account.territoryOrUnit}
          </p>
        </div>
      )}

      {/* Primary Role Navigation */}
      <nav
        aria-label="Primary navigation"
        className="flex-1 overflow-y-auto px-2.5 py-4 space-y-4"
      >
        {sections.map((section) => (
          <div key={section.title}>
            {!isCollapsedDesktop && (
              <div className="px-2.5 pb-1.5 text-[11px] font-semibold tracking-wide text-[#6E7A72]">
                {section.title}
              </div>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = ICON_MAP[item.id] ?? LayoutDashboard;
                const isActive = item.id === activeNavId;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectNav(item.id);
                        onCloseMobile();
                      }}
                      aria-current={isActive ? 'page' : undefined}
                      title={isCollapsedDesktop ? item.label : undefined}
                      className={`group flex w-full items-center rounded-md py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#163C2B] ${
                        isCollapsedDesktop
                          ? 'justify-center px-2'
                          : 'justify-between gap-2 px-2.5'
                      } ${
                        isActive
                          ? 'bg-[#EDF2EE] font-semibold text-[#163C2B]'
                          : 'font-medium text-[#3D4640] hover:bg-[#F4F6F4] hover:text-[#1A1F1C]'
                      }`}
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`h-4 w-4 shrink-0 ${
                            isActive
                              ? 'text-[#163C2B]'
                              : 'text-[#626E66] group-hover:text-[#1A1F1C]'
                          }`}
                          aria-hidden="true"
                        />
                        {!isCollapsedDesktop && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </span>

                      {!isCollapsedDesktop && item.phaseLabel && (
                        <span className="font-mono text-[10px] text-[#7E8981] shrink-0">
                          {item.phaseLabel}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Bottom Utility Section: Help, Settings, Profile, Logout */}
      <div className="border-t border-[#E2E6E1] p-2.5 space-y-1">
        <button
          type="button"
          onClick={() => {
            onSelectNav('help');
            onCloseMobile();
          }}
          aria-current={activeNavId === 'help' ? 'page' : undefined}
          title={isCollapsedDesktop ? 'Help & Support' : undefined}
          className={`flex w-full items-center rounded-md py-2 text-xs font-medium transition-colors ${
            isCollapsedDesktop ? 'justify-center px-2' : 'gap-2.5 px-2.5'
          } ${
            activeNavId === 'help'
              ? 'bg-[#EDF2EE] font-semibold text-[#163C2B]'
              : 'text-[#4F5A53] hover:bg-[#F4F6F4] hover:text-[#1A1F1C]'
          }`}
        >
          <HelpCircle
            className={`h-4 w-4 shrink-0 ${
              activeNavId === 'help' ? 'text-[#163C2B]' : 'text-[#626E66]'
            }`}
            aria-hidden="true"
          />
          {!isCollapsedDesktop && <span>Help &amp; Support</span>}
        </button>

        <button
          type="button"
          onClick={() => {
            onSelectNav('settings');
            onCloseMobile();
          }}
          aria-current={activeNavId === 'settings' ? 'page' : undefined}
          title={isCollapsedDesktop ? 'Settings' : undefined}
          className={`flex w-full items-center rounded-md py-2 text-xs font-medium transition-colors ${
            isCollapsedDesktop ? 'justify-center px-2' : 'gap-2.5 px-2.5'
          } ${
            activeNavId === 'settings'
              ? 'bg-[#EDF2EE] font-semibold text-[#163C2B]'
              : 'text-[#4F5A53] hover:bg-[#F4F6F4] hover:text-[#1A1F1C]'
          }`}
        >
          <Settings
            className={`h-4 w-4 shrink-0 ${
              activeNavId === 'settings' ? 'text-[#163C2B]' : 'text-[#626E66]'
            }`}
            aria-hidden="true"
          />
          {!isCollapsedDesktop && <span>Settings</span>}
        </button>

        {/* User Profile Compact Strip */}
        <div
          className={`mt-1 flex items-center rounded-md border border-[#ECEFEA] bg-[#FAFBF9] py-2 ${
            isCollapsedDesktop ? 'justify-center px-1.5' : 'gap-2.5 px-2.5'
          }`}
          title={isCollapsedDesktop ? `${account.fullName} · ${account.roleLabel}` : undefined}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[#163C2B] font-display text-[11px] font-semibold text-white">
            {account.initials}
          </span>
          {!isCollapsedDesktop && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-[#1A1F1C]">
                {account.fullName}
              </p>
              <p className="truncate text-[11px] text-[#626E66]">
                {account.roleLabel}
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onRequestSignOut}
          title={isCollapsedDesktop ? 'Logout' : undefined}
          className={`flex w-full items-center rounded-md py-2 text-xs font-medium text-[#4F5A53] transition-colors hover:bg-[#FEF2F2] hover:text-[#B91C1C] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#163C2B] ${
            isCollapsedDesktop ? 'justify-center px-2' : 'gap-2.5 px-2.5'
          }`}
        >
          <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
          {!isCollapsedDesktop && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Expandable / Collapsible Sidebar */}
      <aside
        className={`hidden shrink-0 transition-[width] duration-200 lg:block ${
          collapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        {renderSidebarBody(collapsed)}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 flex lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div
            className="fixed inset-0 bg-[#1A1F1C]/40"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative z-10 h-full w-64 max-w-[82vw]">
            {renderSidebarBody(false)}
          </aside>
        </div>
      )}
    </>
  );
}
