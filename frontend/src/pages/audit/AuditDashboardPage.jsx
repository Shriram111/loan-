import { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, BarChart3, CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import { auditService, loanService } from '../../services';
import { useFetch } from '../../hooks/useFetch';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AuditDashboardPage() {
  const { data: dashboard, loading } = useFetch(() => auditService.getDashboard(), []);
  const { data: loans } = useFetch(() => loanService.getAll({ limit: 20 }), []);

  const stats = dashboard?.data || {};
  const applications = loans?.data || [];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of loan audit activities</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Applications', value: stats.total, icon: BarChart3, color: 'bg-blue-50 text-blue-600' },
          { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'bg-yellow-50 text-yellow-600' },
          { label: 'In Audit', value: stats.inAudit, icon: AlertTriangle, color: 'bg-purple-50 text-purple-600' },
          { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'bg-green-50 text-green-600' },
          { label: 'Rejected', value: stats.rejected, icon: Clock, color: 'bg-red-50 text-red-600' },
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

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Applications</h2>
        <div className="space-y-2">
          {applications.map((app, idx) => (
            <motion.div key={app._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-primary-pink font-medium">{app.applicationId}</span>
                <span className="text-sm text-gray-700">{app.personalDetails?.fullName || app.userId?.fullName}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{app.loanDetails?.loanType}</span>
                <StatusBadge status={app.status} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
