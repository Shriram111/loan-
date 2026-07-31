import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Edit, ChevronLeft, ChevronRight } from 'lucide-react';
import { adminService } from '../../services';
import { useFetch } from '../../hooks/useFetch';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/StatusBadge';

export default function UserManagementPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);

  const { data, loading, refetch } = useFetch(
    () => adminService.getUsers({ search, role: roleFilter, page, limit: 10 }),
    [search, roleFilter, page]
  );

  const users = data?.data || [];
  const pagination = data?.pagination || {};

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await adminService.updateUser(userId, { role: newRole });
      refetch();
      setEditingUser(null);
    } catch (err) { console.error(err); }
  };

  const roleColors = {
    customer: 'bg-blue-100 text-blue-700',
    loan_officer: 'bg-purple-100 text-purple-700',
    loan_auditor: 'bg-green-100 text-green-700',
    admin: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-sm text-gray-500 mt-1">Manage all system users</p>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search users..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="input-field pl-10" />
          </div>
          <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }} className="input-field w-full sm:w-48">
            <option value="">All Roles</option>
            <option value="customer">Customer</option>
            <option value="loan_officer">Loan Officer</option>
            <option value="loan_auditor">Loan Auditor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : users.length === 0 ? (
        <div className="card"><EmptyState icon={Users} title="No users found" /></div>
      ) : (
        <>
          <div className="card overflow-hidden p-0">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Mobile</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user, idx) => (
                  <motion.tr key={user._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{user.fullName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.mobile}</td>
                    <td className="px-6 py-4">
                      {editingUser === user._id ? (
                        <select defaultValue={user.role} onChange={(e) => handleUpdateRole(user._id, e.target.value)} className="input-field text-xs py-1">
                          <option value="customer">Customer</option>
                          <option value="loan_officer">Loan Officer</option>
                          <option value="loan_auditor">Loan Auditor</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${roleColors[user.role] || 'bg-gray-100 text-gray-600'}`}>
                          {user.role?.replace('_', ' ')}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => setEditingUser(editingUser === user._id ? null : user._id)} className="p-1.5 rounded-lg hover:bg-primary-light text-gray-500 hover:text-primary-pink">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
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
