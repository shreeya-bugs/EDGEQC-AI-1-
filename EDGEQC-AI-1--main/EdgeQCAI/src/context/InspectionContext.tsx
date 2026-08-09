import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiUrl } from '../lib/api';
import type {
  User,
  Role,
  InspectionJob,
  InspectionRecord,
  RecurringAlert,
  DefectType,
  SessionStats,
  PeriodFilter,
  PeriodMetrics,
  TopLossSummary,
  QualityIssue,
  SupervisorQualityAlert,
  SupervisorFilterState,
} from '../types';
import {
  MOCK_USERS,
  MOCK_JOBS,
  INITIAL_INSPECTION_HISTORY,
  INITIAL_RECURRING_ALERTS,
  MOCK_DEFECT_TEMPLATES,
  RECOMMENDED_CHECKS_MAP,
  MOCK_PERIOD_METRICS,
  MOCK_TOP_LOSSES,
  MOCK_QUALITY_ISSUES,
  MOCK_SUPERVISOR_ALERTS,
} from '../data/mockData';

interface InspectionContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  role: Role;
  setRole: (role: Role) => void;
  activeJob: InspectionJob;
  setActiveJob: (job: InspectionJob) => void;
  sessionStats: SessionStats;
  inspectionHistory: InspectionRecord[];
  recurringAlerts: RecurringAlert[];
  currentMockState: DefectType;
  setCurrentMockState: (state: DefectType) => void;
  currentLiveResult: InspectionRecord;
  acknowledgeAlert: (alertId: string) => void;
  acknowledgeRecord: (recordId: string) => void;
  triggerNextInspection: (overrideState?: DefectType) => InspectionRecord;
  isAutoInspectionActive: boolean;
  setIsAutoInspectionActive: (active: boolean) => void;
  cameraStatus: 'connected' | 'reconnecting' | 'disconnected';
  aiEngineStatus: 'ready' | 'loading' | 'error';
  selectedHistoryRecord: InspectionRecord | null;
  setSelectedHistoryRecord: (record: InspectionRecord | null) => void;
  periodFilter: PeriodFilter;
  setPeriodFilter: (period: PeriodFilter) => void;
  getPeriodMetrics: (period?: PeriodFilter) => PeriodMetrics;
  getTopLosses: (period?: PeriodFilter) => TopLossSummary;
  qualityIssues: QualityIssue[];
  setQualityIssues: React.Dispatch<React.SetStateAction<QualityIssue[]>>;
  supervisorAlerts: SupervisorQualityAlert[];
  setSupervisorAlerts: React.Dispatch<React.SetStateAction<SupervisorQualityAlert[]>>;
  supervisorFilterState: SupervisorFilterState;
  setSupervisorFilterState: React.Dispatch<React.SetStateAction<SupervisorFilterState>>;
  datasetSamples: any[];
  isAnalyzing: boolean;
  inspectUploadedImage: (file: File) => Promise<InspectionRecord>;
  inspectBase64Image: (dataUrl: string, filename?: string) => Promise<InspectionRecord>;
}

const InspectionContext = createContext<InspectionContextType | undefined>(undefined);

