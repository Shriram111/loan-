import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Eye, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { loanService } from '../../services';
import { useFetch } from '../../hooks/useFetch';
import { formatDate, formatCurrency } from '../../utils/helpers';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/StatusBadge';

export default function LoanApplicationsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, loading, refetch } = useFetch(
    () => loanService.getAll({ search, status: statusFilter, page, limit: 10 }),
    [search, statusFilter, page]
  );

  const applications = data?.data || [];
  const pagination = data?.pagination || {};

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'submitted', label: 'Submitted' },
    { value: 'under_review', label: 'Under Review' },
    { value: 'verification_in_progress', label: 'Verification In Progress' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'on_hold', label: 'On Hold' },
  ];

  if (loading && applications.length === 0) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Loan Applications</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track all loan applications</p>
        </div>
        {user?.role === 'customer' && (
          <Link to="/loans/create" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Application
          </Link>
        )}
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID or name..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-field pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="input-field w-full sm:w-48"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={FileText}
            title="No applications found"
            description="No loan applications match your criteria."
          />
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block card overflow-hidden p-0">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Application ID</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Applicant</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Loan Type</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {applications.map((app, idx) => (
                  <motion.tr
                    key={app._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/loans/${app._id}`)}
                  >
                    <td className="px-6 py-4 text-sm font-mono text-primary-pink font-medium">{app.applicationId}</td>
                    <td className="px-6 py-4 text-sm text-gray-800">{app.personalDetails?.fullName || app.userId?.fullName || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{app.loanDetails?.loanType || '-'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{formatCurrency(app.loanDetails?.loanAmount)}</td>
                    <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(app.createdAt)}</td>
                    <td className="px-6 py-4">
                      <button className="p-1.5 rounded-lg hover:bg-primary-light text-gray-500 hover:text-primary-pink">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {applications.map((app, idx) => (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="card cursor-pointer"
                onClick={() => navigate(`/loans/${app._id}`)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-sm text-primary-pink font-medium">{app.applicationId}</p>
                    <p className="text-sm text-gray-800 mt-1">{app.personalDetails?.fullName || app.userId?.fullName}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">{app.loanDetails?.loanType}</span>
                  <span className="text-sm font-semibold">{formatCurrency(app.loanDetails?.loanAmount)}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600">Page {page} of {pagination.pages}</span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
