import { motion } from 'framer-motion';
import { Users, FileText, CheckCircle, XCircle, Clock, TrendingUp, BarChart3 } from 'lucide-react';
import { adminService } from '../../services';
import { useFetch } from '../../hooks/useFetch';
import { formatCurrency } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboardPage() {
  const { data: analytics, loading } = useFetch(() => adminService.getAnalytics(), []);

  if (loading) return <LoadingSpinner />;
  const a = analytics?.data || {};

  const statusData = a.statusDistribution?.map((s) => ({ name: s._id?.replace(/_/g, ' ') || 'Unknown', value: s.count })) || [];
  const loanData = a.loanTypeDistribution?.map((l) => ({ name: l._id || 'Unknown', count: l.count })) || [];
  const COLORS = ['#E91E63', '#E53935', '#FCE4EC', '#AD1457', '#FF8A80', '#F48FB1'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">System overview and analytics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: a.totalUsers, icon: Users, color: 'bg-blue-50 text-blue-600' },
          { label: 'Total Applications', value: a.totalApplications, icon: FileText, color: 'bg-purple-50 text-purple-600' },
          { label: 'Approved', value: a.approvedApplications, icon: CheckCircle, color: 'bg-green-50 text-green-600' },
          { label: 'Rejected', value: a.rejectedApplications, icon: XCircle, color: 'bg-red-50 text-red-600' },
        ].map((stat, idx) => (
          <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="card">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value || 0}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card">
          <p className="text-sm text-gray-500">Pending Applications</p>
          <p className="text-2xl font-bold text-yellow-600">{a.pendingApplications || 0}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Avg CIBIL Score</p>
          <p className="text-2xl font-bold text-primary-pink">{Math.round(a.averageCibilScore || 0)}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-500">Total Loan Value</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(a.totalLoanValue)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Status Distribution</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {statusData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-gray-500 text-center py-8">No data</p>}
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Loan Type Distribution</h3>
          {loanData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={loanData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#E91E63" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-gray-500 text-center py-8">No data</p>}
        </div>
      </div>
    </div>
  );
}
