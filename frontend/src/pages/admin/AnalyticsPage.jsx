import { motion } from 'framer-motion';
import { BarChart3, PieChart as PieIcon, TrendingUp } from 'lucide-react';
import { adminService } from '../../services';
import { useFetch } from '../../hooks/useFetch';
import { formatCurrency } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function AnalyticsPage() {
  const { data: analytics, loading } = useFetch(() => adminService.getAnalytics(), []);

  if (loading) return <LoadingSpinner />;
  const a = analytics?.data || {};

  const statusData = a.statusDistribution?.map((s) => ({ name: s._id?.replace(/_/g, ' ') || 'Unknown', value: s.count })) || [];
  const loanData = a.loanTypeDistribution?.map((l) => ({ name: l._id || 'Unknown', count: l.count })) || [];
  const COLORS = ['#E91E63', '#E53935', '#FCE4EC', '#AD1457', '#FF8A80', '#F48FB1'];

  const approvalRate = a.totalApplications > 0 ? Math.round(((a.approvedApplications || 0) / a.totalApplications) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">System-wide analytics and insights</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Applications', value: a.totalApplications || 0 },
          { label: 'Approval Rate', value: `${approvalRate}%` },
          { label: 'Avg CIBIL Score', value: Math.round(a.averageCibilScore || 0) },
          { label: 'Avg Audit Score', value: `${Math.round(a.averageAuditScore || 0)}%` },
        ].map((s, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="card text-center">
            <p className="text-2xl font-bold text-primary-pink">{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {statusData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Loan Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={loanData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#E91E63" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Application Metrics</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Approved', value: a.approvedApplications || 0, color: 'text-green-600' },
            { label: 'Rejected', value: a.rejectedApplications || 0, color: 'text-red-600' },
            { label: 'Pending', value: a.pendingApplications || 0, color: 'text-yellow-600' },
            { label: 'Total Loan Value', value: formatCurrency(a.totalLoanValue), color: 'text-primary-pink' },
          ].map((m, idx) => (
            <div key={idx} className="text-center p-4 bg-gray-50 rounded-xl">
              <p className={`text-xl font-bold ${m.color}`}>{m.value}</p>
              <p className="text-xs text-gray-500 mt-1">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
