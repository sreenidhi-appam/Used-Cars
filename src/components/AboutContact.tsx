import React, { useState } from 'react';
import { Shield, Sparkles, MessageSquare, PhoneCall, Award, Users, CheckSquare, Clock } from 'lucide-react';

export default function AboutContact() {
  /* Contact Form State */
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [inquirySubject, setInquirySubject] = useState('Buy Car inquiry');
  const [userMessage, setUserMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail || !userMessage) {
      alert("Please ensure the Name, email, and Message fields are populated.");
      return;
    }

    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setUserName('');
      setUserEmail('');
      setUserPhone('');
      setInquirySubject('Buy Car inquiry');
      setUserMessage('');
      alert("Thank you! Your inquiry ticket has been created securely. A regional support executive will connect with you shorty.");
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen space-y-16">
      
      {/* SECTION 1: ABOUT US (Trust Building) */}
      <section id="about-us-section" className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        
        {/* Left Side: Story & Guarantees */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 font-mono">Our Founding Story</span>
            <h2 className="text-3xl sm:text-4.5xl font-black text-slate-950 tracking-tight leading-tight mt-1">REVOLUTIONIZING USED VEHICLE MARKETS</h2>
            <p className="text-sm text-gray-500 mt-2">Established in 2018, Velocity set out to dismantle the traditional, stress-filled used-car purchase loop. By pioneering 150-Point inspections, 100% paperless financial pre-approvals, and verified title histories, we bring showroom safety to second-hand cars.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-gray-150 rounded-2xl shadow-sm text-center">
              <span className="text-3xl font-black text-amber-500">12,000+</span>
              <p className="text-xs font-bold text-gray-800 uppercase mt-1">Cars Certified</p>
            </div>
            <div className="p-4 bg-white border border-gray-150 rounded-2xl shadow-sm text-center">
              <span className="text-3xl font-black text-amber-500">98% PR</span>
              <p className="text-xs font-bold text-gray-800 uppercase mt-1">Direct Satisfaction</p>
            </div>
          </div>

          <div className="space-y-3 font-medium text-gray-700 text-xs">
            <div className="flex items-center space-x-2"><Award className="w-5 h-5 text-amber-500" /> <span>Platinum member of the Dealer Licensing Board</span></div>
            <div className="flex items-center space-x-2"><Users className="w-5 h-5 text-amber-500" /> <span>50+ certified mechanical inspectors nationwide</span></div>
            <div className="flex items-center space-x-2"><Shield className="w-5 h-5 text-amber-500" /> <span>Direct partnerships with leading retail credit banks</span></div>
          </div>
        </div>

        {/* Right Side: Visual Bento Collage */}
        <div className="relative h-96 rounded-3xl overflow-hidden shadow-md">
          <img 
            src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=1200" 
            alt="Showroom" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
          
          <div className="absolute bottom-5 left-5 right-5 text-white bg-slate-900/40 p-4 rounded-2xl backdrop-blur-md border border-white/5">
            <strong className="text-sm font-bold text-amber-400 block pb-1">The Velocity Standard</strong>
            <p className="text-[11px] text-slate-200 leading-normal font-sans font-medium">"Every single second hand car we accept undergoes extensive safety and odometer diagnostics. If a vehicle manifests structural defects, it gets returned. That is our locked promise."</p>
          </div>
        </div>

      </section>

      {/* SECTION 2: CONTACT & INQUIRY FORM */}
      <section id="contact-us-section" className="bg-white border border-gray-150 rounded-3xl p-6.5 md:p-10 shadow-sm grid grid-cols-1 md:grid-cols-5 gap-8 items-stretch">
        
        {/* Contact Coordinates */}
        <div className="md:col-span-2 bg-slate-900 text-white rounded-2xl p-6.5 flex flex-col justify-between border border-slate-800 space-y-8">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block mb-1">Corporate Support</span>
            <h3 className="text-xl font-black">GET IN TOUCH</h3>
            <p className="text-xs text-slate-400 mt-1 pb-4 border-b border-white/10 leading-normal">Have inquiries regarding used car inventory, finance pre-qualification files, or service transfers? Drop a ticket or dial our national callback center directly.</p>
            
            <div className="space-y-4 pt-6 text-xs text-slate-300">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/5 rounded-lg text-amber-400"><PhoneCall className="w-4 h-4" /></div>
                <div>
                  <p className="font-bold text-white">+1 (800) VELOCITY</p>
                  <p className="text-[10px] text-slate-500 font-mono">Toll-Free callback desk</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/5 rounded-lg text-amber-400"><MessageSquare className="w-4 h-4" /></div>
                <div>
                  <p className="font-bold text-white">support@velocitymoto.com</p>
                  <p className="text-[10px] text-slate-500 font-mono">Documentation desk</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/5 rounded-lg text-amber-400"><Clock className="w-4 h-4" /></div>
                <div>
                  <p className="font-bold text-white">09:00 AM - 08:00 PM EST</p>
                  <p className="text-[10px] text-slate-500 font-mono">Operations schedule</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex gap-2 text-[10px] text-slate-450 leading-normal">
            <CheckSquare className="w-5 h-5 shrink-0 text-amber-500" />
            <span>Velocity provides comprehensive compliance support, registering legal documents with state DMVs/RTOs directly.</span>
          </div>
        </div>

        {/* Action Inquiry Form */}
        <form onSubmit={handleContactSubmit} className="md:col-span-3 space-y-4 flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-lg font-black text-slate-900 uppercase">File Support & Inquiry Ticket</h3>
              <p className="text-xs text-gray-500 mt-1">Our customer experience division will prioritize callbacks according to subjects.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5">Your Full name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Arthur Pendragon" 
                  value={userName} 
                  onChange={(e) => setUserName(e.target.value)} 
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-150 rounded-xl text-xs text-gray-800 focus:outline-none" 
                  required 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  placeholder="e.g. client@domain.com" 
                  value={userEmail} 
                  onChange={(e) => setUserEmail(e.target.value)} 
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-150 rounded-xl text-xs text-gray-800 focus:outline-none" 
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5">Phone Number (Optional)</label>
                <input 
                  type="tel" 
                  placeholder="e.g. 9876543210 (10 digits)" 
                  value={userPhone} 
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setUserPhone(val);
                  }} 
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-150 rounded-xl text-xs" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5">Inquiry Topic Subject</label>
                <select
                  value={inquirySubject}
                  onChange={(e) => setInquirySubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-150 rounded-xl text-xs text-gray-800 focus:outline-none"
                >
                  <option value="Buy Car inquiry">Buy Car / Schedule Test-drive</option>
                  <option value="Sell Car trade valuation">Sell Car / Trade-in Valuation</option>
                  <option value="Credit / Finance Approval">Credit Loan pre-approvals</option>
                  <option value="Title RTO services">RTO title / Registration services</option>
                  <option value="Showroom feedback">General Support inquiries</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5 font-semibold">Message Description</label>
              <textarea 
                rows={4}
                placeholder="Briefly state you model selection, finance limits, or specific support queries..." 
                value={userMessage} 
                onChange={(e) => setUserMessage(e.target.value)} 
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-150 rounded-xl text-xs text-gray-850" 
                required 
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4.5 bg-slate-900 hover:bg-slate-800 text-amber-500 font-extrabold uppercase tracking-wider text-xs rounded-xl mt-6 transition-all shadow cursor-pointer active:scale-95"
          >
            Submit Inquiry Ticket
          </button>
        </form>

      </section>

    </div>
  );
}
