import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../services/api';
import { BarChart3, AlertCircle, Award, Trophy, Users } from 'lucide-react';

const AdminResults = () => {
  const [competitions, setCompetitions] = useState([]);
  const [selectedCompId, setSelectedCompId] = useState('');
  const [resultsData, setResultsData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <AdminLayout activeTab="results">
      <div className="space-y-6">
        
        {/* Header */}
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            سجل النتائج والأصوات
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            إحصائيات سرية خاصة بإدارة المركز، لا يتم كشفها للزوار في أي مرحلة
          </p>
        </div>

        {/* Competition Selector Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">اختر المسابقة:</span>
            <select
              value={selectedCompId}
              onChange={(e) => setSelectedCompId(e.target.value)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-cdc-cyan outline-none"
            >
              {competitions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title} ({c.status})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold text-slate-700">
            <span>إجمالي الأصوات المحتسبة: <b className="text-cdc-orange text-sm">{resultsData?.total_votes || 0}</b></span>
          </div>
        </div>

        {/* Tie Warning Alert */}
        {resultsData?.is_tie && (
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-4 text-amber-800">
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold">تنبيه إداري: تم رصد تعادل في المركز الأول!</h4>
              <p className="text-xs mt-1">
                حصل الطلاب التالية أسماؤهم على نفس أعلى عدد من الأصوات ({resultsData.tie_candidates[0]?.total_votes} صوت):
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {resultsData.tie_candidates.map((c) => (
                  <span key={c.participant_id} className="px-3 py-1 rounded-full bg-amber-200/70 font-bold text-xs text-amber-900">
                    {c.student_name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Ranking Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <h3 className="text-base font-bold text-slate-900 mb-4">
            ترتيب المشاركين الفعلي وقوة التصويت
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                  <th className="py-3 px-4 text-start">الترتيب</th>
                  <th className="py-3 px-4 text-start">اسم الطالب</th>
                  <th className="py-3 px-4 text-start">عدد الأصوات</th>
                  <th className="py-3 px-4 text-start">النسبة المئوية</th>
                  <th className="py-3 px-4 text-start">شريط التقدم</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {resultsData?.participants?.map((item) => {
                  const isFirst = item.rank === 1 && item.total_votes > 0;
                  return (
                    <tr
                      key={item.participant_id}
                      className={`hover:bg-slate-50/60 transition-colors ${
                        isFirst ? 'bg-sky-50/50' : ''
                      }`}
                    >
                      <td className="py-4 px-4 font-black">
                        <div className="flex items-center gap-1.5">
                          {isFirst && <Trophy className="w-4 h-4 text-amber-500" />}
                          <span>#{item.rank}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-900">
                        {item.student_name}
                      </td>
                      <td className="py-4 px-4 font-black text-cdc-orange text-sm">
                        {item.total_votes}
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-700">
                        {item.percentage}%
                      </td>
                      <td className="py-4 px-4 min-w-[140px]">
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isFirst ? 'bg-cdc-cyan' : 'bg-slate-400'
                            }`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {(!resultsData?.participants || resultsData.participants.length === 0) && (
              <div className="text-center py-12 text-slate-400">
                لا توجد بيانات مشاركين في هذه المسابقة
              </div>
            )}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminResults;

