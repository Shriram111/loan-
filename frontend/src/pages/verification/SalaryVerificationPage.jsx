import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, CheckCircle, AlertTriangle } from 'lucide-react';
import { verificationService, loanService } from '../../services';
import { useFetch } from '../../hooks/useFetch';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function SalaryVerificationPage() {
  const [selectedApp, setSelectedApp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);

  const { data: loans } = useFetch(() => loanService.getAll({ limit: 50 }), []);
  const applications = loans?.data || [];

  const handleVerify = async () => {
    if (!selectedApp) return alert('Select an application');
    setVerifying(true);
    try {
      const { data } = await verificationService.verifySalary({ applicationId: selectedApp });
      setResult(data.data);
    } catch (err) { console.error(err); } finally { setVerifying(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Salary Slip AI Verification</h1>
        <p className="text-sm text-gray-500 mt-1">AI-powered salary slip analysis and verification</p>
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
            {verifying ? 'Analyzing...' : 'Run AI Analysis'}
          </button>
        </div>
      </div>

      {verifying && <LoadingSpinner />}

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* AI Score */}
          <div className="card text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-pink to-primary-red flex items-center justify-center mx-auto">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center">
                <div>
                  <p className="text-2xl font-bold text-primary-pink">{result.aiConfidenceScore}%</p>
                  <p className="text-[10px] text-gray-500">AI Score</p>
                </div>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-800 mt-3">Salary Slip Verification Score</p>
          </div>

          {/* Salary Breakdown */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-3">Salary Breakdown</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'Basic Salary', value: `₹${result.basic?.toLocaleString()}` },
                { label: 'HRA', value: `₹${result.hra?.toLocaleString()}` },
                { label: 'Allowances', value: `₹${result.allowances?.toLocaleString()}` },
                { label: 'Gross Salary', value: `₹${result.gross?.toLocaleString()}` },
                { label: 'Deductions', value: `₹${result.deductions?.toLocaleString()}` },
                { label: 'Net Salary', value: `₹${result.net?.toLocaleString()}` },
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-800">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Checks */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-3">AI Verification Checks</h3>
            <div className="space-y-2">
              {Object.entries(result.checks || {}).map(([key, passed]) => (
                <div key={key} className="flex items-center gap-2 p-2">
                  {passed ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                  <span className="text-sm text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
