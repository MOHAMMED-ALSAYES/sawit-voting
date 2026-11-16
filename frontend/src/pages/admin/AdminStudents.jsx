import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../services/api';
import { Users, Plus, Trash2, Search, Award, Check } from 'lucide-react';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [selectedCompId, setSelectedCompId] = useState('');
  const [compParticipants, setCompParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students');
      setStudents(res.data);
    } catch (err) {
      console.error(err);
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

  const fetchParticipants = async (compId) => {
    if (!compId) return;
    try {
      const res = await api.get(`/competitions/${compId}/participants`);
      setCompParticipants(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchStudents(), fetchCompetitions()]);
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (selectedCompId) {
      fetchParticipants(selectedCompId);
    }
  }, [selectedCompId]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    try {
      const res = await api.post('/students', { full_name: newStudentName.trim() });
      setStudents([...students, res.data]);
      setNewStudentName('');
    } catch (err) {
      alert(err.response?.data?.detail || 'فشل إضافة الطالب');
    }
  };

  const handleLinkParticipant = async (studentId) => {
    if (!selectedCompId) return;
    try {
      await api.post(`/competitions/${selectedCompId}/participants`, { student_id: studentId });
      fetchParticipants(selectedCompId);
    } catch (err) {
      alert(err.response?.data?.detail || 'فشل تعيين الطالب في المسابقة');
    }
  };

  const handleRemoveParticipant = async (participantId) => {
    if (!window.confirm('هل أنت متأكد من إزالة الطالب من هذه المسابقة؟')) return;
    try {
      await api.delete(`/competitions/participants/${participantId}`);
      fetchParticipants(selectedCompId);
    } catch (err) {
      alert(err.response?.data?.detail || 'فشل إزالة المشارك');
    }
  };

  const participantStudentIds = new Set(compParticipants.map((p) => p.student_id));
  const filteredStudents = students.filter((s) =>
    s.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout activeTab="students">
      <div className="space-y-6">
        
        {/* Header */}
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            إدارة الطلاب والمشاركين
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            سجل الطلاب المعتمد وربطهم بالمسابقات التنافسية المختلفة
          </p>
        </div>

        {/* Competition Selector Bar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">المسابقة المحددة:</span>
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

          <div className="text-xs text-slate-500">
            عدد المشاركين في هذه المسابقة: <b className="text-cdc-cyan">{compParticipants.length}</b>
          </div>
        </div>

        {/* Dual Layout: Students Registry vs Competition Participants */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Card 1: Students Database */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">سجل الطلاب العام</h3>
              <span className="text-xs text-slate-400">{students.length} طالب</span>
            </div>

            {/* Quick Add Form */}
            <form onSubmit={handleAddStudent} className="flex gap-2">
              <input
                type="text"
                placeholder="اسم الطالب الرباعي..."
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cdc-cyan outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-cdc-cyan hover:bg-cdc-cyan-hover text-white text-xs font-bold shadow-sm"
              >
                إضافة
              </button>
            </form>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute top-3 start-3" />
              <input
                type="text"
                placeholder="بحث في الطلاب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full ps-8 pe-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cdc-cyan outline-none"
              />
            </div>

            {/* Students List */}
            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {filteredStudents.map((st) => {
                const isEnrolled = participantStudentIds.has(st.id);
                return (
                  <div key={st.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{st.full_name}</p>
                      <p className="text-[10px] text-slate-400">ID: {st.id}</p>
                    </div>

                    <div>
                      {isEnrolled ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <Check className="w-3 h-3" />
                          <span>مشارك</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleLinkParticipant(st.id)}
                          className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-cdc-cyan text-[11px] font-bold border border-sky-200 transition-colors"
                        >
                          + تعيين بالمسابقة
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2: Current Competition Participants */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                المشاركون في المسابقة الحالية
              </h3>
              <span className="text-xs text-cdc-orange font-bold">
                {compParticipants.length} مرشح
              </span>
            </div>

            <p className="text-xs text-slate-500">
              هؤلاء هم الطلاب الذين سيظهرون للمصوتين في رابط المسابقة الرسمي.
            </p>

            <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
              {compParticipants.map((p) => (
                <div key={p.id} className="py-3.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-cdc-orange flex items-center justify-center font-bold">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{p.student?.full_name}</p>
                      <p className="text-[10px] text-slate-400">
                        مضاف بتاريخ: {new Date(p.created_at).toLocaleDateString('ar-YE')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveParticipant(p.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    title="إزالة المشارك"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {compParticipants.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-xs">
                  لم يتم تعيين أي طلاب في هذه المسابقة بعد. استخدم زر "تعيين بالمسابقة" من القائمة المقابلة.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminStudents;

