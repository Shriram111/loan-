import { motion } from 'framer-motion';
import { TrendingUp, Calendar } from 'lucide-react';
import { financialService } from '../../services';
import { useFetch } from '../../hooks/useFetch';
import { formatDate } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function InterestRatesPage() {
  const { data: rates, loading } = useFetch(() => financialService.getInterestRates(), []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Interest Rates</h1>
        <p className="text-sm text-gray-500 mt-1">Current interest rates for all loan products</p>
      </div>

      <div className="card bg-gradient-to-br from-primary-light/30 to-white mb-4">
        <p className="text-xs text-gray-500 text-center">Indicative rates for demonstration only. Actual interest rates depend on customer eligibility, credit profile, loan type, and current bank policies.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(rates?.data || []).map((rate, idx) => (
          <motion.div key={rate._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="card">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-primary-pink" />
              <h3 className="font-semibold text-gray-800">{rate.loanType}</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Min Rate</span><span className="font-semibold text-green-600">{rate.minRate}%</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Max Rate</span><span className="font-semibold text-red-600">{rate.maxRate}%</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Processing Fee</span><span className="font-semibold">{rate.processingFeePercent}%</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Max Tenure</span><span className="font-semibold">{rate.maxTenureMonths} months</span></div>
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3" /> Effective</span>
                <span className="text-xs text-gray-600">{formatDate(rate.effectiveDate)}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
