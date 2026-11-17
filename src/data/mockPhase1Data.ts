import type {
  NavItemConfig,
  NotificationItem,
  StakeholderAccount,
  UserRole,
} from '../types/gosetu';

export const STAKEHOLDER_ACCOUNTS: StakeholderAccount[] = [
  {
    id: 'USR-ADM-01',
    role: 'admin',
    roleLabel: 'Organization Administrator',
    fullName: 'Meera Deshmukh',
    initials: 'MD',
    email: 'admin@sahyadricoop.org',
    organization: 'Sahyadri Dairy & Livestock Cooperative',
    territoryOrUnit: 'Western Cluster HQ · 42 Villages',
    accessScopeSummary:
      'Full operational oversight across farmer & animal registry, officer allocation, request triage, veterinarian assignment, follow-up monitoring, and reports.',
    restrictionsNote:
      'Administrative coordination role; clinical diagnoses and prescriptions are authored solely by Veterinarians.',
  },
  {
    id: 'USR-FO-14',
    role: 'field_officer',
    roleLabel: 'Field Officer',
    fullName: 'Raghavendra Kulkarni',
    initials: 'RK',
    email: 'r.kulkarni@sahyadricoop.org',
    organization: 'Sahyadri Dairy & Livestock Cooperative',
    territoryOrUnit: 'Baramati North Sub-Cluster · 18 Villages',
    accessScopeSummary:
      'Assigned farmers, farm visit execution, observation recording, veterinary assistance request submission, and follow-up status updates.',
    restrictionsNote:
      'Observation & coordination only. Disease diagnosis and treatment prescription tools are restricted by role policy.',
  },
  {
    id: 'USR-VET-06',
    role: 'veterinarian',
    roleLabel: 'Veterinarian',
    fullName: 'Dr. Kavita Nair, MVSc',
    initials: 'KN',
    email: 'dr.kavita@sahyadricoop.org',
    organization: 'Sahyadri Dairy & Livestock Cooperative',
    territoryOrUnit: 'Central Veterinary Clinical Panel',
    accessScopeSummary:
      'Assigned veterinary cases, animal health history review, clinical examination, diagnosis, treatment documentation, follow-up scheduling, and case closure.',
    restrictionsNote:
      'Only licensed Veterinarians may enter clinical assessments, diagnoses, and treatment decisions.',
  },
  {
    id: 'USR-FRM-204',
    role: 'farmer',
    roleLabel: 'Farmer',
    fullName: 'Suresh Patil',
    initials: 'SP',
    email: 'suresh.patil@farmer.gosetu.org',
    organization: 'Sahyadri Dairy & Livestock Cooperative',
    territoryOrUnit: 'Village Katewadi · Member #FRM-1042',
    accessScopeSummary:
      'Farmer profile, registered livestock list, animal health updates, veterinary assistance request submission, request status tracking, and follow-up instructions.',
    restrictionsNote:
      'Mobile-first self-service portal scoped strictly to household livestock records.',
  },
];

