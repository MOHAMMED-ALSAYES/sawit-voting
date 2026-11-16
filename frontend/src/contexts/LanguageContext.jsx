import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  ar: {
    appName: 'SAWIT | صَوّت',
    tagline: 'المنصة الرسمية للتصويت في المسابقات التعليمية',
    centerName: 'مركز الاستشارات والتنمية (CDC)',
    universityName: 'جامعة العلوم والتكنولوجيا (UST)',
    login: 'تسجيل الدخول للإدارة',
    logout: 'تسجيل الخروج',
    dashboard: 'الرئيسية',
    competitions: 'المسابقات',
    students: 'الطلاب',
    participants: 'المشاركون',
    votes: 'الأصوات',
    results: 'النتائج',
    winnerAnnouncement: 'إعلان الفائز',
    auditLogs: 'سجل العمليات',
    settings: 'الإعدادات',
    voteNow: 'صَوّت الآن',
    whatsappStep: 'بوابة قناة واتساب',
    whatsappPrompt: 'لمتابعة أحدث أخبار المسابقة والفعاليات والنتائج، يرجى زيارة قناة المركز الرسمية على WhatsApp.',
    goToWhatsapp: 'الانتقال إلى قناة واتساب',
    continueToVote: 'متابعة إلى صفحة التصويت',
    selectStudentPrompt: 'اختر طالباً واحداً للتصويت له في هذه المسابقة:',
    searchStudent: 'ابحث عن اسم الطالب...',
    confirmVoteTitle: 'تأكيد اختيار التصويت',
    confirmVoteDesc: 'هل أنت متأكد من رغبتك في التصويت للطالب {name}؟ لا يمكنك التراجع أو تعديل اختيارك بعد التأكيد.',
    confirmButton: 'تأكيد وإرسال الصوت',
    cancel: 'إلغاء',
    voteSuccessTitle: 'تم تسجيل صوتك بنجاح!',
    voteSuccessDesc: 'شكراً لمشاركتك الفعالة في مسابقة المركز التعليمي.',
    alreadyVotedTitle: 'لقد قمت بالتصويت مسبقاً',
    alreadyVotedDesc: 'يمكن لكل زائر التصويت مرة واحدة فقط لكل مسابقة وفقاً لضوابط النظام.',
    startWheel: 'بدء تدوير عجلة النتائج',
    spinning: 'العجلة تدور الآن...',
    winnerCelebration: 'مبارك للفائز بالمركز الأول!',
    tieDetected: 'تنبيه إداري: تم رصد حالة تعادل',
  },
  en: {
    appName: 'SAWIT | Vote',
    tagline: 'Official Educational Competitions & Voting Platform',
    centerName: 'Consultations & Development Center (CDC)',
    universityName: 'University of Science & Technology (UST)',
    login: 'Admin Login',
    logout: 'Logout',
    dashboard: 'Dashboard',
    competitions: 'Competitions',
    students: 'Students',
    participants: 'Participants',
    votes: 'Votes',
    results: 'Results',
    winnerAnnouncement: 'Winner Announcement',
    auditLogs: 'Audit Logs',
    settings: 'Settings',
    voteNow: 'Vote Now',
    whatsappStep: 'WhatsApp Channel Gateway',
    whatsappPrompt: 'To follow the latest competition updates and results, visit the official CDC WhatsApp channel.',
    goToWhatsapp: 'Visit WhatsApp Channel',
    continueToVote: 'Continue to Voting',
    selectStudentPrompt: 'Select one participant to cast your vote:',
    searchStudent: 'Search participant name...',
    confirmVoteTitle: 'Confirm Your Vote',
    confirmVoteDesc: 'Are you sure you want to vote for {name}? You cannot modify or recast your vote after confirmation.',
    confirmButton: 'Confirm & Submit Vote',
    cancel: 'Cancel',
    voteSuccessTitle: 'Vote Recorded Successfully!',
    voteSuccessDesc: 'Thank you for participating in the educational competition.',
    alreadyVotedTitle: 'Already Voted',
    alreadyVotedDesc: 'Each visitor can vote only once per competition according to platform rules.',
    startWheel: 'Spin Result Wheel',
    spinning: 'Spinning the wheel...',
    winnerCelebration: 'Congratulations to the First Place Winner!',
    tieDetected: 'Admin Alert: Tie Detected',
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('sawit_lang') || 'ar');

  useEffect(() => {
    localStorage.setItem('sawit_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key, params = {}) => {
    let text = translations[lang]?.[key] || translations['ar'][key] || key;
    Object.keys(params).forEach((p) => {
      text = text.replace(`{${p}}`, params[p]);
    });
    return text;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t, isRtl: lang === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

