import { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminService } from '../../services';
import { useFetch } from '../../hooks/useFetch';
import { formatDate } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/StatusBadge';

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);

  const { data, loading } = useFetch(
    () => adminService.getAuditLogs({ page, limit: 20 }),
    [page]
  );

  const logs = data?.data || [];
  const pagination = data?.pagination || {};

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
        <p className="text-sm text-gray-500 mt-1">System activity and audit trail</p>
      </div>

      {loading ? <LoadingSpinner /> : logs.length === 0 ? (
        <div className="card"><EmptyState icon={ClipboardList} title="No audit logs" description="No activity has been recorded yet." /></div>
      ) : (
        <>
          <div className="card overflow-hidden p-0">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">User</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Action</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Entity</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log, idx) => (
                  <motion.tr key={log._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.02 }} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-800">{log.userId?.fullName || 'System'}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-light text-primary-dark">
                        {log.action?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{log.entity || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(log.createdAt)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-sm text-gray-600">Page {page} of {pagination.pages}</span>
              <button onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"><ChevronRight className="w-4 h-4" /></button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
