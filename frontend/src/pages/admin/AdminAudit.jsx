import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import api from '../../services/api';
import { History, Search, ShieldCheck } from 'lucide-react';

const AdminAudit = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/audit-logs');
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.entity_type.toLowerCase().includes(search.toLowerCase()) ||
      (l.details && l.details.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AdminLayout activeTab="audit">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              سجل العمليات الإدارية (Audit Logs)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              توثيق شفاف لجميع التغييرات والعمليات الإدارية لضمان النزاهة والموثوقية
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute top-3 start-3" />
            <input
              type="text"
              placeholder="بحث في سجل العمليات..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full ps-9 pe-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cdc-cyan outline-none bg-white"
            />
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold">
                  <th className="py-3 px-4 text-start">#</th>
                  <th className="py-3 px-4 text-start">نوع العملية</th>
                  <th className="py-3 px-4 text-start">الكيان</th>
                  <th className="py-3 px-4 text-start">التفاصيل</th>
                  <th className="py-3 px-4 text-start">التوقيت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-slate-400">{log.id}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{log.action}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]">
                        {log.entity_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                      {log.details || '-'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(log.created_at).toLocaleString('ar-YE')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLogs.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                لا توجد سجلات مطابقة
              </div>
            )}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminAudit;

