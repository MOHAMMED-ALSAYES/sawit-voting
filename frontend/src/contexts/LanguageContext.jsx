import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  ar: {
    appName: 'SAWIT | صَوّت',
    tagline: 'المنصة الرسمية للتصويت في المسابقات التعليمية',
    headerDesc: 'منصة المسابقات والتصويت الإلكتروني',
    centerName: 'مركز الاستشارات والتنمية (CDC)',
    universityName: 'جامعة العلوم والتكنولوجيا (UST)',
    login: 'تسجيل الدخول للإدارة',
    adminShort: 'الإدارة',
    logout: 'تسجيل الخروج',
    dashboard: 'الرئيسية',
    competitions: 'المسابقات',
    students: 'الطلاب والمشاركون',
    votes: 'الأصوات',
    results: 'النتائج والأصوات',
    winnerAnnouncement: 'إعلان الفائز',
    auditLogs: 'سجل العمليات',
    settings: 'الإعدادات والأمان',
    
    // Home Page
    heroBadge: 'المنظومة الإلكترونية المعتمدة للمسابقات والتصويت النزيه',
    welcomeTo: 'أهلاً بكم في بوابة المسابقات الرسمية لـ',
    centerMainTitle: 'مركز الاستشارات والتنمية',
    universityMainTitle: 'جامعة العلوم والتكنولوجيا',
    heroDesc: 'نظام التنافس الأكاديمي الرقمي المخصص لدعم الطلاب المبتكرين واختيار الفائزين بنزاهة تامة وتكريمهم احتفالياً.',
    pillOneVote: 'صوت واحد مؤكد لكل مصوت',
    pillSecretVotes: 'سرية تامة ومطلقة للنتائج والأصوات',
    pillWheel: 'شاشة احتفالية وعجلة دوارة حتمية',
    activeCompetitionsTitle: 'المسابقات المتاحة للتصويت حالياً',
    activeCompetitionsSub: 'اختر المسابقة وشارك بصوتك لدعم الطلاب المبدعين',
    votingOpenNow: 'التصويت مفتوح الآن',
    votingClosedNow: 'المسابقة مغلقة',
    endDatePrefix: 'تاريخ الانتهاء: ',
    goToVotePage: 'الانتقال لصفحة التصويت',
    noActiveComps: 'لا توجد مسابقات نشطة في الوقت الحالي.',
    aboutCenterBadge: 'عن المركز وخدماته الأكاديمية',
    aboutCenterTitle: 'مركز الاستشارات والتنمية (CDC)',
    aboutCenterDesc: 'الذراع التدريبي والاستشاري لجامعة العلوم والتكنولوجيا، رائد بناء وتطوير القدرات الأكاديمية والمهنية وتأهيل الكفاءات لمواكبة متطلبات العصر الرقمي.',
    srv1Title: 'البرامج التدريبية المتقدمة',
    srv1Desc: 'دورات تدريبية متخصصة ومكثفة في مجالات الذكاء الاصطناعي، البرمجيات، إدارة المشاريع، واللغات، لرفع كفاءة الطلاب وسوق العمل.',
    srv2Title: 'الاستشارات الأكاديمية والمهنية',
    srv2Desc: 'تقديم دراسات الجدوى والاستشارات الإدارية والتقنية للمؤسسات التعليمية والشركات بالتعاون مع نخبة خبراء جامعة العلوم والتكنولوجيا.',
    srv3Title: 'تنظيم المسابقات والهاكاثونات',
    srv3Desc: 'إدارة المسابقات الإبداعية والابتكارية للطلاب لتشجيع روح التنافس الشريف واكتشاف المبتكرين ورعايتهم.',
    srv4Title: 'التأهيل المهني والشهادات الدولية',
    srv4Desc: 'إعداد الطلاب والكوادر لاجتياز اختبارات الاعتماد المهني العالمية المعتمدة التي تفتح آفاق التوظيف الدولي.',
    visionMissionTitlePrefix: '',
    visionWord: 'رؤية',
    andWord: 'و',
    missionWord: 'رسالة',
    centerWord: 'المركز',
    visionMissionDesc: 'تقديم استشارات وتدريب نوعي يسهم بفاعلية في تمكين وتأهيل الطلاب والمؤسسات وقيادة التحول الإيجابي في المجتمع من خلال برامج متطورة ومعايير جودة عالمية.',
    allRightsReserved: 'جميع الحقوق محفوظة لـ',

    // Voting Flow
    voteNow: 'صَوّت الآن',
    whatsappStep: 'بوابة قناة واتساب الرسمية',
    whatsappPrompt: 'لمتابعة أحدث أخبار المسابقة والفعاليات والنتائج، يرجى زيارة قناة المركز الرسمية على WhatsApp.',
    goToWhatsapp: 'الانتقال إلى قناة واتساب',
    whatsappVisitedNotice: 'تم فتح رابط القناة بنجاح',
    continueToVote: 'متابعة إلى صفحة التصويت',
    selectStudentPrompt: 'اختر طالباً واحداً للتصويت له في هذه المسابقة:',
    selectStudentSub: 'يمكنك التصويت لطالب واحد فقط. يُرجى التدقيق قبل التأكيد.',
    searchStudent: 'ابحث عن اسم الطالب...',
    candidateBadge: 'مرشح في المسابقة',
    noCandidatesFound: 'لا يوجد مشاركون مطابقون لنتيجة البحث',
    backToDetails: 'العودة للتفاصيل',
    confirmVoteTitle: 'تأكيد اختيار التصويت',
    confirmVoteDesc: 'هل أنت متأكد من رغبتك في التصويت للطالب {name}؟ لا يمكنك التراجع أو تعديل اختيارك بعد التأكيد.',
    confirmButton: 'تأكيد وإرسال الصوت',
    cancel: 'إلغاء',
    voteSuccessTitle: 'تم تسجيل صوتك بنجاح!',
    voteSuccessDesc: 'شكراً لمشاركتك الفعالة في مسابقة المركز التعليمي.',
    alreadyVotedTitle: 'لقد قمت بالتصويت مسبقاً',
    alreadyVotedDesc: 'يمكن لكل زائر التصويت مرة واحدة فقط لكل مسابقة وفقاً لضوابط النظام.',
    backToHome: 'العودة للصفحة الرئيسية',
    loadingCompetition: 'جاري تحميل المسابقة...',
    competitionError: 'تعذر تحميل بيانات المسابقة، يرجى التأكد من صحة الرابط.',
    activeStatus: 'مسابقة نشطة',
    closedStatus: 'المسابقة مغلقة',
    participantsCount: '{count} طلاب مشاركين',

    // Admin Common
    systemOnline: 'النظام متصل وقيد العمل',
    adminRole: 'المسؤول:',
  },
  en: {
    appName: 'SAWIT | Vote',
    tagline: 'Official Educational Competitions & Voting Platform',
    headerDesc: 'Competitions & Electronic Voting Platform',
    centerName: 'Consultations & Development Center (CDC)',
    universityName: 'University of Science & Technology (UST)',
    login: 'Admin Login',
    adminShort: 'Admin',
    logout: 'Logout',
    dashboard: 'Dashboard',
    competitions: 'Competitions',
    students: 'Students & Participants',
    votes: 'Votes',
    results: 'Results & Votes',
    winnerAnnouncement: 'Winner Announcement',
    auditLogs: 'Audit Logs',
    settings: 'Settings & Security',
    
    // Home Page
    heroBadge: 'Official Certified Electronic Voting Platform',
    welcomeTo: 'Welcome to the Official Competitions Portal of',
    centerMainTitle: 'Consultations & Development Center',
    universityMainTitle: 'University of Science & Technology',
    heroDesc: 'The digital academic competition system dedicated to supporting innovative students and crowning winners with absolute integrity and celebration.',
    pillOneVote: 'One Verified Vote Per Voter',
    pillSecretVotes: 'Absolute Confidentiality of Votes & Results',
    pillWheel: 'Celebratory Stage & Deterministic Wheel',
    activeCompetitionsTitle: 'Competitions Available for Voting',
    activeCompetitionsSub: 'Select a competition and cast your vote to support talented students',
    votingOpenNow: 'Voting Open Now',
    votingClosedNow: 'Competition Closed',
    endDatePrefix: 'End Date: ',
    goToVotePage: 'Proceed to Voting',
    noActiveComps: 'No active competitions available at the moment.',
    aboutCenterBadge: 'About the Center & Academic Services',
    aboutCenterTitle: 'Consultations & Development Center (CDC)',
    aboutCenterDesc: 'The training and consulting arm of the University of Science and Technology, leading the development of academic and professional capacities to meet modern digital demands.',
    srv1Title: 'Advanced Training Programs',
    srv1Desc: 'Specialized intensive courses in AI, software development, project management, and languages to boost student and workforce capabilities.',
    srv2Title: 'Academic & Professional Consulting',
    srv2Desc: 'Providing feasibility studies, managerial and technical consulting for institutions in partnership with top UST faculty experts.',
    srv3Title: 'Competitions & Hackathons Organization',
    srv3Desc: 'Managing student innovation and creativity challenges to encourage honest competition and nurture young innovators.',
    srv4Title: 'Professional Qualifications & Certifications',
    srv4Desc: 'Preparing students and professionals to achieve world-class accredited certifications that unlock global career opportunities.',
    visionMissionTitlePrefix: 'Center ',
    visionWord: 'Vision',
    andWord: '&',
    missionWord: 'Mission',
    centerWord: '',
    visionMissionDesc: 'Providing top-tier consulting and training that empowers students and institutions and leads community positive transformation through world-class standards.',
    allRightsReserved: 'All Rights Reserved for',

    // Voting Flow
    voteNow: 'Vote Now',
    whatsappStep: 'Official WhatsApp Channel Gateway',
    whatsappPrompt: 'To follow the latest competition updates, events, and results, visit the official CDC WhatsApp channel.',
    goToWhatsapp: 'Visit WhatsApp Channel',
    whatsappVisitedNotice: 'Channel link opened successfully',
    continueToVote: 'Continue to Voting',
    selectStudentPrompt: 'Select one participant to cast your vote:',
    selectStudentSub: 'You can vote for only one participant. Please review carefully before confirming.',
    searchStudent: 'Search participant name...',
    candidateBadge: 'Competition Candidate',
    noCandidatesFound: 'No candidates matched your search',
    backToDetails: 'Back to Details',
    confirmVoteTitle: 'Confirm Your Vote',
    confirmVoteDesc: 'Are you sure you want to vote for {name}? You cannot modify or recast your vote after confirmation.',
    confirmButton: 'Confirm & Submit Vote',
    cancel: 'Cancel',
    voteSuccessTitle: 'Vote Recorded Successfully!',
    voteSuccessDesc: 'Thank you for your active participation in the competition.',
    alreadyVotedTitle: 'Already Voted',
    alreadyVotedDesc: 'Each visitor can vote only once per competition according to platform rules.',
    backToHome: 'Back to Home Page',
    loadingCompetition: 'Loading competition...',
    competitionError: 'Failed to load competition details. Please verify the URL.',
    activeStatus: 'Active Competition',
    closedStatus: 'Competition Closed',
    participantsCount: '{count} Participants',

    // Admin Common
    systemOnline: 'System Online & Operational',
    adminRole: 'Admin:',
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
