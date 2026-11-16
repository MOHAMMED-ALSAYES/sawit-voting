import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../services/api';
import { 
  Trophy, 
  Users, 
  Vote, 
  CheckCircle, 
  Clock, 
  ArrowUpRight 
} from 'lucide-react';

const AdminDashboard = () => {
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
          <div className="w-8 h-8 border-4 border-cdc-cyan border-t-transparent rounded-full animate-spin"></div>
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
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            مؤشرات لوحة التحكم العامة
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            ملخص مباشر لحالة مسابقات التصويت والطلاب وسجلات العمليات
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-3xl border bg-white shadow-sm flex items-center justify-between ${card.bg}`}
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

        {/* Recent Audit Activities */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-slate-900">
              آخر العمليات الإدارية المسجلة
            </h3>
            <a
              href="/admin/audit"
              className="text-xs font-bold text-cdc-cyan hover:underline flex items-center gap-1"
            >
              <span>عرض السجل الكامل</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                  <th className="py-3 px-4 text-start">العملية</th>
                  <th className="py-3 px-4 text-start">نوع الكيان</th>
                  <th className="py-3 px-4 text-start">التفاصيل</th>
                  <th className="py-3 px-4 text-start">التوقيت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.latest_logs?.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800">{log.action}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-medium text-[11px]">
                        {log.entity_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{log.details || '-'}</td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(log.created_at).toLocaleString('ar-YE')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

