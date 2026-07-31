import { AlertCircle, Inbox } from 'lucide-react';

export function EmptyState({ icon: Icon = Inbox, title = 'No data found', description = 'There is nothing to display yet.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-primary-pink" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 mt-1 text-center max-w-sm">{description}</p>
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800">Error</h3>
      <p className="text-sm text-gray-500 mt-1 text-center max-w-sm">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary mt-4 text-sm">Try Again</button>
      )}
    </div>
  );
}

export function StatusBadge({ status }) {
  const colors = {
    draft: 'bg-gray-100 text-gray-600',
    submitted: 'bg-blue-100 text-blue-600',
    under_review: 'bg-yellow-100 text-yellow-600',
    verification_in_progress: 'bg-purple-100 text-purple-600',
    audit_in_progress: 'bg-indigo-100 text-indigo-600',
    approved: 'bg-green-100 text-green-600',
    conditionally_approved: 'bg-teal-100 text-teal-600',
    rejected: 'bg-red-100 text-red-600',
    on_hold: 'bg-orange-100 text-orange-600',
    uploaded: 'bg-gray-100 text-gray-600',
    processing: 'bg-blue-100 text-blue-600',
    ai_review: 'bg-purple-100 text-purple-600',
    verified: 'bg-green-100 text-green-600',
    pending: 'bg-yellow-100 text-yellow-600',
    additional_info_required: 'bg-orange-100 text-orange-600',
    low: 'bg-green-100 text-green-600',
    medium: 'bg-yellow-100 text-yellow-600',
    high: 'bg-red-100 text-red-600',
    critical: 'bg-red-200 text-red-800',
  };
  const labels = {
    draft: 'Draft', submitted: 'Submitted', under_review: 'Under Review',
    verification_in_progress: 'Verification In Progress', audit_in_progress: 'Audit In Progress',
    approved: 'Approved', conditionally_approved: 'Conditionally Approved',
    rejected: 'Rejected', on_hold: 'On Hold', uploaded: 'Uploaded',
    processing: 'Processing', ai_review: 'AI Review', verified: 'Verified',
    pending: 'Pending', additional_info_required: 'Additional Info Required',
    low: 'Low Risk', medium: 'Medium Risk', high: 'High Risk', critical: 'Critical',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
      {labels[status] || status}
    </span>
  );
}

export default StatusBadge;
