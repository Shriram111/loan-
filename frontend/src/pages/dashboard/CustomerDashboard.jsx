import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Clock,
  ShieldCheck,
  Hourglass,
  Plus,
  Upload,
  Search,
  Bell,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Circle,
  Loader2,
  AlertCircle,
  Zap,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useFetch } from '../../hooks/useFetch';
import { loanService } from '../../services';
import { formatDate, getStatusColor, getStatusLabel } from '../../utils/helpers';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/StatusBadge';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' },
  }),
};

const STEPS = [
  { key: 'personal', label: 'Personal Details', icon: FileText },
  { key: 'documents', label: 'Document Upload', icon: Upload },
  { key: 'digilocker', label: 'DigiLocker', icon: ShieldCheck },
  { key: 'ai_verify', label: 'AI Verification', icon: Zap },
  { key: 'audit', label: 'Loan Audit', icon: Search },
  { key: 'decision', label: 'Final Decision', icon: CheckCircle2 },
];

const STATUS_STEP_MAP = {
  draft: 0,
  submitted: 0,
  under_review: 1,
  verification_in_progress: 2,
  ai_review: 3,
  audit_in_progress: 4,
  approved: 5,
  conditionally_approved: 5,
  rejected: 5,
  on_hold: 4,
};

function getActiveStepIndex(status) {
  return STATUS_STEP_MAP[status] ?? 0;
}

function buildProgressTimeline(activeIndex) {
  return STEPS.map((step, idx) => {
    let state = 'pending';
    if (idx < activeIndex) state = 'completed';
    else if (idx === activeIndex) state = 'active';
    return { ...step, state };
  });
}

function VerificationProgressBar({ percentage }) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-semibold text-gray-700">Verification Progress</span>
        <span className="text-sm font-bold" style={{ color: '#E91E63' }}>{percentage}%</span>
      </div>
      <div className="progress-bar">
        <motion.div
          className="progress-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color, bgColor, index }) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      custom={index}
      className="card flex items-center gap-4 group"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: bgColor }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-surface-dark">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </motion.div>
  );
}

