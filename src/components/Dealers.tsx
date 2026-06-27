import React, { useState, useMemo } from 'react';
import { MapPin, Phone, Star, Car, Clock, ShieldCheck, Mail, Send, ChevronRight } from 'lucide-react';
import { Dealer } from '../types';

const SHOWROOMS: Dealer[] = [
  {
    id: 'dl-1',
    name: 'Velocity Downtown Seattle Hub',
    address: '1120 Union St, Seattle, WA 98101',
    city: 'Seattle',
    phone: '+1 (206) 555-0105',
    rating: 4.9,
    reviewsCount: 182,
    inventoryCount: 42,
    image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'dl-2',
    name: 'Velocity Portland South Bay',
    address: '4390 SE McLoughlin Blvd, Portland, OR 97202',
    city: 'Portland',
    phone: '+1 (503) 555-0144',
    rating: 4.8,
    reviewsCount: 110,
    inventoryCount: 28,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'dl-3',
    name: 'Velocity Los Angeles Showroom',
    address: '8801 Wilshire Blvd, Beverly Hills, CA 90211',
    city: 'Los Angeles',
    phone: '+1 (310) 555-0199',
    rating: 4.9,
    reviewsCount: 325,
    inventoryCount: 55,
    image: 'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'dl-4',
    name: 'Velocity Bay Area Depot',
    address: '1450 Airport Blvd, San Jose, CA 95110',
    city: 'San Francisco',
    phone: '+1 (408) 555-0185',
    rating: 4.7,
    reviewsCount: 95,
    inventoryCount: 21,
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=600'
  }
];

export default function Dealers() {
  const [citySearch, setCitySearch] = useState('');
  const [selectedShowroom, setSelectedShowroom] = useState<Dealer | null>(null);

  /* Manager contact form state */
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientMessage, setClientMessage] = useState('');
  const [chatSubmitted, setChatSubmitted] = useState(false);

  const filteredShowrooms = useMemo(() => {
    if (!citySearch) return SHOWROOMS;
    const query = citySearch.toLowerCase();
    return SHOWROOMS.filter(sh => 
      sh.city.toLowerCase().includes(query) || 
      sh.name.toLowerCase().includes(query) ||
      sh.address.toLowerCase().includes(query)
    );
  }, [citySearch]);

  const handleManagerContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) {
      alert("Please specify your name and contact phone number.");
      return;
    }
    setChatSubmitted(true);
    setTimeout(() => {
      setChatSubmitted(false);
      setClientName('');
      setClientPhone('');
      setClientMessage('');
      setSelectedShowroom(null);
      alert(`Thank you! Your direct consultation voucher has been routed to the Sales Lead at ${selectedShowroom?.name}. They will call you directly.`);
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      
      {/* Header Info */}
      <div id="dealers-header" className="mb-10 text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 font-mono">Guaranteed Safety physical centers</span>
        <h1 className="text-3xl sm:text-4.5xl font-black text-slate-950 tracking-tight leading-tight mt-1">SURETY IN CERTIFIED SHOWROOMS</h1>
        <p className="text-sm text-gray-500 mt-2">Find and visit our direct factory-owned outlets. Every showroom houses our 150-Point Inspection bays, certified sales leads, and instant title transfer desks.</p>

        {/* Input search box */}
        <div className="max-w-md mx-auto mt-6 relative">
          <input 
            type="text" 
            placeholder="Search city, showroom name, state..." 
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
            className="w-full px-4.5 py-3 border border-gray-150 rounded-2xl text-xs bg-white text-gray-800 shadow-sm focus:outline-none focus:border-amber-500"
          />
          <MapPin className="w-4 h-4 text-gray-400 absolute right-4 top-3.5" />
        </div>
      </div>

      {/* Showroom Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredShowrooms.map(showroom => (
          <div key={showroom.id} id={`showroom-${showroom.id}`} className="bg-white border border-gray-150/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row">
            
            {/* Showroom Cover */}
            <div className="sm:w-2/5 h-48 sm:h-auto min-h-[160px] relative bg-slate-100">
              <img src={showroom.image} alt={showroom.name} className="w-full h-full object-cover" />
            </div>

            {/* Showroom metadata body */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-gray-400 font-mono mb-2">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-500" /> {showroom.city} Branch</span>
                  <span className="flex items-center gap-1 text-amber-500 font-bold font-sans">
                    <Star className="w-3.5 h-3.5 fill-amber-500 stroke-none" /> {showroom.rating}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-950 leading-tight mb-2">{showroom.name}</h3>
                <p className="text-xs text-gray-500 leading-normal">{showroom.address}</p>

                <div className="grid grid-cols-2 gap-2 my-4 border-t border-b border-gray-50 py-3 text-[11px] text-gray-600">
                  <div className="flex items-center space-x-1.5 font-medium"><Car className="w-4 h-4 text-emerald-500" /> <span>{showroom.inventoryCount} Cars Active</span></div>
                  <div className="flex items-center space-x-1.5"><Clock className="w-4 h-4 text-gray-400" /> <span>9 AM - 8 PM Daily</span></div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-gray-50">
                <a 
                  href={`tel:${showroom.phone.replace(/[^0-9+]/g, '')}`} 
                  className="flex items-center space-x-1.5 text-xs text-gray-700 font-semibold hover:text-amber-500 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Desk</span>
                </a>
                
                <button
                  onClick={() => setSelectedShowroom(showroom)}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-white font-bold uppercase tracking-wider text-[10px] rounded-xl transition-all cursor-pointer active:scale-95 flex items-center gap-1"
                >
                  <span>Connect Manager</span>
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                </button>
              </div>

            </div>

          </div>
        ))}
      </div>

      {/* Direct Contact Modal Sheet */}
      {selectedShowroom && (
        <div id="showroom-modal" className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6.5 max-w-md w-full border border-gray-100 shadow-2xl relative">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-150 mb-4">
              <h3 className="text-sm font-extrabold text-slate-950 uppercase tracking-wide">Connect Showroom Lead</h3>
              <button 
                onClick={() => setSelectedShowroom(null)}
                className="text-xs text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-full cursor-pointer"
              >
                Close (X)
              </button>
            </div>

            <p className="text-xs text-gray-500 leading-normal mb-4">You are submitting a prioritized inquiry to <strong>{selectedShowroom.name}</strong>. Our branch sales manager coordinates replies within 15 minutes.</p>

            <form onSubmit={handleManagerContact} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5">Client Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Arthur Pendragon" 
                  value={clientName} 
                  onChange={(e) => setClientName(e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-150 rounded-xl text-xs"
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
                  className="w-full px-3 py-2 border border-gray-150 rounded-xl text-xs"
                  required 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5 font-semibold">Special requirements / Custom models</label>
                <textarea 
                  rows={2}
                  placeholder="Is there a specific suv or sedan you wish to view or inspect?" 
                  value={clientMessage} 
                  onChange={(e) => setClientMessage(e.target.value)} 
                  className="w-full px-3 py-2 border border-gray-150 rounded-xl text-xs"
                />
              </div>

              <div className="bg-emerald-500/10 border border-emerald-300 p-3 rounded-xl flex gap-2 text-[10px] text-emerald-800 leading-normal">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span>Priority queue: This assigns you a certified manager bypass token for seamless physical showroom walk-ins.</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-amber-500 font-bold uppercase tracking-wider text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Priority Message</span>
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
