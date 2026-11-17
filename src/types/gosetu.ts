export type UserRole = 'admin' | 'field_officer' | 'veterinarian' | 'farmer';

export type FarmVisitStatus =
  | 'Scheduled'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled';

export type VeterinaryCaseStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Assigned'
  | 'In Consultation'
  | 'Follow-up Required'
  | 'Resolved'
  | 'Closed'
  | 'Cancelled';

export type FollowUpStatus =
  | 'Scheduled'
  | 'Due'
  | 'Completed'
  | 'Overdue'
  | 'Cancelled';

export type AnyEntityStatus =
  | FarmVisitStatus
  | VeterinaryCaseStatus
  | FollowUpStatus;

export type FarmerStatus = 'Active' | 'Inactive';
export type AnimalType = 'Cattle' | 'Buffalo' | 'Goat';
export type AnimalGender = 'Female' | 'Male';
export type LactationStage =
  | 'Milking'
  | 'Dry'
  | 'Pregnant'
  | 'Heifer / Calf'
  | 'Not Applicable';
export type AnimalHealthStatus = 'Healthy' | 'Under Care' | 'Follow-up';

export type TimeframeOption = 'today' | '7d' | '30d';

export type MetricIconKey =
  | 'farmers'
  | 'animals'
  | 'officers'
  | 'requests'
  | 'cases'
  | 'followups';

export interface StakeholderAccount {
  id: string;
  role: UserRole;
  roleLabel: string;
  fullName: string;
  initials: string;
  email: string;
  organization: string;
  territoryOrUnit: string;
  accessScopeSummary: string;
  restrictionsNote: string;
}

export interface FarmerRecord {
  farmerId: string;
  fullName: string;
  phone: string;
  alternatePhone?: string;
  village: string;
  subCluster: string;
  address: string;
  assignedOfficerId: string;
  assignedOfficerName: string;
  registeredSince: string;
  status: FarmerStatus;
  notes?: string;
}

export interface AnimalRecord {
  animalId: string;
  earTag: string;
  nameOrLabel: string;
  farmerId: string;
  animalType: AnimalType;
  breed: string;
  gender: AnimalGender;
  ageYears: number;
  ageMonths: number;
  lactationStage: LactationStage;
  healthStatus: AnimalHealthStatus;
  registeredDate: string;
  lastCheckedDate: string;
  notes?: string;
}

export interface FieldOfficerOption {
  id: string;
  name: string;
  subCluster: string;
  phone: string;
  villages: string[];
  status: 'Active' | 'On Leave';
}

export interface VeterinarianRecord {
  id: string;
  name: string;
  qualification: string;
  specialization: string;
  phone: string;
  clusters: string[];
  availability: 'Available' | 'In Field' | 'Off Duty';
}

export interface VisitObservation {
  id: string;
  animalId: string;
  animalTag: string;
  animalName: string;
  farmerConcern: string;
  observableSymptoms: string;
  appetiteAndYieldNote: string;
  temperatureNote: string;
  recordedAt: string;
  recordedBy: string;
}

export interface FarmVisitRecord {
  visitId: string;
  farmerId: string;
  farmerName: string;
  location: string;
  village: string;
  subCluster: string;
  fieldOfficerId: string;
  fieldOfficer: string;
  scheduledDate: string;
  scheduledTime: string;
  purpose: string;
  status: FarmVisitStatus;
  observations: VisitObservation[];
  completionNotes?: string;
}

export interface MedicationEntry {
  name: string;
  dosage: string;
  duration: string;
}

export interface ConsultationDetails {
  examDate: string;
  vitalNotes: string;
  examFindings: string;
  diagnosis: string;
  treatmentPlan: string;
  medications: MedicationEntry[];
  veterinaryInstructions: string;
  recordedByVet: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  title: string;
  detail: string;
}

export interface VeterinaryCaseRecord {
  caseId: string;
  requestDate: string;
  submittedTime: string;
  farmerId: string;
  farmerName: string;
  village: string;
  animalId: string;
  animalTag: string;
  speciesBreed: string;
  concernSummary: string;
  fieldObservations?: string;
  reportedBy: string;
  reportedByRole: UserRole;
  assignedVetId: string | null;
  assignedVet: string | null;
  priority: 'Routine' | 'Priority' | 'Urgent';
  status: VeterinaryCaseStatus;
  lastUpdated: string;
  consultation?: ConsultationDetails;
  timeline: ActivityEvent[];
}

export interface FollowUpRecord {
  followUpId: string;
  caseId: string;
  farmerId: string;
  farmerName: string;
  animalId: string;
  animalTag: string;
  assignedOfficerId: string;
  assignedPerson: string;
  scheduledByVet: string;
  dueDate: string;
  instructionNote: string;
  officerUpdateNote?: string;
  completedAt?: string;
  status: FollowUpStatus;
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: number;
  description: string;
  iconKey: MetricIconKey;
  tone: 'forest' | 'sage' | 'amber' | 'crimson';
  targetNavId?: string;
}

export interface CaseStatusBreakdownItem {
  status: VeterinaryCaseStatus;
  count: number;
  percentage: number;
  barColorClass: string;
}

export type VeterinaryCaseSummary = VeterinaryCaseRecord;
export type FollowUpSummary = FollowUpRecord;
export type FarmVisitSummary = FarmVisitRecord;

export interface FieldClusterOperation {
  clusterName: string;
  officerName: string;
  completedVisits: number;
  pendingVisits: number;
  totalScheduled: number;
  observationsSubmitted: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  category: 'Case Queue' | 'Follow-up' | 'Field Operations' | 'Registry';
  unread: boolean;
}

export interface NavItemConfig {
  id: string;
  label: string;
  section: string;
  phaseLabel?: string;
  description: string;
  plannedCapabilities: string[];
}
