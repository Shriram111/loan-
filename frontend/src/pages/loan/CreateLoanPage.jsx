import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { ChevronLeft, ChevronRight, Save, Send, CheckCircle2, User, Briefcase, Coins, Building2, FileCheck } from 'lucide-react';
import { loanService } from '../../services';
import { useAuth } from '../../context/AuthContext';

const steps = [
  { id: 1, label: 'Personal Details', icon: User },
  { id: 2, label: 'Employment Details', icon: Briefcase },
  { id: 3, label: 'Loan Details', icon: Coins },
  { id: 4, label: 'Bank Details', icon: Building2 },
  { id: 5, label: 'Review & Submit', icon: FileCheck },
];

const loanTypes = ['Personal Loan', 'Home Loan', 'Vehicle Loan', 'Education Loan', 'Business Loan', 'Gold Loan'];

export default function CreateLoanPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, watch, formState: { errors }, trigger } = useForm({
    defaultValues: {
      personalDetails: { fullName: user?.fullName || '', email: user?.email || '', mobile: user?.mobile || '' },
    },
  });

  const formData = watch();

  const nextStep = async () => {
    let fieldsToValidate;
    if (step === 1) fieldsToValidate = ['personalDetails.fullName', 'personalDetails.dateOfBirth', 'personalDetails.gender', 'personalDetails.mobile', 'personalDetails.email', 'personalDetails.panNumber', 'personalDetails.aadhaarNumber'];
    else if (step === 2) fieldsToValidate = ['employmentDetails.employmentType', 'employmentDetails.companyName', 'employmentDetails.monthlySalary'];
    else if (step === 3) fieldsToValidate = ['loanDetails.loanType', 'loanDetails.loanAmount', 'loanDetails.loanTenure'];
    else if (step === 4) fieldsToValidate = ['bankDetails.bankName', 'bankDetails.accountNumber', 'bankDetails.ifscCode'];

    const valid = await trigger(fieldsToValidate);
    if (valid && step < 5) setStep(step + 1);
  };

  const prevStep = () => { if (step > 1) setStep(step - 1); };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await loanService.create(data);
      navigate('/loans');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const saveDraft = async () => {
    try {
      const data = { ...formData, status: 'draft' };
      await loanService.create(data);
      navigate('/loans');
    } catch (err) {
      console.error(err);
    }
  };

  const inputClass = "input-field";
  const labelClass = "label";
  const errorClass = "text-xs text-red-500 mt-1";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/loans')} className="p-2 rounded-lg hover:bg-gray-100"><ChevronLeft className="w-5 h-5" /></button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Loan Application</h1>
          <p className="text-sm text-gray-500">Step {step} of 5 - {steps[step - 1].label}</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="card">
        <div className="flex items-center justify-between">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={s.id} className="flex items-center">
                <div className={`flex items-center gap-2 ${step >= s.id ? 'text-primary-pink' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${step > s.id ? 'bg-primary-gradient text-white' : step === s.id ? 'bg-primary-light text-primary-pink ring-2 ring-primary-pink' : 'bg-gray-100 text-gray-400'}`}>
                    {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                  </div>
                  <span className="hidden lg:inline text-xs font-medium">{s.label}</span>
                </div>
                {idx < steps.length - 1 && <div className={`hidden lg:block w-8 md:w-16 h-0.5 mx-2 ${step > s.id ? 'bg-primary-gradient' : 'bg-gray-200'}`} />}
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="card">
            {/* Step 1: Personal Details */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Full Name *</label>
                    <input {...register('personalDetails.fullName', { required: 'Name is required' })} className={inputClass} />
                    {errors.personalDetails?.fullName && <p className={errorClass}>{errors.personalDetails.fullName.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Date of Birth *</label>
                    <input type="date" {...register('personalDetails.dateOfBirth', { required: 'DOB is required' })} className={inputClass} />
                    {errors.personalDetails?.dateOfBirth && <p className={errorClass}>{errors.personalDetails.dateOfBirth.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Gender *</label>
                    <select {...register('personalDetails.gender', { required: 'Gender is required' })} className={inputClass}>
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Mobile Number *</label>
                    <input {...register('personalDetails.mobile', { required: 'Mobile is required' })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Email Address *</label>
                    <input type="email" {...register('personalDetails.email', { required: 'Email is required' })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>PAN Number *</label>
                    <input {...register('personalDetails.panNumber', { required: 'PAN is required', pattern: { value: /^[A-Z]{5}[0-9]{4}[A-Z]$/, message: 'Invalid PAN format' } })} className={inputClass} placeholder="ABCDE1234F" />
                    {errors.personalDetails?.panNumber && <p className={errorClass}>{errors.personalDetails.panNumber.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Aadhaar Number *</label>
                    <input {...register('personalDetails.aadhaarNumber', { required: 'Aadhaar is required' })} className={inputClass} placeholder="XXXX XXXX XXXX" />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Current Address *</label>
                    <textarea {...register('personalDetails.currentAddress', { required: 'Address is required' })} className={inputClass} rows={2} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Permanent Address *</label>
                    <textarea {...register('personalDetails.permanentAddress')} className={inputClass} rows={2} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Employment Details */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Employment Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Employment Type *</label>
                    <select {...register('employmentDetails.employmentType', { required: 'Required' })} className={inputClass}>
                      <option value="">Select</option>
                      <option value="salaried">Salaried</option>
                      <option value="self_employed">Self Employed</option>
                      <option value="business_owner">Business Owner</option>
                      <option value="freelancer">Freelancer</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Company Name *</label>
                    <input {...register('employmentDetails.companyName', { required: 'Required' })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Designation</label>
                    <input {...register('employmentDetails.designation')} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Work Experience (years)</label>
                    <input type="number" {...register('employmentDetails.workExperience')} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Monthly Salary (₹) *</label>
                    <input type="number" {...register('employmentDetails.monthlySalary', { required: 'Required' })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Annual Income (₹)</label>
                    <input type="number" {...register('employmentDetails.annualIncome')} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>EPF Account Number</label>
                    <input {...register('employmentDetails.epfAccount')} className={inputClass} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Loan Details */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Loan Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Loan Type *</label>
                    <select {...register('loanDetails.loanType', { required: 'Required' })} className={inputClass}>
                      <option value="">Select Loan Type</option>
                      {loanTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Loan Amount (₹) *</label>
                    <input type="number" {...register('loanDetails.loanAmount', { required: 'Required', min: { value: 10000, message: 'Minimum ₹10,000' } })} className={inputClass} />
                    {errors.loanDetails?.loanAmount && <p className={errorClass}>{errors.loanDetails.loanAmount.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Loan Tenure (months) *</label>
                    <input type="number" {...register('loanDetails.loanTenure', { required: 'Required', min: { value: 6, message: 'Minimum 6 months' } })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Existing Monthly EMI (₹)</label>
                    <input type="number" {...register('loanDetails.existingMonthlyEmi')} className={inputClass} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Purpose of Loan *</label>
                    <textarea {...register('loanDetails.purposeOfLoan', { required: 'Required' })} className={inputClass} rows={2} />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Existing Loan Details</label>
                    <textarea {...register('loanDetails.existingLoanDetails')} className={inputClass} rows={2} placeholder="Details of any existing loans..." />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Bank Details */}
            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Bank Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Account Holder Name *</label>
                    <input {...register('bankDetails.accountHolderName', { required: 'Required' })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Bank Name *</label>
                    <input {...register('bankDetails.bankName', { required: 'Required' })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Account Number *</label>
                    <input {...register('bankDetails.accountNumber', { required: 'Required' })} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>IFSC Code *</label>
                    <input {...register('bankDetails.ifscCode', { required: 'Required', pattern: { value: /^[A-Z]{4}0[A-Z0-9]{6}$/, message: 'Invalid IFSC' } })} className={inputClass} placeholder="HDFC0001234" />
                    {errors.bankDetails?.ifscCode && <p className={errorClass}>{errors.bankDetails.ifscCode.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Account Type *</label>
                    <select {...register('bankDetails.accountType', { required: 'Required' })} className={inputClass}>
                      <option value="">Select</option>
                      <option value="savings">Savings</option>
                      <option value="current">Current</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review & Submit */}
            {step === 5 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Review & Submit</h2>
                {[
                  { title: 'Personal Details', data: formData.personalDetails, fields: ['fullName', 'dateOfBirth', 'gender', 'mobile', 'email', 'panNumber', 'aadhaarNumber'] },
                  { title: 'Employment Details', data: formData.employmentDetails, fields: ['employmentType', 'companyName', 'designation', 'monthlySalary'] },
                  { title: 'Loan Details', data: formData.loanDetails, fields: ['loanType', 'loanAmount', 'loanTenure', 'purposeOfLoan'] },
                  { title: 'Bank Details', data: formData.bankDetails, fields: ['bankName', 'accountNumber', 'ifscCode', 'accountType'] },
                ].map((section) => (
                  <div key={section.title} className="bg-gray-50 rounded-xl p-4">
                    <h3 className="font-semibold text-gray-700 mb-2">{section.title}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {section.fields.map((f) => (
                        <div key={f}>
                          <span className="text-xs text-gray-500 capitalize">{f.replace(/([A-Z])/g, ' $1')}:</span>
                          <p className="text-sm font-medium">{section.data?.[f] || '-'}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <div className="flex gap-2">
            {step > 1 && (
              <button type="button" onClick={prevStep} className="btn-secondary flex items-center gap-2">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={saveDraft} className="btn-secondary flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Draft
            </button>
            {step < 5 ? (
              <button type="button" onClick={nextStep} className="btn-primary flex items-center gap-2">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
                <Send className="w-4 h-4" /> {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