export const InspectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [activeJob, setActiveJob] = useState<InspectionJob>(MOCK_JOBS[0]);
  const [inspectionHistory, setInspectionHistory] = useState<InspectionRecord[]>(INITIAL_INSPECTION_HISTORY);
  const [recurringAlerts, setRecurringAlerts] = useState<RecurringAlert[]>(INITIAL_RECURRING_ALERTS);
  const [currentMockState, setCurrentMockState] = useState<DefectType>('PASS');
  const [isAutoInspectionActive, setIsAutoInspectionActive] = useState<boolean>(false);
  const [cameraStatus] = useState<'connected' | 'reconnecting' | 'disconnected'>('connected');
  const [aiEngineStatus] = useState<'ready' | 'loading' | 'error'>('ready');
  const [selectedHistoryRecord, setSelectedHistoryRecord] = useState<InspectionRecord | null>(null);
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>('week');
  const [qualityIssues, setQualityIssues] = useState<QualityIssue[]>(MOCK_QUALITY_ISSUES);
  const [supervisorAlerts, setSupervisorAlerts] = useState<SupervisorQualityAlert[]>(MOCK_SUPERVISOR_ALERTS);
  const [supervisorFilterState, setSupervisorFilterState] = useState<SupervisorFilterState>({
    datePeriod: 'today',
    skuId: 'all',
    machineId: 'all',
    shift: 'all',
    defectType: 'all',
  });

  const getPeriodMetrics = (period: PeriodFilter = periodFilter): PeriodMetrics => {
    return MOCK_PERIOD_METRICS[period];
  };

  const getTopLosses = (period: PeriodFilter = periodFilter): TopLossSummary => {
    return MOCK_TOP_LOSSES[period];
  };


  const buildLiveRecord = (state: DefectType): InspectionRecord => {
    const template = MOCK_DEFECT_TEMPLATES[state];
    const isPass = state === 'PASS';
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    return {
      id: `INSP-${Date.now().toString().slice(-6)}`,
      timestamp,
      skuId: activeJob.sku.id,
      skuCode: activeJob.sku.code,
      skuName: activeJob.sku.name,
      jobId: activeJob.jobId,
      machineId: activeJob.machine.id,
      machineName: activeJob.machine.name,
      shift: activeJob.shift,
      result: isPass ? 'PASS' : 'FAIL',
      defectType: state,
      confidence: template.confidence,
      severity: template.severity,
      boundingBox: template.boundingBox,
      recommendedChecks: RECOMMENDED_CHECKS_MAP[state],
      snapshotUrl: '',
      acknowledged: false,
    };
  };

  const [currentLiveResult, setCurrentLiveResult] = useState<InspectionRecord>(
    buildLiveRecord('PASS')
  );

  useEffect(() => {
    if (!currentLiveResult?.annotatedImageBase64) {
      setCurrentLiveResult(buildLiveRecord(currentMockState));
    }
  }, [currentMockState, activeJob]);

  const setRole = (newRole: Role) => {
    const targetUser = MOCK_USERS.find((u) => u.role === newRole) || MOCK_USERS[0];
    setCurrentUser(targetUser);
  };

  const totalInspected = inspectionHistory.length;
  const passCount = inspectionHistory.filter((r) => r.result === 'PASS').length;
  const failCount = totalInspected - passCount;
  const passRate = totalInspected > 0 ? parseFloat(((passCount / totalInspected) * 100).toFixed(1)) : 100;
  const avgConfidence =
    totalInspected > 0
      ? parseFloat(
          (
            inspectionHistory.reduce((acc, r) => acc + r.confidence, 0) / totalInspected
          ).toFixed(3)
        )
      : 0.99;

  const sessionStats: SessionStats = {
    totalInspected,
    passCount,
    failCount,
    passRate,
    avgConfidence,
  };

  const triggerNextInspection = (overrideState?: DefectType): InspectionRecord => {
    const stateToUse = overrideState || currentMockState;
    const newRecord = buildLiveRecord(stateToUse);

    setInspectionHistory((prev) => [newRecord, ...prev]);
    setCurrentLiveResult(newRecord);

    setActiveJob((prev) => ({
      ...prev,
      inspectedQuantity: prev.inspectedQuantity + 1,
      passCount: newRecord.result === 'PASS' ? prev.passCount + 1 : prev.passCount,
      failCount: newRecord.result === 'FAIL' ? prev.failCount + 1 : prev.failCount,
    }));

    if (newRecord.result === 'FAIL' && newRecord.defectType === 'Misalignment') {
      const misalignmentCount = inspectionHistory.filter(
        (r) => r.result === 'FAIL' && r.defectType === 'Misalignment'
      ).length + 1;

      setRecurringAlerts((prev) => {
        const existingAlertIndex = prev.findIndex((a) => a.defectType === 'Misalignment');
        if (existingAlertIndex >= 0) {
          const updated = [...prev];
          updated[existingAlertIndex] = {
            ...updated[existingAlertIndex],
            occurrences: misalignmentCount,
            message: `Misalignment has occurred ${misalignmentCount} times on this SKU today.`,
            timestamp: newRecord.timestamp,
            acknowledged: false,
          };
          return updated;
        } else {
          return [
            {
              id: `rec-${Date.now()}`,
              title: 'Recurring Pattern Detected',
              message: `Misalignment has occurred ${misalignmentCount} times on this SKU today.`,
              occurrences: misalignmentCount,
              timeframe: 'Today',
              skuId: activeJob.sku.id,
              skuCode: activeJob.sku.code,
              defectType: 'Misalignment',
              timestamp: newRecord.timestamp,
              acknowledged: false,
            },
            ...prev,
          ];
        }
      });
    }

    return newRecord;
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isAutoInspectionActive) {
      interval = setInterval(() => {
        const states: DefectType[] = ['PASS', 'PASS', 'PASS', 'Misalignment', 'Smudge', 'PASS', 'Missing Print'];
        const randomState = states[Math.floor(Math.random() * states.length)];
        setCurrentMockState(randomState);
        triggerNextInspection(randomState);
      }, 3500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isAutoInspectionActive, inspectionHistory]);

  const [datasetSamples, setDatasetSamples] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  useEffect(() => {
    fetch(apiUrl('/api/dataset-samples'))
      .then((res) => res.json())
      .then((data) => {
        if (data && data.samples) {
          setDatasetSamples(data.samples);
        }
      })
      .catch((err) => console.log('Could not load dataset samples from backend:', err));
  }, []);

  const processBackendResult = (data: any, _defaultFilename: string): InspectionRecord => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const isPass = data.status === 'PASS';

    let bBox = undefined;
    if (data.detections && data.detections.length > 0 && data.detections[0].normalized_bbox) {
      const nb = data.detections[0].normalized_bbox;
      bBox = {
        x: nb.x,
        y: nb.y,
        width: nb.width,
        height: nb.height,
        label: data.detections[0].class,
      };
    }

    const newRecord: InspectionRecord = {
      id: `CV-${Date.now().toString().slice(-6)}`,
      timestamp,
      skuId: activeJob.sku.id,
      skuCode: activeJob.sku.code,
      skuName: activeJob.sku.name,
      jobId: activeJob.jobId,
      machineId: activeJob.machine.id,
      machineName: activeJob.machine.name,
      shift: activeJob.shift,
      result: isPass ? 'PASS' : 'FAIL',
      defectType: data.defectType || (isPass ? 'PASS' : 'Defect Detected'),
      confidence: data.confidence || 0.88,
      severity: data.severity || (isPass ? 'NONE' : 'HIGH'),
      boundingBox: bBox,
      recommendedChecks: data.recommendedChecks || (isPass ? ['Standard inspection clean.'] : ['Verify alignment and optical lens']),
      snapshotUrl: data.annotatedImageBase64 || '',
      annotatedImageBase64: data.annotatedImageBase64 || '',
      detections: data.detections || [],
      processingMeta: data.processing || { opencv: true, yolo: true },
      acknowledged: false,
    };

    setInspectionHistory((prev) => [newRecord, ...prev]);
    setCurrentLiveResult(newRecord);
    setActiveJob((prev) => ({
      ...prev,
      inspectedQuantity: prev.inspectedQuantity + 1,
      passCount: isPass ? prev.passCount + 1 : prev.passCount,
      failCount: isPass ? prev.failCount : prev.failCount + 1,
    }));

    return newRecord;
  };

  const inspectUploadedImage = async (file: File): Promise<InspectionRecord> => {
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(apiUrl('/api/inspect'), {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      return processBackendResult(data, file.name);
    } catch (error) {
      console.error('Error during image inspection:', error);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const inspectBase64Image = async (dataUrl: string, filename: string = 'sample.jpg'): Promise<InspectionRecord> => {
    setIsAnalyzing(true);
    try {
      const response = await fetch(apiUrl('/api/inspect/base64'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_base64: dataUrl, filename }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      return processBackendResult(data, filename);
    } catch (error) {
      console.error('Error during base64 image inspection:', error);
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setRecurringAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
  };

  const acknowledgeRecord = (recordId: string) => {
    setInspectionHistory((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, acknowledged: true } : r))
    );
  };

  return (
    <InspectionContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        role: currentUser.role,
        setRole,
        activeJob,
        setActiveJob,
        sessionStats,
        inspectionHistory,
        recurringAlerts,
        currentMockState,
        setCurrentMockState,
        currentLiveResult,
        acknowledgeAlert,
        acknowledgeRecord,
        triggerNextInspection,
        isAutoInspectionActive,
        setIsAutoInspectionActive,
        cameraStatus,
        aiEngineStatus,
        selectedHistoryRecord,
        setSelectedHistoryRecord,
        periodFilter,
        setPeriodFilter,
        getPeriodMetrics,
        getTopLosses,
        qualityIssues,
        setQualityIssues,
        supervisorAlerts,
        setSupervisorAlerts,
        supervisorFilterState,
        setSupervisorFilterState,
        datasetSamples,
        isAnalyzing,
        inspectUploadedImage,
        inspectBase64Image,
      }}
    >
      {children}
    </InspectionContext.Provider>
  );
};

export const useInspection = () => {
  const context = useContext(InspectionContext);
  if (!context) {
    throw new Error('useInspection must be used within an InspectionProvider');
  }
  return context;
};

