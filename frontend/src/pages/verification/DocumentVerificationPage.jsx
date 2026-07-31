import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Trash2, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { documentService, loanService } from '../../services';
import { useFetch } from '../../hooks/useFetch';
import { formatDate } from '../../utils/helpers';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/StatusBadge';

const docTypes = [
  { value: 'pan_card', label: 'PAN Card' },
  { value: 'aadhaar_card', label: 'Aadhaar Card' },
  { value: 'salary_slip', label: 'Salary Slip' },
  { value: 'bank_statement', label: 'Bank Statement' },
  { value: 'epf_statement', label: 'EPF Statement' },
  { value: 'employment_certificate', label: 'Employment Certificate' },
  { value: 'address_proof', label: 'Address Proof' },
  { value: 'additional', label: 'Additional Document' },
];

export default function DocumentVerificationPage() {
  const [selectedApp, setSelectedApp] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const { data: loans } = useFetch(() => loanService.getAll({ limit: 50 }), []);
  const applications = loans?.data || [];

  const { data: documents, loading, refetch } = useFetch(
    () => selectedApp ? documentService.getByApplication(selectedApp) : Promise.resolve({ data: [] }),
    [selectedApp]
  );

  const handleUpload = async (file, docType) => {
    if (!selectedApp) return alert('Please select an application first');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('applicationId', selectedApp);
      formData.append('documentType', docType);
      await documentService.upload(formData);
      refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file, 'additional');
  }, [selectedApp]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this document?')) {
      await documentService.delete(id);
      refetch();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Document Verification</h1>
        <p className="text-sm text-gray-500 mt-1">Upload and manage verification documents</p>
      </div>

      <div className="card">
        <label className="label">Select Loan Application</label>
        <select value={selectedApp} onChange={(e) => setSelectedApp(e.target.value)} className="input-field">
          <option value="">Choose an application...</option>
          {applications.map((app) => (
            <option key={app._id} value={app._id}>{app.applicationId} - {app.personalDetails?.fullName || app.userId?.fullName}</option>
          ))}
        </select>
      </div>

      {selectedApp && (
        <>
          {/* Upload Area */}
          <div
            className={`card border-2 border-dashed transition-all ${dragActive ? 'border-primary-pink bg-primary-light/20' : 'border-gray-200'}`}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <div className="text-center py-8">
              <Upload className="w-12 h-12 text-primary-pink mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-700">Drag & drop files here or click to browse</p>
              <p className="text-xs text-gray-500 mt-1">Supports JPEG, PNG, WebP, PDF (max 10MB)</p>
              <label className="btn-primary mt-4 inline-flex items-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" /> Browse Files
                <input type="file" className="hidden" accept="image/*,application/pdf" onChange={(e) => e.target.files[0] && handleUpload(e.target.files[0], 'additional')} />
              </label>
            </div>
          </div>

          {/* Quick Upload by Type */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-3">Upload by Document Type</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {docTypes.map((dt) => (
                <label key={dt.value} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-primary-light cursor-pointer transition-colors">
                  <FileText className="w-4 h-4 text-primary-pink" />
                  <span className="text-sm text-gray-700">{dt.label}</span>
                  <input type="file" className="hidden" accept="image/*,application/pdf" onChange={(e) => e.target.files[0] && handleUpload(e.target.files[0], dt.value)} />
                </label>
              ))}
            </div>
            {uploading && <p className="text-sm text-primary-pink mt-3">Uploading...</p>}
          </div>

          {/* Documents List */}
          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-3">Uploaded Documents</h3>
            {loading ? <LoadingSpinner /> : (documents?.data || []).length === 0 ? (
              <EmptyState title="No documents uploaded" description="Upload documents to begin verification." />
            ) : (
              <div className="space-y-2">
                {(documents?.data || []).map((doc, idx) => (
                  <motion.div
                    key={doc._id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary-pink" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{doc.originalName}</p>
                        <p className="text-xs text-gray-500">{doc.documentType.replace(/_/g, ' ')} &middot; {formatDate(doc.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={doc.status} />
                      <button onClick={() => handleDelete(doc._id)} className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
