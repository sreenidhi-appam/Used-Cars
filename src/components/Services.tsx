import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Shield, Sparkles, HeartHandshake, PhoneCall, CheckCircle, Clock, AlertTriangle, Send, ShieldAlert } from 'lucide-react';
import { ServiceBooking } from '../types';

export default function Services({ initialSubTab }: { initialSubTab: string }) {
  const [subTab, setSubTab] = useState<'rc-transfer' | 'insurance-renewal' | 'inspection' | 'fastag' | 'roadside'>('rc-transfer');

  // Sync initial sub-tab route from Navbar clicks
  React.useEffect(() => {
    if (initialSubTab) {
      setSubTab(initialSubTab as any);
    }
  }, [initialSubTab]);

  // Session bookings history state
  const [bookingsHistory, setBookingsHistory] = useState<ServiceBooking[]>([
    {
      id: 'bk-mock-1',
      serviceType: 'RC Transfer',
      name: 'Arthur Pendragon',
      phone: '+1 (555) 304-9210',
      carNumber: 'WA-772-XLP',
      date: '2026-06-08',
      status: 'Confirmed'
    }
  ]);

  /* Dynamic Form State */
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [vehicleRegNo, setVehicleRegNo] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const resetFormState = () => {
    setClientName('');
    setClientPhone('');
    setVehicleRegNo('');
    setBookingDate('');
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !vehicleRegNo) {
      alert("Please check that all core information is fully populated.");
      return;
    }

    const serviceTitleMap: Record<string, any> = {
      'rc-transfer': 'RC Transfer',
      'insurance-renewal': 'Insurance Renewal',
      'inspection': 'Vehicle Inspection',
      'fastag': 'Fastag',
      'roadside': 'Roadside Assistance'
    };

    const newBooking: ServiceBooking = {
      id: `bk-${Date.now()}`,
      serviceType: serviceTitleMap[subTab],
      name: clientName,
      phone: clientPhone,
      carNumber: vehicleRegNo,
      date: bookingDate || new Date().toISOString().split('T')[0],
      status: subTab === 'roadside' ? 'Confirmed' : 'Pending'
    };

    setBookingsHistory(prev => [newBooking, ...prev]);
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      resetFormState();
      if (subTab === 'roadside') {
        alert("CRITICAL CALL RECEIVED: A dispatch vehicle flatbed has been assigned. Safe assist team is driving to your coordinates.");
      } else {
        alert("Appointment successfully created! Check the 'Scheduled Service Registrations' panel underneath to track title status.");
      }
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      
      {/* Intro Header */}
      <div id="services-hero-header" className="mb-10 text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 font-mono">Auxiliary Support Hub</span>
        <h1 className="text-3xl sm:text-4.5xl font-black text-slate-950 tracking-tight leading-tight mt-1">RTO TITLE & CONVENIENCE SERVICES</h1>
        <p className="text-sm text-gray-500 mt-2">Let our dedicated back-office coordinate complex RTO ownership titles transfers, toll transponders registry, insurance renewals, and roadside breakdown dispatching.</p>

        {/* Buttons Subnavigation */}
        <div className="flex flex-wrap justify-center border-b border-gray-150 mt-8 gap-2 sm:gap-4.5">
          <button 
            onClick={() => setSubTab('rc-transfer')}
            className={`pb-3 text-xs sm:text-sm font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
              subTab === 'rc-transfer' ? 'border-amber-500 text-slate-900 font-extrabold' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            RC Title Transfer
          </button>
          <button 
            onClick={() => setSubTab('inspection')}
            className={`pb-3 text-xs sm:text-sm font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
              subTab === 'inspection' ? 'border-amber-500 text-slate-900 font-extrabold' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Vehicle Safety Inspection
          </button>
          <button 
            onClick={() => setSubTab('insurance-renewal')}
            className={`pb-3 text-xs sm:text-sm font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
              subTab === 'insurance-renewal' ? 'border-amber-500 text-slate-900 font-extrabold' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Insurance Renewal
          </button>
          <button 
            onClick={() => setSubTab('fastag')}
            className={`pb-3 text-xs sm:text-sm font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
              subTab === 'fastag' ? 'border-amber-500 text-slate-900 font-extrabold' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Prepaid Fastag
          </button>
          <button 
            onClick={() => setSubTab('roadside')}
            className={`pb-3 text-xs sm:text-sm font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
              subTab === 'roadside' ? 'border-amber-505 text-red-650 font-black' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            🆘 Roadside Distress
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        
        {/* Col 1: Service Booking Form (Splans 3 cols) */}
        <div className="md:col-span-3 bg-white border border-gray-150 rounded-3xl p-6.5 md:p-8 shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={subTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              
              {/* Service specific description card */}
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3.5">
                <div className="p-3 bg-white rounded-xl text-amber-500 shadow-sm border border-gray-100">
                  <HeartHandshake className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold uppercase text-slate-950 font-mono tracking-wide">
                    {subTab === 'rc-transfer' && 'Ownership Title Registry Transfer'}
                    {subTab === 'inspection' && '150-Point Digital safety report'}
                    {subTab === 'insurance-renewal' && 'Sustained Insurance Coverage Renewal'}
                    {subTab === 'fastag' && 'Prepaid National Highways Pass Registration'}
                    {subTab === 'roadside' && 'EMERGENCY TOW & ROADSIDE HELP ASSIST'}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                    {subTab === 'rc-transfer' && 'We handle the complete RTO documentation flow. Simply fill the registered license details and our lawyers file the title transfer forms on your behalf.'}
                    {subTab === 'inspection' && 'Book a highly thorough visual, paint compaction, chassis alignment, and diagnostics scanner report compiled by certified Velocity mechanics.'}
                    {subTab === 'insurance-renewal' && 'Renew pre-owned car insurance policies on-the-spot. Get zero-depreciation and standard comprehensive add-ons for the cheapest premiums.'}
                    {subTab === 'fastag' && 'Never queue for toll gates. Register your pre-owned car license plate to retrieve a national Fastag transponder tag with pre-loaded cash.'}
                    {subTab === 'roadside' && '🚨 FLAT TIRES, BATTERY DRAIN, OR ACCIDENT RECOVERY. Submit details now. Live emergency flatbeds are dispatched to your location instantly.'}
                  </p>
                </div>
              </div>

              {/* Universal Form with dynamic elements based on subTab */}
              <form onSubmit={handleBookingSubmit} id="aux-registry-form" className="space-y-4 pt-2">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5">Your Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Arthur Pendragon" 
                      value={clientName} 
                      onChange={(e) => setClientName(e.target.value)} 
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-150 rounded-xl text-xs text-gray-800 focus:outline-none" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="e.g. 9876543210 (10 digits)" 
                      value={clientPhone} 
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setClientPhone(val);
                      }} 
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-150 rounded-xl text-xs text-gray-800 focus:outline-none" 
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5">
                      {subTab === 'roadside' ? 'Active Breakdown Address / Highway Mile Marker' : 'Vehicle License Number (RTO Reg No)'}
                    </label>
                    <input 
                      type="text" 
                      placeholder={subTab === 'roadside' ? 'e.g. I-95 South, Exit 4A' : 'e.g. WA-772-XLP'} 
                      value={vehicleRegNo} 
                      onChange={(e) => setVehicleRegNo(e.target.value)} 
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-150 rounded-xl text-xs text-gray-850" 
                      required 
                    />
                  </div>
                  
                  {subTab !== 'roadside' ? (
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5">Preferred Date</label>
                      <input 
                        type="date" 
                        value={bookingDate} 
                        onChange={(e) => setBookingDate(e.target.value)} 
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-150 rounded-xl text-xs text-gray-800 focus:outline-none" 
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-red-500 font-mono mb-1.5">Breakdown Nature</label>
                      <select className="w-full px-3.5 py-2.5 bg-rose-50 border border-rose-150 rounded-xl text-xs text-red-900 focus:outline-none">
                        <option value="Engine Overheat">Engine Overheat / Smoke</option>
                        <option value="Flat Tire">Flat Tire (Side replacement)</option>
                        <option value="Dead battery">Dead Battery (Need instant jumpstart)</option>
                        <option value="Collision recovery">Collision recovery towing</option>
                      </select>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className={`w-full py-4 font-bold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow cursor-pointer active:scale-95 ${
                    subTab === 'roadside' 
                      ? 'bg-rose-600 hover:bg-rose-700 text-white font-extrabold focus:ring-rose-500' 
                      : 'bg-slate-900 hover:bg-slate-800 text-amber-500'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {subTab === 'roadside' ? '🚨 INITIATE ROADSIDE EMERGENCY DISPATCH' : 'Confirm Service Appointment Booking'}
                  </span>
                </button>

              </form>

            </motion.div>
          </AnimatePresence>
        </div>

        {/* Col 2: Live appointment records (Splans 2 cols) */}
        <div id="booking-records-panel" className="md:col-span-2 bg-slate-900 text-white border border-slate-800 rounded-3xl p-6.5 shadow-md">
          <div className="pb-3 border-b border-white/10 mb-5 text-center sm:text-left">
            <span className="text-[10px] uppercase font-mono text-amber-400 tracking-widest font-bold">Scheduled Service Registrations</span>
            <p className="text-xs text-slate-400 mt-1">Sustain records of custom bookings registered during the active web session.</p>
          </div>

          <div className="space-y-4 max-h-[360px] overflow-y-auto">
            {bookingsHistory.map(item => (
              <div key={item.id} id={item.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-start gap-3 relative">
                <div className={`p-2 rounded-xl text-xs font-bold leading-none ${
                  item.serviceType === 'Roadside Assistance' ? 'bg-rose-500/15 text-rose-400' : 'bg-amber-500/15 text-amber-400'
                }`}>
                  {item.serviceType.split(' ')[0]}
                </div>
                
                <div className="space-y-1">
                  <span className={`inline-block px-2 py-0.5 rounded text-[8px] uppercase tracking-widest font-mono font-bold ${
                    item.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-450 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-450 border border-amber-500/20'
                  }`}>
                    {item.status}
                  </span>

                  <h4 className="text-xs font-black text-white">{item.serviceType}</h4>
                  <div className="text-[10px] text-slate-400 space-y-0.5 font-sans font-medium">
                    <p>Client: {item.name}</p>
                    <p>Car Plate: {item.carNumber}</p>
                    <p>Date: {item.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
