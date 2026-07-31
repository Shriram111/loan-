import { useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardCheck, Download, Printer, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { auditService, loanService } from '../../services';
import { useFetch } from '../../hooks/useFetch';
import { formatDate, formatCurrency } from '../../utils/helpers';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AuditReportPage() {
  const [selectedApp, setSelectedApp] = useState('');
  const [report, setReport] = useState(null);
  const [loadingReport, setLoadingReport] = useState(false);

  const { data: loans } = useFetch(() => loanService.getAll({ limit: 50 }), []);
  const applications = loans?.data || [];

  const generateReport = async () => {
    if (!selectedApp) return alert('Select an application');
    setLoadingReport(true);
    try {
      const { data } = await auditService.generateReport(selectedApp);
      setReport(data.data);
    } catch (err) { console.error(err); } finally { setLoadingReport(false); }
  };

  const app = report?.application;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Loan Audit Reports</h1>
        <p className="text-sm text-gray-500 mt-1">Generate and view detailed audit reports</p>
      </div>

      <div className="card">
        <label className="label">Select Application</label>
        <div className="flex gap-3">
          <select value={selectedApp} onChange={(e) => { setSelectedApp(e.target.value); setReport(null); }} className="input-field flex-1">
            <option value="">Choose an application...</option>
            {applications.map((app) => (
              <option key={app._id} value={app._id}>{app.applicationId} - {app.personalDetails?.fullName}</option>
            ))}
          </select>
          <button onClick={generateReport} disabled={!selectedApp || loadingReport} className="btn-primary flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4" /> {loadingReport ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {loadingReport && <LoadingSpinner />}

      {report && app && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex gap-3 mb-4">
            <button onClick={() => window.print()} className="btn-secondary flex items-center gap-2 text-sm"><Printer className="w-4 h-4" /> Print</button>
            <button className="btn-secondary flex items-center gap-2 text-sm"><Download className="w-4 h-4" /> Download PDF</button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto" id="report">
            {/* Header */}
            <div className="text-center border-b border-gray-200 pb-6 mb-6">
              <div className="w-16 h-16 rounded-xl bg-primary-gradient flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl font-bold">SB</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Saarthi Bank</h1>
              <p className="text-sm text-gray-500">Loan Audit Report</p>
              <div className="flex justify-center gap-6 mt-3 text-sm text-gray-600">
                <span>Report ID: {report.reportId}</span>
                <span>Application: {app.applicationId}</span>
                <span>Date: {formatDate(report.generatedAt)}</span>
              </div>
            </div>

            {/* Applicant Info */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Applicant Information</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Name: {app.personalDetails?.fullName}</p>
                  <p>Email: {app.personalDetails?.email}</p>
                  <p>Mobile: {app.personalDetails?.mobile}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Loan Details</h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Type: {app.loanDetails?.loanType}</p>
                  <p>Amount: {formatCurrency(app.loanDetails?.loanAmount)}</p>
                  <p>Tenure: {app.loanDetails?.loanTenure} months</p>
                </div>
              </div>
            </div>

            {/* Verification Results */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Verification Results</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'CIBIL Score', value: app.verification?.cibil?.score || 'N/A', status: app.verification?.cibil?.status },
                  { label: 'EPF Status', status: app.verification?.epf?.status },
                  { label: 'Salary Verification', status: app.verification?.salary?.status },
                  { label: 'DigiLocker KYC', status: app.verification?.digilocker?.status },
                  { label: 'Selfie Verification', status: app.verification?.selfie?.status },
                  { label: 'Liveness Check', status: app.verification?.liveness?.status },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <div className="mt-1">
                      {item.value && <p className="text-sm font-medium">{item.value}</p>}
                      <StatusBadge status={item.status || 'pending'} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit Score */}
            {app.auditScore > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Overall Audit Score</h3>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-primary-gradient flex items-center justify-center">
                    <span className="text-white text-xl font-bold">{app.auditScore}%</span>
                  </div>
                  <div>
                    <StatusBadge status={app.riskLevel} />
                    <p className="text-sm text-gray-600 mt-1">Risk Assessment</p>
                  </div>
                </div>
              </div>
            )}

            {/* Auditor Notes */}
            {app.auditNotes && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Auditor Notes</h3>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">{app.auditNotes}</p>
              </div>
            )}

            {/* Final Decision */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-gray-800 mb-2">Final Decision</h3>
              <StatusBadge status={app.status} />
              {app.rejectionReason && <p className="text-sm text-red-600 mt-2">Reason: {app.rejectionReason}</p>}
            </div>

            {/* Disclaimer */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500">This report is generated for internal loan assessment and audit purposes. Verification results may require additional manual review.</p>
            </div>

            <div className="mt-4 text-center text-xs text-gray-400">
              Generated by {report.generatedBy} on {formatDate(report.generatedAt)}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
