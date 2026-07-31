export const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatCurrency = (amount) => {
  if (!amount) return '₹0';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
};

export const formatNumber = (num) => {
  if (!num) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

export const maskPan = (pan) => {
  if (!pan || pan.length < 5) return pan;
  return pan.substring(0, 2) + '****' + pan.substring(pan.length - 2);
};

export const maskAadhaar = (aadhaar) => {
  if (!aadhaar || aadhaar.length < 5) return aadhaar;
  return 'XXXX XXXX ' + aadhaar.substring(aadhaar.length - 4);
};

export const getStatusColor = (status) => {
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
  };
  return colors[status] || 'bg-gray-100 text-gray-600';
};

export const getStatusLabel = (status) => {
  const labels = {
    draft: 'Draft',
    submitted: 'Submitted',
    under_review: 'Under Review',
    verification_in_progress: 'Verification In Progress',
    audit_in_progress: 'Audit In Progress',
    approved: 'Approved',
    conditionally_approved: 'Conditionally Approved',
    rejected: 'Rejected',
    on_hold: 'On Hold',
    uploaded: 'Uploaded',
    processing: 'Processing',
    ai_review: 'AI Review',
    verified: 'Verified',
    pending: 'Pending',
  };
  return labels[status] || status;
};

export const calculateEmi = (principal, annualRate, tenureMonths) => {
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate === 0) return principal / tenureMonths;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) / (Math.pow(1 + monthlyRate, tenureMonths) - 1);
};

export const getCreditScoreCategory = (score) => {
  if (score >= 750) return { label: 'Excellent', color: 'text-green-600' };
  if (score >= 650) return { label: 'Good', color: 'text-blue-600' };
  if (score >= 550) return { label: 'Fair', color: 'text-yellow-600' };
  return { label: 'Poor', color: 'text-red-600' };
};
