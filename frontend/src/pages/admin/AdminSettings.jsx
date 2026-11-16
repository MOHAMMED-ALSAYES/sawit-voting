import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../services/api';
import { Settings as SettingsIcon, ShieldCheck, User, Lock, Mail, CheckCircle2, AlertCircle } from 'lucide-react';

const AdminSettings = () => {
  const [profile, setProfile] = useState({ username: '', email: '' });
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    current_password: '',
    new_password: '',
    confirm_new_password: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchMe = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/me');
        setProfile(res.data);
        setFormData((prev) => ({
          ...prev,
          username: res.data.username,
          email: res.data.email,
        }));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (formData.new_password) {
      if (formData.new_password !== formData.confirm_new_password) {
        setErrorMsg('كلمة المرور الجديدة غير متطابقة مع التأكيد');
        return;
      }
      if (!formData.current_password) {
        setErrorMsg('يجب كتابة كلمة المرور الحالية لتتمكن من تعيين كلمة مرور جديدة');
        return;
      }
    }

    try {
      setSaving(true);
      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
      };
      if (formData.new_password) {
        payload.current_password = formData.current_password.trim();
        payload.new_password = formData.new_password.trim();
      }

      const res = await api.put('/admin/profile', payload);
      setProfile(res.data);
      localStorage.setItem('sawit_admin_name', res.data.username);
      setSuccessMsg('تم حفظ وتحديث بيانات حساب الإدارة وكلمة المرور بنجاح!');
      setFormData((prev) => ({
        ...prev,
        current_password: '',
        new_password: '',
        confirm_new_password: '',
      }));
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'حدث خطأ أثناء حفظ البيانات');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout activeTab="settings">
      <div className="space-y-6 max-w-4xl">
        
        {/* Header */}
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <SettingsIcon className="w-6 h-6 text-cdc-cyan" />
            <span>إعدادات حساب الإدارة والأمان</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            تخصيص اسم المستخدم، البريد الرسمي، وتعيين كلمة المرور لحماية لوحة التحكم عند الرفع على السيرفر
          </p>
        </div>

        {/* Alerts */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Settings Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <form onSubmit={handleUpdate} className="space-y-6 text-xs">
            
            {/* Account Credentials */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                <User className="w-4 h-4 text-cdc-cyan" />
                <span>بيانات الحساب الأساسية</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    اسم المستخدم للإدارة (Username)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cdc-cyan outline-none text-xs"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">الاسم الذي ستستخدمه لتسجيل الدخول</p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    البريد الإلكتروني للإدارة
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cdc-cyan outline-none text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Password Change */}
            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                <Lock className="w-4 h-4 text-cdc-orange" />
                <span>تغيير كلمة المرور (أمان السيرفر)</span>
              </h3>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-800">
                💡 اتركه فارغاً إذا كنت لا ترغب بتغيير كلمة المرور الحالية. عند النقل للإنترنت يُنصح بكلمة مرور قوية تزيد عن 8 أحرف وأرقام.
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  كلمة المرور الحالية
                </label>
                <input
                  type="password"
                  value={formData.current_password}
                  onChange={(e) => setFormData({ ...formData, current_password: e.target.value })}
                  placeholder="اكتب كلمة المرور الحالية لتأكيد التغيير..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cdc-cyan outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    كلمة المرور الجديدة
                  </label>
                  <input
                    type="password"
                    value={formData.new_password}
                    onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                    placeholder="كلمة مرور جديدة قوية..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cdc-cyan outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    تأكيد كلمة المرور الجديدة
                  </label>
                  <input
                    type="password"
                    value={formData.confirm_new_password}
                    onChange={(e) => setFormData({ ...formData, confirm_new_password: e.target.value })}
                    placeholder="إعادة كتابة كلمة المرور الجديدة..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cdc-cyan outline-none text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-cdc-cyan hover:bg-cdc-cyan-hover text-white font-bold text-xs shadow-md transition-all active:scale-95"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>حفظ وتحديث البيانات</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

        {/* System & Developer Credits Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-cdc-cyan flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">معلومات المنظومة والملكية الفكرية</h3>
              <p className="text-xs text-slate-500">حقوق التصميم والبرمجة والتطوير التقني للمنصة</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-500">المهندس المطور للمنظومة:</p>
              <h4 className="text-sm font-extrabold text-slate-900">MOHAMMED SAYES (م. محمد الصايص)</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">منصة صَوّت SAWIT | لمركز الاستشارات والتنمية - جامعة العلوم والتكنولوجيا</p>
            </div>

            <a
              href="https://wa.me/967730116384"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-mono text-xs font-bold shadow-sm transition-all"
            >
              <span>واتساب / اتصال: 730116384</span>
            </a>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminSettings;