export const ROLE_NAV_CONFIG: Record<UserRole, NavItemConfig[]> = {
  admin: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      section: 'Overview',
      description:
        'Organization-wide livestock coordination metrics, veterinary case overview, requests queue, farm visits, and follow-up monitoring.',
      plannedCapabilities: [
        'Operational summary cards across farmers, animals, officers, requests, cases, and overdue follow-ups',
        'Veterinary case distribution and recent request intake triage',
        'Upcoming farm visits, follow-up monitoring, and field operations overview',
      ],
    },
    {
      id: 'farmers',
      label: 'Farmers',
      section: 'Registry',
      description:
        'Register cooperative dairy farmers, manage village profiles, and assign primary field officers.',
      plannedCapabilities: [
        'Searchable & filterable farmer directory by village and field officer',
        'Farmer registration form with contact validation and cluster mapping',
        'Farmer profile view with registered herd summary and visit history',
      ],
    },
    {
      id: 'animals',
      label: 'Animals',
      section: 'Registry',
      description:
        'Maintain ear-tag animal registry, species/breed records, age, and farmer linkage.',
      plannedCapabilities: [
        'Unique ear-tag animal listing with species and breed filters',
        'Animal registration linked directly to farmer profiles',
        'Consolidated animal clinical & visit timeline',
      ],
    },
    {
      id: 'field-officers',
      label: 'Field Officers',
      section: 'Field Operations',
      description:
        'Manage field officer rosters, village sub-clusters, and farmer coverage allocation.',
      plannedCapabilities: [
        'Field officer directory and assigned village coverage',
        'Assign or reassign farmers to field officers',
        'Workload visibility across sub-clusters',
      ],
    },
    {
      id: 'farm-visits',
      label: 'Farm Visits',
      section: 'Field Operations',
      description:
        'Schedule routine and follow-up farm visits and monitor field officer execution.',
      plannedCapabilities: [
        'Farm visit scheduling with officer and date slot assignment',
        'Visit lifecycle tracking (Scheduled, In Progress, Completed, Cancelled)',
        'Field observation summaries linked to animal records',
      ],
    },
    {
      id: 'veterinary-requests',
      label: 'Veterinary Requests',
      section: 'Veterinary Care',
      description:
        'Review incoming veterinary assistance requests from farmers and field officers.',
      plannedCapabilities: [
        'Unified request intake queue with priority sorting',
        'Administrative triage and request-to-case promotion',
        'Status tracking from submission through resolution',
      ],
    },
    {
      id: 'veterinary-cases',
      label: 'Veterinary Cases',
      section: 'Veterinary Care',
      description:
        'Assign reviewed cases to panel veterinarians and oversee active clinical caseloads.',
      plannedCapabilities: [
        'Case assignment workflow to available veterinarians',
        'Structured case detail dossier with activity timeline',
        'End-to-end case lifecycle monitoring through closure',
      ],
    },
    {
      id: 'veterinarians',
      label: 'Veterinarians',
      section: 'Veterinary Care',
      description:
        'Coordinate panel veterinarians, clinical specializations, and active caseloads.',
      plannedCapabilities: [
        'Panel veterinarian directory and cluster coverage',
        'Active assigned caseload breakdown per veterinarian',
        'Consultation turnaround visibility',
      ],
    },
    {
      id: 'follow-ups',
      label: 'Follow-ups',
      section: 'Veterinary Care',
      description:
        'Track post-consultation care instructions, due dates, and overdue escalations.',
      plannedCapabilities: [
        'Organization-wide follow-up schedule and overdue alerts',
        'Field officer follow-up completion verification',
        'Veterinarian review and case closure readiness',
      ],
    },
    {
      id: 'reports',
      label: 'Reports',
      section: 'Governance',
      description:
        'Operational summaries for cooperative leadership on turnaround times, visits, and case closure.',
      plannedCapabilities: [
        'Sub-cluster case volume and turnaround summaries',
        'Field visit completion rate reporting',
        'Exportable operational records',
      ],
    },
  ],
  field_officer: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      section: 'Overview',
      description:
        'Daily farm visit schedule, assigned farmers, and pending follow-up activities.',
      plannedCapabilities: [
        'Today’s assigned farm visits and priority follow-ups',
        'Quick veterinary assistance request submission',
      ],
    },
    {
      id: 'assigned-farmers',
      label: 'Assigned Farmers',
      section: 'Field Scope',
      description:
        'View assigned farmers and registered livestock within your cluster.',
      plannedCapabilities: [
        'Assigned village farmer roster',
        'Animal ear-tag lookup during farm visits',
      ],
    },
    {
      id: 'farm-visits',
      label: 'Farm Visits',
      section: 'Field Scope',
      description:
        'Record farm visit details, farmer-reported concerns, and observable animal information.',
      plannedCapabilities: [
        'Upcoming & completed visit lists',
        'Structured animal observation submission',
      ],
    },
    {
      id: 'veterinary-requests',
      label: 'Veterinary Requests',
      section: 'Coordination',
      description:
        'Submit veterinary assistance requests based on field observations.',
      plannedCapabilities: [
        'Submit concern with field observations',
        'Track request assignment status',
      ],
    },
    {
      id: 'follow-ups',
      label: 'Assigned Follow-ups',
      section: 'Coordination',
      description:
        'Update follow-up activity progress after veterinarian instructions.',
      plannedCapabilities: [
        'Due & overdue follow-up list',
        'Submit field verification updates',
      ],
    },
  ],
  veterinarian: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      section: 'Overview',
      description:
        'Assigned cases awaiting consultation, active follow-ups due, and recent updates.',
      plannedCapabilities: [
        'Assigned caseload overview',
        'New and urgent cases queue',
      ],
    },
    {
      id: 'veterinary-cases',
      label: 'Assigned Cases',
      section: 'Clinical Care',
      description:
        'Review farmer details, animal profiles, previous history, and field observations.',
      plannedCapabilities: [
        '10-section structured clinical case dossier',
        'Cross-linked animal clinical history',
      ],
    },
    {
      id: 'consultations',
      label: 'Consultations',
      section: 'Clinical Care',
      description:
        'Document clinical examination, diagnosis, treatment decisions, and medication.',
      plannedCapabilities: [
        'Clinical assessment & diagnosis entry',
        'Treatment & medication documentation',
      ],
    },
    {
      id: 'follow-ups',
      label: 'Follow-up Schedule',
      section: 'Care Continuity',
      description:
        'Schedule follow-ups, review field officer updates, and close resolved cases.',
      plannedCapabilities: [
        'Follow-up scheduling for field officers',
        'Clinical case closure workflow',
      ],
    },
  ],
  farmer: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      section: 'My Cooperative',
      description:
        'Overview of registered animals, active veterinary requests, and follow-up instructions.',
      plannedCapabilities: [
        'Prominent Request Veterinary Assistance action',
        'Active request status and upcoming follow-ups',
      ],
    },
    {
      id: 'animals',
      label: 'My Livestock',
      section: 'My Herd',
      description:
        'View registered animals, ear-tag identifiers, and recent updates.',
      plannedCapabilities: [
        'Animal list and health profile',
        'Recent veterinary notes',
      ],
    },
    {
      id: 'veterinary-requests',
      label: 'My Requests',
      section: 'Veterinary Care',
      description:
        'Report animal-health concerns and track request progress through resolution.',
      plannedCapabilities: [
        'Simple mobile-friendly request submission',
        'Live status & follow-up instructions',
      ],
    },
    {
      id: 'profile',
      label: 'My Profile',
      section: 'Account',
      description:
        'Personal cooperative membership details and assigned field officer contact.',
      plannedCapabilities: [
        'Household & village profile',
        'Assigned field officer details',
      ],
    },
  ],
};

