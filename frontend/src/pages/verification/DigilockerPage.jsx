import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckCircle, ArrowRight, Lock } from 'lucide-react';
import { verificationService, loanService } from '../../services';
import { useFetch } from '../../hooks/useFetch';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function DigilockerPage() {
  const [selectedApp, setSelectedApp] = useState('');
  const [step, setStep] = useState('select');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);

  const { data: loans } = useFetch(() => loanService.getAll({ limit: 50 }), []);
  const applications = loans?.data || [];

  const startVerification = () => {
    if (!selectedApp) return alert('Select an application');
    setStep('consent');
  };

  const handleConsent = () => setStep('authenticating');

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const { data } = await verificationService.verifyDigilocker({ applicationId: selectedApp });
      setResult(data.data);
      setStep('result');
    } catch (err) { console.error(err); } finally { setVerifying(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">DigiLocker KYC Verification</h1>
        <p className="text-sm text-gray-500 mt-1">Verify identity through DigiLocker integration</p>
      </div>

      {/* Progress */}
      <div className="card">
        <div className="flex items-center justify-between">
          {['Select', 'Consent', 'Verify', 'Result'].map((s, idx) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step === 'select' && idx === 0 ? 'bg-primary-gradient text-white' :
                step === 'consent' && idx <= 1 ? 'bg-primary-gradient text-white' :
                step === 'authenticating' && idx <= 2 ? 'bg-primary-gradient text-white' :
                step === 'result' ? 'bg-primary-gradient text-white' :
                'bg-gray-100 text-gray-400'
              }`}>{idx + 1}</div>
              <span className="text-xs ml-1 hidden sm:inline">{s}</span>
              {idx < 3 && <div className="w-8 h-0.5 bg-gray-200 mx-1" />}
            </div>
          ))}
        </div>
      </div>

      {/* Select Step */}
      {step === 'select' && (
        <div className="card">
          <label className="label">Select Application</label>
          <div className="flex gap-3">
            <select value={selectedApp} onChange={(e) => setSelectedApp(e.target.value)} className="input-field flex-1">
              <option value="">Choose an application...</option>
              {applications.map((app) => (
                <option key={app._id} value={app._id}>{app.applicationId} - {app.personalDetails?.fullName}</option>
              ))}
            </select>
            <button onClick={startVerification} disabled={!selectedApp} className="btn-primary flex items-center gap-2">
              Start <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Consent Step */}
      {step === 'consent' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
          <div className="text-center py-6">
            <ShieldCheck className="w-16 h-16 text-primary-pink mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">DigiLocker Consent</h2>
            <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
              By proceeding, you authorize Saarthi Bank to access your verified documents from DigiLocker for KYC verification purposes.
            </p>
            <div className="bg-gray-50 rounded-xl p-4 max-w-sm mx-auto text-left mb-6">
              <p className="text-xs text-gray-500 mb-2">Documents to be accessed:</p>
              <ul className="space-y-1">
                {['PAN Card', 'Aadhaar Card', 'Driving License'].map((doc) => (
                  <li key={doc} className="flex items-center gap-2 text-sm text-gray-700">
                    <Lock className="w-3 h-3 text-primary-pink" /> {doc}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setStep('select')} className="btn-secondary">Cancel</button>
              <button onClick={handleConsent} className="btn-primary">I Consent & Proceed</button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Authenticating Step */}
      {step === 'authenticating' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card text-center py-12">
          {verifying ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-primary-pink animate-pulse" />
              </div>
              <p className="text-lg font-semibold text-gray-800">Connecting to DigiLocker...</p>
              <p className="text-sm text-gray-500 mt-1">This is a simulated redirect for demonstration</p>
              <button onClick={handleVerify} className="btn-primary mt-6">Simulate Verification</button>
            </>
          )}
        </motion.div>
      )}

      {/* Result Step */}
      {step === 'result' && result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="card text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800">KYC Verified Successfully</h2>
            <p className="text-sm text-gray-500 mt-1">Request ID: {result.requestId}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: 'PAN Verification', details: result.panVerification },
              { title: 'Aadhaar Verification', details: result.aadhaarVerification },
            ].map((section) => (
              <div key={section.title} className="card">
                <h3 className="font-semibold text-gray-800 mb-3">{section.title}</h3>
                <div className="space-y-2">
                  {Object.entries(section.details || {}).map(([key, val]) => (
                    <div key={key} className="flex items-center gap-2">
                      {val ? <CheckCircle className="w-4 h-4 text-green-500" /> : <span className="w-4 h-4 rounded-full bg-red-100" />}
                      <span className="text-sm text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
