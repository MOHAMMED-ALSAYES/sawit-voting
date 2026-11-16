import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../services/api';
import { 
  Trophy, 
  Plus, 
  Copy, 
  ExternalLink, 
  Lock, 
  Trash2, 
  Check, 
  Users,
  Calendar,
  MessageCircle,
  Edit,
  Share2
} from 'lucide-react';

const AdminCompetitions = () => {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingComp, setEditingComp] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    start_at: new Date().toISOString().slice(0, 16),
    end_at: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16),
    status: 'active',
    whatsapp_channel_url: 'https://whatsapp.com/channel/',
  });

  const fetchCompetitions = async () => {
    try {
      setLoading(true);
      const res = await api.get('/competitions');
      setCompetitions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/competitions', formData);
      setShowCreateModal(false);
      fetchCompetitions();
      setFormData({
        title: '',
        slug: '',
        description: '',
        start_at: new Date().toISOString().slice(0, 16),
        end_at: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16),
        status: 'active',
        whatsapp_channel_url: 'https://whatsapp.com/channel/',
      });
    } catch (err) {
      alert(err.response?.data?.detail || 'فشل إنشاء المسابقة');
    }
  };

  const handleOpenEdit = (comp) => {
    setEditingComp(comp);
    setFormData({
      title: comp.title,
      slug: comp.slug,
      description: comp.description || '',
      start_at: new Date(comp.start_at).toISOString().slice(0, 16),
      end_at: new Date(comp.end_at).toISOString().slice(0, 16),
      status: comp.status,
      whatsapp_channel_url: comp.whatsapp_channel_url,
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingComp) return;
    try {
      await api.put(`/competitions/${editingComp.id}`, {
        title: formData.title,
        description: formData.description,
        start_at: formData.start_at,
        end_at: formData.end_at,
        status: formData.status,
        whatsapp_channel_url: formData.whatsapp_channel_url.trim(),
      });
      setShowEditModal(false);
      setEditingComp(null);
      fetchCompetitions();
    } catch (err) {
      alert(err.response?.data?.detail || 'فشل تعديل المسابقة');
    }
  };

  const handleCloseCompetition = async (id) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في إغلاق التصويت لهذه المسابقة؟')) return;
    try {
      await api.post(`/competitions/${id}/close`);
      fetchCompetitions();
    } catch (err) {
      alert(err.response?.data?.detail || 'فشل إغلاق المسابقة');
    }
  };

  const handleDeleteCompetition = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه المسابقة؟ (لا يمكن حذف مسابقات تحتوي على أصوات فعلية)')) return;
    try {
      await api.delete(`/competitions/${id}`);
      fetchCompetitions();
    } catch (err) {
      alert(err.response?.data?.detail || 'فشل حذف المسابقة');
    }
  };

  const copyCompetitionLink = (slug, id) => {
    const url = `${window.location.origin}/c/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <AdminLayout activeTab="competitions">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              إدارة المسابقات وقنوات WhatsApp
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              إنشاء وتعديل المسابقات وتعيين رابط قناة واتساب الرسمية ونشر روابط التصويت
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-cdc-cyan hover:bg-cdc-cyan-hover text-white text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>إنشاء مسابقة جديدة</span>
          </button>
        </div>

        {/* Competitions List */}
        <div className="grid grid-cols-1 gap-4">
          {competitions.map((comp) => {
            const isCopied = copiedId === comp.id;

            return (
              <div
                key={comp.id}
                className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                <div className="space-y-2.5 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        comp.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {comp.status === 'active' ? 'نشطة' : comp.status === 'closed' ? 'مغلقة' : 'مكتملة'}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">{comp.title}</h3>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 max-w-2xl">
                    {comp.description}
                  </p>

                  {/* Channel WhatsApp Badge */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[11px]">
                      <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>قناة واتساب المربوطة:</span>
                      <a 
                        href={comp.whatsapp_channel_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="underline hover:text-emerald-900 max-w-xs truncate"
                      >
                        {comp.whatsapp_channel_url}
                      </a>
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-cdc-cyan" />
                      <span>النهاية: {new Date(comp.end_at).toLocaleDateString('ar-YE')}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-cdc-orange" />
                      <span>{comp.participant_count} مشاركين</span>
                    </span>
                    <span className="font-semibold text-slate-700">
                      إجمالي الأصوات: {comp.total_votes}
                    </span>
                  </div>
                </div>

                {/* Actions & Public Link */}
                <div className="w-full lg:w-auto flex flex-wrap items-center gap-2">
                  
                  {/* WhatsApp Share Button */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `📢 مسابقة *${comp.title}* برعاية مركز الاستشارات والتنمية وجامعة العلوم والتكنولوجيا.\nصوت لمرشحك المفضل عبر الرابط:\n${window.location.origin}/c/${comp.slug}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
                    title="نشر سريع عبر WhatsApp"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>مشاركة واتساب</span>
                  </a>

                  {/* Copy Link Button */}
                  <button
                    onClick={() => copyCompetitionLink(comp.slug, comp.id)}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                    title="نسخ رابط المسابقة"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span className="text-emerald-600">تم النسخ!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-slate-500" />
                        <span>نسخ الرابط</span>
                      </>
                    )}
                  </button>

                  {/* Edit WhatsApp & Details Button */}
                  <button
                    onClick={() => handleOpenEdit(comp)}
                    className="inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-colors"
                    title="تعديل رابط القناة والبيانات"
                  >
                    <Edit className="w-3.5 h-3.5 text-cdc-cyan" />
                    <span>تعديل</span>
                  </button>

                  <a
                    href={`/c/${comp.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                    title="معاينة الواجهة"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  {comp.status === 'active' && (
                    <button
                      onClick={() => handleCloseCompetition(comp.id)}
                      className="inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 text-xs font-bold transition-colors"
                      title="إغلاق التصويت"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>إغلاق</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteCompetition(comp.id)}
                    className="inline-flex items-center justify-center p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                    title="حذف المسابقة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Create Competition Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-4">إنشاء مسابقة جديدة</h3>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم المسابقة</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="مثال: مسابقة اللغة الإنجليزية 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cdc-cyan outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">الاسم التعريفي في الرابط (Slug)</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  placeholder="english-contest-2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cdc-cyan outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">وصف المسابقة</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="اكتب نبذة مختصرة عن أهداف المسابقة..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cdc-cyan outline-none text-xs"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-emerald-800 mb-1 flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>رابط قناة WhatsApp الرسمية للمركز</span>
                </label>
                <input
                  type="url"
                  required
                  value={formData.whatsapp_channel_url}
                  onChange={(e) => setFormData({ ...formData, whatsapp_channel_url: e.target.value })}
                  placeholder="https://whatsapp.com/channel/0029Va..."
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs bg-emerald-50/30"
                />
                <p className="text-[10px] text-slate-400 mt-1">هذا الرابط سينتقل إليه الطلاب قبل إتمام عملية التصويت</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">تاريخ البداية</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.start_at}
                    onChange={(e) => setFormData({ ...formData, start_at: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cdc-cyan outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">تاريخ النهاية</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.end_at}
                    onChange={(e) => setFormData({ ...formData, end_at: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cdc-cyan outline-none text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cdc-cyan hover:bg-cdc-cyan-hover text-white font-bold shadow-md"
                >
                  حفظ وإنشاء المسابقة
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Competition Modal */}
      {showEditModal && editingComp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-900 mb-4">تعديل بيانات المسابقة وقناة WhatsApp</h3>

            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">اسم المسابقة</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cdc-cyan outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-emerald-800 mb-1 flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>تعديل رابط قناة WhatsApp الرسمية للمركز</span>
                </label>
                <input
                  type="url"
                  required
                  value={formData.whatsapp_channel_url}
                  onChange={(e) => setFormData({ ...formData, whatsapp_channel_url: e.target.value })}
                  placeholder="https://whatsapp.com/channel/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-xs bg-emerald-50/50 font-mono"
                />
                <p className="text-[10px] text-slate-500 mt-1">قم بلصق رابط القناة الجديد وسيتم اعتماده للطلاب فوراً</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">وصف المسابقة</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cdc-cyan outline-none text-xs"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">تاريخ النهاية</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.end_at}
                    onChange={(e) => setFormData({ ...formData, end_at: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cdc-cyan outline-none text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">حالة المسابقة</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cdc-cyan outline-none text-xs"
                  >
                    <option value="active">نشطة (تصويت مفتوح)</option>
                    <option value="closed">مغلقة (التصويت منتهي)</option>
                    <option value="completed">مكتملة (معلنة النتائج)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-cdc-cyan hover:bg-cdc-cyan-hover text-white font-bold shadow-md"
                >
                  حفظ التعديلات
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default AdminCompetitions;
