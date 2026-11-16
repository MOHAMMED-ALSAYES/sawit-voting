import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe, UserCheck } from 'lucide-react';

const Navbar = ({ isAdmin = false }) => {
  const { lang, toggleLanguage, t } = useLanguage();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logos & Platform Title */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <img 
              src="/logo-cdc.png" 
              alt="CDC Logo" 
              className="h-11 sm:h-12 w-auto object-contain hover:scale-105 transition-transform" 
            />
            <div className="h-7 w-[1px] bg-slate-300"></div>
            <img 
              src="/logo-ust.png" 
              alt="UST Logo" 
              className="h-11 sm:h-12 w-auto object-contain hover:scale-105 transition-transform" 
            />
          </div>

          <div>
            <h1 className="text-base sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span className="text-cdc-cyan">SAWIT</span>
              <span className="text-cdc-orange">|</span>
              <span className="text-slate-800">{lang === 'ar' ? 'صَوّت' : 'Vote'}</span>
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-500 font-semibold truncate max-w-[200px] sm:max-w-none">
              {t('headerDesc')}
            </p>
          </div>
        </div>

        {/* Actions & Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all shadow-sm"
          >
            <Globe className="w-3.5 h-3.5 text-cdc-cyan" />
            <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
          </button>

          {!isAdmin && (
            <a
              href="/admin/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
            >
              <UserCheck className="w-3.5 h-3.5 text-cdc-cyan" />
              <span className="hidden sm:inline">{t('login')}</span>
              <span className="sm:hidden">{t('adminShort')}</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
