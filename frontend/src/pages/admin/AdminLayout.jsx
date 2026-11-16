import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  LayoutDashboard, 
  Trophy, 
  Users, 
  BarChart3, 
  Sparkles, 
  History, 
  Settings as SettingsIcon,
  LogOut,
  Globe,
  Menu,
  X
} from 'lucide-react';

const AdminLayout = ({ children, activeTab = 'dashboard' }) => {
  const navigate = useNavigate();
  const { lang, toggleLanguage, t } = useLanguage();
  const adminName = localStorage.getItem('sawit_admin_name') || 'Admin';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('sawit_admin_token');
    localStorage.removeItem('sawit_admin_name');
    navigate('/admin/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'competitions', label: 'المسابقات', icon: Trophy, path: '/admin/competitions' },
    { id: 'students', label: 'الطلاب والمشاركون', icon: Users, path: '/admin/students' },
    { id: 'results', label: 'النتائج والأصوات', icon: BarChart3, path: '/admin/results' },
    { id: 'announcement', label: 'إعلان الفائز', icon: Sparkles, path: '/admin/announcement' },
    { id: 'audit', label: 'سجل العمليات', icon: History, path: '/admin/audit' },
    { id: 'settings', label: 'الإعدادات والأمان', icon: SettingsIcon, path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-cairo">
      
      {/* Mobile Top Navbar (Visible only on small screens) */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <img src="/logo-cdc.png" alt="CDC Logo" className="h-8 w-auto bg-white/10 rounded-lg p-0.5" />
          <span className="font-black text-sm tracking-tight flex items-center gap-1">
            <span className="text-cdc-cyan">SAWIT</span>
            <span>| صَوّت</span>
          </span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar (Desktop permanent, Mobile overlay/drawer) */}
      <aside
        className={`fixed md:sticky top-0 bottom-0 start-0 z-40 w-64 bg-slate-900 text-white flex flex-col shrink-0 border-e border-slate-800 transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 rtl:translate-x-full rtl:md:translate-x-0'
        } h-screen`}
      >
        {/* Brand & Center Header */}
        <div className="p-5 border-b border-slate-800 flex items-center gap-3">
          <img src="/logo-cdc.png" alt="CDC Logo" className="h-10 w-auto bg-white/10 rounded-xl p-1" />
          <div>
            <h2 className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
              <span className="text-cdc-cyan font-black">SAWIT</span>
              <span>صَوّت</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-medium">لوحة إدارة المسابقات</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-cdc-cyan text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Developer Credit */}
        <div className="px-3 py-2.5 mx-3 mb-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-[10px]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-slate-400 font-semibold">تطوير وبرمجة:</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-cdc-cyan/20 text-cdc-cyan font-bold">المطور</span>
          </div>
          <p className="text-white font-extrabold text-xs">MOHAMMED SAYES</p>
          <p className="text-slate-400 text-[10px]">م. محمد الصايص</p>
          <a
            href="https://wa.me/967730116384"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 font-mono text-[11px] font-bold border border-emerald-500/30 transition-colors"
          >
            <span>واتساب: 730116384</span>
          </a>
        </div>

        {/* Admin Footer & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-slate-400">
              المسؤول: <b className="text-white">{adminName}</b>
            </span>
            <button
              onClick={toggleLanguage}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
              title="تغيير اللغة"
            >
              <Globe className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-xs transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for Mobile */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-sm"
        ></div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-ust.png" alt="UST Logo" className="h-8 w-auto hidden sm:block" />
            <h2 className="text-xs sm:text-sm font-bold text-slate-800">
              مركز الاستشارات والتنمية • جامعة العلوم والتكنولوجيا
            </h2>
          </div>
          <div className="flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>النظام متصل وقيد العمل</span>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </div>

        {/* Admin Footer */}
        <footer className="px-6 py-4 border-t border-slate-200 bg-white text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 مركز الاستشارات والتنمية • جامعة العلوم والتكنولوجيا</p>
          <div className="flex items-center gap-2 text-[11px] text-slate-600">
            <span>تطوير وبرمجة المنظومة:</span>
            <b className="text-slate-900 font-bold">MOHAMMED SAYES (محمد الصايص)</b>
            <span>•</span>
            <a
              href="https://wa.me/967730116384"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cdc-cyan hover:underline font-mono font-bold"
            >
              730116384
            </a>
          </div>
        </footer>
      </main>

    </div>
  );
};

export default AdminLayout;
