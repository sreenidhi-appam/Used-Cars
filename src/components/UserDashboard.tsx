import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Car, Heart, MessageSquare, Calendar, Settings, LogOut, 
  Eye, Users, TrendingUp, Zap, Check, Trash2, MapPin, Clock, ArrowRight, 
  Search, Sparkles, CheckCircle, X, ChevronRight, Send, AlertTriangle, ShieldCheck, Dumbbell, Star
} from 'lucide-react';
import { Car as CarType } from '../types';

interface UserDashboardProps {
  user: { name: string; email: string } | null;
  setUser: React.Dispatch<React.SetStateAction<{ name: string; email: string } | null>>;
  wishlist: string[];
  setWishlist: React.Dispatch<React.SetStateAction<string[]>>;
  setActiveTab: (tab: string) => void;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  cars: CarType[];
}

interface UserListing {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  image: string;
  views: number;
  leads: number;
  status: 'Active' | 'Pending Review' | 'Sold';
  isBoosted: boolean;
  boostLevel?: 'Silver' | 'Gold' | 'Platinum' | null;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'buyer';
  text: string;
  time: string;
}

interface BuyerChat {
  id: string;
  buyerName: string;
  buyerAvatar: string;
  carModel: string;
  lastMessage: string;
  unread: boolean;
  messages: ChatMessage[];
}

