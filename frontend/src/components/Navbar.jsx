import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe, Building2, Trophy } from 'lucide-react';

const Navbar = () => {
  const { lang, toggleLanguage, t } = useLanguage();
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* CDC Logo & Platform Title (Clickable to Home) */}
        <Link to="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
          <img 
            src="/logo-cdc.png" 
            alt="CDC Logo" 
            className="h-9 sm:h-11 w-auto object-contain group-hover:scale-105 transition-transform" 
          />

          <div>
            <h1 className="text-sm sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-1">
              <span className="text-cdc-cyan">SAWIT</span>
              <span className="text-cdc-orange">|</span>
              <span className="text-slate-800">{lang === 'ar' ? 'صَوّت' : 'Vote'}</span>
            </h1>
            <p className="text-[9px] sm:text-xs text-slate-500 font-semibold truncate max-w-[110px] sm:max-w-none">
              {t('headerDesc')}
            </p>
          </div>
        </Link>

        {/* Navigation & Language Switcher (Compact & balanced on mobile) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          {/* Link to About CDC & Programs */}
          <Link
            to={location.pathname === '/about' ? '/' : '/about'}
            className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all border ${
              location.pathname === '/about'
                ? 'bg-sky-50 text-cdc-cyan border-sky-200 shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
            }`}
          >
            {location.pathname === '/about' ? (
              <>
                <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cdc-cyan shrink-0" />
                <span>{lang === 'ar' ? 'المسابقات' : 'Competitions'}</span>
              </>
            ) : (
              <>
                <Building2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cdc-orange shrink-0" />
                <span>{lang === 'ar' ? 'عن المركز' : 'About CDC'}</span>
              </>
            )}
          </Link>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-slate-200 text-[11px] sm:text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all shadow-xs"
            title="تغيير اللغة"
          >
            <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cdc-cyan shrink-0" />
            <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
