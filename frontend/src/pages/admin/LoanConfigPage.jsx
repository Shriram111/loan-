import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Plus, Edit, Save } from 'lucide-react';
import { financialService } from '../../services';
import { useFetch } from '../../hooks/useFetch';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function LoanConfigPage() {
  const { data: products, loading, refetch } = useFetch(() => financialService.getProducts(), []);
  const [editing, setEditing] = useState(null);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Loan Configuration</h1>
        <p className="text-sm text-gray-500 mt-1">Manage loan products and their settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(products?.data || []).map((product, idx) => (
          <motion.div key={product._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="card">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-800">{product.name}</h3>
              <button onClick={() => setEditing(editing === product._id ? null : product._id)} className="p-1.5 rounded-lg hover:bg-primary-light text-gray-500">
                <Edit className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-3">{product.description}</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Amount Range:</span><span className="font-medium">₹{product.minAmount?.toLocaleString()} - ₹{product.maxAmount?.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Tenure:</span><span className="font-medium">{product.minTenure} - {product.maxTenure} months</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Interest Rate:</span><span className="font-medium">{product.interestRateMin}% - {product.interestRateMax}%</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Processing Fee:</span><span className="font-medium">{product.processingFee}%</span></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
