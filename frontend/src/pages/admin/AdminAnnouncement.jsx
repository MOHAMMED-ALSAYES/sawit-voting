import React, { useState, useEffect, useRef } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../services/api';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Trophy, 
  AlertCircle, 
  RotateCw, 
  CheckCircle2,
  Award
} from 'lucide-react';

const AdminAnnouncement = () => {
  const [competitions, setCompetitions] = useState([]);
  const [selectedCompId, setSelectedCompId] = useState('');
  const [resultsData, setResultsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Wheel Animation States
  const canvasRef = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const [winnerAnnounced, setWinnerAnnounced] = useState(null);
  const [tieAlert, setTieAlert] = useState(null);

  // Sound Effect using Web Audio API synthesis (no external assets required)
  const playCheerSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.log('AudioContext not allowed or not supported yet');
    }
  };

  const fetchCompetitions = async () => {
    try {
      const res = await api.get('/competitions');
      setCompetitions(res.data);
      if (res.data.length > 0 && !selectedCompId) {
        setSelectedCompId(res.data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchResults = async (compId) => {
    if (!compId) return;
    try {
      setLoading(true);
      const res = await api.get(`/admin/competitions/${compId}/results`);
      setResultsData(res.data);
      setWinnerAnnounced(null);
      setTieAlert(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  useEffect(() => {
    if (selectedCompId) {
      fetchResults(selectedCompId);
    }
  }, [selectedCompId]);

  // Draw the Wheel Canvas
  const drawWheel = (angle = 0) => {
    const canvas = canvasRef.current;
    if (!canvas || !resultsData?.participants?.length) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 15;

    ctx.clearRect(0, 0, width, height);

    const participants = resultsData.participants;
    const numSegments = participants.length;
    const segmentAngle = (2 * Math.PI) / numSegments;

    // Palette for wheel slices inspired by CDC Cyan, CDC Orange, UST Blue and Amber
    const colors = [
      '#0284C7', '#EA580C', '#1E3A8A', '#F59E0B', 
      '#0D9488', '#E11D48', '#7C3AED', '#15803D'
    ];

    participants.forEach((p, i) => {
      const startA = angle + i * segmentAngle;
      const endA = startA + segmentAngle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startA, endA);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Text inside segment
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startA + segmentAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Cairo, sans-serif';
      ctx.fillText(p.student_name, radius - 20, 4);
      ctx.restore();
    });

    // Central Pin
    ctx.beginPath();
    ctx.arc(centerX, centerY, 24, 0, 2 * Math.PI);
    ctx.fillStyle = '#0F172A';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#F59E0B';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('صَوّت', centerX, centerY + 3);
  };

  useEffect(() => {
    drawWheel(0);
  }, [resultsData]);

  // Handle Deterministic Spin Trigger
  const handleSpinWheel = async () => {
    if (!selectedCompId || spinning) return;

    try {
      // 1. استدعاء API الرسمي لاعتماد وإعلان الفائز
      const announceRes = await api.post(`/admin/competitions/${selectedCompId}/announce-winner`);
      const announcement = announceRes.data;

      // فحص التعادل: التوقف الفوري وعرض التنبيه الإداري
      if (announcement.is_tie) {
        setTieAlert(announcement.tie_message);
        return;
      }

      setSpinning(true);
      setWinnerAnnounced(null);
      setTieAlert(null);

      // 2. تحديد الزاوية الدقيقة رياضياً التي تضمن توقف المؤشر (في الأعلى عند 3π/2 أو 270 deg)
      // على الفائز المحسوب سلفاً من قاعدة البيانات
      const participants = resultsData.participants;
      const winnerIndex = participants.findIndex(
        (p) => p.participant_id === announcement.winner_participant_id
      );

      const segmentAngle = (2 * Math.PI) / participants.length;
      
      // المؤشر الثابت في أعلى العجلة عند الزاوية (3 * Math.PI / 2)
      // نحسب زاوية الدوران بحيث يستقر منتصف قطاع الفائز تحت المؤشر
      const targetSegmentMid = winnerIndex * segmentAngle + segmentAngle / 2;
      const pointerAngle = (3 * Math.PI) / 2;
      
      // عدد الدورات الكاملة للتشويق (5 دورات كاملة = 10 * PI)
      const fullRotations = 10 * Math.PI;
      const finalAngle = fullRotations + (pointerAngle - targetSegmentMid);

      const duration = 5000; // 5 ثوانٍ دوران سلس وتباطؤ
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Cubic Easing Out للتدرج والتباطؤ الواقعي
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentAngle = easeOut * finalAngle;

        drawWheel(currentAngle);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // اكتمال الدوران وتأكيد الفائز مع الاحتفالية
          setSpinning(false);
          setWinnerAnnounced(announcement);
          playCheerSound();
          confetti({
            particleCount: 180,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#0284C7', '#EA580C', '#F59E0B', '#16A34A']
          });
        }
      };

      requestAnimationFrame(animate);

    } catch (err) {
      alert(err.response?.data?.detail || 'حدث خطأ أثناء إعلان النتائج');
      setSpinning(false);
    }
  };

  return (
    <AdminLayout activeTab="announcement">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-500" />
              <span>شاشة إعلان الفائز بالمسابقة</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              عجلة دوارة تفاعلية تشويقية حتمية مبنية على نتائج قاعدة البيانات الفعلية
            </p>
          </div>

          {/* Competition Selector */}
          <select
            value={selectedCompId}
            onChange={(e) => setSelectedCompId(e.target.value)}
            disabled={spinning}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-cdc-cyan outline-none bg-white shadow-sm"
          >
            {competitions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.status})
              </option>
            ))}
          </select>
        </div>

        {/* Tie Alert Banner */}
        {tieAlert && (
          <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-300 text-amber-900 flex items-start gap-4 animate-in fade-in">
            <AlertCircle className="w-8 h-8 text-amber-600 shrink-0 mt-1" />
            <div>
              <h4 className="text-base font-bold">تنبيه حاسم: تم إيقاف الإعلان لوجود تعادل!</h4>
              <p className="text-xs sm:text-sm mt-1 leading-relaxed">{tieAlert}</p>
            </div>
          </div>
        )}

        {/* Main Stage */}
        <div className="bg-gradient-to-b from-slate-900 via-ust-navy to-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col items-center">
          
          {/* Top Logos */}
          <div className="flex items-center gap-4 mb-6 bg-white/5 px-6 py-2.5 rounded-full border border-white/10 backdrop-blur-md">
            <img src="/logo-cdc.png" alt="CDC Logo" className="h-9 w-auto" />
            <div className="h-6 w-[1px] bg-white/20"></div>
            <img src="/logo-ust.png" alt="UST Logo" className="h-9 w-auto" />
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-center mb-1 text-white">
            {resultsData?.title || 'مسابقة التصويت التعليمية'}
          </h3>
          <p className="text-xs text-slate-400 mb-8 font-medium">
            المركز صاحب أعلى الأصوات المسجلة بقاعدة البيانات
          </p>

          {/* Wheel Container with Pointer */}
          <div className="relative mb-8 flex justify-center items-center">
            
            {/* Top Indicator Arrow */}
            <div className="absolute -top-3 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[22px] border-t-amber-400 filter drop-shadow-md"></div>

            <canvas
              ref={canvasRef}
              width={380}
              height={380}
              className="rounded-full shadow-2xl border-4 border-slate-700 bg-slate-800"
            />
          </div>

          {/* Control Button */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleSpinWheel}
              disabled={spinning || !resultsData?.participants?.length}
              className={`inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-base shadow-xl transition-all active:scale-95 ${
                spinning
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 via-cdc-orange to-cdc-cyan hover:opacity-95 text-white scale-100 hover:scale-105'
              }`}
            >
              <RotateCw className={`w-5 h-5 ${spinning ? 'animate-spin' : ''}`} />
              <span>{spinning ? 'العجلة تدور الآن...' : 'بدء تدوير العجلة وإعلان الفائز'}</span>
            </button>

            <span className="text-[11px] text-slate-400 font-medium">
              * العجلة أداة تشويق واحتفال؛ والفائز يُستخرج قطعياً من قاعدة البيانات
            </span>
          </div>

          {/* Winner Celebration Modal / Card */}
          {winnerAnnounced && (
            <div className="mt-8 max-w-lg w-full bg-white/10 backdrop-blur-xl border border-amber-400/40 rounded-3xl p-6 sm:p-8 text-center text-white animate-in zoom-in-95 duration-300 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce">
                <Trophy className="w-9 h-9" />
              </div>

              <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
                الفائز بالمركز الأول
              </span>

              <h2 className="text-2xl sm:text-3xl font-black mt-2 mb-2 text-white">
                {winnerAnnounced.winner_name}
              </h2>

              <p className="text-xs text-slate-300">
                بإجمالي أصوات: <b className="text-amber-400 text-sm">{winnerAnnounced.total_votes} صوت</b>
              </p>

              <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
                <span>اعتمد بواسطة: {winnerAnnounced.announced_by}</span>
                <span>{new Date(winnerAnnounced.announced_at).toLocaleString('ar-YE')}</span>
              </div>
            </div>
          )}

        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminAnnouncement;

