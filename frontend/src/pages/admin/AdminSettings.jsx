import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../services/api';
import { 
  Settings as SettingsIcon, 
  ShieldCheck, 
  User, 
  Lock, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  Phone,
  MessageCircle,
  Globe,
  MapPin,
  Clock,
  Share2
} from 'lucide-react';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('contact'); // 'contact' or 'account'

  // Admin Account Profile State
  const [profile, setProfile] = useState({ username: '', email: '' });
  const [accountForm, setAccountForm] = useState({
    username: '',
    email: '',
    current_password: '',
    new_password: '',
    confirm_new_password: '',
  });

  // Contact Channels State
  const [contactForm, setContactForm] = useState({
    phone_primary: '',
    phone_secondary: '',
    whatsapp_number: '',
    whatsapp_channel_url: '',
    email_primary: '',
    email_secondary: '',
    facebook_url: '',
    address: '',
    extra_info: '',
  });

  const [loading, setLoading] = useState(true);
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingContact, setSavingContact] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [meRes, contactRes] = await Promise.all([
          api.get('/admin/me'),
          api.get('/admin/contact-info')
        ]);

        setProfile(meRes.data);
        setAccountForm((prev) => ({
          ...prev,
          username: meRes.data.username,
          email: meRes.data.email,
        }));

        if (contactRes.data) {
          setContactForm({
            phone_primary: contactRes.data.phone_primary || '',
            phone_secondary: contactRes.data.phone_secondary || '',
            whatsapp_number: contactRes.data.whatsapp_number || '',
            whatsapp_channel_url: contactRes.data.whatsapp_channel_url || '',
            email_primary: contactRes.data.email_primary || '',
            email_secondary: contactRes.data.email_secondary || '',
            facebook_url: contactRes.data.facebook_url || '',
            address: contactRes.data.address || '',
            extra_info: contactRes.data.extra_info || '',
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (accountForm.new_password) {
      if (accountForm.new_password !== accountForm.confirm_new_password) {
        setErrorMsg('كلمة المرور الجديدة غير متطابقة مع التأكيد');
        return;
      }
      if (!accountForm.current_password) {
        setErrorMsg('يجب كتابة كلمة المرور الحالية لتتمكن من تعيين كلمة مرور جديدة');
        return;
      }
    }

    try {
      setSavingAccount(true);
      const payload = {
        username: accountForm.username.trim(),
        email: accountForm.email.trim(),
      };
      if (accountForm.new_password) {
        payload.current_password = accountForm.current_password.trim();
        payload.new_password = accountForm.new_password.trim();
      }

      const res = await api.put('/admin/profile', payload);
      setProfile(res.data);
      localStorage.setItem('sawit_admin_name', res.data.username);
      setSuccessMsg('تم حفظ وتحديث بيانات حساب الإدارة وكلمة المرور بنجاح!');
      setAccountForm((prev) => ({
        ...prev,
        current_password: '',
        new_password: '',
        confirm_new_password: '',
      }));
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'حدث خطأ أثناء حفظ البيانات');
    } finally {
      setSavingAccount(false);
    }
  };

  const handleUpdateContact = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    try {
      setSavingContact(true);
      await api.put('/admin/contact-info', contactForm);
      setSuccessMsg('تم حفظ وتحديث قنوات التواصل وأرقام الهواتف والفيسبوك بنجاح!');
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'حدث خطأ أثناء حفظ قنوات التواصل');
    } finally {
      setSavingContact(false);
    }
  };

  return (
    <AdminLayout activeTab="settings">
      <div className="space-y-6 max-w-4xl">
        
        {/* Header */}
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <SettingsIcon className="w-6 h-6 text-cdc-cyan" />
            <span>إعدادات النظام وقنوات التواصل</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            إدارة أرقام هواتف المركز، قنوات الواتساب، البريد الإلكتروني، رابط الفيسبوك، وبيانات أمان الإدارة
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => { setActiveTab('contact'); setSuccessMsg(''); setErrorMsg(''); }}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'contact'
                ? 'bg-cdc-cyan text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>قنوات وأرقام التواصل والفيسبوك</span>
          </button>

          <button
            onClick={() => { setActiveTab('account'); setSuccessMsg(''); setErrorMsg(''); }}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all ${
              activeTab === 'account'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>حساب الإدارة وكلمة المرور</span>
          </button>
        </div>

        {/* Alerts */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB 1: Contact Channels & Socials */}
        {activeTab === 'contact' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
            <form onSubmit={handleUpdateContact} className="space-y-6 text-xs">
              
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-cdc-cyan" />
                  <span>أرقام الهواتف وقنوات الواتساب</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  هذه الأرقام تظهر للمستخدمين والطلاب في صفحة دليل المركز للتواصل والاستفسار
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-cdc-cyan" />
                    <span>رقم الهاتف الأساسي للاتصال</span>
                  </label>
                  <input
                    type="text"
                    value={contactForm.phone_primary}
                    onChange={(e) => setContactForm({ ...contactForm, phone_primary: e.target.value })}
                    placeholder="مثال: 730116384 أو 777123456"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cdc-cyan outline-none text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-cdc-orange" />
                    <span>أرقام هواتف إضافية / خطوط أخرى</span>
                  </label>
                  <input
                    type="text"
                    value={contactForm.phone_secondary}
                    onChange={(e) => setContactForm({ ...contactForm, phone_secondary: e.target.value })}
                    placeholder="مثال: 03-200000 / 777000000 / 711000000"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cdc-cyan outline-none text-xs font-mono"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">يمكنك كتابة أكثر من رقم مفصولاً بفاصلة /</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>رقم الواتساب المعتمد للمركز</span>
                  </label>
                  <input
                    type="text"
                    value={contactForm.whatsapp_number}
                    onChange={(e) => setContactForm({ ...contactForm, whatsapp_number: e.target.value })}
                    placeholder="مثال: 730116384 أو 967730116384"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cdc-cyan outline-none text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>رابط قناة واتساب الرسمية (Channel URL)</span>
                  </label>
                  <input
                    type="url"
                    value={contactForm.whatsapp_channel_url}
                    onChange={(e) => setContactForm({ ...contactForm, whatsapp_channel_url: e.target.value })}
                    placeholder="https://whatsapp.com/channel/..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cdc-cyan outline-none text-xs font-mono"
                  />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                  <Share2 className="w-4 h-4 text-cdc-orange" />
                  <span>البريد الإلكتروني وحسابات التواصل الاجتماعي</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-sky-600" />
                      <span>البريد الإلكتروني الرسمي للمركز</span>
                    </label>
                    <input
                      type="email"
                      value={contactForm.email_primary}
                      onChange={(e) => setContactForm({ ...contactForm, email_primary: e.target.value })}
                      placeholder="cdc.hodeidah@ust.edu.ye"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cdc-cyan outline-none text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-blue-600" />
                      <span>رابط صفحة الفيسبوك الرسمية (Facebook)</span>
                    </label>
                    <input
                      type="url"
                      value={contactForm.facebook_url}
                      onChange={(e) => setContactForm({ ...contactForm, facebook_url: e.target.value })}
                      placeholder="https://facebook.com/cdc.ust.hodeidah"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cdc-cyan outline-none text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5 space-y-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                    <span>عنوان ومقر المركز والفرع</span>
                  </label>
                  <input
                    type="text"
                    value={contactForm.address}
                    onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                    placeholder="مثال: اليمن - الحديدة - جامعة العلوم والتكنولوجيا - فرع الحديدة"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cdc-cyan outline-none text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>مواعيد الدوام وملاحظات إضافية</span>
                  </label>
                  <input
                    type="text"
                    value={contactForm.extra_info}
                    onChange={(e) => setContactForm({ ...contactForm, extra_info: e.target.value })}
                    placeholder="مثال: أوقات الدوام الرسمي: السبت إلى الخميس من 8:00 صباحاً حتى 2:00 ظهراً"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-cdc-cyan outline-none text-xs"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={savingContact}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-cdc-cyan hover:bg-cdc-cyan-hover text-white font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  {savingContact ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>حفظ وتحديث قنوات التواصل</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* TAB 2: Admin Account Credentials */}
        {activeTab === 'account' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
            <form onSubmit={handleUpdateAccount} className="space-y-6 text-xs">
              
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
                      value={accountForm.username}
                      onChange={(e) => setAccountForm({ ...accountForm, username: e.target.value })}
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
                      value={accountForm.email}
                      onChange={(e) => setAccountForm({ ...accountForm, email: e.target.value })}
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
                    value={accountForm.current_password}
                    onChange={(e) => setAccountForm({ ...accountForm, current_password: e.target.value })}
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
                      value={accountForm.new_password}
                      onChange={(e) => setAccountForm({ ...accountForm, new_password: e.target.value })}
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
                      value={accountForm.confirm_new_password}
                      onChange={(e) => setAccountForm({ ...accountForm, confirm_new_password: e.target.value })}
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
                  disabled={savingAccount}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  {savingAccount ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>حفظ وتحديث بيانات الحساب</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
