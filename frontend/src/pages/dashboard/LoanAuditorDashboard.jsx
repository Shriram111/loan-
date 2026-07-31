import { useAuth } from '../../context/AuthContext';
import { loanService, auditService } from '../../services';
import { useFetch } from '../../hooks/useFetch';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/helpers';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/StatusBadge';
import { Shield, Clock, CheckCircle, XCircle, AlertTriangle, Brain, ClipboardCheck, FileText, TrendingUp, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function LoanAuditorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: loans, loading: loansLoading } = useFetch(() => loanService.getAll({ limit: 50 }), []);
  const { data: dashData, loading: dashLoading } = useFetch(() => auditService.getDashboard(), []);

  const applications = loans?.data || [];
  const stats = dashData?.data || {};

  const total = applications.length;
  const pendingReview = applications.filter((a) => ['submitted', 'under_review', 'verification_in_progress'].includes(a.status)).length;
  const inAudit = applications.filter((a) => a.status === 'audit_in_progress').length;
  const approved = applications.filter((a) => ['approved', 'conditionally_approved'].includes(a.status)).length;
  const rejected = applications.filter((a) => a.status === 'rejected').length;
  const withScore = applications.filter((a) => a.auditScore > 0);
  const avgScore = withScore.length > 0 ? Math.round(withScore.reduce((s, a) => s + a.auditScore, 0) / withScore.length) : 0;

  const statusData = [
    { name: 'Pending', value: pendingReview, color: '#F59E0B' },
    { name: 'In Audit', value: inAudit, color: '#8B5CF6' },
    { name: 'Approved', value: approved, color: '#16A34A' },
    { name: 'Rejected', value: rejected, color: '#DC2626' },
  ].filter((d) => d.value > 0);

  const riskData = [
    { name: 'Low', count: applications.filter((a) => a.riskLevel === 'low').length },
    { name: 'Medium', count: applications.filter((a) => a.riskLevel === 'medium').length },
    { name: 'High', count: applications.filter((a) => a.riskLevel === 'high').length },
    { name: 'Critical', count: applications.filter((a) => a.riskLevel === 'critical').length },
  ];

  const recentApps = applications.slice(0, 6);

  if (loansLoading || dashLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Audit Dashboard</h1>
        <p className="text-white/80 text-sm mt-1">Welcome, {user?.fullName} — Review, verify, and audit loan applications</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Applications', value: total, icon: FileText, color: 'bg-blue-50 text-blue-600' },
          { label: 'Pending Review', value: pendingReview, icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
          { label: 'In Audit', value: inAudit, icon: Shield, color: 'bg-purple-50 text-purple-600' },
          { label: 'Approved', value: approved, icon: CheckCircle, color: 'bg-green-50 text-green-600' },
          { label: 'Avg Audit Score', value: `${avgScore}%`, icon: BarChart3, color: 'bg-pink-50 text-pink-600' },
        ].map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="card">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Pie Chart */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Status Distribution</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {statusData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">No data</p>
          )}
        </div>

        {/* Risk Distribution */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Risk Distribution</h3>
          {riskData.some((d) => d.count > 0) ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={riskData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {riskData.map((entry, idx) => <Cell key={idx} fill={['#16A34A', '#F59E0B', '#DC2626', '#7F1D1D'][idx]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">No audit data yet</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'Review Applications', path: '/loans', icon: Eye, color: 'text-blue-600' },
              { label: 'CIBIL Verification', path: '/verification/cibil', icon: Shield, color: 'text-green-600' },
              { label: 'EPF Verification', path: '/verification/epf', icon: TrendingUp, color: 'text-purple-600' },
              { label: 'Salary Verification', path: '/verification/salary', icon: ClipboardCheck, color: 'text-yellow-600' },
              { label: 'AI Notes', path: '/audit/ai-notes', icon: Brain, color: 'text-pink-600' },
              { label: 'Audit Reports', path: '/audit/reports', icon: FileText, color: 'text-indigo-600' },
            ].map((action, idx) => (
              <button key={idx} onClick={() => navigate(action.path)} className="w-full flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl hover:bg-primary-light transition-colors text-left">
                <action.icon className={`w-4 h-4 ${action.color}`} />
                <span className="text-sm text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Recent Applications for Audit</h3>
          <button onClick={() => navigate('/loans')} className="text-sm text-primary-pink hover:underline">View All</button>
        </div>
        {recentApps.length === 0 ? (
          <EmptyState title="No applications" description="No applications to audit yet." />
        ) : (
          <div className="space-y-2">
            {recentApps.map((app, idx) => (
              <motion.div key={app._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}
                onClick={() => navigate(`/loans/${app._id}`)}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-primary-pink font-medium">{app.applicationId}</span>
                  <span className="text-sm text-gray-700">{app.personalDetails?.fullName || app.userId?.fullName}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 hidden sm:inline">{app.loanDetails?.loanType}</span>
                  <span className="text-sm font-medium hidden md:inline">{formatCurrency(app.loanDetails?.loanAmount)}</span>
                  {app.auditScore > 0 && (
                    <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{app.auditScore}%</span>
                  )}
                  <StatusBadge status={app.status} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Eye(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
