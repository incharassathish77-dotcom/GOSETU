import { useState } from 'react';
import { AnimalFormModal } from './components/animals/AnimalFormModal';
import { AssignVetModal } from './components/cases/AssignVetModal';
import { VetRequestFormModal } from './components/cases/VetRequestFormModal';
import { FarmerFormModal } from './components/farmers/FarmerFormModal';
import { AppShell } from './components/layout/AppShell';
import { FarmVisitFormModal } from './components/operations/FarmVisitFormModal';
import { ObservationModal } from './components/operations/ObservationModal';
import { ConfirmationDialog } from './components/ui/ConfirmationDialog';
import {
  INITIAL_NOTIFICATIONS,
  ROLE_NAV_CONFIG,
  STAKEHOLDER_ACCOUNTS,
  UTILITY_NAV_ITEMS,
} from './data/mockPhase1Data';
import { INITIAL_ANIMALS, INITIAL_FARMERS } from './data/mockPhase2Data';
import {
  INITIAL_FARM_VISITS,
  INITIAL_FIELD_OFFICERS,
  INITIAL_FOLLOW_UPS,
  INITIAL_VETERINARIANS,
  INITIAL_VETERINARY_CASES,
} from './data/mockWorkflowData';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AnimalsPage } from './pages/AnimalsPage';
import { FarmVisitsPage } from './pages/FarmVisitsPage';
import { FarmerPortalPage } from './pages/FarmerPortalPage';
import { FarmersPage } from './pages/FarmersPage';
import { FieldOfficerWorkspacePage } from './pages/FieldOfficerWorkspacePage';
import { FieldOfficersPage } from './pages/FieldOfficersPage';
import { FollowUpsPage } from './pages/FollowUpsPage';
import { LoginPage } from './pages/LoginPage';
import { ReportsPage } from './pages/ReportsPage';
import { UtilityPages } from './pages/UtilityPages';
import { VetWorkspacePage } from './pages/VetWorkspacePage';
import { VeterinariansPage } from './pages/VeterinariansPage';
import { VeterinaryCasesPage } from './pages/VeterinaryCasesPage';
import type {
  AnimalRecord,
  ConsultationDetails,
  FarmVisitRecord,
  FarmerRecord,
  FieldOfficerOption,
  FollowUpRecord,
  NotificationItem,
  StakeholderAccount,
  UserRole,
  VeterinarianRecord,
  VeterinaryCaseRecord,
  VeterinaryCaseStatus,
  VisitObservation,
} from './types/gosetu';

