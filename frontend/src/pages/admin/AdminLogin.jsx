import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { Lock, User, ArrowRight, ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { isRtl } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/admin/login', { 
        username: username.trim(), 
        password: password.trim() 
      });
      localStorage.setItem('sawit_admin_token', res.data.access_token);
      localStorage.setItem('sawit_admin_name', res.data.admin_name);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'فشل تسجيل الدخول، يرجى التأكد من البيانات.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-ust-navy to-slate-950 flex flex-col justify-center items-center p-4">
      
      {/* Logos Header */}
      <div className="flex items-center gap-4 mb-8 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg">
        <img src="/logo-cdc.png" alt="CDC Logo" className="h-12 w-auto" />
        <div className="h-8 w-[1px] bg-white/20"></div>
        <img src="/logo-ust.png" alt="UST Logo" className="h-12 w-auto" />
      </div>

      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl border border-slate-200">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            لوحة الإدارة | <span className="text-cdc-cyan">SAWIT</span>
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            تسجيل الدخول الآمن لإدارة المسابقات والمشاركين والنتائج
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              اسم المستخدم
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute top-3.5 start-3.5" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full ps-10 pe-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-cdc-cyan focus:border-cdc-cyan outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute top-3.5 start-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full ps-10 pe-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-cdc-cyan focus:border-cdc-cyan outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-cdc-cyan hover:bg-cdc-cyan-hover text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>دخول لوحة التحكم</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <a
            href="/"
            className="text-xs text-slate-500 hover:text-cdc-cyan transition-colors"
          >
            ← العودة للصفحة العامة
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

