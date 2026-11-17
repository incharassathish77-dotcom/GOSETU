import { useState, type ReactNode } from 'react';
import type { NavItemConfig, NotificationItem, StakeholderAccount, UserRole } from '../../types/gosetu';
import { NotificationPanel } from '../ui/NotificationPanel';
import { SidebarNav } from './SidebarNav';
import { TopNavBar } from './TopNavBar';

interface AppShellProps {
  account: StakeholderAccount;
  navItems: NavItemConfig[];
  activeNavId: string;
  activePageTitle: string;
  globalSearch: string;
  onGlobalSearchChange: (value: string) => void;
  onSelectNav: (id: string) => void;
  onSwitchRole: (role: UserRole) => void;
  onRequestSignOut: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
  children: ReactNode;
}

export function AppShell({
  account,
  navItems,
  activeNavId,
  activePageTitle,
  globalSearch,
  onGlobalSearchChange,
  onSelectNav,
  onSwitchRole,
  onRequestSignOut,
  notifications,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
  children,
}: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="flex min-h-screen bg-[#F7F8F6] text-[#1A1F1C]">
      <SidebarNav
        account={account}
        navItems={navItems}
        activeNavId={activeNavId}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        onSelectNav={onSelectNav}
        onRequestSignOut={onRequestSignOut}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavBar
          account={account}
          activePageTitle={activePageTitle}
          globalSearch={globalSearch}
          onGlobalSearchChange={onGlobalSearchChange}
          unreadCount={unreadCount}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenNotifications={() => setNotificationsOpen(true)}
          onSwitchRole={onSwitchRole}
          onRequestSignOut={onRequestSignOut}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1320px]">{children}</div>
        </main>
      </div>

      <NotificationPanel
        open={notificationsOpen}
        notifications={notifications}
        onClose={() => setNotificationsOpen(false)}
        onMarkRead={onMarkNotificationRead}
        onMarkAllRead={onMarkAllNotificationsRead}
      />
    </div>
  );
}
