import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import api from '../../services/api';
import { 
  Trophy, 
  Users, 
  Vote, 
  Clock, 
  ArrowUpRight,
  PlusCircle,
  ExternalLink,
  GraduationCap,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminDashboard = () => {
  const { isRtl } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminLayout activeTab="dashboard">
        <div className="flex justify-center items-center h-64">
          <div className="w-9 h-9 border-4 border-cdc-cyan border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  const stats = data?.stats || {
    total_competitions: 0,
    active_competitions: 0,
    total_students: 0,
    total_votes: 0,
  };

  const competitions = data?.competitions || [];
  const students = data?.students || [];

  const statCards = [
    { title: 'إجمالي المسابقات', value: stats.total_competitions, icon: Trophy, color: 'text-cdc-cyan', bg: 'bg-sky-50 border-sky-200' },
    { title: 'المسابقات النشطة', value: stats.active_competitions, icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
    { title: 'إجمالي الطلاب المسجلين', value: stats.total_students, icon: Users, color: 'text-cdc-orange', bg: 'bg-orange-50 border-orange-200' },
    { title: 'إجمالي الأصوات المسجلة', value: stats.total_votes, icon: Vote, color: 'text-ust-blue', bg: 'bg-blue-50 border-blue-200' },
  ];

  return (
    <AdminLayout activeTab="dashboard">
      <div className="space-y-8">
        
        {/* Header Intro */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              لوحة التحكم الرئيسية
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              متابعة البيانات الحيوية للمسابقات والطلاب المشاركين وإحصائيات المنظومة
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/admin/competitions"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cdc-cyan hover:bg-cdc-cyan-hover text-white text-xs font-bold shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة مسابقة</span>
            </Link>
            <Link
              to="/admin/students"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة طالب</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-3xl border bg-white shadow-sm flex items-center justify-between transition-all hover:shadow-md ${card.bg}`}
              >
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-1">{card.title}</p>
                  <p className="text-3xl font-black text-slate-900">{card.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white shadow-sm ${card.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Section 1: Competitions Showcase */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-cdc-cyan flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  المسابقات الحالية والنشطة
                </h3>
                <p className="text-[11px] text-slate-500">
                  أهم المسابقات المقامة ومؤشرات التصويت والمشاركين
                </p>
              </div>
            </div>

            <Link
              to="/admin/competitions"
              className="text-xs font-bold text-cdc-cyan hover:underline flex items-center gap-1"
            >
              <span>إدارة كافة المسابقات</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {competitions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {competitions.map((comp) => (
                <div
                  key={comp.id}
                  className="p-5 rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white to-slate-50/50 hover:border-cdc-cyan/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          comp.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            comp.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                          }`}
                        ></span>
                        <span>{comp.status === 'active' ? 'نشطة للتصويت' : 'مغلقة'}</span>
                      </span>

                      <a
                        href={`/c/${comp.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-cdc-cyan p-1"
                        title="معاينة صفحة التصويت"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-900 mb-2 line-clamp-1">
                      {comp.title}
                    </h4>

                    <div className="space-y-1.5 text-xs text-slate-500 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-slate-400">
                          <Users className="w-3.5 h-3.5 text-cdc-orange" />
                          <span>الطلاب المشاركون:</span>
                        </span>
                        <b className="text-slate-800 font-bold">{comp.participant_count} طلاب</b>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-slate-400">
                          <Vote className="w-3.5 h-3.5 text-cdc-cyan" />
                          <span>الأصوات المسجلة:</span>
                        </span>
                        <b className="text-slate-800 font-bold">{comp.total_votes} صوت</b>
                      </div>
                      {comp.end_at && (
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="flex items-center gap-1 text-slate-400">
                            <Calendar className="w-3.5 h-3.5 text-amber-500" />
                            <span>تاريخ الانتهاء:</span>
                          </span>
                          <span className="text-slate-600">
                            {new Date(comp.end_at).toLocaleDateString('ar-YE')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Link
                      to="/admin/competitions"
                      className="text-xs font-bold text-slate-700 hover:text-cdc-cyan"
                    >
                      إدارة المسابقة
                    </Link>
                    <Link
                      to="/admin/results"
                      className="text-xs font-bold text-cdc-orange hover:underline"
                    >
                      النتائج والأصوات
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
              <Trophy className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-600">لا توجد مسابقات حالياً</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                ابدأ بإنشاء مسابقة تصويت جديدة للطلاب والبدء باستقبال الأصوات
              </p>
              <Link
                to="/admin/competitions"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cdc-cyan text-white text-xs font-bold shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>إضافة مسابقة جديدة</span>
              </Link>
            </div>
          )}
        </div>

        {/* Section 2: Students Showcase */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-cdc-orange flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  الطلاب المسجلون حديثاً
                </h3>
                <p className="text-[11px] text-slate-500">
                  قائمة بأحدث الطلاب المضافين في قاعدة بيانات المنظومة
                </p>
              </div>
            </div>

            <Link
              to="/admin/students"
              className="text-xs font-bold text-cdc-orange hover:underline flex items-center gap-1"
            >
              <span>إدارة كافة الطلاب</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {students.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="p-4 rounded-2xl border border-slate-200/90 bg-white hover:border-slate-300 hover:shadow-sm transition-all flex items-center gap-3.5"
                >
                  <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">
                    <GraduationCap className="w-5 h-5 text-cdc-orange" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                      {student.full_name}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono truncate">
                      {student.student_code ? `كود: ${student.student_code}` : 'رقم تعريفي تلقائي'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-600">لا يوجد طلاب مسجلون حتى الآن</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                قم بإضافة بيانات الطلاب المرشحين لتتمكن من إشراكهم في المسابقات
              </p>
              <Link
                to="/admin/students"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cdc-orange text-white text-xs font-bold shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>إضافة طالب جديد</span>
              </Link>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
