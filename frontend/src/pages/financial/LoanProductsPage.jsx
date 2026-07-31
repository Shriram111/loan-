import { motion } from 'framer-motion';
import { Coins, ArrowRight } from 'lucide-react';
import { financialService } from '../../services';
import { useFetch } from '../../hooks/useFetch';
import { formatCurrency } from '../../utils/helpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function LoanProductsPage() {
  const { data: products, loading } = useFetch(() => financialService.getProducts(), []);

  if (loading) return <LoadingSpinner />;

  const iconColors = ['from-pink-500 to-red-500', 'from-blue-500 to-indigo-500', 'from-green-500 to-teal-500', 'from-yellow-500 to-orange-500', 'from-purple-500 to-pink-500', 'from-red-500 to-rose-500'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Loan Products</h1>
        <p className="text-sm text-gray-500 mt-1">Explore our range of loan products</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {(products?.data || []).map((product, idx) => (
          <motion.div key={product._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="card hover:shadow-xl group cursor-pointer">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${iconColors[idx % iconColors.length]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <Coins className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{product.description}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Loan Amount</span><span className="font-semibold">{formatCurrency(product.minAmount)} - {formatCurrency(product.maxAmount)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Tenure</span><span className="font-semibold">{product.minTenure} - {product.maxTenure} months</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Interest Rate</span><span className="font-semibold text-primary-pink">{product.interestRateMin}% - {product.interestRateMax}%</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Processing Fee</span><span className="font-semibold">{product.processingFee}%</span></div>
            </div>
            {product.eligibilityRequirements?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-2">Eligibility</p>
                <ul className="space-y-1">
                  {product.eligibilityRequirements.map((req, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                      <ArrowRight className="w-3 h-3 mt-0.5 text-primary-pink flex-shrink-0" /> {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="card bg-gradient-to-br from-primary-light/30 to-white">
        <p className="text-xs text-gray-500 text-center">Indicative rates for demonstration only. Actual interest rates depend on customer eligibility, credit profile, loan type, and current bank policies.</p>
      </div>
    </div>
  );
}
