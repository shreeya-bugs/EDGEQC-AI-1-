import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { InspectionProvider } from './context/InspectionContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { VoiceProvider } from './context/VoiceContext';
import { AppLayout } from './components/layout/AppLayout';
import { Login } from './pages/auth/Login';
import { OperatorOverview } from './pages/operator/OperatorOverview';
import { LiveInspection } from './pages/operator/LiveInspection';
import { InspectionSetup } from './pages/operator/InspectionSetup';
import { InspectionHistory } from './pages/operator/InspectionHistory';
import { SupervisorOverview } from './pages/supervisor/SupervisorOverview';
import { SupervisorQualityIntelligence } from './pages/supervisor/SupervisorQualityIntelligence';
import { SupervisorInspections } from './pages/supervisor/SupervisorInspections';
import { SupervisorAlerts } from './pages/supervisor/SupervisorAlerts';
import { SupervisorAnalytics } from './pages/supervisor/SupervisorAnalytics';
import { SupervisorLinePerformance } from './pages/supervisor/SupervisorLinePerformance';
import { OwnerOverview } from './pages/owner/OwnerOverview';
import { OwnerAnalytics } from './pages/owner/OwnerAnalytics';
import { OwnerQualityIssues } from './pages/owner/OwnerQualityIssues';
import { OwnerReports } from './pages/owner/OwnerReports';
import { OwnerInspectionRecords } from './pages/owner/OwnerInspectionRecords';
import { FactoryHealthDashboard } from './pages/factory/FactoryHealthDashboard';

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <InspectionProvider>
          <BrowserRouter>
            <VoiceProvider>
              <Routes>
                <Route path="/login" element={<Login />} />

                {/* Shared & Factory Health Routes */}
                <Route
                  path="/factory-health"
                  element={
                    <AppLayout>
                      <FactoryHealthDashboard />
                    </AppLayout>
                  }
                />

                {/* Operator Routes */}
                <Route
                  path="/operator"
                  element={
                    <AppLayout>
                      <OperatorOverview />
                    </AppLayout>
                  }
                />
                <Route
                  path="/operator/live"
                  element={
                    <AppLayout>
                      <LiveInspection />
                    </AppLayout>
                  }
                />
                <Route
                  path="/operator/setup"
                  element={
                    <AppLayout>
                      <InspectionSetup />
                    </AppLayout>
                  }
                />
                <Route
                  path="/operator/history"
                  element={
                    <AppLayout>
                      <InspectionHistory />
                    </AppLayout>
                  }
                />

                {/* Supervisor Routes */}
                <Route
                  path="/supervisor"
                  element={
                    <AppLayout>
                      <SupervisorOverview />
                    </AppLayout>
                  }
                />
                <Route
                  path="/supervisor/overview"
                  element={
                    <AppLayout>
                      <SupervisorOverview />
                    </AppLayout>
                  }
                />
                <Route
                  path="/supervisor/intelligence"
                  element={
                    <AppLayout>
                      <SupervisorQualityIntelligence />
                    </AppLayout>
                  }
                />
                <Route
                  path="/supervisor/inspections"
                  element={
                    <AppLayout>
                      <SupervisorInspections />
                    </AppLayout>
                  }
                />
                <Route
                  path="/supervisor/alerts"
                  element={
                    <AppLayout>
                      <SupervisorAlerts />
                    </AppLayout>
                  }
                />
                <Route
                  path="/supervisor/analytics"
                  element={
                    <AppLayout>
                      <SupervisorAnalytics />
                    </AppLayout>
                  }
                />
                <Route
                  path="/supervisor/lines"
                  element={
                    <AppLayout>
                      <SupervisorLinePerformance />
                    </AppLayout>
                  }
                />

                {/* Owner Executive Routes */}
                <Route
                  path="/owner"
                  element={
                    <AppLayout>
                      <OwnerOverview />
                    </AppLayout>
                  }
                />
                <Route
                  path="/owner/overview"
                  element={
                    <AppLayout>
                      <OwnerOverview />
                    </AppLayout>
                  }
                />
                <Route
                  path="/owner/analytics"
                  element={
                    <AppLayout>
                      <OwnerAnalytics />
                    </AppLayout>
                  }
                />
                <Route
                  path="/owner/yield"
                  element={
                    <AppLayout>
                      <OwnerAnalytics />
                    </AppLayout>
                  }
                />
                <Route
                  path="/owner/issues"
                  element={
                    <AppLayout>
                      <OwnerQualityIssues />
                    </AppLayout>
                  }
                />
                <Route
                  path="/owner/reports"
                  element={
                    <AppLayout>
                      <OwnerReports />
                    </AppLayout>
                  }
                />
                <Route
                  path="/owner/records"
                  element={
                    <AppLayout>
                      <OwnerInspectionRecords />
                    </AppLayout>
                  }
                />

                <Route path="/" element={<Navigate to="/operator" replace />} />
                <Route path="*" element={<Navigate to="/operator" replace />} />
              </Routes>
            </VoiceProvider>
          </BrowserRouter>
        </InspectionProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;