export default function UserDashboard({
  user,
  setUser,
  wishlist,
  setWishlist,
  setActiveTab,
  setFilters,
  cars
}: UserDashboardProps) {
  // Tabs: listings, wishlist, messages, drives, settings
  const [activeSubTab, setActiveSubTab] = useState<string>('listings');
  
  // Listings State
  const [userListings, setUserListings] = useState<UserListing[]>([
    {
      id: 'ul-1',
      brand: 'Bmw',
      model: '330i M Sport',
      year: 2021,
      price: 33800,
      mileage: 34500,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=400',
      views: 742,
      leads: 12,
      status: 'Active',
      isBoosted: false,
      boostLevel: null
    },
    {
      id: 'ul-2',
      brand: 'Toyota',
      model: 'RAV4 Hybrid XLE',
      year: 2020,
      price: 25900,
      mileage: 48000,
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400',
      views: 589,
      leads: 6,
      status: 'Active',
      isBoosted: true,
      boostLevel: 'Silver'
    }
  ]);

  // Modals for Boosting
  const [boostModalOpen, setBoostModalOpen] = useState(false);
  const [selectedListingForBoost, setSelectedListingForBoost] = useState<string | null>(null);
  const [boostSuccess, setBoostSuccess] = useState(false);
  const [selectedBoostTier, setSelectedBoostTier] = useState<'Silver' | 'Gold' | 'Platinum'>('Gold');

  // Messages State
  const [chats, setChats] = useState<BuyerChat[]>([
    {
      id: 'chat-1',
      buyerName: 'Arthur Pendragon',
      buyerAvatar: 'A',
      carModel: 'BMW 330i M Sport',
      lastMessage: 'Is this vehicle still available for a walkaround tomorrow?',
      unread: true,
      messages: [
        { id: 'm1', sender: 'buyer', text: 'Hi corporate seller, I noticed your post for the gray metallic turbo BMW.', time: '09:20 AM' },
        { id: 'm2', sender: 'user', text: 'Yes! It is fully certified and located in our main Seattle showroom.', time: '09:44 AM' },
        { id: 'm3', sender: 'buyer', text: 'Is this vehicle still available for a walkaround tomorrow?', time: '09:45 AM' }
      ]
    },
    {
      id: 'chat-2',
      buyerName: 'Guinevere Lane',
      buyerAvatar: 'G',
      carModel: 'Toyota RAV4 Hybrid',
      lastMessage: 'Excellent pricing structure, I will discuss with my bank.',
      unread: false,
      messages: [
        { id: 'm4', sender: 'buyer', text: 'Hello, what was the warranty buffer on this RAV4?', time: 'Yesterday' },
        { id: 'm5', sender: 'user', text: 'It has 18 months remaining on factory hybrid system powertrain coverage.', time: 'Yesterday' },
        { id: 'm6', sender: 'buyer', text: 'Excellent pricing structure, I will discuss with my bank.', time: 'Yesterday' }
      ]
    }
  ]);
  const [activeChatId, setActiveChatId] = useState<string>('chat-1');
  const [newMessageText, setNewMessageText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Test Drives Booking State
  const [testDrives, setTestDrives] = useState([
    {
      id: 'td-1',
      carModel: 'BMW 330i M Sport',
      buyerName: 'Arthur Pendragon',
      date: '2026-06-08',
      time: '11:00 AM',
      location: 'Downtown Seattle Main Showroom',
      status: 'Confirmed'
    },
    {
      id: 'td-2',
      carModel: 'Toyota RAV4 Hybrid XLE',
      buyerName: 'Lancelot du Lac',
      date: '2026-06-11',
      time: '02:30 PM',
      location: 'Downtown Seattle Main Showroom',
      status: 'Pending Review'
    }
  ]);

  // Profile Settings Form State
  const [profileName, setProfileName] = useState(user?.name || "Arthur Pendragon");
  const [profileEmail, setProfileEmail] = useState(user?.email || "arthur@kamalot.org");
  const [profilePhone, setProfilePhone] = useState("+1 (360) 555-0144");
  const [profileLocation, setProfileLocation] = useState("Downtown Seattle");
  const [settingsSavedMsg, setSettingsSavedMsg] = useState(false);

  // General Notification toggles
  const [notifInquiry, setNotifInquiry] = useState(true);
  const [notifInspection, setNotifInspection] = useState(true);
  const [notifMarketing, setNotifMarketing] = useState(false);

  // Logout Warning Modal
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  // Calculate high level stats dashboard widgets
  const totalViews = userListings.reduce((sum, item) => sum + item.views, 0);
  const totalLeads = userListings.reduce((sum, item) => sum + item.leads, 0);
  const activeListingsCount = userListings.filter(item => item.status === 'Active').length;

  // Handle Send Message with automatic replies!
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const messageToSend = newMessageText;
    setNewMessageText('');

    // Append user message
    setChats(prev => prev.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          lastMessage: messageToSend,
          unread: false,
          messages: [
            ...chat.messages,
            {
              id: `m-user-${Date.now()}`,
              sender: 'user',
              text: messageToSend,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return chat;
    }));

    // Trigger simulate buyer response after 1.5 seconds
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setChats(prev => prev.map(chat => {
        if (chat.id === activeChatId) {
          let systemReply = "Thank you for the quick update. Let me double-check with my scheduler.";
          if (messageToSend.toLowerCase().includes('price') || messageToSend.toLowerCase().includes('discount') || messageToSend.toLowerCase().includes('offer')) {
            systemReply = "I understand. I am comfortable with that pricing if we can verify the service receipt documents during the test drive.";
          } else if (messageToSend.toLowerCase().includes('available') || messageToSend.toLowerCase().includes('when') || messageToSend.toLowerCase().includes('time')) {
            systemReply = "That schedule fits perfectly. I will arrive with my representative. Will the papers be ready?";
          } else if (messageToSend.toLowerCase().includes('yes') || messageToSend.toLowerCase().includes('ok')) {
             systemReply = "Great! I am looking forward to our appointment. Talk soon.";
          }
          return {
            ...chat,
            lastMessage: systemReply,
            messages: [
              ...chat.messages,
              {
                id: `m-buyer-${Date.now()}`,
                sender: 'buyer',
                text: systemReply,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]
          };
        }
        return chat;
      }));
    }, 1500);
  };

  // Trigger Boost action
  const handleBoostListing = (listingId: string) => {
    setSelectedListingForBoost(listingId);
    setBoostModalOpen(true);
  };

  // Perform listing boost
  const confirmBoost = () => {
    if (!selectedListingForBoost) return;
    
    // Update local state listing
    setUserListings(prev => prev.map(listing => {
      if (listing.id === selectedListingForBoost) {
        // Boost adds immediate random views and double leads!
        return {
          ...listing,
          isBoosted: true,
          boostLevel: selectedBoostTier,
          views: listing.views + 350,
          leads: listing.leads + 4
        };
      }
      return listing;
    }));

    setBoostSuccess(true);
    setTimeout(() => {
      setBoostSuccess(false);
      setBoostModalOpen(false);
      setSelectedListingForBoost(null);
    }, 1800);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (setUser) {
      setUser({ name: profileName, email: profileEmail });
    }
    setSettingsSavedMsg(true);
    setTimeout(() => setSettingsSavedMsg(false), 3000);
  };

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  // If user is logged out, prompt log-in banner nicely
  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mx-auto border border-amber-200">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Authorized Access Required</h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">Please identify your credentials via the navigation header login button to access your listings, messages, and settings.</p>
        </div>
        <div>
          <button
            onClick={() => {
              const loginBtn = document.getElementById('nav-cta-container')?.querySelector('button');
              if (loginBtn) {
                loginBtn.click();
              } else {
                alert("Please click 'Login' at the top right header to authenticate.");
              }
            }}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md active:scale-95"
          >
            Authenticate Profile Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Title greeting card wrapper */}
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-150 pb-6">
        <div>
          <span className="text-[10px] font-bold font-mono text-amber-600 uppercase tracking-widest block mb-1">PRO TRADER SYSTEM</span>
          <h1 className="text-2xl md:text-3.5xl font-black text-slate-950 uppercase tracking-tight">
            User Account Dashboard
          </h1>
          <p className="text-xs text-gray-505 text-gray-400 mt-1">
            Manage your listed vehicles, test drive coordinates, real-time message bids, and profile security parameters.
          </p>
        </div>

        {/* User Badge Profile snippet */}
        <div className="flex items-center space-x-3 bg-white border border-gray-150 rounded-2xl px-4 py-2.5 shadow-sm">
          <div className="w-10 h-10 bg-slate-950 text-amber-400 font-black flex items-center justify-center rounded-xl font-mono text-sm shadow-md">
            {profileName.charAt(0)}
          </div>
          <div className="text-left font-sans">
            <h4 className="text-xs font-bold text-slate-900 leading-tight block">{profileName}</h4>
            <span className="text-[10px] text-gray-400 font-mono block tracking-tight truncate max-w-[150px]">{profileEmail}</span>
          </div>
        </div>
      </div>

      {/* Main Structural Bento layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR SUB-MENU CONTROL */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-gray-150 rounded-2xl p-4 shadow-sm space-y-1 text-left hidden lg:block">
            <div className="pb-2 border-b border-gray-100 mb-2 px-2.5">
              <span className="text-[9px] font-bold font-mono text-gray-400 uppercase tracking-widest">Dashboard Menu</span>
            </div>

            {[
              { id: 'listings', label: 'My Listings', icon: Car },
              { id: 'wishlist', label: 'Saved Cars', icon: Heart, count: wishlist.length },
              { id: 'messages', label: 'Messages', icon: MessageSquare, count: chats.filter(c => c.unread).length },
              { id: 'drives', label: 'Test Drives', icon: Calendar, count: testDrives.filter(t => t.status === 'Pending Review').length },
              { id: 'settings', label: 'Account Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all active:scale-[0.98] cursor-pointer ${
                    isActive 
                      ? 'bg-slate-950 text-amber-400 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-gray-400'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-amber-400 text-slate-950' : 'bg-amber-500/10 text-amber-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-2 border-t border-gray-100 mt-2">
              <button
                onClick={() => setLogoutModalOpen(true)}
                className="w-full flex items-center space-x-2.5 px-3 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer text-left"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Logout Session</span>
              </button>
            </div>
          </div>

          {/* MOBILE MENU TAB DROPDOWN TRIGGER (Excellent responsiveness) */}
          <div className="block lg:hidden text-left bg-white border border-gray-100 p-3 rounded-2xl shadow-sm">
            <span className="block text-[8px] font-bold font-mono tracking-wider uppercase text-gray-400 mb-1 px-1">Selected View</span>
            <select
              value={activeSubTab}
              onChange={(e) => {
                if (e.target.value === 'logout') {
                  setLogoutModalOpen(true);
                } else {
                  setActiveSubTab(e.target.value);
                }
              }}
              className="w-full bg-slate-950 text-amber-400 text-xs font-bold tracking-tight px-3.5 py-2.5 rounded-xl outline-none"
            >
              <option value="listings">🚗 My Cars Listings ({userListings.length})</option>
              <option value="wishlist">❤️ Saved / Favorites ({wishlist.length})</option>
              <option value="messages">💬 Incoming Messages / Bids</option>
              <option value="drives">📅 Booked Test Drives ({testDrives.length})</option>
              <option value="settings">⚙️ Edit Profile Settings</option>
              <option value="logout">❌ Logout Account</option>
            </select>
          </div>

          {/* Dynamic support promo card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-5 border border-slate-900 text-left relative overflow-hidden shadow-md">
            <div className="absolute -top-12 -right-12 w-28 h-28 bg-amber-500/10 rounded-full" />
            <Sparkles className="w-6 h-6 text-amber-400 mb-3" />
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 font-mono">Verified Gold Seller</h4>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Your listings have passed the VelocityMoto security gateway checks. Receive prioritized dealer bidding values immediately upon scheduling 150-point inspections.
            </p>
            <button 
              onClick={() => setActiveTab('services')}
              className="mt-4 inline-flex items-center space-x-1 text-[10px] uppercase tracking-widest font-bold text-white hover:text-amber-400 transition-colors cursor-pointer"
            >
              <span>Certified Programs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* DETAILS SECTION AREA */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* SELLER DASHBOARD WIDGETS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Metric Card 1: Total Views */}
            <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm text-left relative overflow-hidden group">
              <div className="flex items-center justify-between pb-1">
                <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-wider">Total Views</span>
                <div className="p-1.5 bg-sky-50 rounded-lg text-sky-600">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2.5xl font-black text-slate-950 font-mono">{totalViews.toLocaleString()}</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded leading-none flex items-center space-x-0.5">
                  <TrendingUp className="w-2.5 h-2.5" />
                  <span>+12%</span>
                </span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1.5 font-sans leading-none">Traffic across online platforms</p>
              
              {/* Visual mini-sparkline track */}
              <div className="w-full h-1 bg-slate-50 rounded-full mt-4 overflow-hidden">
                <div className="w-[82%] h-full bg-sky-500 rounded-full" />
              </div>
            </div>

            {/* Metric Card 2: Leads */}
            <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm text-left relative overflow-hidden">
              <div className="flex items-center justify-between pb-1">
                <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-wider">Acquired Leads</span>
                <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-2.5xl font-black text-slate-950 font-mono">{totalLeads}</span>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1 py-0.5 rounded leading-none flex items-center space-x-0.5">
                  <Zap className="w-2.5 h-2.5" />
                  <span>HOT Offers</span>
                </span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1.5 font-sans leading-none">Inquiries, bids & chat negotiations</p>

              {/* Visual mini-sparkline track */}
              <div className="w-full h-1 bg-slate-50 rounded-full mt-4 overflow-hidden">
                <div className="w-[65%] h-full bg-emerald-500 rounded-full" />
              </div>
            </div>

            {/* Metric Card 3: Active Listings + Boost button */}
            <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm text-left flex flex-col justify-between relative overflow-hidden min-h-[140px]">
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-amber-100/30 rounded-full -z-1" />
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-wider">Active Listings</span>
                <span className="text-xs font-black text-[#d97706] font-mono bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-250">
                  {activeListingsCount} Listed
                </span>
              </div>
              
              {/* Boost Listing action button widget */}
              <button
                type="button"
                onClick={() => {
                  const targetListing = userListings.find(l => !l.isBoosted) || userListings[0];
                  if (targetListing) {
                    handleBoostListing(targetListing.id);
                  } else {
                    alert("No qualifying listings found to boost. List a vehicle!");
                  }
                }}
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[10px] uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center space-x-1.5 border-b-2 border-amber-600 mt-3"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950 stroke-none" />
                <span>Boost Top Listing</span>
              </button>
            </div>

          </div>

          {/* DYNAMIC SUBTAB VIEWS CONTAINER */}
          <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 min-h-[420px] shadow-sm">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: My Listings */}
              {activeSubTab === 'listings' && (
                <motion.div
                  key="listings-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 text-left"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">Listed Inventory</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Your submitted pre-owned vehicles. Boost listings to double dealer visibility.</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('sell')}
                      className="px-4 py-2 bg-slate-905 hover:bg-slate-800 text-amber-400 text-[10px] font-bold uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      + Sell Another
                    </button>
                  </div>

                  {userListings.length === 0 ? (
                    <div className="text-center py-16 space-y-4">
                      <Car className="w-12 h-12 text-gray-200 mx-auto" />
                      <p className="text-xs text-gray-500 max-w-sm mx-auto">You have not published any vehicles to trade yet. Begin with an instant online estimated valuation.</p>
                      <button
                        onClick={() => setActiveTab('sell')}
                        className="px-5 py-2.5 bg-amber-500 text-slate-950 font-black text-xs uppercase rounded-xl"
                      >
                        Valuate and Sell Car Now
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userListings.map((listing) => (
                        <div 
                          key={listing.id} 
                          className={`border rounded-2.5xl p-4.5 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden ${
                            listing.isBoosted 
                              ? 'border-amber-400 bg-amber-500/5 shadow-sm' 
                              : 'border-gray-150 hover:border-gray-200'
                          }`}
                        >
                          {listing.isBoosted && (
                            <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 font-mono text-[8px] font-black uppercase px-2.5 py-0.5 rounded-bl-xl shadow-xs flex items-center space-x-0.5">
                              <Sparkles className="w-2.5 h-2.5 fill-slate-950 stroke-none animate-spin" />
                              <span>{listing.boostLevel || 'Gold'} Boost Active</span>
                            </div>
                          )}

                          <div className="flex items-center space-x-4">
                            <img 
                              src={listing.image} 
                              alt={listing.model} 
                              className="w-18 h-15 rounded-xl object-cover border bg-gray-100 flex-shrink-0" 
                            />
                            <div className="space-y-1">
                              <h4 className="text-sm font-black text-slate-950">
                                {listing.year} {listing.brand} {listing.model}
                              </h4>
                              
                              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-gray-400 text-[10px] font-mono leading-none">
                                <span className="font-sans font-bold text-slate-800">₹{listing.price.toLocaleString('en-IN')}</span>
                                <span>•</span>
                                <span>{listing.mileage.toLocaleString()} km</span>
                                <span>•</span>
                                <span className={`font-sans font-semibold px-1.5 py-0.25 rounded ${
                                  listing.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                                }`}>
                                  {listing.status}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-row items-center gap-6 justify-between w-full md:w-auto">
                            {/* Listing Statistics */}
                            <div className="flex items-center space-x-4 font-mono text-[10px] text-gray-400">
                              <div className="text-left">
                                <span className="block uppercase tracking-tight text-[8px] text-gray-400 leading-none mb-0.5">VIEWS</span>
                                <strong className="text-slate-800 text-xs font-bold leading-normal">{listing.views}</strong>
                              </div>
                              <div className="text-left border-l border-gray-150 pl-3">
                                <span className="block uppercase tracking-tight text-[8px] text-gray-400 leading-none mb-0.5">LEADS</span>
                                <strong className="text-slate-800 text-xs font-bold leading-normal">{listing.leads}</strong>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center space-x-2">
                              {!listing.isBoosted ? (
                                <button
                                  type="button"
                                  onClick={() => handleBoostListing(listing.id)}
                                  className="px-3.5 py-2 bg-slate-950 hover:bg-slate-850 text-amber-400 text-[10px] font-bold uppercase tracking-wider rounded-xl cursor-pointer flex items-center space-x-1"
                                >
                                  <Zap className="w-3 h-3 text-amber-400" />
                                  <span>Boost Ad</span>
                                </button>
                              ) : (
                                <span className="text-[10px] font-bold text-[#b45309] uppercase tracking-wide px-3 py-2 bg-amber-100 rounded-xl font-mono flex items-center space-x-1">
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  <span>Boosted +2x views</span>
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Remove listing for ${listing.year} ${listing.brand} ${listing.model}?`)) {
                                    setUserListings(prev => prev.filter(l => l.id !== listing.id));
                                  }
                                }}
                                className="p-2 hover:bg-rose-50 text-rose-500 rounded-xl border border-transparent hover:border-rose-100 transition-colors"
                                title="Remove vehicle"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 2: Saved Cars (Wishlist) */}
              {activeSubTab === 'wishlist' && (
                <motion.div
                  key="wishlist-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 text-left"
                >
                  <div>
                    <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">Saved Wishlist ({wishlist.length})</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Vehicles you bookmarked from our pre-owned stock catalog engine.</p>
                  </div>

                  {wishlist.length === 0 ? (
                    <div className="text-center py-16 space-y-4">
                      <Heart className="w-12 h-12 text-gray-200 mx-auto" />
                      <p className="text-xs text-gray-500">No cars saved in your wishlist currently.</p>
                      <button
                        onClick={() => { setActiveTab('buy'); }}
                        className="px-5 py-2.5 bg-slate-900 text-amber-400 hover:bg-slate-850 font-bold text-xs uppercase rounded-xl"
                      >
                        Explore Inventory Catalog
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {wishlist.map((carId) => {
                        const car = cars.find(c => c.id === carId);
                        if (!car) return null;
                        return (
                          <div key={car.id} className="border border-gray-150 rounded-2.5xl overflow-hidden bg-white shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
                            <div className="relative aspect-[16/10] overflow-hidden bg-gray-50">
                              <img 
                                src={car.image} 
                                alt={car.model} 
                                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300" 
                              />
                              <div className="absolute top-2.5 left-2.5 bg-slate-950/80 text-white font-mono text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-lg leading-none">
                                {car.year} Model
                              </div>
                              <button
                                onClick={() => setWishlist(prev => prev.filter(id => id !== car.id))}
                                className="absolute top-2.5 right-2.5 p-1.5 bg-white/95 rounded-full text-rose-500 shadow hover:scale-105 transition-all cursor-pointer"
                                title="Remove Bookmark"
                              >
                                <Heart className="w-4 h-4 fill-rose-505 fill-rose-500" />
                              </button>
                            </div>

                            <div className="p-4 text-left space-y-2 flex-grow flex flex-col justify-between">
                              <div>
                                <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-amber-600 block">{car.brand}</span>
                                <h4 className="text-sm font-black text-slate-950 truncate mt-0.5">{car.model}</h4>
                                <strong className="text-sm font-mono text-emerald-700 block mt-1">₹{car.price.toLocaleString('en-IN')}</strong>
                              </div>

                              <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between gap-2 mt-2">
                                <span className="text-[9px] font-mono text-gray-400 uppercase">{car.mileage.toLocaleString()} km • {car.transmission}</span>
                                <button
                                  onClick={() => {
                                    setActiveTab('buy');
                                    setFilters(prev => ({ ...prev, search: car.model }));
                                  }}
                                  className="text-[10px] font-bold text-slate-900 group-hover:text-amber-600 font-sans tracking-wide uppercase flex items-center gap-0.5 cursor-pointer"
                                >
                                  <span>View Ads</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 3: Messages (Chat Inbox Panel) */}
              {activeSubTab === 'messages' && (
                <motion.div
                  key="messages-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 text-left"
                >
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">Inquiries and Buyer Chat Bids</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Communicate directly with interested regional buyers. Maintain optimal responsive times to secure transactions.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 border border-gray-150 rounded-2.5xl overflow-hidden min-h-[380px] bg-slate-50 shadow-inner">
                    
                    {/* Chat selection tab panel (Left column) */}
                    <div className="md:col-span-1 border-r border-gray-150 bg-white flex flex-col">
                      <div className="p-3 border-b border-gray-100 font-mono text-[9px] text-gray-400 uppercase tracking-widest font-black">
                        Sender Inbox
                      </div>
                      <div className="flex-grow overflow-y-auto divide-y divide-gray-50">
                        {chats.map((chat) => (
                          <button
                            key={chat.id}
                            onClick={() => {
                              setActiveChatId(chat.id);
                              // Clear unread
                              setChats(prev => prev.map(c => c.id === chat.id ? { ...c, unread: false } : c));
                            }}
                            className={`w-full p-4 flex items-start space-x-3 transition-colors cursor-pointer text-left relative ${
                              activeChatId === chat.id 
                                ? 'bg-amber-500/10 border-l-4 border-amber-500' 
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="w-8.5 h-8.5 rounded-full bg-slate-900 text-amber-400 text-xs font-black flex items-center justify-center font-mono">
                              {chat.buyerAvatar}
                            </div>
                            <div className="flex-grow min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-slate-900 truncate pr-1">{chat.buyerName}</span>
                                {chat.unread && (
                                  <span className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0" />
                                )}
                              </div>
                              <p className="text-[10px] font-mono text-amber-600 truncate leading-none mt-0.5">{chat.carModel}</p>
                              <p className="text-[10px] text-gray-400 truncate mt-1.5">{chat.lastMessage}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Chat dialogue wrapper (Middle+Right column) */}
                    <div className="md:col-span-2 flex flex-col justify-between bg-gray-50">
                      
                      {/* Active Chat Header */}
                      <div className="bg-white px-4 py-3 border-b border-gray-150 flex items-center justify-between">
                        <div className="flex items-center space-x-2.5 text-left">
                          <div className="w-7 h-7 rounded-lg bg-slate-950 text-amber-400 text-xs font-black flex items-center justify-center font-mono leading-none">
                            {activeChat.buyerAvatar}
                          </div>
                          <div>
                            <span className="text-xs font-black text-slate-950 block">{activeChat.buyerName}</span>
                            <span className="text-[9px] font-mono font-bold text-[#b45309] uppercase leading-none block">{activeChat.carModel} Inquiry</span>
                          </div>
                        </div>
                        <div className="text-[9px] font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center space-x-1 shrink-0">
                          <span className="w-1.5 h-1.5 bg-emerald-550 bg-emerald-500 rounded-full animate-pulse" />
                          <span>Active Bidder</span>
                        </div>
                      </div>

                      {/* Messages Dialogue scroll content */}
                      <div className="flex-grow p-4 overflow-y-auto space-y-3 max-h-72">
                        {activeChat.messages.map((m) => {
                          const isMe = m.sender === 'user';
                          return (
                            <div 
                              key={m.id} 
                              className={`flex flex-col max-w-[80%] ${isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                            >
                              <div className={`px-3.5 py-2 rounded-2xl text-xs ${
                                isMe 
                                  ? 'bg-slate-900 text-white rounded-tr-none' 
                                  : 'bg-white border border-gray-150 text-gray-850 rounded-tl-none'
                              }`}>
                                <p className="leading-relaxed whitespace-pre-line">{m.text}</p>
                              </div>
                              <span className="text-[8px] font-mono text-gray-400 mt-1">{m.time}</span>
                            </div>
                          );
                        })}

                        {isTyping && (
                          <div className="mr-auto flex items-center space-x-2 text-gray-400 text-xs font-medium italic">
                            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
                            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                            <span>{activeChat.buyerName} is writing...</span>
                          </div>
                        )}
                      </div>

                      {/* Chat entry form */}
                      <form onSubmit={handleSendMessage} className="bg-white p-3 border-t border-gray-150 flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Type answers, list drop-off times or negotiability terms..."
                          value={newMessageText}
                          onChange={(e) => setNewMessageText(e.target.value)}
                          className="flex-grow px-3.5 py-2.5 bg-gray-50 border border-gray-150 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-amber-500"
                        />
                        <button
                          type="submit"
                          disabled={!newMessageText.trim() || isTyping}
                          className="px-4.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-amber-500 font-bold uppercase text-xs rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </form>

                    </div>

                  </div>
                </motion.div>
              )}

              {/* TAB 4: Test Drives Scheduled */}
              {activeSubTab === 'drives' && (
                <motion.div
                  key="drives-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 text-left"
                >
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">Test Drive Bookings</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Automated booking appointments scheduled by external direct shoppers at our physical depots.</p>
                    </div>
                  </div>

                  {testDrives.length === 0 ? (
                    <div className="text-center py-16 space-y-4">
                      <Calendar className="w-12 h-12 text-gray-200 mx-auto" />
                      <p className="text-xs text-gray-550 text-gray-500">No scheduled drive drives booked on your inventory currently.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {testDrives.map((drive) => (
                        <div key={drive.id} className="border border-gray-155 border-gray-150 rounded-2.5xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white hover:bg-gray-50/50 transition-colors text-left font-sans">
                          <div className="space-y-2">
                            <span className={`inline-block text-[8px] font-bold font-mono uppercase px-2 py-0.5 rounded-lg border ${
                              drive.status === 'Confirmed' 
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                                : 'bg-amber-50 border-amber-200 text-amber-600'
                            }`}>
                              {drive.status}
                            </span>
                            
                            <h4 className="text-sm font-black text-slate-950">
                              {drive.carModel}
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 font-mono text-[10px] text-gray-400">
                              <div className="flex items-center space-x-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                <span>Date: <strong>{drive.date}</strong> at <strong>{drive.time}</strong></span>
                              </div>
                              <div className="flex items-center space-x-1.5">
                                <MapPin className="w-3.5 h-3.5" />
                                <span className="truncate max-w-[170px]">{drive.location}</span>
                              </div>
                            </div>
                            
                            <div className="text-[10px] text-gray-500 pl-1">
                              Shopper: <strong className="text-slate-800">{drive.buyerName}</strong> (Verified Account)
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 sm:self-center">
                            {drive.status !== 'Confirmed' && (
                              <button
                                onClick={() => {
                                  setTestDrives(prev => prev.map(t => t.id === drive.id ? { ...t, status: 'Confirmed' } : t));
                                }}
                                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-850 text-amber-400 text-[10px] font-bold uppercase rounded-xl cursor-pointer"
                              >
                                Approve Scheduling
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (confirm("Cancel this test drive booking assignment?")) {
                                  setTestDrives(prev => prev.filter(t => t.id !== drive.id));
                                }
                              }}
                              className="px-3.5 py-2 border border-gray-200 text-rose-500 hover:bg-rose-50 text-[10px] font-bold uppercase rounded-xl cursor-pointer"
                            >
                              Cancel Booking
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 5: Settings Editing */}
              {activeSubTab === 'settings' && (
                <motion.div
                  key="settings-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6 text-left"
                >
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">Account Parameters & Security</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Customize your verified profiles coordinates and automated platform alerts checklist.</p>
                  </div>

                  {settingsSavedMsg && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-bounce">
                      <CheckCircle className="w-4.5 h-4.5 text-emerald-500" />
                      <span>Account information persisted successfully and logged in to regional state router.</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveSettings} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-450 font-mono mb-1.5">Profile Display Name</label>
                        <input 
                          type="text" 
                          value={profileName} 
                          onChange={(e) => setProfileName(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-150 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-amber-500 font-semibold"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-455 text-gray-400 font-mono mb-1.5">Verified Email Coordinates</label>
                        <input 
                          type="email" 
                          value={profileEmail} 
                          onChange={(e) => setProfileEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-150 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-amber-500 font-semibold"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5">Phone Contact Number</label>
                        <input 
                          type="tel" 
                          value={profilePhone} 
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                            setProfilePhone(val);
                          }}
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-150 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-amber-500 font-mono"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5">Region Location</label>
                        <input 
                          type="text" 
                          value={profileLocation} 
                          onChange={(e) => setProfileLocation(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-150 rounded-xl text-xs text-gray-800 focus:outline-none focus:border-amber-500 font-semibold"
                        />
                      </div>
                    </div>

                    {/* Checkboxes alerts settings block */}
                    <div className="bg-slate-50 border border-gray-150 rounded-2xl p-4.5 space-y-3 pt-4">
                      <span className="block text-[9px] font-bold uppercase tracking-widest text-[#d97706] font-mono leading-none mb-1">💡 NOTIFICATION & SECURITY TRIGGERS:</span>
                      
                      <label className="flex items-start space-x-2.5 cursor-pointer text-xs text-gray-700 font-sans select-none">
                        <input 
                          type="checkbox" 
                          checked={notifInquiry} 
                          onChange={(e) => setNotifInquiry(e.target.checked)}
                          className="mt-1 accent-amber-500 rounded cursor-pointer" 
                        />
                        <div>
                          <strong>Send Email on Direct Inquiry Bids</strong>
                          <span className="block text-[10px] text-gray-400">Receive regional bidder messages instantly in your inbox folder.</span>
                        </div>
                      </label>

                      <label className="flex items-start space-x-2.5 cursor-pointer text-xs text-gray-700 font-sans select-none">
                        <input 
                          type="checkbox" 
                          checked={notifInspection} 
                          onChange={(e) => setNotifInspection(e.target.checked)}
                          className="mt-1 accent-amber-500 rounded cursor-pointer" 
                        />
                        <div>
                          <strong>Test Drive & Scheduling Alerts</strong>
                          <span className="block text-[10px] text-gray-400">Notifies when scheduling inspections or test drives are requested on your vehicles.</span>
                        </div>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer active:scale-95"
                    >
                      Save Account Parameters
                    </button>
                  </form>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

      </div>

      {/* BOOSt SELECTION DIALOG MODAL (Satisfies "Boost Listing button") */}
      {boostModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-white border border-gray-100 rounded-3xl w-full max-w-md p-6 relative shadow-2xl space-y-5 text-left">
            <button
              onClick={() => { if (!boostSuccess) setBoostModalOpen(false); }}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-slate-900 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {boostSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-3"
              >
                <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2.5xl flex items-center justify-center mx-auto border border-amber-200">
                  <Zap className="w-8 h-8 fill-amber-505 fill-amber-500 animate-bounce cursor-none" />
                </div>
                <h4 className="text-lg font-black text-slate-950 uppercase tracking-tight">Listing Power Powered Up!</h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">This listing has been escalated to <strong>{selectedBoostTier} Status</strong>. Traffic indexes will double within 60 minutes.</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
                    <Zap className="w-6 h-6 fill-amber-500 strike-none" />
                  </div>
                  <h3 className="text-lg font-black text-slate-950 tracking-tight mt-2 uppercase">Boost Your Car Listing</h3>
                  <p className="text-xs text-gray-550 text-gray-400">Amplify views, acquire rapid buyer lead responses, and sell 2.5X faster.</p>
                </div>

                {/* Boost packages checkboxes */}
                <div className="space-y-3 pt-2">
                  {[
                    { tier: 'Silver', multiplier: '1.5x Views', desc: 'Prioritizes listing on lower search tags', price: 'FREE Starter' },
                    { tier: 'Gold', multiplier: '2.5x Views', desc: 'Featured badge overlay, SMS notifications on bids', price: '₹2,380 Value (Free promo)' },
                    { tier: 'Platinum', multiplier: '5.0x Views', desc: 'Absolute hero slider highlights, maximum dealer bids', price: '₹4,840 Value (Free promo)' }
                  ].map((pkg) => {
                    const isSel = selectedBoostTier === pkg.tier;
                    return (
                      <button
                        key={pkg.tier}
                        type="button"
                        onClick={() => setSelectedBoostTier(pkg.tier as any)}
                        className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSel 
                            ? 'border-amber-500 bg-amber-550/5 ring-4 ring-amber-400/10' 
                            : 'border-gray-150 hover:bg-gray-50'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-black text-slate-950 uppercase">{pkg.tier} Tier</span>
                            <span className="bg-emerald-100 text-emerald-800 text-[8px] font-mono font-bold px-1.5 py-0.2 px-1 rounded">
                              {pkg.multiplier}
                            </span>
                          </div>
                          <span className="block text-[10px] text-gray-400 leading-normal">{pkg.desc}</span>
                        </div>
                        <span className="text-xs font-black text-slate-800 font-mono shrink-0">{pkg.price}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => setBoostModalOpen(false)}
                    className="flex-1 py-3 border border-gray-200 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    onClick={confirmBoost}
                    className="flex-1 py-3 bg-slate-900 hover:bg-slate-850 text-amber-400 text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    Confirm Active Premium Boost
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECURE LOGOUT MODAL BOX */}
      {logoutModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-white border border-gray-100 rounded-3xl w-full max-w-sm p-6 relative shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto border border-rose-100">
              <LogOut className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-955 text-slate-950 uppercase tracking-tight">Confirm Sign Out</h3>
              <p className="text-xs text-gray-550 text-gray-400">Are you sure you want to exit your active verified dealer bidding channel session?</p>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={() => setLogoutModalOpen(false)}
                className="flex-1 py-2.5 border border-gray-200 text-slate-700 text-xs font-bold uppercase rounded-xl cursor-pointer"
              >
                Stay Logged In
              </button>
              <button
                onClick={() => {
                  setLogoutModalOpen(false);
                  if (setUser) setUser(null);
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase rounded-xl cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
