export type Role = 'operator' | 'supervisor' | 'owner';

export interface User {
  id: string;
  name: string;
  role: Role;
  title: string;
  avatar?: string;
  shift?: string;
  machineId?: string;
}

export type DefectType = 'PASS' | 'Misalignment' | 'Smudge' | 'Missing Print' | string;
export type DefectSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface BoundingBox {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
  label: string;
}

export interface RecommendedCheck {
  id: string;
  title: string;
  action: string;
  category: 'mechanical' | 'ink' | 'feed' | 'optical';
}

export interface RecurringAlert {
  id: string;
  title: string;
  message: string;
  occurrences: number;
  timeframe: string;
  skuId: string;
  skuCode: string;
  defectType: DefectType;
  timestamp: string;
  acknowledged: boolean;
}

export interface SKU {
  id: string;
  code: string;
  name: string;
  category: string;
  targetSpeedPpm: number;
  toleranceMm: number;
}

export interface Machine {
  id: string;
  name: string;
  code: string;
  type: string;
  status: 'running' | 'idle' | 'warning' | 'offline';
}

export interface InspectionJob {
  id: string;
  jobId: string;
  sku: SKU;
  machine: Machine;
  shift: string;
  targetQuantity: number;
  inspectedQuantity: number;
  passCount: number;
  failCount: number;
  startTime: string;
  status: 'active' | 'completed' | 'paused';
}

export interface InspectionRecord {
  id: string;
  timestamp: string;
  skuId: string;
  skuCode: string;
  skuName: string;
  jobId: string;
  machineId: string;
  machineName: string;
  shift: string;
  result: 'PASS' | 'FAIL';
  defectType: string;
  confidence: number;
  severity?: DefectSeverity;
  boundingBox?: BoundingBox;
  recommendedChecks?: string[];
  snapshotUrl?: string;
  annotatedImageBase64?: string;
  detections?: any[];
  processingMeta?: {
    opencv: boolean;
    yolo: boolean;
    opencv_preprocess_ms?: number;
    yolo_inference_ms?: number;
    total_pipeline_ms?: number;
    laplacian_variance?: number;
    edge_density?: number;
  };
  acknowledged?: boolean;
}

export interface SessionStats {
  totalInspected: number;
  passCount: number;
  failCount: number;
  passRate: number;
  avgConfidence: number;
}

export type PeriodFilter = 'today' | 'week' | 'month';

export interface PeriodMetrics {
  totalInspected: number;
  passCount: number;
  failCount: number;
  passRate: number;
  defectRate: number;
  activeIssuesCount: number;
  prevPassRate: number;
  prevDefectRate: number;
  prevTotalInspected: number;
  estimatedScrapSavings: number;
}

export interface TopLossSummary {
  mostCommonDefect: {
    name: DefectType;
    count: number;
    percentage: number;
  };
  mostAffectedSKU: {
    skuId: string;
    skuCode: string;
    name: string;
    defectRate: number;
    totalInspected: number;
  };
  mostAffectedMachine: {
    machineId: string;
    name: string;
    defectCount: number;
    percentage: number;
  };
  mostAffectedShift: {
    name: string;
    defectRate: number;
    totalDefects: number;
  };
}

export interface QualityIssue {
  id: string;
  title: string;
  skuId: string;
  skuCode: string;
  skuName: string;
  machineId: string;
  machineName: string;
  occurrences: number;
  timeframe: string;
  period: PeriodFilter;
  defectType: DefectType;
  severity: 'medium' | 'high' | 'critical';
  status: 'active' | 'under_review' | 'resolved';
  estimatedFinancialLoss: number;
  rootCauseHypothesis: string;
  actionTaken: string;
  lastUpdated: string;
}

export interface ReportFilterState {
  period: PeriodFilter | 'all';
  skuId: string;
  machineId: string;
  shift: string;
  dateRange?: string;
}

export interface SupervisorQualityAlert {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  defectType: DefectType;
  skuId: string;
  skuCode: string;
  skuName: string;
  machineId: string;
  machineName: string;
  shift: string;
  occurrencesToday: number;
  percentageChange: number; // e.g. +62%
  alertType: 'recurring' | 'trend_surge' | 'sku_pattern' | 'machine_pattern' | 'shift_pattern';
  recommendedInvestigation: string;
  possibleProcessAreas: string[];
  recommendedChecks: string[];
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

export interface SupervisorFilterState {
  datePeriod: 'today' | 'week' | 'month';
  skuId: string;
  machineId: string;
  shift: string;
  defectType: string;
}

export type SupportedLanguage = 'en' | 'hi' | 'kn' | 'mr';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  walkthroughDefectId?: string;
  flashcardDefectId?: string;
}

export interface WalkthroughStep {
  stepNumber: number;
  title: string;
  description: string;
  targetComponent: string;
  zoomLevel: number;
  highlightCoordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  actionLabel: string;
  interactiveType: 'inspect' | 'tool' | 'replace' | 'verify';
  expectedOutcome: string;
}

export interface WalkthroughGuide {
  defectId: string;
  defectName: string;
  steps: WalkthroughStep[];
}

export interface DefectFlashcardData {
  id: string;
  defectType: DefectType | string;
  title: string;
  severity: DefectSeverity;
  commonCauses: string[];
  recommendedFix: string;
  estimatedRepairTime: string;
  estimatedFinancialLoss: number;
  preventionTips: string[];
  exampleImages: string[];
}

export interface PredictiveAlert {
  id: string;
  machineId: string;
  machineName: string;
  predictedDefectsCount: number;
  timeframeMinutes: number;
  confidencePercentage: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  rootCauseExplanation: string;
  suggestedAction: string;
  timestamp: string;
}

export interface WhatsAppReportPayload {
  recipientPhone: string;
  machineName: string;
  defectCount: number;
  topIssue: string;
  recommendedAction: string;
  estimatedLoss: number;
  alertType: 'critical' | 'hourly' | 'daily';
  timestamp: string;
}

export interface FactoryHealthMetrics {
  healthScore: number;
  activeMachines: number;
  totalMachines: number;
  avgPassRate: number;
  overallThroughputPpm: number;
  predictedDowntimeHours: number;
  defectHeatmap: { machine: string; Pass: number; Misalignment: number; Smudge: number; MissingPrint: number }[];
}



