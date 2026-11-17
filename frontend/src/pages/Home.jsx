import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { 
  Trophy, 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  ShieldCheck, 
  Compass, 
  GraduationCap, 
  Building2, 
  Sparkles,
  MessageCircle
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Home = () => {
  const { isRtl, t } = useLanguage();
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const res = await api.get('/public/competitions');
        setCompetitions(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompetitions();
  }, []);

  const cdcServices = [
    {
      title: t('srv1Title'),
      desc: t('srv1Desc'),
      icon: GraduationCap,
      color: 'text-cdc-cyan',
      bg: 'bg-sky-50 border-sky-200/60'
    },
    {
      title: t('srv2Title'),
      desc: t('srv2Desc'),
      icon: Compass,
      color: 'text-cdc-orange',
      bg: 'bg-orange-50 border-orange-200/60'
    },
    {
      title: t('srv4Title'),
      desc: t('srv4Desc'),
      icon: ShieldCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200/60'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col pt-16 sm:pt-20">
      
      {/* Dynamic Background Glow Orbs */}
      <div className="glow-orb-cyan -top-20 -right-20 animate-pulse"></div>
      <div className="glow-orb-orange top-96 -left-20 animate-pulse" style={{ animationDuration: '6s' }}></div>
      <div className="glow-orb-cyan bottom-40 right-1/4"></div>

      {/* Header Fixed at top */}
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-10 sm:pt-14 pb-12 text-center relative z-10">
        
        {/* Glow Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full bg-white/95 backdrop-blur-md shadow-sm border border-slate-200/80 text-[11px] sm:text-xs font-bold text-slate-800 mb-6 transition-transform hover:scale-105">
          <Sparkles className="w-4 h-4 text-cdc-orange" />
          <span>{t('heroBadge')}</span>
          <span className="w-2 h-2 rounded-full bg-cdc-cyan"></span>
        </div>

        {/* Center Glowing Logo */}
        <div className="flex justify-center mb-6">
          <div className="relative group">
            {/* Ambient Multi-layer Aura Glow */}
            <div className="absolute -inset-3 bg-gradient-to-r from-cdc-cyan via-sky-400 to-cdc-orange rounded-3xl blur-2xl opacity-65 group-hover:opacity-90 transition-all duration-700 animate-pulse"></div>
            <div className="absolute -inset-1 bg-gradient-to-r from-cdc-orange/40 via-amber-400/30 to-cdc-cyan/40 rounded-3xl blur-md"></div>

            {/* Logo Glass Container */}
            <div className="relative p-3.5 sm:p-4 rounded-3xl bg-white/95 backdrop-blur-xl border border-white/80 shadow-xl shadow-sky-500/10 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
              <img 
                src="/logo-cdc.png" 
                alt="شعار مركز الاستشارات والتنمية" 
                className="h-16 sm:h-20 md:h-24 w-auto object-contain filter drop-shadow-md" 
              />
            </div>
          </div>
        </div>

        {/* Hero Title: Spotlight on Center Name */}
        <div className="space-y-3 mb-2 sm:mb-4">
          <p className="text-base sm:text-xl font-bold text-slate-500">
            {t('welcomeTo')}
          </p>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-cdc-orange via-amber-600 to-cdc-orange bg-clip-text text-transparent">
              {t('centerMainTitle')}
            </span>
            <br />
            <span className="text-ust-blue text-2xl sm:text-4xl lg:text-5xl mt-1 block font-extrabold">
              {t('universityMainTitle')}
            </span>
          </h1>
        </div>
      </section>

      {/* Active Competitions Showcase */}
      <section className="max-w-5xl mx-auto px-4 py-6 sm:py-8 w-full relative z-10">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-cdc-cyan" />
            <span>{t('activeCompetitionsTitle')}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">{t('activeCompetitionsSub')}</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {competitions.map((c) => (
            <div
              key={c.id}
              className="bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md hover:shadow-xl hover:border-cdc-cyan/40 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-cdc-cyan via-cdc-orange to-ust-blue"></div>

              <div className="space-y-2 flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>{c.status === 'active' ? t('votingOpenNow') : t('votingClosedNow')}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">{c.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 max-w-xl leading-relaxed">
                  {c.description}
                </p>
                <div className="flex items-center gap-5 text-xs text-slate-400 pt-2 sm:pt-3">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-cdc-cyan" />
                    <span>{t('endDatePrefix')}{new Date(c.end_at).toLocaleDateString(isRtl ? 'ar-YE' : 'en-US')}</span>
                  </span>
                </div>
              </div>

              <a
                href={`/c/${c.slug}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-7 sm:py-3.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-cdc-cyan to-sky-600 hover:from-cdc-cyan-hover hover:to-sky-700 text-white font-bold sm:font-extrabold text-xs sm:text-sm shadow-sm hover:shadow-md transition-all active:scale-95 shrink-0"
              >
                <span>{t('goToVotePage')}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </a>
            </div>
          ))}

          {competitions.length === 0 && !loading && (
            <div className="text-center py-12 bg-white/80 rounded-3xl border border-slate-200 text-slate-400 text-xs">
              {t('noActiveComps')}
            </div>
          )}
        </div>
      </section>

      {/* About CDC Center & Services Showcase */}
      <section className="max-w-6xl mx-auto px-4 py-12 sm:py-16 w-full relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 text-cdc-orange text-xs font-bold mb-3 border border-orange-200">
            <Building2 className="w-4 h-4" />
            <span>{t('aboutCenterBadge')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
            {t('aboutCenterTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t('aboutCenterDesc')}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {cdcServices.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                className={`p-6 sm:p-7 rounded-3xl border bg-white/95 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-4 sm:gap-5 ${service.bg}`}
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center shrink-0 ${service.color}`}>
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {service.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Vision & Mission Banner */}
        <div className="mt-8 sm:mt-10 p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-ust-navy to-slate-900 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-center md:text-start">
            <h3 className="text-lg sm:text-2xl font-black text-white flex items-center justify-center md:justify-start gap-2">
              {isRtl ? (
                <>
                  <span className="text-cdc-cyan">رؤية</span>
                  <span>و</span>
                  <span className="text-cdc-orange">رسالة</span>
                  <span>المركز</span>
                </>
              ) : (
                <>
                  <span>Center</span>
                  <span className="text-cdc-cyan">Vision</span>
                  <span>&</span>
                  <span className="text-cdc-orange">Mission</span>
                </>
              )}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t('visionMissionDesc')}
            </p>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cdc-cyan hover:bg-cdc-cyan-hover text-white text-xs font-bold shadow-md transition-all active:scale-95"
              >
                <span>{isRtl ? 'استكشاف دليل المركز والـ 16 برنامجاً معتمداً' : 'Explore All 16 Center Programs & Profile'}</span>
                {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </Link>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3 sm:gap-4 bg-white/10 p-3 sm:p-4 rounded-2xl border border-white/10">
            <img src="/logo-cdc.png" alt="CDC" className="h-10 sm:h-12 w-auto" />
            <div className="h-7 sm:h-8 w-[1px] bg-white/20"></div>
            <img src="/logo-ust.png" alt="UST" className="h-10 sm:h-12 w-auto" />
          </div>
        </div>

      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200/80 bg-white/95 backdrop-blur-md text-center text-xs text-slate-500 relative z-10">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-3">
          
          <p className="text-slate-500">
            © 2026 {t('allRightsReserved')} <b className="text-slate-800">{t('centerName')}</b> • <b className="text-slate-800">{t('universityName')}</b>
          </p>

          {/* Elegant Developer Credits Badge */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-50/90 border border-slate-200/90 shadow-sm text-xs">
            <span className="text-slate-500 font-medium">
              {isRtl ? 'المطور:' : 'Developer:'}
            </span>
            
            <span className="font-extrabold text-slate-900 tracking-tight">
              MOHAMMED SAYES (محمد سايس)
            </span>

            <span className="text-slate-300 hidden sm:inline">•</span>

            <a
              href="https://wa.me/967730116384"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 font-bold font-mono text-xs transition-all hover:scale-105 active:scale-95 shadow-sm"
              title="تواصل مع المطور عبر واتساب أو اتصال"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>730116384</span>
            </a>
          </div>

        </div>
      </footer>

    </div>
  );
};

export default Home;