export const UTILITY_NAV_ITEMS: Record<'help' | 'settings', NavItemConfig> = {
  help: {
    id: 'help',
    label: 'Help & Support',
    section: 'Support',
    description:
      'Operational field manuals, cooperative onboarding guides, and veterinary escalation contacts.',
    plannedCapabilities: [
      'Role-specific quick reference guides for Farmers, Field Officers, and Veterinarians',
      'Cooperative administrator support desk contact directory',
    ],
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    section: 'System',
    description:
      'Cooperative organization profile, sub-cluster configuration, and notification preferences.',
    plannedCapabilities: [
      'Organization metadata & village cluster management',
      'Notification delivery and role permission audit log',
    ],
  },
};


export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NTF-01',
    title: 'Urgent request submitted for IN-MH-449201',
    detail:
      'Field Officer R. Kulkarni flagged acute milk drop and udder swelling at Suresh Patil’s farm (Katewadi).',
    timestamp: '14 mins ago',
    category: 'Case Queue',
    unread: true,
  },
  {
    id: 'NTF-02',
    title: '5 follow-ups have crossed scheduled due dates',
    detail:
      '2 follow-ups in Baramati North and 3 in Indapur require officer status update.',
    timestamp: '48 mins ago',
    category: 'Follow-up',
    unread: true,
  },
  {
    id: 'NTF-03',
    title: 'Dr. Kavita Nair moved CASE-2026-0836 to In Consultation',
    detail:
      'Clinical examination initiated for Prakash More’s Jersey Crossbred cow in Nira.',
    timestamp: '2 hours ago',
    category: 'Case Queue',
    unread: false,
  },
  {
    id: 'NTF-04',
    title: '6 new farmer registrations logged today',
    detail: 'Cluster onboarding batch verified in Malegaon Bk and Katewadi.',
    timestamp: '3 hours ago',
    category: 'Registry',
    unread: false,
  },
];
