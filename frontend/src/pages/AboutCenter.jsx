import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Building2, 
  Compass, 
  Target, 
  GraduationCap, 
  Award, 
  ShieldCheck, 
  BookOpen, 
  Users, 
  Laptop, 
  Stethoscope, 
  Languages, 
  Briefcase, 
  BarChart, 
  TrendingUp, 
  Cpu, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  MessageCircle,
  Sparkles,
  Trophy,
  Phone,
  Mail,
  MapPin,
  Clock,
  ExternalLink
} from 'lucide-react';

const FacebookIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const AboutCenter = () => {
  const { isRtl, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [contact, setContact] = useState({
    phone_primary: '730116384',
    phone_secondary: '03-200000',
    whatsapp_number: '730116384',
    whatsapp_channel_url: 'https://whatsapp.com',
    email_primary: 'cdc.hodeidah@ust.edu.ye',
    facebook_url: 'https://facebook.com',
    address: 'اليمن - الحديدة - جامعة العلوم والتكنولوجيا - فرع الحديدة',
    extra_info: 'أوقات الدوام: من السبت إلى الخميس (8:00 ص - 2:00 م)'
  });

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await api.get('/public/contact-info');
        if (res.data) {
          setContact((prev) => ({ ...prev, ...res.data }));
        }
      } catch (err) {
        console.error('Failed to load contact info', err);
      }
    };
    fetchContact();
  }, []);

  const objectives = [
    {
      id: 1,
      title: isRtl ? 'خدمة أفراد المجتمع ومؤسساته بجودة عالية' : 'Serving society members and institutions with world-class quality'
    },
    {
      id: 2,
      title: isRtl ? 'تقديم خدمات تدريبية وتأهيلية واستشارية بجودة عالية' : 'Providing high-tier training, qualifying, and consulting services'
    },
    {
      id: 3,
      title: isRtl ? 'تقديم دورات ودبلومات نوعية تلبي احتياجات سوق العمل' : 'Offering specialized courses and diplomas tailored to market demands'
    },
    {
      id: 4,
      title: isRtl ? 'الاستفادة من الكوادر والقدرات المجتمعية البارزة والكفؤة' : 'Leveraging distinguished expertise to lead impactful community programs'
    }
  ];

  const means = [
    {
      id: 1,
      title: isRtl ? 'إقامة الدورات التدريبية ذات الجودة العالية' : 'Hosting high-quality professional training programs'
    },
    {
      id: 2,
      title: isRtl ? 'تنظيم المؤتمرات والندوات (الإدارية - التربوية - الاجتماعية)' : 'Organizing conferences and symposiums in management, education & social fields'
    },
    {
      id: 3,
      title: isRtl ? 'تقديم الاستشارات الإدارية (التسويق - الهيكلة - الجودة - الحوافز)' : 'Management consulting in marketing, restructuring, quality systems & incentives'
    },
    {
      id: 4,
      title: isRtl ? 'وضع خطط تدريبية شاملة للمؤسسات لتعزيز القيم المؤسسية' : 'Comprehensive corporate training plans to reinforce core organizational values'
    },
    {
      id: 5,
      title: isRtl ? 'التواصل التفاعلي الرقمي لتبادل الرؤى والمقترحات التطويرية' : 'Interactive digital engagement to exchange progressive administrative insights'
    }
  ];

  const services = [
    {
      title: isRtl ? 'التدريب الاحترافي' : 'Professional Training',
      desc: isRtl ? 'برامج وورش تدريبية متخصصة تواكب أحدث المعايير العلمية والتقنية الحديثة.' : 'Specialized training workshops aligned with cutting-edge academic standards.',
      icon: GraduationCap,
      color: 'text-cdc-cyan',
      bg: 'bg-sky-50 border-sky-200/70'
    },
    {
      title: isRtl ? 'الاستشارات والدراسات' : 'Consultations & Studies',
      desc: isRtl ? 'دراسات جدوى متكاملة وحلول استشارية إدارية وتقنية للمؤسسات والشركات.' : 'Comprehensive feasibility studies and advisory solutions for institutions.',
      icon: Compass,
      color: 'text-cdc-orange',
      bg: 'bg-orange-50 border-orange-200/70'
    },
    {
      title: isRtl ? 'تنظيم المؤتمرات والندوات' : 'Conferences & Symposiums',
      desc: isRtl ? 'إدارة وتنسيق الفعاليات العلمية والمؤتمرات وحلقات النقاش وورش العمل.' : 'Managing academic forums, seminars, panel discussions, and workshops.',
      icon: Users,
      color: 'text-amber-500',
      bg: 'bg-amber-50 border-amber-200/70'
    },
    {
      title: isRtl ? 'برامج مخصصة وتأجير قاعات' : 'Custom Corporate & Hall Rentals',
      desc: isRtl ? 'برامج مصممة خصيصاً للشركات، بالإضافة لتأجير قاعات مكيفة مجهزة بأحدث الوسائل.' : 'Bespoke corporate programs and state-of-the-art air-conditioned training halls.',
      icon: Building2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200/70'
    }
  ];

  const programs = [
    { id: 1, name: isRtl ? 'البرامج الإدارية والتنمية البشرية' : 'Management & Human Development', icon: Briefcase, color: 'text-sky-600 bg-sky-50' },
    { id: 2, name: isRtl ? 'البرامج المالية والمصرفية' : 'Finance & Banking Programs', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
    { id: 3, name: isRtl ? 'برامج التخطيط والإحصاء' : 'Planning & Statistics Programs', icon: BarChart, color: 'text-indigo-600 bg-indigo-50' },
    { id: 4, name: isRtl ? 'الاستشارات المالية والإدارية والهياكل' : 'Financial & Administrative Consulting', icon: Compass, color: 'text-amber-600 bg-amber-50' },
    { id: 5, name: isRtl ? 'اللغات والترجمة' : 'Languages & Translation', icon: Languages, color: 'text-purple-600 bg-purple-50' },
    { id: 6, name: isRtl ? 'برامج إعداد الخبراء والاستشاريين' : 'Consultants & Experts Qualification', icon: Award, color: 'text-rose-600 bg-rose-50' },
    { id: 7, name: isRtl ? 'الرخصة الدولية لقيادة الحاسوب (ICDL)' : 'International Computer Driving License (ICDL)', icon: Laptop, color: 'text-blue-600 bg-blue-50' },
    { id: 8, name: isRtl ? 'الدبلومات التدريبية المهنية' : 'Professional Training Diplomas', icon: BookOpen, color: 'text-teal-600 bg-teal-50' },
    { id: 9, name: isRtl ? 'البرامج القيادية والتطويرية' : 'Leadership & Executive Development', icon: ShieldCheck, color: 'text-cyan-600 bg-cyan-50' },
    { id: 10, name: isRtl ? 'برامج تنمية المهارات الشخصية' : 'Soft Skills & Personal Development', icon: Sparkles, color: 'text-orange-600 bg-orange-50' },
    { id: 11, name: isRtl ? 'برامج الصحة والسلامة المهنية' : 'Occupational Health & Safety', icon: ShieldCheck, color: 'text-red-600 bg-red-50' },
    { id: 12, name: isRtl ? 'برامج الجودة والاعتماد' : 'Quality Assurance & Accreditation', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
    { id: 13, name: isRtl ? 'البرامج التعليمية والتربوية' : 'Educational & Pedagogical Programs', icon: GraduationCap, color: 'text-violet-600 bg-violet-50' },
    { id: 14, name: isRtl ? 'برامج التسويق والعلاقات العامة' : 'Marketing & Public Relations', icon: Users, color: 'text-pink-600 bg-pink-50' },
    { id: 15, name: isRtl ? 'برامج التمريض والعلوم الصحية' : 'Nursing & Healthcare Sciences', icon: Stethoscope, color: 'text-red-500 bg-red-50' },
    { id: 16, name: isRtl ? 'لغات البرمجة وتقنية المعلومات' : 'Programming Languages & IT Systems', icon: Cpu, color: 'text-sky-700 bg-sky-50' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pt-20 sm:pt-24">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 w-full pb-16">
        
        {/* Breadcrumb / Back Link */}
        <div className="mb-4 sm:mb-6 flex flex-row items-center justify-between gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-slate-500 hover:text-cdc-cyan transition-colors truncate"
          >
            {isRtl ? <ArrowRight className="w-3.5 h-3.5 shrink-0" /> : <ArrowLeft className="w-3.5 h-3.5 shrink-0" />}
            <span>{isRtl ? 'العودة للرئيسية ومسابقات التصويت' : 'Back to Home & Competitions'}</span>
          </Link>

          <span className="text-[10px] sm:text-xs font-semibold text-cdc-orange bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200 shrink-0">
            {isRtl ? 'فرع الحديدة' : 'Hodeidah Branch'}
          </span>
        </div>

        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-slate-900 via-ust-navy to-slate-900 text-white rounded-3xl p-5 sm:p-10 shadow-xl relative overflow-hidden mb-8 sm:mb-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cdc-cyan/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cdc-orange/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cdc-cyan text-[11px] sm:text-xs font-bold mb-3 sm:mb-4 backdrop-blur-md border border-white/10">
              <Building2 className="w-3.5 h-3.5" />
              <span>{isRtl ? 'الدليل التعريفي والبرامج المعتمدة' : 'Official Center Profile & Accredited Programs'}</span>
            </div>

            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-3 sm:mb-4 tracking-tight">
              {isRtl ? (
                <>
                  مركز الاستشارات والتنمية <br />
                  <span className="text-cdc-orange">جامعة العلوم والتكنولوجيا</span>
                </>
              ) : (
                <>
                  Consultations & Development Center <br />
                  <span className="text-cdc-orange">University of Science & Technology</span>
                </>
              )}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              {isRtl 
                ? 'الذراع الأكاديمي والاستشاري الرائد لبناء وتطوير القدرات وتأهيل الكفاءات المجتمعية والمؤسسية وفق أرقى معايير الجودة العالمية والتميز المستدام.'
                : 'The premier academic and consulting arm committed to cultivating professional capacities and empowering institutions with world-class excellence.'
              }
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 text-xs font-bold">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cdc-cyan hover:bg-cdc-cyan-hover text-white transition-all shadow-sm active:scale-95 text-xs font-bold"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>{isRtl ? 'عرض المسابقات والتصويت' : 'View Competitions & Voting'}</span>
            </Link>

            <a
              href="https://wa.me/967730116384"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/15 text-xs font-bold"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isRtl ? 'التواصل والاستفسارات' : 'Contact & Inquiries'}</span>
            </a>
          </div>
        </section>

        {/* Section 1: Vision, Mission & Goals */}
        <section className="space-y-6 mb-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Vision Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-cdc-cyan flex items-center justify-center mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-2">
                {isRtl ? 'رؤيتنا' : 'Our Vision'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {isRtl 
                  ? 'أن يكون مركز الاستشارات والتنمية بفرع جامعة العلوم والتكنولوجيا بالحديدة من المراكز الرائدة محلياً والمتميزة إقليمياً.'
                  : 'To be among the leading centers locally and exceptionally distinguished regionally across consultation and training.'
                }
              </p>
            </div>

            {/* Mission Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 text-cdc-orange flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-2">
                {isRtl ? 'رسالتنا' : 'Our Mission'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {isRtl 
                  ? 'مركز الاستشارات والتنمية مركز تنموي يسعى من خلال أنشطته التدريبية والتأهيلية والاستشارية إلى تطوير أفراد المجتمع ومؤسساته وبما يساهم في عملية التنمية معتمداً في تنفيذ برامجه على ذوي الخبرة والكفاءة العالية، حريصاً على تقديم أنشطته بجودة عالية تحقق له الريادة والتميز.'
                  : 'A developmental center dedicated to empowering society members and corporate entities through quality training, qualifying, and advisory services backed by distinguished expertise.'
                }
              </p>
            </div>

          </div>

          {/* Objectives Grid */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
            <h3 className="text-base sm:text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-cdc-cyan" />
              <span>{isRtl ? 'أهداف المركز الرئيسية' : 'Core Center Objectives'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {objectives.map((obj) => (
                <div
                  key={obj.id}
                  className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex items-start gap-3"
                >
                  <div className="w-7 h-7 rounded-full bg-cdc-cyan text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {obj.id}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-semibold leading-relaxed">
                    {obj.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* Section 2: Services & Means */}
        <section className="space-y-6 mb-12">
          
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
              {isRtl ? 'خدماتنا وتسهيلاتنا التدريبية' : 'Our Services & Facilities'}
            </h2>
            <p className="text-xs text-slate-500">
              {isRtl ? 'منظومة خدمات استشارية وتدريبية متكاملة للمؤسسات والأفراد' : 'Integrated consulting and training solutions for institutions and individuals'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {services.map((srv, idx) => {
              const Icon = srv.icon;
              return (
                <div
                  key={idx}
                  className={`p-6 rounded-3xl border bg-white shadow-sm flex flex-col justify-between ${srv.bg}`}
                >
                  <div>
                    <div className={`w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 ${srv.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-2">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {srv.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Means of Achieving Goals */}
          <div className="bg-gradient-to-br from-white to-sky-50/50 rounded-3xl p-6 sm:p-8 shadow-sm border border-sky-200/80">
            <h3 className="text-base sm:text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{isRtl ? 'وسائل وآليات تحقيق الأهداف' : 'Means of Achieving Strategic Goals'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {means.map((m) => (
                <div key={m.id} className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-cdc-orange mt-2 shrink-0"></span>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    {m.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* Section 3: The 16 Accredited Programs */}
        <section className="space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {isRtl ? 'برامجنا الأكاديمية والتدريبية (16 برنامجاً)' : 'Our Academic & Training Programs (16 Tracks)'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {isRtl ? 'تخصصات نوعية ودبلومات معتمدة تفتح آفاق التوظيف والتميز' : 'Accredited tracks designed to meet regional job market needs'}
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cdc-cyan-light text-cdc-cyan text-xs font-bold w-fit">
              <Award className="w-3.5 h-3.5" />
              <span>{isRtl ? 'شهادات واعتمادات رسمية' : 'Certified Credentials'}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {programs.map((prog) => {
              const Icon = prog.icon;
              return (
                <div
                  key={prog.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-cdc-cyan/40 hover:shadow-md transition-all flex items-start gap-3.5 group"
                >
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${prog.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block mb-0.5">
                      {isRtl ? `مسار ${prog.id}` : `Track ${prog.id}`}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {prog.name}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>

        </section>

        {/* Section 4: Contact & Social Channels */}
        <section className="mt-12 bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2 border border-emerald-200">
                <Phone className="w-3.5 h-3.5" />
                <span>{isRtl ? 'قنوات التواصل والاستفسارات الرسمية' : 'Official Inquiries & Contact Channels'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {isRtl ? 'تواصل مع مركز الاستشارات والتنمية' : 'Connect with CDC'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isRtl ? 'يسعدنا الرد على استفساراتكم والتسجيل في الدورات والبرامج الأكاديمية' : 'We are pleased to answer your inquiries and enroll you in specialized training programs'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            
            {/* Phones Card */}
            <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-200/80 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-white text-cdc-cyan shadow-sm flex items-center justify-center mb-3">
                  <Phone className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  {isRtl ? 'أرقام الاتصال والتواصل' : 'Contact Numbers'}
                </h3>
                <div className="space-y-1.5 text-xs font-mono font-bold text-slate-700">
                  {contact.phone_primary && (
                    <a href={`tel:${contact.phone_primary}`} className="block hover:text-cdc-cyan hover:underline">
                      {contact.phone_primary}
                    </a>
                  )}
                  {contact.phone_secondary && (
                    <div className="text-slate-600 font-medium">
                      {contact.phone_secondary}
                    </div>
                  )}
                </div>
              </div>

              {contact.phone_primary && (
                <a
                  href={`tel:${contact.phone_primary}`}
                  className="mt-4 inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-white text-cdc-cyan font-bold text-xs shadow-xs border border-sky-200 hover:bg-sky-100 transition-all"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{isRtl ? 'اتصال مباشر' : 'Call Now'}</span>
                </a>
              )}
            </div>

            {/* WhatsApp Card */}
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-white text-emerald-600 shadow-sm flex items-center justify-center mb-3">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  {isRtl ? 'واتساب وقناة المركز' : 'WhatsApp & Channel'}
                </h3>
                <p className="text-xs text-slate-600 font-mono">
                  {contact.whatsapp_number ? `واتساب: ${contact.whatsapp_number}` : 'متاح عبر واتساب'}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  {isRtl ? 'لمتابعة أحدث أخبار الدورات والنتائج أولاً بأول' : 'Follow latest course announcements and updates'}
                </p>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                {contact.whatsapp_number && (
                  <a
                    href={`https://wa.me/${contact.whatsapp_number.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{isRtl ? 'محادثة واتساب' : 'Chat on WhatsApp'}</span>
                  </a>
                )}
                {contact.whatsapp_channel_url && (
                  <a
                    href={contact.whatsapp_channel_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-white text-emerald-700 font-bold text-[11px] border border-emerald-200 hover:bg-emerald-100/60"
                  >
                    <span>{isRtl ? 'الانتقال لقناة واتساب' : 'Visit WhatsApp Channel'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            {/* Email & Facebook Card */}
            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200/80 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-white text-blue-600 shadow-sm flex items-center justify-center mb-3">
                  <FacebookIcon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  {isRtl ? 'البريد الإلكتروني والفيسبوك' : 'Email & Social Media'}
                </h3>
                {contact.email_primary && (
                  <a href={`mailto:${contact.email_primary}`} className="block text-xs font-mono text-slate-700 hover:text-blue-600 hover:underline truncate">
                    {contact.email_primary}
                  </a>
                )}
                {contact.email_secondary && (
                  <a href={`mailto:${contact.email_secondary}`} className="block text-xs font-mono text-slate-500 hover:underline truncate mt-1">
                    {contact.email_secondary}
                  </a>
                )}
              </div>

              {contact.facebook_url && (
                <a
                  href={contact.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all active:scale-95"
                >
                  <FacebookIcon className="w-4 h-4" />
                  <span>{isRtl ? 'صفحة الفيسبوك الرسمية' : 'Visit Facebook Page'}</span>
                </a>
              )}
            </div>

          </div>

          {/* Location & Extra Info */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-600">
            {contact.address && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                <span>{contact.address}</span>
              </div>
            )}
            {contact.extra_info && (
              <div className="flex items-center gap-2 text-slate-500">
                <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                <span>{contact.extra_info}</span>
              </div>
            )}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200/80 bg-white/95 backdrop-blur-md text-center text-xs text-slate-500 relative z-10">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-3">
          <p className="text-slate-500">
            © 2026 {t('allRightsReserved')} <b className="text-slate-800">{t('centerName')}</b> • <b className="text-slate-800">{t('universityName')}</b>
          </p>

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
              title="تواصل مع المطور"
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

export default AboutCenter;