function ProgressTimeline({ timeline }) {
  return (
    <div className="card">
      <h3 className="text-lg font-bold text-surface-dark mb-6">Application Progress</h3>
      <div className="space-y-0">
        {timeline.map((step, idx) => {
          const Icon = step.icon;
          const isLast = idx === timeline.length - 1;

          const connectorColor =
            step.state === 'completed'
              ? 'bg-green-500'
              : step.state === 'active'
              ? 'bg-primary-pink'
              : 'bg-gray-200';

          const nodeColor =
            step.state === 'completed'
              ? 'bg-green-500 text-white'
              : step.state === 'active'
              ? 'bg-primary-gradient text-white'
              : 'bg-gray-200 text-gray-400';

          const labelColor =
            step.state === 'completed'
              ? 'text-green-700'
              : step.state === 'active'
              ? 'text-primary-dark font-semibold'
              : 'text-gray-400';

          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.07, duration: 0.35 }}
              className="flex gap-4"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${nodeColor}`}
                >
                  {step.state === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : step.state === 'active' ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </div>
                {!isLast && <div className={`w-0.5 h-8 ${connectorColor} transition-colors duration-300`} />}
              </div>
              <div className="pb-6 pt-2">
                <p className={`text-sm ${labelColor}`}>{step.label}</p>
                {step.state === 'active' && (
                  <p className="text-xs text-primary-pink mt-0.5 font-medium">In Progress</p>
                )}
                {step.state === 'completed' && (
                  <p className="text-xs text-green-500 mt-0.5">Completed</p>
                )}
                {step.state === 'pending' && (
                  <p className="text-xs text-gray-400 mt-0.5">Pending</p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

const PIE_COLORS = ['#E91E63', '#E53935', '#FCE4EC', '#AD1457'];

function RecentActivity({ loans }) {
  const activities = useMemo(() => {
    if (!loans || loans.length === 0) return [];
    return loans
      .slice()
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5)
      .map((loan) => ({
        id: loan._id,
        title: `Application ${loan.applicationNumber || loan._id?.slice(-6).toUpperCase()}`,
        status: loan.status,
        date: loan.updatedAt || loan.createdAt,
        type: loan.loanType || 'Personal Loan',
        amount: loan.loanAmount,
      }));
  }, [loans]);

  if (activities.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-10">
        <Bell className="w-10 h-10 text-gray-300 mb-3" />
        <p className="text-gray-500 text-sm">No recent activity yet</p>
        <p className="text-gray-400 text-xs mt-1">Your loan application updates will appear here</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-surface-dark">Recent Activity</h3>
        <Link
          to="/loans"
          className="text-sm font-semibold flex items-center gap-1 hover:underline"
          style={{ color: '#E91E63' }}
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="space-y-3">
        {activities.map((activity, idx) => (
          <motion.div
            key={activity.id}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={idx}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-light transition-colors duration-200"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-2 h-2 rounded-full bg-primary-pink flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-surface-dark truncate">{activity.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {activity.type} &middot; {formatDate(activity.date)}
                </p>
              </div>
            </div>
            <StatusBadge status={activity.status} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function QuickActions() {
  const actions = [
    {
      label: 'Create Application',
      icon: Plus,
      to: '/loans/create',
      gradient: true,
    },
    {
      label: 'Upload Documents',
      icon: Upload,
      to: '/verification/documents',
      gradient: false,
    },
    {
      label: 'Check Status',
      icon: Search,
      to: '/loans',
      gradient: false,
    },
  ];

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-surface-dark mb-4">Quick Actions</h3>
      <div className="flex flex-col gap-3">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.label}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={idx}
            >
              <Link
                to={action.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${
                  action.gradient
                    ? 'text-white bg-primary-gradient hover:bg-primary-gradient-hover'
                    : 'text-primary-dark bg-primary-light hover:bg-pink-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {action.label}
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function StatusChart({ loans }) {
  const chartData = useMemo(() => {
    if (!loans || loans.length === 0) return [];
    const counts = {};
    loans.forEach((loan) => {
      const s = loan.status || 'draft';
      counts[s] = (counts[s] || 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({
      name: getStatusLabel(status),
      value: count,
    }));
  }, [loans]);

  if (chartData.length === 0) return null;

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-surface-dark mb-4">Application Overview</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-3 mt-2 justify-center">
        {chartData.map((entry, idx) => (
          <div key={entry.name} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
            />
            {entry.name} ({entry.value})
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsPanel({ notifications }) {
  const recent = (notifications || []).slice(0, 4);

  if (recent.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-10">
        <Bell className="w-10 h-10 text-gray-300 mb-3" />
        <p className="text-gray-500 text-sm">No notifications</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-surface-dark">Notifications</h3>
        <Link
          to="/loans"
          className="text-sm font-semibold flex items-center gap-1 hover:underline"
          style={{ color: '#E91E63' }}
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <div className="space-y-3">
        {recent.map((n, idx) => (
          <motion.div
            key={n._id || idx}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={idx}
            className={`p-3 rounded-xl transition-colors duration-200 ${
              n.isRead ? 'bg-white' : 'bg-primary-light/30'
            }`}
          >
            <p className="text-sm text-surface-dark leading-snug">{n.message || n.title}</p>
            <p className="text-xs text-gray-400 mt-1">{formatDate(n.createdAt)}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { notifications } = useNotifications();

  const {
    data: loansData,
    loading,
    error,
    refetch,
  } = useFetch(() => loanService.getAll(), []);

  const loans = useMemo(() => {
    if (!loansData) return [];
    if (Array.isArray(loansData)) return loansData;
    if (loansData.loans) return loansData.loans;
    if (Array.isArray(loansData.data)) return loansData.data;
    if (loansData.data?.loans) return loansData.data.loans;
    return [];
  }, [loansData]);

  const stats = useMemo(() => {
    const total = loans.length;
    const underReview = loans.filter((l) =>
      ['under_review', 'submitted'].includes(l.status)
    ).length;
    const verified = loans.filter((l) =>
      ['verified', 'approved', 'conditionally_approved'].includes(l.status)
    ).length;
    const pending = loans.filter((l) =>
      ['draft', 'pending', 'verification_in_progress', 'audit_in_progress', 'on_hold'].includes(l.status)
    ).length;
    return { total, underReview, verified, pending };
  }, [loans]);

  const latestLoan = useMemo(() => {
    if (loans.length === 0) return null;
    return loans.slice().sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
  }, [loans]);

  const activeStepIndex = latestLoan ? getActiveStepIndex(latestLoan.status) : 0;
  const timeline = buildProgressTimeline(activeStepIndex);

  const verificationPercentage = useMemo(() => {
    if (loans.length === 0) return 0;
    const completed = loans.filter((l) =>
      ['approved', 'conditionally_approved', 'verified'].includes(l.status)
    ).length;
    return Math.round((completed / loans.length) * 100);
  }, [loans]);

  const barData = useMemo(() => {
    return [
      { name: 'Total', count: stats.total },
      { name: 'Review', count: stats.underReview },
      { name: 'Verified', count: stats.verified },
      { name: 'Pending', count: stats.pending },
    ];
  }, [stats]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-full">
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl md:text-3xl font-bold text-surface-dark">
            Welcome back, {user?.name || 'Customer'}!
          </h1>
          <motion.span
            animate={{ rotate: [0, 14, -8, 14, 0] }}
            transition={{ duration: 1.5, delay: 0.3, ease: 'easeInOut' }}
            className="text-2xl"
          >
            👋
          </motion.span>
        </div>
        <p className="text-gray-500 text-sm">
          Here's an overview of your loan applications and verification status.
        </p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-700">{error}</p>
          </div>
          <button
            onClick={refetch}
            className="text-sm font-semibold text-red-600 hover:text-red-800 underline"
          >
            Retry
          </button>
        </motion.div>
      )}

      {loans.length === 0 && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <EmptyState
            icon={FileText}
            title="No Applications Yet"
            description="You haven't created any loan applications. Click below to get started."
          />
          <div className="flex justify-center mt-4">
            <Link
              to="/loans/create"
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              Create Your First Application
            </Link>
          </div>
        </motion.div>
      )}

      {loans.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={FileText}
              value={stats.total}
              label="Total Applications"
              color="#E91E63"
              bgColor="#FCE4EC"
              index={0}
            />
            <StatCard
              icon={Clock}
              value={stats.underReview}
              label="Under Review"
              color="#F59E0B"
              bgColor="#FEF3C7"
              index={1}
            />
            <StatCard
              icon={ShieldCheck}
              value={stats.verified}
              label="Documents Verified"
              color="#16A34A"
              bgColor="#DCFCE7"
              index={2}
            />
            <StatCard
              icon={Hourglass}
              value={stats.pending}
              label="Pending"
              color="#E53935"
              bgColor="#FEE2E2"
              index={3}
            />
          </div>

          <div className="mb-6">
            <VerificationProgressBar percentage={verificationPercentage} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <ProgressTimeline timeline={timeline} />
            </div>
            <div className="space-y-6">
              <QuickActions />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <RecentActivity loans={loans} />
            </div>
            <div className="space-y-6">
              <StatusChart loans={loans} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="card">
                <h3 className="text-lg font-bold text-surface-dark mb-4">Monthly Trend</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} barCategoryGap="30%">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#999" />
                      <YAxis tick={{ fontSize: 12 }} stroke="#999" allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: '12px',
                          border: 'none',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                        }}
                      />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {barData.map((_, index) => (
                          <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div>
              <NotificationsPanel notifications={notifications} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
