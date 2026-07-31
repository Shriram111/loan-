import { useAuth } from '../../context/AuthContext';
import { loanService } from '../../services';
import { useFetch } from '../../hooks/useFetch';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate } from '../../utils/helpers';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/StatusBadge';
import { FileText, Clock, CheckCircle, AlertTriangle, Eye, Users, TrendingUp, Briefcase } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function LoanOfficerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: loans, loading } = useFetch(() => loanService.getAll({ limit: 50 }), []);

  const applications = loans?.data || [];
  const total = applications.length;
  const submitted = applications.filter((a) => a.status === 'submitted').length;
  const underReview = applications.filter((a) => a.status === 'under_review').length;
  const approved = applications.filter((a) => a.status === 'approved').length;
  const verificationInProgress = applications.filter((a) => a.status === 'verification_in_progress').length;

  const statusData = [
    { name: 'Submitted', value: submitted, color: '#3B82F6' },
    { name: 'Under Review', value: underReview, color: '#F59E0B' },
    { name: 'Verification', value: verificationInProgress, color: '#8B5CF6' },
    { name: 'Approved', value: approved, color: '#16A34A' },
  ].filter((d) => d.value > 0);

  const recentApps = applications.slice(0, 8);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-primary-pink to-primary-red rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Welcome, {user?.fullName}</h1>
        <p className="text-white/80 text-sm mt-1">Loan Officer Dashboard — Manage and review assigned applications</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Assigned', value: total, icon: FileText, color: 'bg-blue-50 text-blue-600' },
          { label: 'Submitted', value: submitted, icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
          { label: 'Under Review', value: underReview, icon: Eye, color: 'bg-purple-50 text-purple-600' },
          { label: 'Approved', value: approved, icon: CheckCircle, color: 'bg-green-50 text-green-600' },
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
        {/* Chart */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Application Status</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {statusData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-500 text-center py-8">No data</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'Review Submitted Applications', path: '/loans?status=submitted', icon: Eye, color: 'text-blue-600' },
              { label: 'View All Applications', path: '/loans', icon: FileText, color: 'text-primary-pink' },
              { label: 'Verification Hub', path: '/verification/documents', icon: CheckCircle, color: 'text-green-600' },
              { label: 'Loan Products', path: '/financial/products', icon: TrendingUp, color: 'text-purple-600' },
            ].map((action, idx) => (
              <button key={idx} onClick={() => navigate(action.path)} className="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-primary-light transition-colors text-left">
                <action.icon className={`w-5 h-5 ${action.color}`} />
                <span className="text-sm text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pending Actions */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Pending Actions</h3>
          <div className="space-y-3">
            {submitted > 0 && (
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{submitted} applications awaiting review</p>
                  <button onClick={() => navigate('/loans?status=submitted')} className="text-xs text-primary-pink hover:underline">Review now</button>
                </div>
              </div>
            )}
            {verificationInProgress > 0 && (
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                <Clock className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{verificationInProgress} in verification</p>
                  <button onClick={() => navigate('/verification/documents')} className="text-xs text-primary-pink hover:underline">Check status</button>
                </div>
              </div>
            )}
            {submitted === 0 && verificationInProgress === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No pending actions</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Recent Applications</h3>
          <button onClick={() => navigate('/loans')} className="text-sm text-primary-pink hover:underline">View All</button>
        </div>
        {recentApps.length === 0 ? (
          <EmptyState title="No applications" description="No applications have been assigned yet." />
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
                  <span className="text-sm font-medium hidden sm:inline">{formatCurrency(app.loanDetails?.loanAmount)}</span>
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
