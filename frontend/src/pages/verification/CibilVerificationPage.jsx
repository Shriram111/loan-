import { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { verificationService, loanService } from '../../services';
import { useFetch } from '../../hooks/useFetch';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function CibilVerificationPage() {
  const [selectedApp, setSelectedApp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);

  const { data: loans } = useFetch(() => loanService.getAll({ limit: 50 }), []);
  const applications = loans?.data || [];

  const handleVerify = async () => {
    if (!selectedApp) return alert('Select an application');
    setVerifying(true);
    try {
      const { data } = await verificationService.verifyCibil({ applicationId: selectedApp });
      setResult(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setVerifying(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 750) return 'text-green-600';
    if (score >= 650) return 'text-blue-600';
    if (score >= 550) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score) => {
    if (score >= 750) return 'from-green-400 to-green-600';
    if (score >= 650) return 'from-blue-400 to-blue-600';
    if (score >= 550) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">CIBIL Verification</h1>
        <p className="text-sm text-gray-500 mt-1">Verify applicant credit score and history</p>
        <p className="text-xs text-amber-600 mt-1 bg-amber-50 p-2 rounded-lg">CIBIL information shown is simulated for demonstration and testing only.</p>
      </div>

      <div className="card">
        <label className="label">Select Application</label>
        <div className="flex gap-3">
          <select value={selectedApp} onChange={(e) => setSelectedApp(e.target.value)} className="input-field flex-1">
            <option value="">Choose an application...</option>
            {applications.map((app) => (
              <option key={app._id} value={app._id}>{app.applicationId} - {app.personalDetails?.fullName || app.userId?.fullName}</option>
            ))}
          </select>
          <button onClick={handleVerify} disabled={!selectedApp || verifying} className="btn-primary">
            {verifying ? 'Verifying...' : 'Run CIBIL Check'}
          </button>
        </div>
      </div>

      {verifying && <LoadingSpinner />}

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Score Gauge */}
          <div className="card text-center">
            <div className="relative inline-block">
              <div className={`w-40 h-40 rounded-full bg-gradient-to-br ${getScoreGradient(result.score)} flex items-center justify-center mx-auto`}>
                <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center">
                  <div>
                    <p className={`text-3xl font-bold ${getScoreColor(result.score)}`}>{result.score}</p>
                    <p className="text-xs text-gray-500">CIBIL Score</p>
                  </div>
                </div>
              </div>
            </div>
            <p className={`text-lg font-semibold mt-4 ${getScoreColor(result.score)}`}>{result.category}</p>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Credit History', value: result.creditHistory, icon: CreditCard },
              { label: 'Active Loans', value: result.totalActiveLoans, icon: TrendingUp },
              { label: 'Outstanding', value: `₹${result.totalOutstanding?.toLocaleString()}`, icon: AlertTriangle },
              { label: 'Credit Utilisation', value: `${result.creditUtilisation}%`, icon: CheckCircle },
            ].map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="card">
                <item.icon className="w-5 h-5 text-primary-pink mb-2" />
                <p className="text-xs text-gray-500">{item.label}</p>
                <p className="text-lg font-semibold text-gray-800">{item.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-2">Payment History</h3>
            <p className="text-sm text-gray-600">{result.paymentHistory}</p>
            <p className="text-sm text-gray-600 mt-2">Recent Credit Enquiries: {result.recentEnquiries}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
