import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, Plus, FolderOpen, Shield, CreditCard,
  Briefcase, GraduationCap, Car, Home, Coins, Settings, Users,
  BarChart3, ClipboardList, Calculator, TrendingUp, LogOut,
  ChevronLeft, ChevronRight, X, ShieldCheck, Fingerprint, Video,
  FileCheck, Brain, ClipboardCheck, ScanFace, Building2, Wallet
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['customer', 'loan_officer', 'loan_auditor', 'admin'] },
  { label: 'Loan Applications', path: '/loans', icon: FileText, roles: ['customer', 'loan_officer', 'loan_auditor', 'admin'] },
  { label: 'Create Application', path: '/loans/create', icon: Plus, roles: ['customer'] },
  { label: 'My Applications', path: '/loans?my=true', icon: FolderOpen, roles: ['customer'] },
  { section: 'Verification', roles: ['customer', 'loan_officer', 'loan_auditor'] },
  { label: 'Document Verification', path: '/verification/documents', icon: FileCheck, roles: ['customer', 'loan_officer', 'loan_auditor'] },
  { label: 'CIBIL Verification', path: '/verification/cibil', icon: CreditCard, roles: ['loan_auditor'] },
  { label: 'EPF Verification', path: '/verification/epf', icon: Briefcase, roles: ['loan_auditor'] },
  { label: 'Salary Verification', path: '/verification/salary', icon: Wallet, roles: ['loan_auditor'] },
  { label: 'DigiLocker KYC', path: '/verification/digilocker', icon: ShieldCheck, roles: ['customer', 'loan_auditor'] },
  { label: 'Selfie Verification', path: '/verification/selfie', icon: ScanFace, roles: ['customer', 'loan_auditor'] },
  { label: 'Live Video', path: '/verification/live-video', icon: Video, roles: ['customer', 'loan_officer'] },
  { section: 'Loan Audit', roles: ['loan_auditor', 'admin'] },
  { label: 'Audit Dashboard', path: '/audit/dashboard', icon: Shield, roles: ['loan_auditor'] },
  { label: 'AI Verification Notes', path: '/audit/ai-notes', icon: Brain, roles: ['loan_auditor'] },
  { label: 'Audit Reports', path: '/audit/reports', icon: ClipboardCheck, roles: ['loan_auditor'] },
  { section: 'Financial Tools', roles: ['customer', 'loan_officer', 'loan_auditor', 'admin'] },
  { label: 'Loan Products', path: '/financial/products', icon: Coins, roles: ['customer', 'loan_officer', 'loan_auditor', 'admin'] },
  { label: 'Interest Rates', path: '/financial/interest-rates', icon: TrendingUp, roles: ['customer', 'loan_officer', 'loan_auditor', 'admin'] },
  { label: 'EMI Calculator', path: '/financial/emi-calculator', icon: Calculator, roles: ['customer', 'loan_officer', 'loan_auditor', 'admin'] },
  { section: 'Administration', roles: ['admin'] },
  { label: 'Users', path: '/admin/users', icon: Users, roles: ['admin'] },
  { label: 'Loan Configuration', path: '/admin/loan-config', icon: Settings, roles: ['admin'] },
  { label: 'Analytics', path: '/admin/analytics', icon: BarChart3, roles: ['admin'] },
  { label: 'Audit Logs', path: '/admin/audit-logs', icon: ClipboardList, roles: ['admin'] },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const filteredItems = menuItems.filter((item) => {
    if (item.section) return item.roles.includes(user?.role);
    return item.roles.includes(user?.role);
  });

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-gradient flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          {(!collapsed || isOpen) && (
            <div>
              <h1 className="text-lg font-bold text-primary-dark">Saarthi Bank</h1>
              <p className="text-[10px] text-gray-500">Smart Loan Verification</p>
            </div>
          )}
        </div>
        <button onClick={() => setCollapsed(!collapsed)} className="hidden lg:flex p-1 rounded-lg hover:bg-primary-light text-gray-500">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
        <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-gray-100">
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
        {filteredItems.map((item, idx) => {
          if (item.section) {
            return (
              <div key={idx} className="pt-4 pb-1 px-4">
                {(!collapsed || isOpen) && (
                  <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{item.section}</span>
                )}
              </div>
            );
          }
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) => isActive ? 'sidebar-link-active' : 'sidebar-link'}
              title={item.label}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {(!collapsed || isOpen) && <span className="text-sm">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-100">
        {(!collapsed || isOpen) && (
          <div className="px-4 py-2 mb-2">
            <p className="text-sm font-medium text-gray-800 truncate">{user?.fullName}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
        )}
        <button onClick={handleLogout} className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600">
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {(!collapsed || isOpen) && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className={`hidden lg:flex flex-col bg-white border-r border-gray-100 transition-all duration-300 ${collapsed ? 'w-[72px]' : 'w-64'}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ type: 'spring', damping: 25 }} className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:hidden">
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
