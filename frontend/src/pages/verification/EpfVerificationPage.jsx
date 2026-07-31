import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Building2, Calendar, Wallet } from 'lucide-react';
import { verificationService, loanService } from '../../services';
import { useFetch } from '../../hooks/useFetch';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import StatusBadge from '../../components/common/StatusBadge';

export default function EpfVerificationPage() {
  const [selectedApp, setSelectedApp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);

  const { data: loans } = useFetch(() => loanService.getAll({ limit: 50 }), []);
  const applications = loans?.data || [];

  const handleVerify = async () => {
    if (!selectedApp) return alert('Select an application');
    setVerifying(true);
    try {
      const { data } = await verificationService.verifyEpf({ applicationId: selectedApp });
      setResult(data.data);
    } catch (err) { console.error(err); } finally { setVerifying(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">EPF Verification</h1>
        <p className="text-sm text-gray-500 mt-1">Verify Employee Provident Fund details</p>
        <p className="text-xs text-amber-600 mt-1 bg-amber-50 p-2 rounded-lg">EPF data shown is simulated for demonstration only.</p>
      </div>

      <div className="card">
        <label className="label">Select Application</label>
        <div className="flex gap-3">
          <select value={selectedApp} onChange={(e) => setSelectedApp(e.target.value)} className="input-field flex-1">
            <option value="">Choose an application...</option>
            {applications.map((app) => (
              <option key={app._id} value={app._id}>{app.applicationId} - {app.personalDetails?.fullName}</option>
            ))}
          </select>
          <button onClick={handleVerify} disabled={!selectedApp || verifying} className="btn-primary">
            {verifying ? 'Verifying...' : 'Run EPF Check'}
          </button>
        </div>
      </div>

      {verifying && <LoadingSpinner />}

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'UAN Number', value: result.uan, icon: Briefcase },
              { label: 'Employment Status', value: result.employmentStatus, icon: Building2 },
              { label: 'Monthly Contribution', value: `₹${result.monthlyContribution?.toLocaleString()}`, icon: Wallet },
              { label: 'Total EPF Balance', value: `₹${result.totalBalance?.toLocaleString()}`, icon: Wallet },
            ].map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="card">
                <item.icon className="w-5 h-5 text-primary-pink mb-2" />
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="text-sm font-semibold text-gray-800">{item.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-3">Employment History</h3>
            <div className="space-y-3">
              {result.employmentHistory?.map((job, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-primary-pink" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{job.employer}</p>
                    <p className="text-xs text-gray-500">{job.from} - {job.to}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <p className="text-sm text-gray-600"><strong>Employer:</strong> {result.employerName}</p>
            <p className="text-sm text-gray-600 mt-1"><strong>Last Contribution:</strong> {result.lastContributionDate}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
