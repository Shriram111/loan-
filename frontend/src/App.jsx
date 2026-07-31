import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import CustomerDashboard from './pages/dashboard/CustomerDashboard';
import LoanOfficerDashboard from './pages/dashboard/LoanOfficerDashboard';
import LoanAuditorDashboard from './pages/dashboard/LoanAuditorDashboard';
import AdminDashboard from './pages/admin/AdminDashboardPage';
import LoanApplicationsPage from './pages/loan/LoanApplicationsPage';
import CreateLoanPage from './pages/loan/CreateLoanPage';
import LoanDetailPage from './pages/loan/LoanDetailPage';
import DocumentVerificationPage from './pages/verification/DocumentVerificationPage';
import CibilVerificationPage from './pages/verification/CibilVerificationPage';
import EpfVerificationPage from './pages/verification/EpfVerificationPage';
import SalaryVerificationPage from './pages/verification/SalaryVerificationPage';
import DigilockerPage from './pages/verification/DigilockerPage';
import SelfieVerificationPage from './pages/verification/SelfieVerificationPage';
import LiveVideoPage from './pages/verification/LiveVideoPage';
import AuditDashboardPage from './pages/audit/AuditDashboardPage';
import AiNotesPage from './pages/audit/AiNotesPage';
import AuditReportPage from './pages/audit/AuditReportPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import LoanConfigPage from './pages/admin/LoanConfigPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';
import LoanProductsPage from './pages/financial/LoanProductsPage';
import InterestRatesPage from './pages/financial/InterestRatesPage';
import EmiCalculatorPage from './pages/financial/EmiCalculatorPage';
import LoadingSpinner from './components/common/LoadingSpinner';

function RoleDashboard() {
  const { user } = useAuth();
  switch (user?.role) {
    case 'loan_officer': return <LoanOfficerDashboard />;
    case 'loan_auditor': return <LoanAuditorDashboard />;
    case 'admin': return <AdminDashboard />;
    default: return <CustomerDashboard />;
  }
}

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  const { loading } = useAuth();
  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />

      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<RoleDashboard />} />

        <Route path="loans" element={<LoanApplicationsPage />} />
        <Route path="loans/create" element={<CreateLoanPage />} />
        <Route path="loans/:id" element={<LoanDetailPage />} />

        <Route path="verification/documents" element={<DocumentVerificationPage />} />
        <Route path="verification/cibil" element={<CibilVerificationPage />} />
        <Route path="verification/epf" element={<EpfVerificationPage />} />
        <Route path="verification/salary" element={<SalaryVerificationPage />} />
        <Route path="verification/digilocker" element={<DigilockerPage />} />
        <Route path="verification/selfie" element={<SelfieVerificationPage />} />
        <Route path="verification/live-video" element={<LiveVideoPage />} />

        <Route path="audit/dashboard" element={<ProtectedRoute roles={['loan_auditor', 'admin']}><AuditDashboardPage /></ProtectedRoute>} />
        <Route path="audit/ai-notes" element={<ProtectedRoute roles={['loan_auditor', 'admin']}><AiNotesPage /></ProtectedRoute>} />
        <Route path="audit/reports" element={<ProtectedRoute roles={['loan_auditor', 'admin']}><AuditReportPage /></ProtectedRoute>} />

        <Route path="admin/users" element={<ProtectedRoute roles={['admin']}><UserManagementPage /></ProtectedRoute>} />
        <Route path="admin/loan-config" element={<ProtectedRoute roles={['admin']}><LoanConfigPage /></ProtectedRoute>} />
        <Route path="admin/analytics" element={<ProtectedRoute roles={['admin']}><AnalyticsPage /></ProtectedRoute>} />
        <Route path="admin/audit-logs" element={<ProtectedRoute roles={['admin']}><AuditLogsPage /></ProtectedRoute>} />

        <Route path="financial/products" element={<LoanProductsPage />} />
        <Route path="financial/interest-rates" element={<InterestRatesPage />} />
        <Route path="financial/emi-calculator" element={<EmiCalculatorPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
