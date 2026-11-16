import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Calendar, 
  MessageCircle, 
  Users, 
  CheckCircle2, 
  Search, 
  AlertCircle, 
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Award
} from 'lucide-react';

const PublicCompetition = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, isRtl } = useLanguage();

  const [competition, setCompetition] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Voting Wizard Steps: 1: Overview & WhatsApp Gateway, 2: Select Student, 3: Success Screen
  const [step, setStep] = useState(1);
  const [whatsappVisited, setWhatsappVisited] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submittingVote, setSubmittingVote] = useState(false);
  const [voteResult, setVoteResult] = useState(null);

  // Generate or retrieve persistent anonymous voter identifier
  const getVoterIdentifier = () => {
    let voterId = localStorage.getItem('sawit_voter_fingerprint');
    if (!voterId) {
      voterId = 'voter_' + Math.random().toString(36).substring(2, 15) + '_' + Date.now();
      localStorage.setItem('sawit_voter_fingerprint', voterId);
    }
    return voterId;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const compRes = await api.get(`/public/competitions/${slug}`);
        setCompetition(compRes.data);

        const partsRes = await api.get(`/public/competitions/${slug}/participants`);
        setParticipants(partsRes.data);

        // Check if already voted in this competition
        const voterId = getVoterIdentifier();
        const statusRes = await api.get(`/voting/status?competition_id=${compRes.data.id}&voter_identifier=${voterId}`);
        if (statusRes.data.has_voted) {
          setVoteResult({
            success: false,
            already_voted: true,
            message: t('alreadyVotedDesc'),
          });
          setStep(3);
        }
      } catch (err) {
        console.error(err);
        setError('تعذر تحميل بيانات المسابقة، يرجى التأكد من صحة الرابط.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const handleOpenWhatsapp = () => {
    if (competition?.whatsapp_channel_url) {
      window.open(competition.whatsapp_channel_url, '_blank', 'noopener,noreferrer');
      setWhatsappVisited(true);
    }
  };

  const handleVoteSubmit = async () => {
    if (!selectedParticipant) return;
    try {
      setSubmittingVote(true);
      const voterId = getVoterIdentifier();
      const res = await api.post('/voting/submit', {
        competition_id: competition.id,
        participant_id: selectedParticipant.id,
        voter_identifier: voterId,
        metadata: navigator.userAgent
      });

      setVoteResult(res.data);
      setShowConfirmModal(false);
      setStep(3);
    } catch (err) {
      alert(err.response?.data?.detail || 'حدث خطأ أثناء إرسال صوتك، يرجى المحاولة مرة أخرى.');
    } finally {
      setSubmittingVote(false);
    }
  };

  const filteredParticipants = participants.filter((p) =>
    p.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center">
        <div className="w-12 h-12 border-4 border-cdc-cyan border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-semibold text-slate-600">جاري تحميل المسابقة...</p>
      </div>
    );
  }

  if (error || !competition) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-2xl shadow-sm border border-slate-200 text-center">
          <AlertCircle className="w-12 h-12 text-cdc-orange mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-800 mb-2">تنبيه</h2>
          <p className="text-sm text-slate-600">{error || 'المسابقة غير متوفرة'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50/30 to-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        
        {/* Step 1: Overview & WhatsApp Gateway */}
        {step === 1 && (
          <div className="space-y-6">
            
            {/* Competition Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-cdc-cyan via-cdc-orange to-ust-blue"></div>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cdc-cyan-light text-cdc-cyan text-xs font-bold mb-4">
                <span className="w-2 h-2 rounded-full bg-cdc-cyan animate-pulse"></span>
                <span>{competition.status === 'active' ? 'مسابقة نشطة' : 'المسابقة مغلقة'}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug mb-3">
                {competition.title}
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                {competition.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-cdc-cyan" />
                  <span>تاريخ الانتهاء: {new Date(competition.end_at).toLocaleDateString('ar-YE')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-cdc-orange" />
                  <span>{participants.length} طلاب مشاركين</span>
                </div>
              </div>
            </div>

            {/* WhatsApp Channel Gateway */}
            <div className="bg-gradient-to-br from-white to-emerald-50/50 rounded-3xl p-6 sm:p-8 shadow-sm border border-emerald-200 relative">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-md">
                    <MessageCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      {t('whatsappStep')}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed">
                      {t('whatsappPrompt')}
                    </p>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex flex-col gap-2">
                  <button
                    onClick={handleOpenWhatsapp}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{t('goToWhatsapp')}</span>
                  </button>

                  {whatsappVisited && (
                    <span className="text-[11px] text-emerald-700 font-semibold text-center flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>تم فتح الرابط بنجاح</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Continue to Vote Button (Appears once WhatsApp link is clicked or after prompt) */}
              <div className="mt-8 pt-6 border-t border-slate-200/80 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!whatsappVisited && competition.status !== 'active'}
                  className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md ${
                    whatsappVisited
                      ? 'bg-cdc-cyan hover:bg-cdc-cyan-hover text-white scale-100'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>{t('continueToVote')}</span>
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>

          </div>
        )}

        {/* Step 2: Participants List & Voting Action */}
        {step === 2 && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {t('selectStudentPrompt')}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  يمكنك التصويت لطالب واحد فقط. يُرجى التدقيق قبل التأكيد.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute top-3.5 start-3" />
                <input
                  type="text"
                  placeholder={t('searchStudent')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full ps-9 pe-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cdc-cyan focus:border-cdc-cyan outline-none transition-all"
                />
              </div>
            </div>

            {/* Participants Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredParticipants.map((p) => {
                const isSelected = selectedParticipant?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedParticipant(p)}
                    className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 flex items-center justify-between ${
                      isSelected
                        ? 'border-cdc-cyan bg-sky-50/60 shadow-md ring-2 ring-cdc-cyan/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm ${
                          isSelected
                            ? 'bg-cdc-cyan text-white shadow-sm'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900">
                          {p.full_name}
                        </h4>
                        <span className="text-[11px] text-slate-400 font-medium">
                          مرشح في المسابقة
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'border-cdc-cyan bg-cdc-cyan text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white"></div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredParticipants.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">لا يوجد مشاركون مطابقون لنتيجة البحث</p>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                العودة للتفاصيل
              </button>

              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={!selectedParticipant}
                className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all ${
                  selectedParticipant
                    ? 'bg-cdc-orange hover:bg-cdc-orange-hover text-white scale-100'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>{t('voteNow')}</span>
                <ShieldCheck className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

        {/* Step 3: Success or Already Voted Screen */}
        {step === 3 && (
          <div className="max-w-md mx-auto bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center my-8">
            <div
              className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 ${
                voteResult?.already_voted
                  ? 'bg-amber-100 text-amber-600'
                  : 'bg-emerald-100 text-emerald-600'
              }`}
            >
              {voteResult?.already_voted ? (
                <AlertCircle className="w-10 h-10" />
              ) : (
                <CheckCircle2 className="w-10 h-10" />
              )}
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 mb-3">
              {voteResult?.already_voted
                ? t('alreadyVotedTitle')
                : t('voteSuccessTitle')}
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed mb-8">
              {voteResult?.message || t('voteSuccessDesc')}
            </p>

            <div className="pt-6 border-t border-slate-100 space-y-3">
              <button
                onClick={() => navigate('/')}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all"
              >
                العودة للصفحة الرئيسية
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedParticipant && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-cdc-orange-light text-cdc-orange flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">
              {t('confirmVoteTitle')}
            </h3>

            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              {t('confirmVoteDesc', { name: selectedParticipant.full_name })}
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {t('cancel')}
              </button>

              <button
                onClick={handleVoteSubmit}
                disabled={submittingVote}
                className="flex-1 py-3 rounded-xl bg-cdc-cyan hover:bg-cdc-cyan-hover text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                {submittingVote ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>{t('confirmButton')}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 bg-white/50 text-center text-xs text-slate-500">
        <p>© 2026 جميع الحقوق محفوظة لـ {t('centerName')} بالتعاون مع {t('universityName')}</p>
      </footer>
    </div>
  );
};

export default PublicCompetition;

