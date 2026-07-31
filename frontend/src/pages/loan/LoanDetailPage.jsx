import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Edit, Trash2, Send, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { loanService } from '../../services';
import { useFetch } from '../../hooks/useFetch';
import { formatDate, formatCurrency, maskPan, maskAadhaar } from '../../utils/helpers';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function LoanDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: application, loading, refetch } = useFetch(() => loanService.getById(id), [id]);

  const handleSubmit = async () => {
    try {
      await loanService.submit(id);
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await loanService.delete(id);
        navigate('/loans');
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!application) return <div className="card text-center py-12"><p className="text-gray-500">Application not found</p></div>;

  const v = application.verification || {};

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/loans')} className="p-2 rounded-lg hover:bg-gray-100"><ChevronLeft className="w-5 h-5" /></button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{application.applicationId}</h1>
            <StatusBadge status={application.status} />
          </div>
          <p className="text-sm text-gray-500">Created on {formatDate(application.createdAt)}</p>
        </div>
        <div className="flex gap-2">
          {application.status === 'draft' && (
            <>
              <button onClick={handleSubmit} className="btn-primary flex items-center gap-2 text-sm"><Send className="w-4 h-4" /> Submit</button>
              <button onClick={handleDelete} className="btn-danger flex items-center gap-2 text-sm"><Trash2 className="w-4 h-4" /> Delete</button>
            </>
          )}
        </div>
      </div>

      {/* Sections */}
      {[
        { title: 'Personal Details', data: application.personalDetails, fields: [
          { key: 'fullName', label: 'Full Name' }, { key: 'dateOfBirth', label: 'Date of Birth', format: formatDate },
          { key: 'gender', label: 'Gender' }, { key: 'mobile', label: 'Mobile' }, { key: 'email', label: 'Email' },
          { key: 'panNumber', label: 'PAN', format: maskPan }, { key: 'aadhaarNumber', label: 'Aadhaar', format: maskAadhaar },
          { key: 'currentAddress', label: 'Current Address' },
        ]},
        { title: 'Employment Details', data: application.employmentDetails, fields: [
          { key: 'employmentType', label: 'Type' }, { key: 'companyName', label: 'Company' },
          { key: 'designation', label: 'Designation' }, { key: 'workExperience', label: 'Experience (years)' },
          { key: 'monthlySalary', label: 'Monthly Salary', format: formatCurrency },
          { key: 'annualIncome', label: 'Annual Income', format: formatCurrency },
        ]},
        { title: 'Loan Details', data: application.loanDetails, fields: [
          { key: 'loanType', label: 'Loan Type' }, { key: 'loanAmount', label: 'Amount', format: formatCurrency },
          { key: 'loanTenure', label: 'Tenure (months)' }, { key: 'purposeOfLoan', label: 'Purpose' },
        ]},
        { title: 'Bank Details', data: application.bankDetails, fields: [
          { key: 'accountHolderName', label: 'Account Holder' }, { key: 'bankName', label: 'Bank' },
          { key: 'accountNumber', label: 'Account No.' }, { key: 'ifscCode', label: 'IFSC' },
          { key: 'accountType', label: 'Account Type' },
        ]},
      ].map((section) => (
        <motion.div key={section.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">{section.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.fields.map((f) => (
              <div key={f.key}>
                <p className="text-xs text-gray-500">{f.label}</p>
                <p className="text-sm font-medium text-gray-800">{f.format ? f.format(section.data?.[f.key]) : section.data?.[f.key] || '-'}</p>
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Verification Status */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Verification Progress</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: 'CIBIL', status: v.cibil?.status },
            { label: 'EPF', status: v.epf?.status },
            { label: 'Salary Slip', status: v.salary?.status },
            { label: 'DigiLocker KYC', status: v.digilocker?.status },
            { label: 'Selfie', status: v.selfie?.status },
            { label: 'Liveness', status: v.liveness?.status },
            { label: 'PAN Holding', status: v.panHolding?.status },
            { label: 'Aadhaar Holding', status: v.aadhaarHolding?.status },
            { label: 'Live Video', status: v.liveVideo?.status },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-700">{item.label}</span>
              <StatusBadge status={item.status || 'pending'} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* AI Notes */}
      {application.aiNotes && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card bg-gradient-to-br from-primary-light/30 to-white">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">AI Verification Notes</h2>
          <p className="text-sm text-gray-600 mb-3">{application.aiNotes.summary}</p>
          <div className="flex gap-4 text-sm">
            <span className="font-medium">Risk: <StatusBadge status={application.aiNotes.riskLevel?.toLowerCase()} /></span>
            <span className="text-gray-600">Confidence: {application.aiNotes.confidenceScore}%</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
