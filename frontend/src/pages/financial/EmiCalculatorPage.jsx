import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, IndianRupee, Calendar, TrendingUp } from 'lucide-react';
import { financialService } from '../../services';
import { formatCurrency } from '../../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function EmiCalculatorPage() {
  const [principal, setPrincipal] = useState(1000000);
  const [rate, setRate] = useState(10);
  const [tenure, setTenure] = useState(60);
  const [result, setResult] = useState(null);
  const [calculating, setCalculating] = useState(false);

  const calculate = async () => {
    setCalculating(true);
    try {
      const { data } = await financialService.calculateEmi({ principal, annualRate: rate, tenureMonths: tenure });
      setResult(data.data);
    } catch (err) { console.error(err); } finally { setCalculating(false); }
  };

  const pieData = result ? [
    { name: 'Principal', value: principal },
    { name: 'Interest', value: result.totalInterest },
  ] : [];

  const scheduleData = result?.schedule?.slice(0, 12).map((s) => ({ name: `M${s.month}`, principal: s.principal, interest: s.interest })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">EMI Calculator</h1>
        <p className="text-sm text-gray-500 mt-1">Calculate your monthly EMI and repayment schedule</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inputs */}
        <div className="card space-y-6">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2"><Calculator className="w-5 h-5 text-primary-pink" /> Loan Parameters</h2>
          <div>
            <label className="label">Loan Amount: ₹{Number(principal).toLocaleString()}</label>
            <input type="range" min={10000} max={50000000} step={10000} value={principal} onChange={(e) => setPrincipal(Number(e.target.value))} className="w-full accent-primary-pink" />
            <div className="flex justify-between text-xs text-gray-400"><span>₹10K</span><span>₹5Cr</span></div>
          </div>
          <div>
            <label className="label">Interest Rate: {rate}% p.a.</label>
            <input type="range" min={1} max={30} step={0.1} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-primary-pink" />
            <div className="flex justify-between text-xs text-gray-400"><span>1%</span><span>30%</span></div>
          </div>
          <div>
            <label className="label">Loan Tenure: {tenure} months ({Math.floor(tenure / 12)} years {tenure % 12} months)</label>
            <input type="range" min={6} max={360} step={1} value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full accent-primary-pink" />
            <div className="flex justify-between text-xs text-gray-400"><span>6 mo</span><span>30 yr</span></div>
          </div>
          <button onClick={calculate} disabled={calculating} className="btn-primary w-full flex items-center justify-center gap-2">
            <Calculator className="w-4 h-4" /> {calculating ? 'Calculating...' : 'Calculate EMI'}
          </button>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {result && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="card text-center bg-gradient-to-br from-primary-light/30 to-white">
                <IndianRupee className="w-6 h-6 text-primary-pink mx-auto mb-2" />
                <p className="text-2xl font-bold text-primary-pink">{formatCurrency(result.emi)}</p>
                <p className="text-xs text-gray-500">Monthly EMI</p>
              </div>
              <div className="card text-center">
                <TrendingUp className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-600">{formatCurrency(result.totalInterest)}</p>
                <p className="text-xs text-gray-500">Total Interest</p>
              </div>
              <div className="card text-center">
                <Calendar className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{formatCurrency(result.totalPayment)}</p>
                <p className="text-xs text-gray-500">Total Repayment</p>
              </div>
            </motion.div>
          )}

          {result && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="font-semibold text-gray-800 mb-3">Principal vs Interest</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      <Cell fill="#E91E63" />
                      <Cell fill="#F59E0B" />
                    </Pie>
                    <Tooltip formatter={(val) => formatCurrency(val)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="card">
                <h3 className="font-semibold text-gray-800 mb-3">Monthly Breakdown (First 12 Months)</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={scheduleData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip formatter={(val) => formatCurrency(val)} />
                    <Bar dataKey="principal" fill="#E91E63" stackId="a" />
                    <Bar dataKey="interest" fill="#F59E0B" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {result && (
            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-3">Payment Schedule</h3>
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-gray-50">
                    <tr>
                      <th className="text-left px-3 py-2 text-xs font-semibold text-gray-500">Month</th>
                      <th className="text-right px-3 py-2 text-xs font-semibold text-gray-500">EMI</th>
                      <th className="text-right px-3 py-2 text-xs font-semibold text-gray-500">Principal</th>
                      <th className="text-right px-3 py-2 text-xs font-semibold text-gray-500">Interest</th>
                      <th className="text-right px-3 py-2 text-xs font-semibold text-gray-500">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {result.schedule?.map((s) => (
                      <tr key={s.month} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-gray-600">{s.month}</td>
                        <td className="px-3 py-2 text-right font-medium">{formatCurrency(s.emi)}</td>
                        <td className="px-3 py-2 text-right text-green-600">{formatCurrency(s.principal)}</td>
                        <td className="px-3 py-2 text-right text-yellow-600">{formatCurrency(s.interest)}</td>
                        <td className="px-3 py-2 text-right text-gray-600">{formatCurrency(s.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
