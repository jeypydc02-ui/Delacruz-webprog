import { useState } from 'react';
import { RotateCcw, Package, Clock, CheckCircle, HelpCircle } from 'lucide-react';

const faqs = [
  { q: 'How long do I have to return an item?', a: 'You have 30 days from the delivery date to initiate a return for eligible items.' },
  { q: 'What items are eligible for return?', a: 'Unworn, unwashed items in original packaging with all tags attached are eligible. Sale items marked "Final Sale" cannot be returned.' },
  { q: 'How do I get a refund?', a: 'Once we receive and inspect the item, your refund will be processed within 5-7 business days to your original payment method.' },
  { q: 'Can I exchange for a different size?', a: 'Yes! You can exchange for a different size of the same product. Place a return request and add the new item to your cart.' },
  { q: 'Who pays for return shipping?', a: 'JEYP Members enjoy free return shipping. Non-members are responsible for return shipping costs.' },
];

export default function ReturnsPage() {
  const [form, setForm] = useState({ orderNumber: '', email: '', reason: '', details: '' });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = (e) => { e.preventDefault(); setSubmitted(true); };

  return (
    <main className="max-w-4xl mx-auto px-4 lg:px-8 py-10">
      <div className="text-center mb-10">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'linear-gradient(135deg,#1a1a2e,#0f3460)' }}>
          <RotateCcw size={28} className="text-yellow-400" />
        </div>
        <h1 className="text-3xl font-black mb-2" style={{ color: '#1a1a2e' }}>Returns & Exchanges</h1>
        <p className="text-gray-500">Easy returns within 30 days of delivery</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { icon: Clock,        label: '30-Day Returns',    desc: 'Return within 30 days of delivery' },
          { icon: Package,      label: 'Free for Members',  desc: 'JEYP Members get free return shipping' },
          { icon: CheckCircle,  label: 'Fast Refunds',      desc: 'Refunds processed in 5-7 business days' },
        ].map(({ icon: Icon, label, desc }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: 'linear-gradient(135deg,#e8c547,#f5d76e)' }}>
              <Icon size={18} className="text-[#1a1a2e]" />
            </div>
            <p className="font-bold text-sm text-[#1a1a2e] mb-1">{label}</p>
            <p className="text-xs text-gray-400">{desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Return Form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-black text-[#1a1a2e] mb-5">Request a Return</h2>
          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Return Request Submitted!</h3>
              <p className="text-gray-500 text-sm">We'll contact you within 24 hours with return instructions.</p>
              <button onClick={() => { setSubmitted(false); setForm({ orderNumber:'', email:'', reason:'', details:'' }); }}
                className="mt-4 px-6 py-2 text-sm font-bold rounded-full btn-dark">Submit Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div><label className="block text-sm font-semibold mb-1.5 text-gray-700">Order Number</label>
                <input required className="input-base" value={form.orderNumber} onChange={update('orderNumber')} placeholder="JEYP-000001" /></div>
              <div><label className="block text-sm font-semibold mb-1.5 text-gray-700">Email Address</label>
                <input required type="email" className="input-base" value={form.email} onChange={update('email')} placeholder="you@email.com" /></div>
              <div><label className="block text-sm font-semibold mb-1.5 text-gray-700">Reason for Return</label>
                <select required className="input-base" value={form.reason} onChange={update('reason')}>
                  <option value="">Select a reason</option>
                  <option>Wrong size</option>
                  <option>Defective/Damaged item</option>
                  <option>Not as described</option>
                  <option>Changed my mind</option>
                  <option>Wrong item received</option>
                  <option>Other</option>
                </select></div>
              <div><label className="block text-sm font-semibold mb-1.5 text-gray-700">Additional Details</label>
                <textarea className="input-base h-24 resize-none" value={form.details} onChange={update('details')} placeholder="Describe the issue..." /></div>
              <button type="submit" className="w-full py-3 text-sm font-bold rounded-full btn-gold">Submit Return Request</button>
            </form>
          )}
        </div>

        {/* FAQ */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <HelpCircle size={20} className="text-gray-400" />
            <h2 className="text-lg font-black text-[#1a1a2e]">Frequently Asked Questions</h2>
          </div>
          <div className="flex flex-col gap-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm text-[#1a1a2e] hover:bg-gray-50 transition-colors">
                  {faq.q}
                  <span className="text-gray-400 flex-shrink-0 ml-2">{openFaq === idx ? '−' : '+'}</span>
                </button>
                {openFaq === idx && <div className="px-4 pb-4 text-sm text-gray-500 leading-relaxed">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
