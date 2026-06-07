import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, X, Save, Search, Package } from 'lucide-react';
import { api } from '../../lib/api';
import AdminLayout from './AdminLayout';
import { useToastStore } from '../../components/ui/Toast';

const EMPTY = {
  name:'', slug:'', subtitle:'', description:'', price:'', salePrice:'',
  category:'men', sport:'Lifestyle', badge:'', image:'', sizes:'',
  colors:'', colorNames:'', featured:false
};

const BADGE_COLORS = {
  'Just In': 'bg-blue-100 text-blue-700',
  'New': 'bg-green-100 text-green-700',
  'Bestseller': 'bg-amber-100 text-amber-700',
  'Sale': 'bg-red-100 text-red-600',
};

function Field({ label, children, span2 }) {
  return (
    <div className={span2 ? 'col-span-2' : ''}>
      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

export default function AdminProducts() {
  const [modal, setModal]   = useState(null);
  const [form, setForm]     = useState(EMPTY);
  const [search, setSearch] = useState('');
  const qc    = useQueryClient();
  const toast = useToastStore();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', search],
    queryFn: async () => {
      const r = await api.get('/products', { params: { search: search || undefined, limit: 50 } });
      return r.data.products;
    },
  });

  const save = useMutation({
    mutationFn: (f) => {
      const payload = {
        ...f,
        price: Number(f.price),
        salePrice: f.salePrice ? Number(f.salePrice) : null,
        sizes: f.sizes.split(',').map(s => s.trim()).filter(Boolean),
        colors: f.colors.split(',').map(s => s.trim()).filter(Boolean),
        colorNames: f.colorNames.split(',').map(s => s.trim()).filter(Boolean),
        badge: f.badge || null,
      };
      return modal === 'edit' ? api.put(`/products/${f._id}`, payload) : api.post('/products', payload);
    },
    onSuccess: () => {
      qc.invalidateQueries(['admin-products']); setModal(null); setForm(EMPTY);
      toast.success(modal === 'edit' ? 'Product updated.' : 'Product added.');
    },
    onError: () => toast.error('Failed to save product.'),
  });

  const del = useMutation({
    mutationFn: (id) => api.delete(`/products/${id}`),
    onSuccess: () => { qc.invalidateQueries(['admin-products']); toast.success('Product deleted.'); },
    onError: () => toast.error('Failed to delete product.'),
  });

  const openEdit = (p) => {
    setForm({ ...p, sizes: (p.sizes||[]).join(', '), colors: (p.colors||[]).join(', '), colorNames: (p.colorNames||[]).join(', '), salePrice: p.salePrice || '', badge: p.badge || '' });
    setModal('edit');
  };

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const inputCls = "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#1a1a2e] focus:ring-2 focus:ring-[#1a1a2e]/10 transition-all";

  return (
    <AdminLayout>
      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
              <div>
                <h3 className="text-lg font-black text-[#1a1a2e]">{modal === 'edit' ? 'Edit Product' : 'Add Product'}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{modal === 'edit' ? 'Update product details below' : 'Fill in the product details below'}</p>
              </div>
              <button onClick={() => setModal(null)} className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Product Name">
                  <input className={inputCls} value={form.name} onChange={update('name')} required placeholder="JEYP Air Max..." />
                </Field>
                <Field label="Slug (URL)">
                  <input className={inputCls} value={form.slug} onChange={update('slug')} required placeholder="air-max-..." />
                </Field>
                <Field label="Subtitle" span2>
                  <input className={inputCls} value={form.subtitle} onChange={update('subtitle')} placeholder="Just Elevate Your..." />
                </Field>
                <Field label="Image URL" span2>
                  <input className={inputCls} value={form.image} onChange={update('image')} required placeholder="https://..." />
                  {form.image && (
                    <div className="mt-2 w-16 h-16 rounded-xl overflow-hidden border border-gray-100">
                      <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </Field>
                <Field label="Description" span2>
                  <textarea className={`${inputCls} h-24 resize-none`} value={form.description} onChange={update('description')} required />
                </Field>
                <Field label="Price (₱)">
                  <input type="number" className={inputCls} value={form.price} onChange={update('price')} required placeholder="5995" />
                </Field>
                <Field label="Sale Price (₱) — optional">
                  <input type="number" className={inputCls} value={form.salePrice} onChange={update('salePrice')} placeholder="4995" />
                </Field>
                <Field label="Category">
                  <select className={inputCls} value={form.category} onChange={update('category')}>
                    {['men','women','kids'].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
                  </select>
                </Field>
                <Field label="Sport">
                  <select className={inputCls} value={form.sport} onChange={update('sport')}>
                    {['Running','Basketball','Football','Training','Lifestyle','Golf','Tennis','Skateboarding'].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Field>
                <Field label="Badge">
                  <select className={inputCls} value={form.badge} onChange={update('badge')}>
                    {['','New','Just In','Bestseller','Sale'].map(b => <option key={b} value={b}>{b || 'None'}</option>)}
                  </select>
                </Field>
                <Field label=" ">
                  <label className="flex items-center gap-3 cursor-pointer mt-2">
                    <div className="relative">
                      <input type="checkbox" id="featured" checked={form.featured} onChange={update('featured')} className="sr-only" />
                      <div className={`w-11 h-6 rounded-full transition-colors ${form.featured ? 'bg-[#1a1a2e]' : 'bg-gray-200'}`}>
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.featured ? 'translate-x-5' : ''}`} style={form.featured ? {background:'linear-gradient(135deg,#e8c547,#f5d76e)'} : {}} />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-700">Featured product</span>
                  </label>
                </Field>
                <Field label="Sizes (comma-separated, e.g. 6, 7, 8 or XS, S, M)" span2>
                  <input className={inputCls} value={form.sizes} onChange={update('sizes')} placeholder="6, 6.5, 7, 7.5, 8..." />
                </Field>
                <Field label="Colors (hex, comma-separated)">
                  <input className={inputCls} value={form.colors} onChange={update('colors')} placeholder="#111111, #FFFFFF" />
                </Field>
                <Field label="Color Names (comma-separated)">
                  <input className={inputCls} value={form.colorNames} onChange={update('colorNames')} placeholder="Black, White" />
                </Field>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-gray-100 flex-shrink-0">
              <button type="button" onClick={() => setModal(null)}
                className="flex-1 py-3 text-sm font-bold border-2 border-gray-200 rounded-full hover:border-gray-300 transition-colors text-gray-600">
                Cancel
              </button>
              <button onClick={() => save.mutate(form)} disabled={save.isPending}
                className="flex-1 py-3 text-sm font-bold rounded-full flex items-center justify-center gap-2 disabled:opacity-60 text-[#1a1a2e]"
                style={{ background: 'linear-gradient(135deg,#e8c547,#f5d76e)' }}>
                <Save size={15} /> {save.isPending ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-black text-[#1a1a2e] tracking-tight">Products</h2>
          <p className="text-gray-500 text-sm mt-1">{data?.length || 0} products in catalog</p>
        </div>
        <button onClick={() => { setForm(EMPTY); setModal('add'); }}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-full text-[#1a1a2e] shadow-sm hover:shadow-md transition-all"
          style={{ background: 'linear-gradient(135deg,#e8c547,#f5d76e)' }}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:border-[#1a1a2e] focus:ring-2 focus:ring-[#1a1a2e]/10 transition-all"
          placeholder="Search products..."
          value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
            <div className="w-5 h-5 border-2 border-gray-200 border-t-[#1a1a2e] rounded-full animate-spin" />
            Loading products...
          </div>
        ) : !data?.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Package size={40} className="mb-3 opacity-30" />
            <p>No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#1a1a2e' }}>
                  {['Image', 'Name', 'Category', 'Sport', 'Price', 'Badge', 'Featured', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((p, i) => (
                  <tr key={p._id} className={`border-b border-gray-50 hover:bg-gray-50/80 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                    <td className="px-5 py-4">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-[#1a1a2e] leading-tight">{p.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{p.subtitle}</p>
                    </td>
                    <td className="px-5 py-4 capitalize text-gray-600">{p.category}</td>
                    <td className="px-5 py-4 text-gray-600">{p.sport}</td>
                    <td className="px-5 py-4">
                      {p.salePrice ? (
                        <>
                          <p className="font-bold text-red-500">₱{p.salePrice.toLocaleString()}</p>
                          <p className="text-xs text-gray-400 line-through">₱{p.price.toLocaleString()}</p>
                        </>
                      ) : (
                        <p className="font-bold text-[#1a1a2e]">₱{p.price.toLocaleString()}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {p.badge && (
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${BADGE_COLORS[p.badge] || 'bg-gray-100 text-gray-600'}`}>
                          {p.badge}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {p.featured ? (
                        <span className="text-amber-400 text-base">★</span>
                      ) : (
                        <span className="text-gray-300 text-base">☆</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)}
                          className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border border-blue-100" title="Edit">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => { if(window.confirm('Delete this product?')) del.mutate(p._id); }}
                          className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors border border-red-100" title="Delete">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
