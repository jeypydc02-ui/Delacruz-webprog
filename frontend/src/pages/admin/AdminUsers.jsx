import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Shield, ShieldCheck, User as UserIcon, Users } from 'lucide-react';
import { api } from '../../lib/api';
import AdminLayout from './AdminLayout';
import { useAuthStore } from '../../store/authStore';
import { useToastStore } from '../../components/ui/Toast';

const ROLE_STYLES = {
  buyer:      { bg: 'bg-slate-100 text-slate-600',      dot: 'bg-slate-400' },
  admin:      { bg: 'bg-amber-100 text-amber-700',      dot: 'bg-amber-500' },
  superadmin: { bg: 'bg-violet-100 text-violet-700',    dot: 'bg-violet-500' },
};

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const { user: me } = useAuthStore();
  const qc    = useQueryClient();
  const toast = useToastStore();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', search],
    queryFn: async () => {
      const r = await api.get('/admin/users', { params: { search: search || undefined } });
      return r.data.users;
    },
  });

  const changeRole = useMutation({
    mutationFn: ({ id, role }) => api.put(`/admin/users/${id}/role`, { role }),
    onSuccess: () => { qc.invalidateQueries(['admin-users']); toast.success('User role updated.'); },
    onError: () => toast.error('Failed to update user role.'),
  });

  const admins = data?.filter(u => u.role !== 'buyer').length || 0;
  const buyers = data?.filter(u => u.role === 'buyer').length || 0;

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl font-black text-[#1a1a2e] tracking-tight">User Management</h2>
            <p className="text-gray-500 text-sm mt-1">Manage roles and monitor registered users</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white border border-gray-100 rounded-2xl px-5 py-3 text-center shadow-sm">
              <div className="text-2xl font-black text-[#1a1a2e]">{data?.length || 0}</div>
              <div className="text-xs text-gray-400 font-medium mt-0.5">Total</div>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-2xl px-5 py-3 text-center shadow-sm">
              <div className="text-2xl font-black text-amber-600">{admins}</div>
              <div className="text-xs text-amber-500 font-medium mt-0.5">Admins</div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-center shadow-sm">
              <div className="text-2xl font-black text-slate-600">{buyers}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Buyers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:border-[#1a1a2e] focus:ring-2 focus:ring-[#1a1a2e]/10 transition-all"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
            <div className="w-5 h-5 border-2 border-gray-200 border-t-[#1a1a2e] rounded-full animate-spin" />
            Loading users...
          </div>
        ) : !data?.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Users size={40} className="mb-3 opacity-30" />
            <p>No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#1a1a2e' }} className="text-left">
                  {['User', 'Email', 'Role', 'Status', 'Joined', 'Change Role'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-xs font-semibold text-white/50 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((u, i) => {
                  const style = ROLE_STYLES[u.role] || ROLE_STYLES.buyer;
                  return (
                    <tr key={u._id} className={`border-b border-gray-50 hover:bg-gray-50/80 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-[#1a1a2e] flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg,#e8c547,#f5d76e)' }}>
                            {u.firstName?.[0]}{u.lastName?.[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-[#1a1a2e] leading-tight">{u.firstName} {u.lastName}</p>
                            {u._id === me?._id && <span className="text-xs text-amber-500 font-medium">You</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-500">{u.email}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg capitalize ${style.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {u.isVerified
                          ? <span className="inline-flex items-center gap-1 text-green-600 text-xs font-semibold"><ShieldCheck size={13} /> Verified</span>
                          : <span className="inline-flex items-center gap-1 text-red-400 text-xs font-semibold"><Shield size={13} /> Unverified</span>
                        }
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-xs">
                        {new Date(u.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4">
                        {u._id !== me?._id ? (
                          <select
                            value={u.role}
                            onChange={(e) => changeRole.mutate({ id: u._id, role: e.target.value })}
                            className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white cursor-pointer hover:border-[#1a1a2e] focus:outline-none focus:border-[#1a1a2e] transition-colors font-medium">
                            {['buyer', 'admin', 'superadmin'].map(r => <option key={r} value={r}>{r}</option>)}
                          </select>
                        ) : (
                          <span className="text-xs text-gray-300 italic">Cannot change own role</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