export default function App() {
  const [activeAccount, setActiveAccount] = useState<StakeholderAccount | null>(null);
  const [activeNavId, setActiveNavId] = useState<string>('dashboard');
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS
  );
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);

  // Shared Cooperative Domain State (Phases 2-6)
  const [farmers, setFarmers] = useState<FarmerRecord[]>(INITIAL_FARMERS);
  const [animals, setAnimals] = useState<AnimalRecord[]>(INITIAL_ANIMALS);
  const [officers] = useState<FieldOfficerOption[]>(INITIAL_FIELD_OFFICERS);
  const [veterinarians] = useState<VeterinarianRecord[]>(INITIAL_VETERINARIANS);
  const [visits, setVisits] = useState<FarmVisitRecord[]>(INITIAL_FARM_VISITS);
  const [cases, setCases] = useState<VeterinaryCaseRecord[]>(
    INITIAL_VETERINARY_CASES
  );
  const [followUps, setFollowUps] = useState<FollowUpRecord[]>(INITIAL_FOLLOW_UPS);

  // Selection State
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null);
  const [selectedAnimalId, setSelectedAnimalId] = useState<string | null>(null);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  // Modal State
  const [farmerModalOpen, setFarmerModalOpen] = useState(false);
  const [editingFarmer, setEditingFarmer] = useState<FarmerRecord | null>(null);

  const [animalModalOpen, setAnimalModalOpen] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState<AnimalRecord | null>(null);
  const [prefilledFarmerId, setPrefilledFarmerId] = useState<string | undefined>(
    undefined
  );
  const [lockFarmerSelection, setLockFarmerSelection] = useState(false);

  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [observingVisit, setObservingVisit] = useState<FarmVisitRecord | null>(null);
  const [vetRequestModalOpen, setVetRequestModalOpen] = useState(false);
  const [assigningCase, setAssigningCase] = useState<VeterinaryCaseRecord | null>(
    null
  );

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const pushNotification = (
    title: string,
    detail: string,
    category: NotificationItem['category']
  ) => {
    setNotifications((prev) => [
      {
        id: `NTF-${Date.now()}`,
        title,
        detail,
        timestamp: 'Just now',
        category,
        unread: true,
      },
      ...prev,
    ]);
  };

  const resetViewSelections = () => {
    setGlobalSearch('');
    setSelectedFarmerId(null);
    setSelectedAnimalId(null);
    setSelectedCaseId(null);
    setToastMessage(null);
  };

  const handleLoginSuccess = (account: StakeholderAccount) => {
    setActiveAccount(account);
    setActiveNavId('dashboard');
    resetViewSelections();
  };

  const handleSwitchRole = (role: UserRole) => {
    const nextAccount = STAKEHOLDER_ACCOUNTS.find((a) => a.role === role);
    if (!nextAccount) return;
    setActiveAccount(nextAccount);
    setActiveNavId('dashboard');
    resetViewSelections();
  };

  const handleConfirmSignOut = () => {
    setSignOutDialogOpen(false);
    setActiveAccount(null);
    setActiveNavId('dashboard');
    resetViewSelections();
  };

  const handleSelectNav = (id: string) => {
    setActiveNavId(id);
    setSelectedFarmerId(null);
    setSelectedAnimalId(null);
    setSelectedCaseId(null);
    setToastMessage(null);
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unread: false } : item))
    );
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((item) => ({ ...item, unread: false })));
  };

  // --- Farmer & Animal Registry Mutators ---
  const handleOpenNewFarmer = () => {
    setEditingFarmer(null);
    setFarmerModalOpen(true);
  };

  const handleOpenEditFarmer = (farmer: FarmerRecord) => {
    setEditingFarmer(farmer);
    setFarmerModalOpen(true);
  };

  const handleSaveFarmer = (record: FarmerRecord, isEdit: boolean) => {
    if (isEdit) {
      setFarmers((prev) =>
        prev.map((f) => (f.farmerId === record.farmerId ? record : f))
      );
      setToastMessage(
        `Updated farmer profile for ${record.fullName} (${record.farmerId}).`
      );
    } else {
      setFarmers((prev) => [record, ...prev]);
      setActiveNavId('farmers');
      setSelectedFarmerId(record.farmerId);
      setToastMessage(
        `Registered new farmer ${record.fullName} (${record.farmerId}) and assigned to ${record.assignedOfficerName}.`
      );
      pushNotification(
        `New farmer registered: ${record.fullName}`,
        `Assigned to ${record.assignedOfficerName} in ${record.village}.`,
        'Registry'
      );
    }
    setFarmerModalOpen(false);
    setEditingFarmer(null);
  };

  const handleOpenNewAnimal = (farmerId?: string, lockFarmer = false) => {
    setEditingAnimal(null);
    setPrefilledFarmerId(farmerId);
    setLockFarmerSelection(lockFarmer);
    setAnimalModalOpen(true);
  };

  const handleOpenEditAnimal = (animal: AnimalRecord) => {
    setEditingAnimal(animal);
    setPrefilledFarmerId(animal.farmerId);
    setLockFarmerSelection(false);
    setAnimalModalOpen(true);
  };

  const handleSaveAnimal = (record: AnimalRecord, isEdit: boolean) => {
    if (isEdit) {
      setAnimals((prev) =>
        prev.map((a) => (a.animalId === record.animalId ? record : a))
      );
      setToastMessage(
        `Updated animal record for ${record.nameOrLabel} (${record.earTag}).`
      );
    } else {
      setAnimals((prev) => [record, ...prev]);
      setToastMessage(
        `Registered animal ${record.nameOrLabel} (${record.earTag}) under ${
          farmers.find((f) => f.farmerId === record.farmerId)?.fullName ??
          record.farmerId
        }.`
      );
    }
    setAnimalModalOpen(false);
    setEditingAnimal(null);
    setPrefilledFarmerId(undefined);
    setLockFarmerSelection(false);
  };

  // --- Phase 3: Field Operations & Farm Visits ---
  const handleReassignFarmer = (farmerId: string, newOfficerId: string) => {
    const officer = officers.find((o) => o.id === newOfficerId);
    const farmer = farmers.find((f) => f.farmerId === farmerId);
    if (!officer || !farmer) return;

    setFarmers((prev) =>
      prev.map((f) =>
        f.farmerId === farmerId
          ? {
              ...f,
              assignedOfficerId: officer.id,
              assignedOfficerName: officer.name,
            }
          : f
      )
    );
    setToastMessage(
      `Reassigned ${farmer.fullName} (${farmer.village}) to ${officer.name}.`
    );
    pushNotification(
      `Farmer assignment updated`,
      `${farmer.fullName} assigned to Field Officer ${officer.name}.`,
      'Field Operations'
    );
  };

  const handleSaveScheduledVisit = (newVisit: FarmVisitRecord) => {
    setVisits((prev) => [newVisit, ...prev]);
    setVisitModalOpen(false);
    setToastMessage(
      `Scheduled farm visit ${newVisit.visitId} for ${newVisit.farmerName} (${newVisit.fieldOfficer}).`
    );
    pushNotification(
      `New farm visit ${newVisit.visitId} scheduled`,
      `${newVisit.farmerName} (${newVisit.village}) assigned to ${newVisit.fieldOfficer} for ${newVisit.scheduledDate}.`,
      'Field Operations'
    );
  };

  const handleStartVisit = (visitId: string) => {
    setVisits((prev) =>
      prev.map((v) =>
        v.visitId === visitId ? { ...v, status: 'In Progress' } : v
      )
    );
    setToastMessage(`Started farm visit ${visitId}. You can now record observations.`);
  };

  const handleCompleteVisit = (visitId: string) => {
    setVisits((prev) =>
      prev.map((v) =>
        v.visitId === visitId
          ? {
              ...v,
              status: 'Completed',
              completionNotes: 'Completed by Field Officer on-site.',
            }
          : v
      )
    );
    setToastMessage(`Marked farm visit ${visitId} as Completed.`);
  };

  const handleCancelVisit = (visitId: string) => {
    setVisits((prev) =>
      prev.map((v) =>
        v.visitId === visitId ? { ...v, status: 'Cancelled' } : v
      )
    );
    setToastMessage(`Cancelled farm visit ${visitId}.`);
  };

  const handleSaveObservation = (
    visitId: string,
    observation: VisitObservation,
    raiseVetRequest: boolean
  ) => {
    const visit = visits.find((v) => v.visitId === visitId);
    const farmer = farmers.find((f) => f.farmerId === visit?.farmerId);
    const animal = animals.find((a) => a.animalId === observation.animalId);

    setVisits((prev) =>
      prev.map((v) =>
        v.visitId === visitId
          ? {
              ...v,
              status: v.status === 'Scheduled' ? 'In Progress' : v.status,
              observations: [observation, ...v.observations],
            }
          : v
      )
    );

    if (raiseVetRequest && visit && farmer && animal) {
      const maxNum = cases.reduce((max, c) => {
        const num = parseInt(c.caseId.split('-').pop() ?? '0', 10);
        return Number.isNaN(num) ? max : Math.max(max, num);
      }, 842);
      const nextCaseId = `REQ-2026-0${maxNum + 1}`;
      const nowLabel = '17 Nov 2026 · Just now';

      const createdCase: VeterinaryCaseRecord = {
        caseId: nextCaseId,
        requestDate: '17 Nov 2026',
        submittedTime: 'Just now',
        farmerId: farmer.farmerId,
        farmerName: farmer.fullName,
        village: farmer.village,
        animalId: animal.animalId,
        animalTag: animal.earTag,
        speciesBreed: `${animal.animalType} · ${animal.breed}`,
        concernSummary: observation.farmerConcern,
        fieldObservations: `${observation.observableSymptoms} | ${observation.appetiteAndYieldNote} | ${observation.temperatureNote}`,
        reportedBy: `${observation.recordedBy} (Officer)`,
        reportedByRole: 'field_officer',
        assignedVetId: null,
        assignedVet: null,
        priority: 'Priority',
        status: 'Submitted',
        lastUpdated: nowLabel,
        timeline: [
          {
            id: `EVT-${Date.now()}`,
            timestamp: nowLabel,
            actor: observation.recordedBy,
            role: 'Field Officer',
            title: `Observation & Veterinary Request submitted (${visitId})`,
            detail: `${observation.farmerConcern} — ${observation.observableSymptoms}`,
          },
        ],
      };

      setCases((prev) => [createdCase, ...prev]);
      setAnimals((prev) =>
        prev.map((a) =>
          a.animalId === animal.animalId
            ? { ...a, healthStatus: 'Under Care', lastCheckedDate: '17 Nov 2026' }
            : a
        )
      );
      pushNotification(
        `New request ${nextCaseId} from ${observation.recordedBy}`,
        `Submitted during farm visit ${visitId} for ${animal.nameOrLabel} (${animal.earTag}).`,
        'Case Queue'
      );
      setToastMessage(
        `Saved field observation and submitted veterinary request ${nextCaseId}.`
      );
    } else {
      setToastMessage(`Saved field observation for ${observation.animalTag}.`);
    }

    setObservingVisit(null);
  };

  // --- Phase 4 & 5: Requests, Case Assignment, Consultations, Follow-ups, Closure ---
  const handleSubmitVetRequest = (newCase: VeterinaryCaseRecord) => {
    setCases((prev) => [newCase, ...prev]);
    setAnimals((prev) =>
      prev.map((a) =>
        a.animalId === newCase.animalId
          ? { ...a, healthStatus: 'Under Care', lastCheckedDate: '17 Nov 2026' }
          : a
      )
    );
    setVetRequestModalOpen(false);
    setToastMessage(
      `Submitted veterinary assistance request ${newCase.caseId} for ${newCase.animalTag}.`
    );
    pushNotification(
      `${newCase.priority} request ${newCase.caseId} submitted`,
      `${newCase.farmerName} (${newCase.village}) — ${newCase.concernSummary}`,
      'Case Queue'
    );
  };

  const handleMarkUnderReview = (caseId: string) => {
    const nowLabel = '17 Nov 2026 · Just now';
    setCases((prev) =>
      prev.map((c) =>
        c.caseId === caseId
          ? {
              ...c,
              status: 'Under Review',
              lastUpdated: nowLabel,
              timeline: [
                ...c.timeline,
                {
                  id: `EVT-${Date.now()}`,
                  timestamp: nowLabel,
                  actor: activeAccount?.fullName ?? 'Organization Administrator',
                  role: 'Organization Administrator',
                  title: 'Moved to Under Review',
                  detail: 'Administrative triage started prior to veterinarian assignment.',
                },
              ],
            }
          : c
      )
    );
    setToastMessage(`Case ${caseId} marked as Under Review.`);
  };

  const handleAssignVet = (
    caseId: string,
    vet: VeterinarianRecord,
    note: string
  ) => {
    const nowLabel = '17 Nov 2026 · Just now';
    setCases((prev) =>
      prev.map((c) =>
        c.caseId === caseId
          ? {
              ...c,
              assignedVetId: vet.id,
              assignedVet: vet.name,
              status: 'Assigned',
              lastUpdated: nowLabel,
              timeline: [
                ...c.timeline,
                {
                  id: `EVT-${Date.now()}`,
                  timestamp: nowLabel,
                  actor: activeAccount?.fullName ?? 'Organization Administrator',
                  role: 'Organization Administrator',
                  title: `Assigned to ${vet.name}`,
                  detail: note || `Routed to ${vet.name} (${vet.specialization}).`,
                },
              ],
            }
          : c
      )
    );
    setAssigningCase(null);
    setToastMessage(`Assigned case ${caseId} to ${vet.name}.`);
    pushNotification(
      `Case ${caseId} assigned to ${vet.name}`,
      note || `Awaiting clinical consultation.`,
      'Case Queue'
    );
  };

  const handleSaveConsultation = (
    caseId: string,
    consultation: ConsultationDetails,
    nextStatus: VeterinaryCaseStatus
  ) => {
    const nowLabel = '17 Nov 2026 · Just now';
    const targetCase = cases.find((c) => c.caseId === caseId);

    setCases((prev) =>
      prev.map((c) =>
        c.caseId === caseId
          ? {
              ...c,
              consultation,
              status: nextStatus,
              lastUpdated: nowLabel,
              timeline: [
                ...c.timeline,
                {
                  id: `EVT-${Date.now()}`,
                  timestamp: nowLabel,
                  actor: consultation.recordedByVet,
                  role: 'Veterinarian',
                  title: `Consultation documented (${nextStatus})`,
                  detail: `Diagnosis: ${consultation.diagnosis} · Plan: ${consultation.treatmentPlan}`,
                },
              ],
            }
          : c
      )
    );

    if (targetCase) {
      const nextHealth =
        nextStatus === 'Resolved'
          ? 'Healthy'
          : nextStatus === 'Follow-up Required'
            ? 'Follow-up'
            : 'Under Care';

      setAnimals((prev) =>
        prev.map((a) =>
          a.animalId === targetCase.animalId
            ? { ...a, healthStatus: nextHealth, lastCheckedDate: '17 Nov 2026' }
            : a
        )
      );
    }

    setToastMessage(`Saved clinical consultation for ${caseId} (${nextStatus}).`);
  };

  const handleScheduleFollowUp = (
    caseId: string,
    dueDateIso: string,
    instructionNote: string
  ) => {
    const targetCase = cases.find((c) => c.caseId === caseId);
    if (!targetCase) return;

    const farmer = farmers.find((f) => f.farmerId === targetCase.farmerId);
    const parsed = new Date(`${dueDateIso}T00:00:00`);
    const dueLabel = Number.isNaN(parsed.getTime())
      ? dueDateIso
      : parsed.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });

    const maxFu = followUps.reduce((max, f) => {
      const n = parseInt(f.followUpId.replace('FU-', ''), 10);
      return Number.isNaN(n) ? max : Math.max(max, n);
    }, 1105);
    const nextFuId = `FU-${maxFu + 1}`;
    const nowLabel = '17 Nov 2026 · Just now';

    const newFollowUp: FollowUpRecord = {
      followUpId: nextFuId,
      caseId: targetCase.caseId,
      farmerId: targetCase.farmerId,
      farmerName: targetCase.farmerName,
      animalId: targetCase.animalId,
      animalTag: targetCase.animalTag,
      assignedOfficerId: farmer?.assignedOfficerId ?? 'FO-14',
      assignedPerson: farmer?.assignedOfficerName ?? 'Raghavendra Kulkarni',
      scheduledByVet: activeAccount?.fullName ?? 'Dr. Kavita Nair',
      dueDate: dueLabel,
      instructionNote,
      status: 'Scheduled',
    };

    setFollowUps((prev) => [newFollowUp, ...prev]);
    setCases((prev) =>
      prev.map((c) =>
        c.caseId === caseId
          ? {
              ...c,
              status: 'Follow-up Required',
              lastUpdated: nowLabel,
              timeline: [
                ...c.timeline,
                {
                  id: `EVT-${Date.now()}`,
                  timestamp: nowLabel,
                  actor: activeAccount?.fullName ?? 'Veterinarian',
                  role: 'Veterinarian',
                  title: `Follow-up ${nextFuId} scheduled for ${dueLabel}`,
                  detail: `Assigned to ${newFollowUp.assignedPerson}: ${instructionNote}`,
                },
              ],
            }
          : c
      )
    );
    setAnimals((prev) =>
      prev.map((a) =>
        a.animalId === targetCase.animalId ? { ...a, healthStatus: 'Follow-up' } : a
      )
    );
    pushNotification(
      `Follow-up ${nextFuId} scheduled (${dueLabel})`,
      `${newFollowUp.assignedPerson} assigned to check ${targetCase.animalTag}.`,
      'Follow-up'
    );
    setToastMessage(`Scheduled follow-up ${nextFuId} for ${dueLabel}.`);
  };

  const handleUpdateFollowUpStatus = (
    followUpId: string,
    officerUpdateNote: string
  ) => {
    const targetFu = followUps.find((f) => f.followUpId === followUpId);
    const nowLabel = '17 Nov 2026 · Just now';

    setFollowUps((prev) =>
      prev.map((f) =>
        f.followUpId === followUpId
          ? {
              ...f,
              status: 'Completed',
              officerUpdateNote,
              completedAt: nowLabel,
            }
          : f
      )
    );

    if (targetFu) {
      setCases((prev) =>
        prev.map((c) =>
          c.caseId === targetFu.caseId
            ? {
                ...c,
                lastUpdated: nowLabel,
                timeline: [
                  ...c.timeline,
                  {
                    id: `EVT-${Date.now()}`,
                    timestamp: nowLabel,
                    actor: activeAccount?.fullName ?? targetFu.assignedPerson,
                    role: 'Field Officer',
                    title: `Follow-up ${followUpId} completed`,
                    detail: officerUpdateNote,
                  },
                ],
              }
            : c
        )
      );
      pushNotification(
        `Follow-up ${followUpId} verified by Field Officer`,
        `${targetFu.animalTag} (${targetFu.farmerName}): ${officerUpdateNote}`,
        'Follow-up'
      );
    }

    setToastMessage(`Marked follow-up ${followUpId} as Completed.`);
  };

  const handleCloseCase = (caseId: string) => {
    const targetCase = cases.find((c) => c.caseId === caseId);
    const nowLabel = '17 Nov 2026 · Just now';

    setCases((prev) =>
      prev.map((c) =>
        c.caseId === caseId
          ? {
              ...c,
              status: 'Closed',
              lastUpdated: nowLabel,
              timeline: [
                ...c.timeline,
                {
                  id: `EVT-${Date.now()}`,
                  timestamp: nowLabel,
                  actor: activeAccount?.fullName ?? 'Veterinarian',
                  role: 'Veterinarian',
                  title: 'Case Closed',
                  detail: 'Clinical care completed and animal recovery confirmed.',
                },
              ],
            }
          : c
      )
    );

    if (targetCase) {
      setAnimals((prev) =>
        prev.map((a) =>
          a.animalId === targetCase.animalId
            ? { ...a, healthStatus: 'Healthy', lastCheckedDate: '17 Nov 2026' }
            : a
        )
      );
    }

    setToastMessage(`Closed case ${caseId}. Animal status updated to Healthy.`);
  };

  const handleOpenCaseDossier = (caseId: string) => {
    if (!activeAccount) return;
    if (activeAccount.role === 'admin' || activeAccount.role === 'veterinarian') {
      setActiveNavId('veterinary-cases');
    } else {
      setActiveNavId('veterinary-requests');
    }
    setSelectedCaseId(caseId);
  };

  if (!activeAccount) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const navItems = ROLE_NAV_CONFIG[activeAccount.role];
  const currentNavItem =
    navItems.find((item) => item.id === activeNavId) ??
    (activeNavId === 'help'
      ? UTILITY_NAV_ITEMS.help
      : activeNavId === 'settings'
        ? UTILITY_NAV_ITEMS.settings
        : navItems[0]);

  const loggedInFarmerRecord =
    farmers.find((f) => f.farmerId === 'FRM-1042') ?? farmers[0];
  const currentOfficerId = 'FO-14';
  const currentVetId = 'VET-06';
  const currentVetName = 'Dr. Kavita Nair';

  const renderMainContent = () => {
    if (currentNavItem.id === 'help' || currentNavItem.id === 'settings') {
      return (
        <UtilityPages
          mode={currentNavItem.id as 'help' | 'settings'}
          account={activeAccount}
        />
      );
    }

    // --- Organization Administrator Views ---
    if (activeAccount.role === 'admin') {
      switch (currentNavItem.id) {
        case 'dashboard':
          return (
            <AdminDashboardPage
              account={activeAccount}
              globalSearch={globalSearch}
              onClearGlobalSearch={() => setGlobalSearch('')}
              onNavigateModule={handleSelectNav}
              totalFarmersCount={farmers.length}
              totalAnimalsCount={animals.length}
              officers={officers}
              visits={visits}
              cases={cases}
              followUps={followUps}
              onQuickRegisterFarmer={handleOpenNewFarmer}
              onOpenCaseDossier={handleOpenCaseDossier}
            />
          );
        case 'farmers':
          return (
            <FarmersPage
              farmers={farmers}
              animals={animals}
              officers={officers}
              visits={visits}
              cases={cases}
              globalSearch={globalSearch}
              selectedFarmerId={selectedFarmerId}
              onSelectFarmerId={setSelectedFarmerId}
              onOpenNewFarmer={handleOpenNewFarmer}
              onOpenEditFarmer={handleOpenEditFarmer}
              onOpenNewAnimalForFarmer={(fId) => handleOpenNewAnimal(fId, true)}
              onOpenAnimalProfile={(aId) => {
                setActiveNavId('animals');
                setSelectedAnimalId(aId);
              }}
              onOpenCaseDossier={handleOpenCaseDossier}
              toastMessage={toastMessage}
              onDismissToast={() => setToastMessage(null)}
            />
          );
        case 'animals':
          return (
            <AnimalsPage
              animals={animals}
              farmers={farmers}
              cases={cases}
              followUps={followUps}
              globalSearch={globalSearch}
              selectedAnimalId={selectedAnimalId}
              onSelectAnimalId={setSelectedAnimalId}
              onOpenNewAnimal={() => handleOpenNewAnimal(undefined, false)}
              onOpenEditAnimal={handleOpenEditAnimal}
              onOpenFarmerProfile={(fId) => {
                setActiveNavId('farmers');
                setSelectedFarmerId(fId);
              }}
              onOpenCaseDossier={handleOpenCaseDossier}
              toastMessage={toastMessage}
              onDismissToast={() => setToastMessage(null)}
            />
          );
        case 'field-officers':
          return (
            <FieldOfficersPage
              officers={officers}
              farmers={farmers}
              visits={visits}
              followUps={followUps}
              onReassignFarmer={handleReassignFarmer}
              onOpenFarmerProfile={(fId) => {
                setActiveNavId('farmers');
                setSelectedFarmerId(fId);
              }}
              toastMessage={toastMessage}
              onDismissToast={() => setToastMessage(null)}
            />
          );
        case 'farm-visits':
          return (
            <FarmVisitsPage
              role="admin"
              visits={visits}
              animals={animals}
              globalSearch={globalSearch}
              onOpenScheduleVisit={() => setVisitModalOpen(true)}
              onStartVisit={handleStartVisit}
              onCompleteVisit={handleCompleteVisit}
              onCancelVisit={handleCancelVisit}
              onOpenObservationModal={setObservingVisit}
              toastMessage={toastMessage}
              onDismissToast={() => setToastMessage(null)}
            />
          );
        case 'veterinary-requests':
        case 'veterinary-cases':
          return (
            <VeterinaryCasesPage
              mode={
                currentNavItem.id === 'veterinary-requests'
                  ? 'requests'
                  : 'cases'
              }
              role="admin"
              cases={cases}
              farmers={farmers}
              animals={animals}
              followUps={followUps}
              globalSearch={globalSearch}
              selectedCaseId={selectedCaseId}
              onSelectCaseId={setSelectedCaseId}
              onOpenNewRequest={() => setVetRequestModalOpen(true)}
              onOpenAssignVet={setAssigningCase}
              onMarkUnderReview={handleMarkUnderReview}
              onSaveConsultation={handleSaveConsultation}
              onScheduleFollowUp={handleScheduleFollowUp}
              onCloseCase={handleCloseCase}
              toastMessage={toastMessage}
              onDismissToast={() => setToastMessage(null)}
            />
          );
        case 'veterinarians':
          return (
            <VeterinariansPage
              veterinarians={veterinarians}
              cases={cases}
              onOpenCase={handleOpenCaseDossier}
            />
          );
        case 'follow-ups':
          return (
            <FollowUpsPage
              role="admin"
              followUps={followUps}
              globalSearch={globalSearch}
              onUpdateFollowUpStatus={handleUpdateFollowUpStatus}
              onOpenCaseDossier={handleOpenCaseDossier}
              toastMessage={toastMessage}
              onDismissToast={() => setToastMessage(null)}
            />
          );
        case 'reports':
          return (
            <ReportsPage
              farmers={farmers}
              animals={animals}
              officers={officers}
              veterinarians={veterinarians}
              visits={visits}
              cases={cases}
              followUps={followUps}
            />
          );
      }
    }

    // --- Field Officer Views ---
    if (activeAccount.role === 'field_officer') {
      if (
        currentNavItem.id === 'dashboard' ||
        currentNavItem.id === 'assigned-farmers'
      ) {
        return (
          <FieldOfficerWorkspacePage
            activeNavId={currentNavItem.id}
            account={activeAccount}
            officerId={currentOfficerId}
            farmers={farmers}
            animals={animals}
            visits={visits}
            followUps={followUps}
            onNavigate={handleSelectNav}
            onStartVisit={handleStartVisit}
            onOpenObservationModal={setObservingVisit}
            onOpenNewRequest={() => setVetRequestModalOpen(true)}
            toastMessage={toastMessage}
            onDismissToast={() => setToastMessage(null)}
          />
        );
      }

      if (currentNavItem.id === 'farm-visits') {
        return (
          <FarmVisitsPage
            role="field_officer"
            officerId={currentOfficerId}
            visits={visits}
            animals={animals}
            globalSearch={globalSearch}
            onStartVisit={handleStartVisit}
            onCompleteVisit={handleCompleteVisit}
            onCancelVisit={handleCancelVisit}
            onOpenObservationModal={setObservingVisit}
            toastMessage={toastMessage}
            onDismissToast={() => setToastMessage(null)}
          />
        );
      }

      if (currentNavItem.id === 'veterinary-requests') {
        return (
          <VeterinaryCasesPage
            mode="requests"
            role="field_officer"
            cases={cases}
            farmers={farmers}
            animals={animals}
            followUps={followUps}
            globalSearch={globalSearch}
            selectedCaseId={selectedCaseId}
            onSelectCaseId={setSelectedCaseId}
            onOpenNewRequest={() => setVetRequestModalOpen(true)}
            onSaveConsultation={handleSaveConsultation}
            onScheduleFollowUp={handleScheduleFollowUp}
            onCloseCase={handleCloseCase}
            toastMessage={toastMessage}
            onDismissToast={() => setToastMessage(null)}
          />
        );
      }

      if (currentNavItem.id === 'follow-ups') {
        return (
          <FollowUpsPage
            role="field_officer"
            officerId={currentOfficerId}
            followUps={followUps}
            globalSearch={globalSearch}
            onUpdateFollowUpStatus={handleUpdateFollowUpStatus}
            onOpenCaseDossier={handleOpenCaseDossier}
            toastMessage={toastMessage}
            onDismissToast={() => setToastMessage(null)}
          />
        );
      }
    }

    // --- Veterinarian Views ---
    if (activeAccount.role === 'veterinarian') {
      if (currentNavItem.id === 'dashboard') {
        return (
          <VetWorkspacePage
            account={activeAccount}
            vetId={currentVetId}
            cases={cases}
            followUps={followUps}
            onNavigate={handleSelectNav}
            onOpenCase={handleOpenCaseDossier}
            toastMessage={toastMessage}
            onDismissToast={() => setToastMessage(null)}
          />
        );
      }

      if (
        currentNavItem.id === 'veterinary-cases' ||
        currentNavItem.id === 'consultations'
      ) {
        return (
          <VeterinaryCasesPage
            mode={
              currentNavItem.id === 'consultations' ? 'consultations' : 'cases'
            }
            role="veterinarian"
            currentVetId={currentVetId}
            currentVetName={currentVetName}
            cases={cases}
            farmers={farmers}
            animals={animals}
            followUps={followUps}
            globalSearch={globalSearch}
            selectedCaseId={selectedCaseId}
            onSelectCaseId={setSelectedCaseId}
            onSaveConsultation={handleSaveConsultation}
            onScheduleFollowUp={handleScheduleFollowUp}
            onCloseCase={handleCloseCase}
            toastMessage={toastMessage}
            onDismissToast={() => setToastMessage(null)}
          />
        );
      }

      if (currentNavItem.id === 'follow-ups') {
        return (
          <FollowUpsPage
            role="veterinarian"
            followUps={followUps}
            globalSearch={globalSearch}
            onUpdateFollowUpStatus={handleUpdateFollowUpStatus}
            onOpenCaseDossier={handleOpenCaseDossier}
            toastMessage={toastMessage}
            onDismissToast={() => setToastMessage(null)}
          />
        );
      }
    }

    // --- Farmer Views ---
    if (activeAccount.role === 'farmer') {
      if (currentNavItem.id === 'veterinary-requests') {
        return (
          <VeterinaryCasesPage
            mode="requests"
            role="farmer"
            currentFarmerId={loggedInFarmerRecord.farmerId}
            cases={cases}
            farmers={farmers}
            animals={animals}
            followUps={followUps}
            globalSearch={globalSearch}
            selectedCaseId={selectedCaseId}
            onSelectCaseId={setSelectedCaseId}
            onOpenNewRequest={() => setVetRequestModalOpen(true)}
            onSaveConsultation={handleSaveConsultation}
            onScheduleFollowUp={handleScheduleFollowUp}
            onCloseCase={handleCloseCase}
            toastMessage={toastMessage}
            onDismissToast={() => setToastMessage(null)}
          />
        );
      }

      return (
        <FarmerPortalPage
          activeNavId={currentNavItem.id}
          farmer={loggedInFarmerRecord}
          animals={animals}
          cases={cases}
          followUps={followUps}
          onNavigate={handleSelectNav}
          onRegisterAnimal={() =>
            handleOpenNewAnimal(loggedInFarmerRecord.farmerId, true)
          }
          onOpenNewRequest={() => setVetRequestModalOpen(true)}
          onOpenCaseDossier={handleOpenCaseDossier}
          toastMessage={toastMessage}
          onDismissToast={() => setToastMessage(null)}
        />
      );
    }

    return null;
  };

  return (
    <>
      <AppShell
        account={activeAccount}
        navItems={navItems}
        activeNavId={currentNavItem.id}
        activePageTitle={currentNavItem.label}
        globalSearch={globalSearch}
        onGlobalSearchChange={setGlobalSearch}
        onSelectNav={handleSelectNav}
        onSwitchRole={handleSwitchRole}
        onRequestSignOut={() => setSignOutDialogOpen(true)}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
      >
        {renderMainContent()}
      </AppShell>

      <FarmerFormModal
        open={farmerModalOpen}
        initialFarmer={editingFarmer}
        existingFarmers={farmers}
        onClose={() => {
          setFarmerModalOpen(false);
          setEditingFarmer(null);
        }}
        onSave={handleSaveFarmer}
      />

      <AnimalFormModal
        open={animalModalOpen}
        initialAnimal={editingAnimal}
        prefilledFarmerId={prefilledFarmerId}
        lockFarmerSelection={lockFarmerSelection}
        farmers={farmers}
        existingAnimals={animals}
        onClose={() => {
          setAnimalModalOpen(false);
          setEditingAnimal(null);
          setPrefilledFarmerId(undefined);
          setLockFarmerSelection(false);
        }}
        onSave={handleSaveAnimal}
      />

      <FarmVisitFormModal
        open={visitModalOpen}
        farmers={farmers}
        fieldOfficers={officers}
        existingVisits={visits}
        onClose={() => setVisitModalOpen(false)}
        onSave={handleSaveScheduledVisit}
      />

      <ObservationModal
        open={Boolean(observingVisit)}
        visit={observingVisit}
        farmerAnimals={animals.filter(
          (a) => a.farmerId === observingVisit?.farmerId
        )}
        officerName={activeAccount.fullName}
        onClose={() => setObservingVisit(null)}
        onSave={handleSaveObservation}
      />

      <VetRequestFormModal
        open={vetRequestModalOpen}
        role={activeAccount.role}
        reporterName={activeAccount.fullName}
        lockedFarmerId={
          activeAccount.role === 'farmer'
            ? loggedInFarmerRecord.farmerId
            : undefined
        }
        farmers={farmers}
        animals={animals}
        existingCases={cases}
        onClose={() => setVetRequestModalOpen(false)}
        onSubmit={handleSubmitVetRequest}
      />

      <AssignVetModal
        open={Boolean(assigningCase)}
        caseRecord={assigningCase}
        veterinarians={veterinarians}
        allCases={cases}
        onClose={() => setAssigningCase(null)}
        onAssign={handleAssignVet}
      />

      <ConfirmationDialog
        open={signOutDialogOpen}
        title="Logout of current session?"
        description={`You are currently exploring GOSETU as ${activeAccount.fullName} (${activeAccount.roleLabel}). Returning to the login screen lets you test another stakeholder login.`}
        confirmLabel="Logout"
        cancelLabel="Stay signed in"
        onConfirm={handleConfirmSignOut}
        onCancel={() => setSignOutDialogOpen(false)}
      />
    </>
  );
}
