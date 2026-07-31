import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, AlertTriangle, CheckCircle, Shield, FileText } from 'lucide-react';
import { verificationService, loanService } from '../../services';
import { useFetch } from '../../hooks/useFetch';
import StatusBadge from '../../components/common/StatusBadge';

export default function AiNotesPage() {
  const [selectedApp, setSelectedApp] = useState('');
  const [generating, setGenerating] = useState(false);
  const [notes, setNotes] = useState(null);

  const { data: loans } = useFetch(() => loanService.getAll({ limit: 50 }), []);
  const applications = loans?.data || [];

  const handleGenerate = async () => {
    if (!selectedApp) return alert('Select an application');
    setGenerating(true);
    try {
      const { data } = await verificationService.generateAiNotes({ applicationId: selectedApp });
      setNotes(data.data);
    } catch (err) { console.error(err); } finally { setGenerating(false); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Verification Notes</h1>
        <p className="text-sm text-gray-500 mt-1">AI-generated loan verification analysis</p>
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
          <button onClick={handleGenerate} disabled={!selectedApp || generating} className="btn-primary flex items-center gap-2">
            <Brain className="w-4 h-4" /> {generating ? 'Generating...' : 'Generate AI Notes'}
          </button>
        </div>
      </div>

      {generating && (
        <div className="card text-center py-12">
          <Brain className="w-12 h-12 text-primary-pink mx-auto mb-3 animate-pulse" />
          <p className="text-lg font-semibold text-gray-800">AI is analyzing the application...</p>
          <p className="text-sm text-gray-500">Reviewing credit profile, income, documents, and verification results</p>
        </div>
      )}

      {notes && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Summary */}
          <div className="card bg-gradient-to-br from-primary-light/30 to-white">
            <div className="flex items-start gap-3">
              <Brain className="w-8 h-8 text-primary-pink flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-2">AI Loan Verification Summary</h2>
                <p className="text-sm text-gray-700 leading-relaxed">{notes.summary}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card text-center">
              <p className="text-3xl font-bold text-primary-pink">{notes.confidenceScore}%</p>
              <p className="text-xs text-gray-500">AI Confidence Score</p>
            </div>
            <div className="card text-center">
              <StatusBadge status={notes.riskLevel?.toLowerCase()} />
              <p className="text-xs text-gray-500 mt-2">Risk Level</p>
            </div>
            <div className="card text-center">
              <p className="text-sm font-semibold text-gray-800">{notes.recommendedAction}</p>
              <p className="text-xs text-gray-500 mt-1">Recommended Action</p>
            </div>
          </div>

          {/* Positive Findings */}
          <div className="card">
            <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> Positive Findings
            </h3>
            <ul className="space-y-2">
              {notes.positiveFindings?.map((f, idx) => (
                <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Risk Findings */}
          {notes.riskFindings?.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-yellow-700 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Risk Findings
              </h3>
              <ul className="space-y-2">
                {notes.riskFindings.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing Info */}
          {notes.missingInformation?.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-red-700 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Missing Information
              </h3>
              <ul className="space-y-2">
                {notes.missingInformation.map((f, idx) => (
                  <li key={idx} className="text-sm text-gray-700">• {f}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
