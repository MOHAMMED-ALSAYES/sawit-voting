import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe, Building2, Trophy } from 'lucide-react';

const Navbar = () => {
  const { lang, toggleLanguage, t } = useLanguage();
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logos & Platform Title (Clickable to Home) */}
        <Link to="/" className="flex items-center gap-3 sm:gap-4 group">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <img 
              src="/logo-cdc.png" 
              alt="CDC Logo" 
              className="h-11 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform" 
            />
            <div className="h-7 w-[1px] bg-slate-300"></div>
            <img 
              src="/logo-ust.png" 
              alt="UST Logo" 
              className="h-11 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform" 
            />
          </div>

          <div>
            <h1 className="text-base sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span className="text-cdc-cyan">SAWIT</span>
              <span className="text-cdc-orange">|</span>
              <span className="text-slate-800">{lang === 'ar' ? 'صَوّت' : 'Vote'}</span>
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-500 font-semibold truncate max-w-[150px] sm:max-w-none">
              {t('headerDesc')}
            </p>
          </div>
        </Link>

        {/* Navigation & Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Link to About CDC & Programs */}
          <Link
            to={location.pathname === '/about' ? '/' : '/about'}
            className={`inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
              location.pathname === '/about'
                ? 'bg-sky-50 text-cdc-cyan border-sky-200'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
            }`}
          >
            {location.pathname === '/about' ? (
              <>
                <Trophy className="w-3.5 h-3.5 text-cdc-cyan" />
                <span>{lang === 'ar' ? 'المسابقات' : 'Competitions'}</span>
              </>
            ) : (
              <>
                <Building2 className="w-3.5 h-3.5 text-cdc-orange" />
                <span>{lang === 'ar' ? 'عن المركز وبرامجه' : 'About CDC'}</span>
              </>
            )}
          </Link>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all shadow-xs"
            title="تغيير اللغة"
          >
            <Globe className="w-3.5 h-3.5 text-cdc-cyan" />
            <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
