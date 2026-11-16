import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { 
  Trophy, 
  ArrowLeft, 
  ArrowRight, 
  Calendar, 
  Users, 
  Award, 
  ShieldCheck, 
  Compass, 
  GraduationCap, 
  Building2, 
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Home = () => {
  const { isRtl } = useLanguage();
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
      title: 'البرامج التدريبية المتقدمة',
      desc: 'دورات تدريبية متخصصة ومكثفة في مجالات الذكاء الاصطناعي، البرمجيات، إدارة المشاريع، واللغات، لرفع كفاءة الطلاب وسوق العمل.',
      icon: GraduationCap,
      color: 'text-cdc-cyan',
      bg: 'bg-sky-50 border-sky-200/60'
    },
    {
      title: 'الاستشارات الأكاديمية والمهنية',
      desc: 'تقديم دراسات الجدوى والاستشارات الإدارية والتقنية للمؤسسات التعليمية والشركات بالتعاون مع نخبة خبراء جامعة العلوم والتكنولوجيا.',
      icon: Compass,
      color: 'text-cdc-orange',
      bg: 'bg-orange-50 border-orange-200/60'
    },
    {
      title: 'تنظيم المسابقات والهاكاثونات',
      desc: 'إدارة المسابقات الإبداعية والابتكارية للطلاب لتشجيع روح التنافس الشريف واكتشاف المبتكرين ورعايتهم.',
      icon: Trophy,
      color: 'text-amber-500',
      bg: 'bg-amber-50 border-amber-200/60'
    },
    {
      title: 'التأهيل المهني والشهادات الدولية',
      desc: 'إعداد الطلاب والكوادر لاجتياز اختبارات الاعتماد المهني العالمية المعتمدة التي تفتح آفاق التوظيف الدولي.',
      icon: ShieldCheck,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200/60'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col pt-20">
      
      {/* Dynamic Background Glow Orbs */}
      <div className="glow-orb-cyan -top-20 -right-20 animate-pulse"></div>
      <div className="glow-orb-orange top-96 -left-20 animate-pulse" style={{ animationDuration: '6s' }}></div>
      <div className="glow-orb-cyan bottom-40 right-1/4"></div>

      {/* Header Fixed at top */}
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-10 sm:pt-14 pb-12 text-center relative z-10">
        
        {/* Glow Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full bg-white/95 backdrop-blur-md shadow-sm border border-slate-200/80 text-[11px] sm:text-xs font-bold text-slate-800 mb-6 sm:mb-8 transition-transform hover:scale-105">
          <Sparkles className="w-4 h-4 text-cdc-orange" />
          <span>المنظومة الإلكترونية المعتمدة للمسابقات والتصويت النزيه</span>
          <span className="w-2 h-2 rounded-full bg-cdc-cyan"></span>
        </div>

        {/* Hero Title: Spotlight on Center Name */}
        <div className="space-y-3 mb-6">
          <p className="text-base sm:text-xl font-bold text-slate-500">
            أهلاً بكم في بوابة المسابقات الرسمية لـ
          </p>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-cdc-orange via-amber-600 to-cdc-orange bg-clip-text text-transparent">
              مركز الاستشارات والتنمية
            </span>
            <br />
            <span className="text-ust-blue text-2xl sm:text-4xl lg:text-5xl mt-1 block font-extrabold">
              جامعة العلوم والتكنولوجيا
            </span>
          </h1>
        </div>

        <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed mb-8 sm:mb-10 font-medium px-2">
          نظام التنافس الأكاديمي الرقمي المخصص لدعم الطلاب المبتكرين واختيار الفائزين بنزاهة تامة وتكريمهم احتفالياً.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm font-bold text-slate-700">
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-cdc-cyan" />
            <span>صوت واحد مؤكد لكل مصوت</span>
          </div>
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-cdc-orange" />
            <span>سرية تامة ومطلقة للنتائج والأصوات</span>
          </div>
          <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
            <span>شاشة احتفالية وعجلة دوارة حتمية</span>
          </div>
        </div>
      </section>

      {/* Active Competitions Showcase */}
      <section className="max-w-5xl mx-auto px-4 py-6 sm:py-8 w-full relative z-10">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Trophy className="w-6 h-6 text-cdc-cyan" />
            <span>المسابقات المتاحة للتصويت حالياً</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">اختر المسابقة وشارك بصوتك لدعم الطلاب المبدعين</p>
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
                  <span>التصويت مفتوح الآن</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">{c.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 max-w-xl leading-relaxed">
                  {c.description}
                </p>
                <div className="flex items-center gap-5 text-xs text-slate-400 pt-2 sm:pt-3">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-cdc-cyan" />
                    <span>تاريخ الانتهاء: {new Date(c.end_at).toLocaleDateString('ar-YE')}</span>
                  </span>
                </div>
              </div>

              <a
                href={`/c/${c.slug}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-cdc-cyan to-sky-600 hover:from-cdc-cyan-hover hover:to-sky-700 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 shrink-0"
              >
                <span>الانتقال لصفحة التصويت</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </a>
            </div>
          ))}

          {competitions.length === 0 && !loading && (
            <div className="text-center py-12 bg-white/80 rounded-3xl border border-slate-200 text-slate-400 text-xs">
              لا توجد مسابقات نشطة في الوقت الحالي.
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
            <span>عن المركز وخدماته الأكاديمية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
            مركز الاستشارات والتنمية (CDC)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            الذراع التدريبي والاستشاري لجامعة العلوم والتكنولوجيا، رائد بناء وتطوير القدرات الأكاديمية والمهنية وتأهيل الكفاءات لمواكبة متطلبات العصر الرقمي.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
              <span className="text-cdc-cyan">رؤية</span> و <span className="text-cdc-orange">رسالة</span> المركز
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              تقديم استشارات وتدريب نوعي يسهم بفاعلية في تمكين وتأهيل الطلاب والمؤسسات وقيادة التحول الإيجابي في المجتمع من خلال برامج متطورة ومعايير جودة عالمية.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3 sm:gap-4 bg-white/10 p-3 sm:p-4 rounded-2xl border border-white/10">
            <img src="/logo-cdc.png" alt="CDC" className="h-10 sm:h-12 w-auto" />
            <div className="h-7 sm:h-8 w-[1px] bg-white/20"></div>
            <img src="/logo-ust.png" alt="UST" className="h-10 sm:h-12 w-auto" />
          </div>
        </div>

      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 border-t border-slate-200/80 bg-white/90 backdrop-blur-md text-center text-xs text-slate-500 relative z-10">
        <p>© 2026 جميع الحقوق محفوظة لـ <b>مركز الاستشارات والتنمية (CDC)</b> • <b>جامعة العلوم والتكنولوجيا (UST)</b></p>
      </footer>

    </div>
  );
};

export default Home;
