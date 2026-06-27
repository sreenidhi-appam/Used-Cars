import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Car, MessageSquare, Calendar, Settings, LogOut, 
  Eye, Users, TrendingUp, Zap, Check, Trash2, MapPin, Clock, ArrowRight, 
  Search, Sparkles, CheckCircle, X, ChevronRight, Send, AlertTriangle, 
  ShieldCheck, DollarSign, Plus, UserPlus, BarChart2, CreditCard, Award, 
  Star, Settings2, PlusCircle, CheckCircle2, ChevronDown, Filter, HelpCircle
} from 'lucide-react';
import { Car as CarType } from '../types';

interface DealerDashboardProps {
  user: { name: string; email: string } | null;
  setUser: React.Dispatch<React.SetStateAction<{ name: string; email: string } | null>>;
  setActiveTab: (tab: string) => void;
}

interface DealerInventoryItem extends CarType {
  views: number;
  leadsCount: number;
  dateAdded: string;
  status: 'Available' | 'Reserved' | 'Sold';
}

interface DealerLead {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  carModel: string;
  carId: string;
  offeredPrice: number;
  status: 'New' | 'Viewing Scheduled' | 'Negotiating' | 'Sale Closed' | 'Archived';
  dateCreated: string;
  notes: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Dealer Admin' | 'Sales Manager' | 'Listing Inspector' | 'Customer Rep';
  status: 'Active' | 'On Leave' | 'Pending Invite';
  dealsClosed: number;
  performanceScore: number; // 1-100
}

interface Invoice {
  id: string;
  billingPeriod: string;
  amount: number;
  status: 'Paid' | 'Outstanding' | 'Pending';
  issuedDate: string;
}

export default function DealerDashboard({
  user,
  setUser,
  setActiveTab
}: DealerDashboardProps) {
  // Sub-tabs: overview, inventory, leads, team, analytics, subscription, payments
  const [activeSubTab, setActiveSubTab] = useState<string>('overview');

  // DEALER PROFILE MOCK STATE
  const [dealershipName, setDealershipName] = useState("Alpha Velocity Motors");
  const [dealershipPhone, setDealershipPhone] = useState("+1 (206) 555-0988");
  const [dealershipAddress, setDealershipAddress] = useState("1044 Auto Row Ave, Seattle WA");
  const [dealershipRating, setDealershipRating] = useState(4.9);
  const [dealershipReviews, setDealershipReviews] = useState(148);

  // INVENTORY MOCK DATA
  const [inventoryList, setInventoryList] = useState<DealerInventoryItem[]>([
    {
      id: 'dl-1',
      brand: 'BMW',
      model: '740i xDrive Sedan',
      year: 2022,
      price: 5649800,
      mileage: 18400,
      fuelType: 'Hybrid',
      transmission: 'Automatic',
      bodyType: 'Luxury',
      isCertified: true,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=600',
      power: '375 HP',
      engine: '3.0L TwinPower Turbo I6',
      owners: 1,
      color: 'Sapphire Black Metallic',
      rating: 4.9,
      features: ['Panoramic Sky Lounge', 'Executive Package', 'Harman Kardon Premium Sound', 'Soft-Close doors'],
      views: 1240,
      leadsCount: 22,
      dateAdded: '2026-04-12',
      status: 'Available'
    },
    {
      id: 'dl-2',
      brand: 'Tesla',
      model: 'Model Y Long Range',
      year: 2021,
      price: 3239000,
      mileage: 26000,
      fuelType: 'Electric',
      transmission: 'Automatic',
      bodyType: 'SUV',
      isCertified: true,
      image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&q=80&w=600',
      power: '384 HP',
      engine: 'Dual AC Electric Motors',
      owners: 1,
      color: 'Pearl White Multi-Coat',
      rating: 4.8,
      features: ['Autopilot', 'Full Self-Driving Capable', 'Premium Audio System', 'Acoustic Glass'],
      views: 954,
      leadsCount: 15,
      dateAdded: '2026-05-01',
      status: 'Available'
    },
    {
      id: 'dl-3',
      brand: 'Porsche',
      model: 'Cayenne S Coupe',
      year: 2020,
      price: 6141800,
      mileage: 35100,
      fuelType: 'Petrol',
      transmission: 'Automatic',
      bodyType: 'Luxury',
      isCertified: true,
      image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=600',
      power: '434 HP',
      engine: '2.9L Twin-Turbo V6',
      owners: 2,
      color: 'Chalk',
      rating: 4.9,
      features: ['Sport Chrono Package', 'Adaptive Air Suspension', 'Burmester Surround Sound', '21" RS Spyder Wheels'],
      views: 2405,
      leadsCount: 45,
      dateAdded: '2026-05-18',
      status: 'Reserved'
    }
  ]);

  // LEADS STATE
  const [leadsList, setLeadsList] = useState<DealerLead[]>([
    {
      id: 'ld-1',
      customerName: 'Marcus Aurelius',
      customerEmail: 'marcus@stoicphil.com',
      customerPhone: '+1 (425) 555-0199',
      carModel: 'BMW 740i xDrive Sedan',
      carId: 'dl-1',
      offeredPrice: 5535000,
      status: 'New',
      dateCreated: '2026-06-02',
      notes: 'Wants to trade-in old 2017 Audi A6 and finance remaining chunk.'
    },
    {
      id: 'ld-2',
      customerName: 'Evelyn Gray',
      customerEmail: 'evelyn.g@futuretech.io',
      customerPhone: '+1 (360) 555-0812',
      carModel: 'Tesla Model Y Long Range',
      carId: 'dl-2',
      offeredPrice: 3181600,
      status: 'Viewing Scheduled',
      dateCreated: '2026-05-31',
      notes: 'Scheduled physical inspection for next Tuesday at 10 AM. Requested paperwork validation.'
    },
    {
      id: 'ld-3',
      customerName: 'Sir Galahad',
      customerEmail: 'galahad@kamalot.org',
      customerPhone: '+1 (206) 555-0143',
      carModel: 'Porsche Cayenne S Coupe',
      carId: 'dl-3',
      offeredPrice: 6109000,
      status: 'Negotiating',
      dateCreated: '2026-05-28',
      notes: 'Secured credit approval. Validating options on the chalk exterior condition report.'
    }
  ]);

  // TEAM MEMBERS STATE
  const [teamList, setTeamList] = useState<TeamMember[]>([
    {
      id: 'tm-1',
      name: 'Arthur Pendragon',
      email: 'arthur@kamalot.org',
      role: 'Dealer Admin',
      status: 'Active',
      dealsClosed: 42,
      performanceScore: 98
    },
    {
      id: 'tm-2',
      name: 'Gawain Bright',
      email: 'gawain@alpha-motors.com',
      role: 'Sales Manager',
      status: 'Active',
      dealsClosed: 31,
      performanceScore: 92
    },
    {
      id: 'tm-3',
      name: 'Bohort Pure',
      email: 'bohort@alpha-motors.com',
      role: 'Listing Inspector',
      status: 'Active',
      dealsClosed: 18,
      performanceScore: 88
    },
    {
      id: 'tm-4',
      name: 'Dagonet Clown',
      email: 'dagonet@alpha-motors.com',
      role: 'Customer Rep',
      status: 'Pending Invite',
      dealsClosed: 0,
      performanceScore: 0
    }
  ]);

  // INVOICES STATE
  const [invoicesList, setInvoicesList] = useState<Invoice[]>([
    { id: 'inv-1092', billingPeriod: 'May 01 - May 31, 2026', amount: 28700.00, status: 'Paid', issuedDate: '2026-06-01' },
    { id: 'inv-1081', billingPeriod: 'Apr 01 - Apr 30, 2026', amount: 28700.00, status: 'Paid', issuedDate: '2026-05-01' },
    { id: 'inv-1070', billingPeriod: 'Mar 01 - Mar 31, 2026', amount: 34440.00, status: 'Paid', issuedDate: '2026-04-01' }
  ]);

  // SUBSCRIPTION STATE
  const [activeSubscriptionTier, setActiveSubscriptionTier] = useState<'Starter' | 'Premium Dealer' | 'Enterprise Elite'>('Premium Dealer');

  // MODAL/UI ACTION STATES
  const [isAddingCar, setIsAddingCar] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [showPayoutLinkSuccess, setShowPayoutLinkSuccess] = useState(false);
  const [boostCredits, setBoostCredits] = useState(12);

  // CAR ADD STATE FORM
  const [newCarBrand, setNewCarBrand] = useState('');
  const [newCarModel, setNewCarModel] = useState('');
  const [newCarYear, setNewCarYear] = useState<number>(2022);
  const [newCarPrice, setNewCarPrice] = useState<number>(1450000);
  const [newCarMileage, setNewCarMileage] = useState<number>(15000);
  const [newCarFuel, setNewCarFuel] = useState<'Petrol' | 'Diesel' | 'Electric' | 'Hybrid'>('Petrol');
  const [newCarTransmission, setNewCarTransmission] = useState<'Manual' | 'Automatic'>('Automatic');
  const [newCarBodyType, setNewCarBodyType] = useState<'Hatchback' | 'Sedan' | 'SUV' | 'Luxury' | 'Coupe'>('SUV');
  const [newCarColor, setNewCarColor] = useState('');
  const [newCarPower, setNewCarPower] = useState('');
  const [newCarEngine, setNewCarEngine] = useState('');
  const [newCarImage, setNewCarImage] = useState('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600');

  // TEAM ADD STATE FORM
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<'Dealer Admin' | 'Sales Manager' | 'Listing Inspector' | 'Customer Rep'>('Sales Manager');

  // LEAD ACTION RESPONSE NOTIFICATION HELPER
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const displaySuccessNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => {
      setNotificationMsg(null);
    }, 3500);
  };

  // CALCULATE HIGH LEVEL EXECUTIVES KPIs
  const totalViews = inventoryList.reduce((sum, item) => sum + item.views, 0);
  const totalLeads = leadsList.length;
  const activeCarsCount = inventoryList.filter(item => item.status !== 'Sold').length;
  const totalSalesRevenue = 15000000; // Mock accumulated pipeline sales in INR (~1.5 Crore)

  // ADD NEW CAR CRITICAL HELPER
  const handleCreateCar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCarBrand || !newCarModel) {
      alert("Please fill in car Brand and Model.");
      return;
    }

    const createdCar: DealerInventoryItem = {
      id: `dl-${Date.now()}`,
      brand: newCarBrand,
      model: newCarModel,
      year: newCarYear,
      price: newCarPrice,
      mileage: newCarMileage,
      fuelType: newCarFuel,
      transmission: newCarTransmission,
      bodyType: newCarBodyType,
      isCertified: true,
      image: newCarImage || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=600',
      power: newCarPower || '240 HP',
      engine: newCarEngine || '2.0L I4 Turbo',
      owners: 1,
      color: newCarColor || 'Metallic Gray',
      rating: 4.8,
      features: ['Touchscreen Infotainment', 'Apple CarPlay', 'Park Assist', 'Adaptive Headlights'],
      views: 120, // Start healthy
      leadsCount: 1,
      dateAdded: new Date().toISOString().split('T')[0],
      status: 'Available'
    };

    setInventoryList(prev => [createdCar, ...prev]);
    setIsAddingCar(false);

    // Reset Form
    setNewCarBrand('');
    setNewCarModel('');
    setNewCarYear(2022);
    setNewCarPrice(45000);
    setNewCarMileage(15000);
    setNewCarColor('');
    setNewCarPower('');
    setNewCarEngine('');

    displaySuccessNotification(`Successfully listed dealership unit: ${createdCar.brand} ${createdCar.model}!`);
  };

  // TEAM RECRUIT MEMBER HELPER
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !newMemberEmail) {
      alert("Please fill in Name and Email address.");
      return;
    }

    const createdMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name: newMemberName,
      email: newMemberEmail,
      role: newMemberRole,
      status: 'Pending Invite',
      dealsClosed: 0,
      performanceScore: 0
    };

    setTeamList(prev => [...prev, createdMember]);
    setIsAddingMember(false);
    setNewMemberName('');
    setNewMemberEmail('');

    displaySuccessNotification(`Registration invitation sent securely to ${createdMember.name}!`);
  };

  const handleUpdateLeadStatus = (leadId: string, nextStatus: DealerLead['status']) => {
    setLeadsList(prev => prev.map(lead => lead.id === leadId ? { ...lead, status: nextStatus } : lead));
    displaySuccessNotification(`Deals state synchronized to: "${nextStatus}" status.`);
  };

  const handleUpgradeSubscription = (tierName: 'Starter' | 'Premium Dealer' | 'Enterprise Elite') => {
    setActiveSubscriptionTier(tierName);
    displaySuccessNotification(`Dealership profile migrated to the "${tierName}" active program!`);
  };

  const purchaseBoosterAdCredits = (amount: number, cost: number) => {
    setBoostCredits(prev => prev + amount);
    displaySuccessNotification(`Successfully added ${amount} Priority Boost credits! Billing of ₹${cost.toLocaleString('en-IN')} scheduled.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Floating Alert Notifications Banner */}
      <AnimatePresence>
        {notificationMsg && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-55 w-full max-w-md px-4"
          >
            <div className="bg-slate-900 border border-slate-800 text-amber-400 p-4 rounded-2xl shadow-2xl flex items-center space-x-3 text-left">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
              <div className="flex-grow">
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block">Dealership Core Sync</span>
                <p className="text-xs font-bold text-white leading-normal">{notificationMsg}</p>
              </div>
              <button onClick={() => setNotificationMsg(null)} className="p-1 text-gray-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary header widget */}
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-150 pb-6">
        <div>
          <span className="text-[10px] font-bold font-mono text-amber-600 uppercase tracking-widest block mb-1">
            EXECUTIVE DEALER SYSTEM
          </span>
          <h1 className="text-2xl md:text-3.5xl font-black text-slate-950 uppercase tracking-tight">
            Commercial Dealer Management Panel
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Optimize fleet inventory listings, manage registered sales personnel, monitor client pipeline leads, and secure commission payouts.
          </p>
        </div>

        {/* Dealer Identity block */}
        <div className="flex items-center space-x-3 bg-white border border-gray-150 rounded-2xl px-5 py-3 shadow-xs">
          <div className="w-11 h-11 bg-slate-950 text-amber-400 font-mono font-black text-sm flex items-center justify-center rounded-xl shadow-md shrink-0">
            DM
          </div>
          <div className="text-left">
            <div className="flex items-center space-x-1.5">
              <h4 className="text-xs font-black text-slate-900 leading-tight uppercase tracking-tight">{dealershipName}</h4>
              <Award className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            </div>
            <p className="text-[9px] font-mono text-gray-400 mt-0.5 leading-none">{dealershipAddress}</p>
            <div className="flex items-center space-x-1.5 mt-1.5 leading-none">
              <div className="flex items-center text-amber-500">
                <Star className="w-2.5 h-2.5 fill-amber-500" />
                <span className="text-[10px] font-bold text-slate-800 font-mono ml-0.5 mt-0.5">{dealershipRating}</span>
              </div>
              <span className="text-[9px] text-gray-400 font-mono">({dealershipReviews} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid structure */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR SUB-MENU */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-gray-150 rounded-2xl p-4 shadow-sm space-y-1 text-left">
            <div className="pb-2 border-b border-gray-100 mb-2 px-2.5">
              <span className="text-[9px] font-bold font-mono text-gray-400 uppercase tracking-widest block">Dealer Operations</span>
            </div>

            {[
              { id: 'overview', label: 'Dealer Menu', icon: LayoutDashboard },
              { id: 'inventory', label: 'Fleet Inventory', icon: Car, count: activeCarsCount },
              { id: 'leads', label: 'Client Leads', icon: MessageSquare, count: leadsList.filter(l => l.status === 'New').length },
              { id: 'team', label: 'Team Members', icon: Users, count: teamList.length },
              { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart2 },
              { id: 'subscription', label: 'Fleet Subscription', icon: Award },
              { id: 'payments', label: 'Invoice & Payments', icon: CreditCard }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold tracking-tight transition-all active:scale-[0.98] cursor-pointer ${
                    isActive 
                      ? 'bg-slate-950 text-amber-400 shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
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
          </div>

          {/* Quick Support Assistance widget */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-5 border border-slate-900 text-left relative overflow-hidden shadow-md">
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-amber-500/10 rounded-full" />
            <ShieldCheck className="w-6 h-6 text-amber-400 mb-3" />
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 font-mono">Enterprise Elite Verified Plan</h4>
            <p className="text-[10px] text-slate-450 text-slate-350 mt-1 leading-relaxed">
              Dealership priority bidding, instant credit verification access, and physical depot vehicle audits are active for Seattle.
            </p>
            <div className="mt-4 flex items-center space-x-2">
              <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-500/5 border border-emerald-500/35 px-2 py-0.5 rounded">
                Live Server Online
              </span>
            </div>
          </div>
        </div>

        {/* DETAILS SECTION AREA */}
        <div className="lg:col-span-3 space-y-6">

          {/* TAB CONTENT: OVERVIEW (Dealer Menu Dashboard Home) */}
          {activeSubTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* DEALER KPI COUNTER CHIPS */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                
                <div className="bg-white border border-gray-150 rounded-2xl p-5 text-left relative overflow-hidden">
                  <span className="text-[9px] font-bold font-mono text-gray-400 uppercase tracking-wider block">Estimated Pipeline Payouts</span>
                  <strong className="text-2xl font-black text-slate-950 font-mono block mt-1">₹{totalSalesRevenue.toLocaleString('en-IN')}</strong>
                  <p className="text-[10px] text-emerald-600 mt-1 font-bold flex items-center space-x-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>In Escrow Contracts</span>
                  </p>
                </div>

                <div className="bg-white border border-gray-150 rounded-2xl p-5 text-left relative overflow-hidden">
                  <span className="text-[9px] font-bold font-mono text-gray-400 uppercase tracking-wider block">Fleet Cars Active</span>
                  <strong className="text-2xl font-black text-slate-950 font-mono block mt-1">{activeCarsCount}</strong>
                  <p className="text-[10px] text-slate-500 mt-1 font-bold">In-Stock Showroom Units</p>
                </div>

                <div className="bg-white border border-gray-150 rounded-2xl p-5 text-left relative overflow-hidden">
                  <span className="text-[9px] font-bold font-mono text-gray-400 uppercase tracking-wider block">Active Buyer Inquiries</span>
                  <strong className="text-2xl font-black text-slate-950 font-mono block mt-1">{totalLeads}</strong>
                  <p className="text-[10px] text-amber-600 mt-1 font-bold">12 Hours Responded Buffer</p>
                </div>

                <div className="bg-white border border-gray-150 rounded-2xl p-5 text-left relative overflow-hidden">
                  <span className="text-[9px] font-bold font-mono text-gray-400 uppercase tracking-wider block">Priority Boost Ads</span>
                  <strong className="text-2xl font-black text-slate-950 font-mono block mt-1">{boostCredits}</strong>
                  <p className="text-[10px] text-slate-500 mt-1 font-bold">Remaining Booster Credits</p>
                </div>

              </div>

              {/* DUAL WIDGET SECTION - INVENTORY STATUS & QUICK ACTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                
                {/* Dealer Activity Summary Block */}
                <div className="bg-white border border-gray-150 rounded-2.5xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                    <h3 className="text-sm font-black text-slate-950 uppercase tracking-tight">Active Dealership Settings</h3>
                    <button onClick={() => setActiveSubTab('subscription')} className="text-[10px] font-mono text-amber-600 hover:underline uppercase font-bold">
                      Upgrade Plan
                    </button>
                  </div>

                  <div className="space-y-3 font-sans">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">Tier Status:</span>
                      <strong className="text-amber-600 font-bold font-mono bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {activeSubscriptionTier}
                      </strong>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">Allowed Fleet Allocation Slot:</span>
                      <span className="font-bold font-mono">18 / 50 Active Slots</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">Dealership Phone:</span>
                      <span className="font-semibold">{dealershipPhone}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-gray-500">Staff Assigned Permissions:</span>
                      <span className="font-bold text-slate-800 font-mono">{teamList.length} Active Personnels</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setIsAddingCar(true)}
                      className="w-full py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      <Plus className="w-4 h-4 text-amber-400" />
                      <span>Upload Certified Vehicle</span>
                    </button>
                  </div>
                </div>

                {/* Hot Pending Inbound Leads preview widget */}
                <div className="bg-white border border-gray-150 rounded-2.5xl p-6 space-y-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                    <h3 className="text-sm font-black text-slate-950 uppercase tracking-tight">Hot Business Leads Pipeline</h3>
                    <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">REPLY PENALTY: 9M</span>
                  </div>

                  <div className="space-y-3 flex-grow">
                    {leadsList.slice(0, 2).map((lead) => (
                      <div key={lead.id} className="p-3 bg-slate-50 border border-gray-100 rounded-xl flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-bold text-slate-950">{lead.customerName}</h4>
                          <span className="text-[9px] font-mono text-amber-600 block leading-none mt-0.5">{lead.carModel}</span>
                        </div>
                        <div className="text-right">
                          <strong className="text-xs font-mono text-emerald-700 block">₹{lead.offeredPrice.toLocaleString('en-IN')}</strong>
                          <button onClick={() => setActiveSubTab('leads')} className="text-[9px] uppercase tracking-wider text-slate-900 hover:text-amber-500 font-black flex items-center space-x-0.5 mt-1 leading-none">
                            <span>Process lead</span>
                            <ChevronRight className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setActiveSubTab('leads')}
                    className="w-full text-center py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent hover:border-gray-150 transition-all rounded-xl"
                  >
                    View All Bids & Leads ({leadsList.length})
                  </button>
                </div>

              </div>

              {/* LIVE INVENTORY SHOWROOM DISPLAY LIST */}
              <div className="bg-white border border-gray-150 rounded-3xl p-6 text-left space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div>
                    <h3 className="text-base font-black text-slate-950 uppercase tracking-tight">Dealership Certified Showcase</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">High-performing premium active fleet tracked down by Seattle inspectors.</p>
                  </div>
                  <button onClick={() => setActiveSubTab('inventory')} className="text-xs font-bold text-slate-950 hover:text-amber-600 flex items-center space-x-1 cursor-pointer">
                    <span>Manage Fleet Inventory</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="divide-y divide-gray-100">
                  {inventoryList.map((item) => (
                    <div key={item.id} className="py-4.5 first:pt-0 last:pb-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      
                      <div className="flex items-center space-x-4">
                        <img src={item.image} alt={item.model} className="w-16 h-13 object-cover rounded-xl border shrink-0 bg-gray-50" />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-110 border-emerald-100 px-1.5 py-0.25 rounded">
                              Active Ad
                            </span>
                            <span className="text-[10px] font-bold text-gray-450 text-gray-450 font-mono italic">{item.color}</span>
                          </div>
                          <h4 className="text-sm font-black text-slate-950 mt-1">
                            {item.year} {item.brand} {item.model}
                          </h4>
                          <span className="text-[10px] font-mono text-gray-400">{item.mileage.toLocaleString()} km • {item.power} • {item.transmission}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 justify-between w-full md:w-auto font-mono text-xs text-left">
                        <div>
                          <span className="block text-[8px] text-gray-400 uppercase">VIEWS TRACK</span>
                          <strong className="text-slate-800 text-sm font-bold">{item.views.toLocaleString()}</strong>
                        </div>
                        <div className="border-l border-gray-100 pl-4">
                          <span className="block text-[8px] text-gray-400 uppercase">CUSTOMER LEADS</span>
                          <strong className="text-amber-602 text-amber-600 text-sm font-bold">{item.leadsCount} Bids</strong>
                        </div>
                        <div className="text-right border-l border-gray-100 pl-4 min-w-[90px]">
                          <span className="block text-[8px] text-slate-400 text-gray-400 uppercase">PRICE VALUE</span>
                          <strong className="text-slate-950 text-sm font-black">₹{item.price.toLocaleString('en-IN')}</strong>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB CONTENT: FLEET INVENTORY MANAGER */}
          {activeSubTab === 'inventory' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 text-left space-y-6"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">Showroom Fleet Allocation ({inventoryList.length} units)</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Edit price tags, certify packages, or release sold cars back to the national register.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingCar(true)}
                  className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>List Fleet Car</span>
                </button>
              </div>

              {/* DYNAMIC FORM TO INVENTORY APPENDING */}
              {isAddingCar && (
                <div className="bg-slate-50 border border-gray-200 rounded-2.5xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b pb-3 border-gray-200">
                    <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider font-mono flex items-center space-x-1">
                      <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                      <span>Add Fleet Unit Parameters</span>
                    </h4>
                    <button onClick={() => setIsAddingCar(false)} className="text-gray-400 hover:text-slate-800 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleCreateCar} className="space-y-4 font-sans text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="block text-gray-500 font-semibold mb-0.5">Brand Manufacturer <span className="text-rose-500">*</span></label>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g. BMW, Audi, Tesla" 
                          value={newCarBrand}
                          onChange={(e) => setNewCarBrand(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-gray-500 font-semibold mb-0.5">Model Specification <span className="text-rose-500">*</span></label>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g. Model Y Longe Range" 
                          value={newCarModel}
                          onChange={(e) => setNewCarModel(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-gray-500 font-semibold mb-0.5">Build Year</label>
                        <select 
                          value={newCarYear}
                          onChange={(e) => setNewCarYear(parseInt(e.target.value))}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-mono"
                        >
                          {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018].map(y => (
                            <option key={y} value={y}>{y}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="block text-gray-500 font-semibold mb-0.5">Showroom Price (₹) <span className="text-rose-500">*</span></label>
                        <input 
                          type="number" 
                          min="0"
                          required 
                          placeholder="e.g. 1500000" 
                          value={newCarPrice || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '') {
                              setNewCarPrice(0);
                            } else {
                              const parsed = parseInt(val);
                              if (parsed >= 0) {
                                setNewCarPrice(parsed);
                              }
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                              e.preventDefault();
                            }
                          }}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-gray-500 font-semibold mb-0.5">Odometer (km) <span className="text-rose-500">*</span></label>
                        <input 
                          type="number" 
                          min="0"
                          required 
                          placeholder="e.g. 23500" 
                          value={newCarMileage || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === '') {
                              setNewCarMileage(0);
                            } else {
                              const parsed = parseInt(val);
                              if (parsed >= 0) {
                                setNewCarMileage(parsed);
                              }
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                              e.preventDefault();
                            }
                          }}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-gray-500 font-semibold mb-0.5">Color Finish</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Obsidian Black Metallic" 
                          value={newCarColor}
                          onChange={(e) => setNewCarColor(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="block text-gray-500 font-semibold mb-0.5">Fuel Category</label>
                        <select 
                          value={newCarFuel}
                          onChange={(e) => setNewCarFuel(e.target.value as any)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl"
                        >
                          <option value="Petrol">Petrol Fuel</option>
                          <option value="Diesel">Diesel Power</option>
                          <option value="Electric">Pure EV Electric</option>
                          <option value="Hybrid">Hybrid Synergy</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-gray-500 font-semibold mb-0.5">Transmission Unit</label>
                        <select 
                          value={newCarTransmission}
                          onChange={(e) => setNewCarTransmission(e.target.value as any)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl"
                        >
                          <option value="Automatic">Automatic (Steptronic)</option>
                          <option value="Manual">Manual Stickshift</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-gray-500 font-semibold mb-0.5">Body Structure Type</label>
                        <select 
                          value={newCarBodyType}
                          onChange={(e) => setNewCarBodyType(e.target.value as any)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl"
                        >
                          <option value="SUV">Crossover / SUV</option>
                          <option value="Sedan">Sleek Sedan</option>
                          <option value="Luxury">Luxury Premium</option>
                          <option value="Coupe">Aerodynamic Coupe</option>
                          <option value="Hatchback">Compact Hatchback</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-gray-500 font-semibold mb-0.5">Custom Image URL</label>
                        <input 
                          type="text" 
                          placeholder="Paste direct HTTPS photo url..." 
                          value={newCarImage}
                          onChange={(e) => setNewCarImage(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="block text-gray-500 font-semibold mb-0.5">Rated Power</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 340 HP" 
                            value={newCarPower}
                            onChange={(e) => setNewCarPower(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-gray-500 font-semibold mb-0.5">Engine Displacement</label>
                          <input 
                            type="text" 
                            placeholder="e.g. 3.0L Inline-6" 
                            value={newCarEngine}
                            onChange={(e) => setNewCarEngine(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end space-x-2">
                      <button 
                        type="button" 
                        onClick={() => setIsAddingCar(false)}
                        className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-150 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="px-5 py-2 bg-slate-950 font-bold text-white rounded-xl hover:bg-slate-900 shadow-md"
                      >
                        Publish Ad listing
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* FLEET CARS TABLE AND ACTIONS */}
              <div className="space-y-4">
                {inventoryList.map((item) => (
                  <div key={item.id} className="border border-gray-150 rounded-2.5xl p-5 hover:border-gray-200 transition-colors">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      
                      <div className="flex items-start md:items-center space-x-4">
                        <img 
                          src={item.image} 
                          alt={item.model} 
                          className="w-20 h-16 rounded-xl object-cover border bg-gray-100 flex-shrink-0" 
                        />
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5 leading-none">
                            <span className="text-[10px] font-black text-[#d97706] bg-amber-500/15 border border-amber-300 px-2 py-0.5 rounded uppercase font-mono">
                              Certified Gold
                            </span>
                            <span className={`text-[9px] font-bold font-mono uppercase px-1.5 py-0.25 rounded ${
                              item.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                              {item.status}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">Added {item.dateAdded}</span>
                          </div>
                          
                          <h4 className="text-base font-black text-slate-950 pt-1">
                            {item.year} {item.brand} {item.model}
                          </h4>
                          <span className="text-xs text-gray-500 block leading-none">
                            Transmission: <strong>{item.transmission}</strong> • Fuel: <strong>{item.fuelType}</strong> • Body: <strong>{item.bodyType}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col md:items-end gap-2 text-left">
                        <div className="flex items-center space-x-4 font-mono text-xs">
                          <div>
                            <span className="block text-[8px] text-gray-400 uppercase">Mileage</span>
                            <strong className="text-slate-900 font-bold leading-normal">{item.mileage.toLocaleString()} km</strong>
                          </div>
                          <div className="border-l border-gray-150 pl-3">
                            <span className="block text-[8px] text-gray-400 uppercase">Value Rating</span>
                            <strong className="text-slate-905 text-slate-800 font-bold flex items-center">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-0.5" />
                              {item.rating}
                            </strong>
                          </div>
                          <div className="border-l border-gray-150 pl-3 text-right">
                            <span className="block text-[8px] text-gray-400 uppercase">Dealer Price</span>
                            <strong className="text-emerald-700 font-black text-sm">₹{item.price.toLocaleString('en-IN')}</strong>
                          </div>
                        </div>

                        {/* Inventory adjustments */}
                        <div className="flex items-center space-x-2 mt-1">
                          <button
                            onClick={() => {
                              const nextPrice = prompt(`Enter new showroom price for ${item.brand} ${item.model}:`, item.price.toString());
                              if (nextPrice && !isNaN(parseInt(nextPrice))) {
                                setInventoryList(prev => prev.map(c => c.id === item.id ? { ...c, price: parseInt(nextPrice) } : c));
                                displaySuccessNotification(`Updated price parameters for ${item.brand}.`);
                              }
                            }}
                            className="px-3.5 py-1.5 border border-gray-200 text-slate-800 hover:bg-slate-50 text-[10px] font-bold uppercase rounded-xl"
                          >
                            Adjust Price
                          </button>
                          
                          {item.status === 'Available' ? (
                            <button
                              onClick={() => {
                                setInventoryList(prev => prev.map(c => c.id === item.id ? { ...c, status: 'Reserved' } : c));
                                displaySuccessNotification(`Unit reserved successfully.`);
                              }}
                              className="px-3 py-1.5 bg-slate-950 text-white hover:bg-slate-900 text-[10px] font-bold uppercase rounded-xl"
                            >
                              Reserve Unit
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setInventoryList(prev => prev.map(c => c.id === item.id ? { ...c, status: 'Available' } : c));
                                displaySuccessNotification(`Unit released as available.`);
                              }}
                              className="px-3 py-1.5 bg-emerald-600 text-white text-[10px] font-bold uppercase rounded-xl"
                            >
                              Set Available
                            </button>
                          )}

                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${item.year} ${item.brand} ${item.model} from showroom database? This cannot be undone.`)) {
                                setInventoryList(prev => prev.filter(c => c.id !== item.id));
                                displaySuccessNotification(`Deleted ${item.brand} listed vehicle.`);
                              }
                            }}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded-xl transition-colors"
                            title="Remove listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB CONTENT: CLIENT LEADS TRACKER */}
          {activeSubTab === 'leads' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 text-left space-y-6"
            >
              <div>
                <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">Active Bids and Inbound Leads</h3>
                <p className="text-xs text-gray-400 mt-0.5">Customer feedback, requested test drives, and direct bidding values on indexed units.</p>
              </div>

              <div className="space-y-4">
                {leadsList.map((lead) => {
                  const targetCar = inventoryList.find(c => c.id === lead.carId);
                  return (
                    <div key={lead.id} className="border border-gray-150 rounded-2.5xl p-5 hover:border-gray-200 bg-white transition-colors">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 text-left">
                        
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-black font-mono text-amber-600 uppercase tracking-wider">Inquiry</span>
                            <span className={`text-[8px] font-mono font-bold uppercase px-2 py-0.5 rounded-lg border ${
                              lead.status === 'New' 
                                ? 'bg-sky-50 border-sky-100 text-sky-600'
                                : lead.status === 'Viewing Scheduled' 
                                ? 'bg-amber-50 border-amber-150 text-amber-600'
                                : lead.status === 'Negotiating'
                                ? 'bg-indigo-50 border-indigo-150 text-indigo-600'
                                : 'bg-emerald-50 border-emerald-150 text-emerald-600'
                            }`}>
                              {lead.status}
                            </span>
                            <span className="text-[9px] text-gray-400 font-mono">Created {lead.dateCreated}</span>
                          </div>

                          <h4 className="text-base font-black text-slate-950">
                            Buyer: {lead.customerName}
                          </h4>

                          <p className="text-xs font-mono text-[#1e293b] leading-tight">
                            Target Fleet: <strong className="text-slate-900 font-bold">{lead.carModel}</strong>
                          </p>

                          {targetCar && (
                            <div className="text-[11px] font-sans text-gray-500 max-w-xl pb-1 bg-gray-50 p-3 rounded-xl border border-gray-100 italic leading-relaxed mt-1">
                              "{lead.notes}"
                            </div>
                          )}

                          <div className="font-mono text-[9px] text-gray-400 pt-1 leading-none">
                            Email: <strong className="text-slate-800">{lead.customerEmail}</strong> • Contact: <strong className="text-slate-800">{lead.customerPhone}</strong>
                          </div>
                        </div>

                        <div className="flex flex-col items-start sm:items-end gap-2.5 text-left font-mono">
                          <div>
                            <span className="block text-[8px] text-gray-400 uppercase pb-0.5">Dealer Offer tag</span>
                            <strong className="text-emerald-700 text-base font-black leading-none">₹{lead.offeredPrice.toLocaleString('en-IN')}</strong>
                          </div>

                          <div className="flex flex-wrap gap-2.5 items-center mt-1">
                            {lead.status === 'New' && (
                              <button
                                onClick={() => handleUpdateLeadStatus(lead.id, 'Viewing Scheduled')}
                                className="px-3.5 py-2 bg-slate-950 hover:bg-slate-900 text-amber-400 text-[10px] font-bold uppercase rounded-xl cursor-pointer"
                              >
                                Approve & Call Inspections
                              </button>
                            )}

                            {lead.status === 'Viewing Scheduled' && (
                              <button
                                onClick={() => handleUpdateLeadStatus(lead.id, 'Negotiating')}
                                className="px-3.5 py-2 bg-indigo-600 text-white text-[10px] font-bold uppercase rounded-xl cursor-pointer"
                              >
                                Begin Negotiation
                              </button>
                            )}

                            {lead.status !== 'Sale Closed' ? (
                              <button
                                onClick={() => {
                                  handleUpdateLeadStatus(lead.id, 'Sale Closed');
                                  // Update the inventory status to Sold too
                                  if (lead.carId) {
                                    setInventoryList(prev => prev.map(c => c.id === lead.carId ? { ...c, status: 'Sold' } : c));
                                  }
                                }}
                                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase rounded-xl cursor-pointer"
                              >
                                Mark Unit Sold
                              </button>
                            ) : (
                              <span className="text-[10px] font-bold font-mono text-emerald-650 bg-emerald-50 px-3 py-2 rounded-xl flex items-center space-x-1">
                                <Check className="w-3.5 h-3.5" />
                                <span>Sale Completed</span>
                              </span>
                            )}

                            <button
                              onClick={() => {
                                if (confirm("Archiving this hot bidder leads pipeline?")) {
                                  setLeadsList(prev => prev.filter(l => l.id !== lead.id));
                                  displaySuccessNotification("Lead archived successfully.");
                                }
                              }}
                              className="px-3 py-2 border border-gray-200 text-rose-500 hover:bg-rose-50 text-[10px] font-bold uppercase rounded-xl cursor-pointer"
                            >
                              Archive
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TAB CONTENT: TEAM MEMBERS */}
          {activeSubTab === 'team' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 text-left space-y-6"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">Showroom Certified Staff ({teamList.length} registered)</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Control staff roles, allocate regional leads, and check performance scores.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingMember(true)}
                  className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 text-amber-400 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer flex items-center space-x-2"
                >
                  <UserPlus className="w-4 h-4 text-amber-400" />
                  <span>Invite Staff Member</span>
                </button>
              </div>

              {/* DYNAMIC FORM TO INVITATION */}
              {isAddingMember && (
                <div className="bg-slate-50 border border-gray-200 rounded-2.5xl p-6 space-y-4">
                  <div className="flex items-center justify-between border-b pb-3 border-gray-205">
                    <h4 className="text-xs font-black text-slate-950 uppercase tracking-wider font-mono">
                      Invite Dealership Agent
                    </h4>
                    <button onClick={() => setIsAddingMember(false)} className="text-gray-400 hover:text-slate-800">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleAddMember} className="space-y-4 font-sans text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="block text-gray-500 font-semibold mb-0.5">Full Name <span className="text-rose-500">*</span></label>
                        <input 
                          type="text" 
                          required 
                          placeholder="e.g. Elaine Vance" 
                          value={newMemberName}
                          onChange={(e) => setNewMemberName(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-250 rounded-xl"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-gray-500 font-semibold mb-0.5">Corporate Email Address <span className="text-rose-500">*</span></label>
                        <input 
                          type="email" 
                          required 
                          placeholder="e.g. elaine@alpha-motors.com" 
                          value={newMemberEmail}
                          onChange={(e) => setNewMemberEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-gray-500 font-semibold mb-0.5">Assigned Authorized Role</label>
                        <select 
                          value={newMemberRole}
                          onChange={(e) => setNewMemberRole(e.target.value as any)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl"
                        >
                          <option value="Sales Manager">Sales Manager (Lead Allocation)</option>
                          <option value="Listing Inspector">Listing Inspector (Certified Verification)</option>
                          <option value="Customer Rep">Customer Rep (Chat Desk Responses)</option>
                          <option value="Dealer Admin">Co-Dealer Admin (Root Privileges)</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end space-x-2">
                      <button 
                        type="button" 
                        onClick={() => setIsAddingMember(false)}
                        className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-slate-800"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="px-5 py-2 bg-slate-950 font-bold text-white rounded-xl hover:bg-slate-900 shadow-md"
                      >
                        Transmit Team Invitation
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* MEMBERS CARD LISTING */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {teamList.map((member) => (
                  <div key={member.id} className="border border-gray-150 rounded-2.5xl p-5 flex items-start space-x-4 bg-white hover:bg-slate-50/50 transition-colors">
                    <div className="w-10 h-10 bg-slate-950 text-amber-400 font-mono font-black rounded-lg flex items-center justify-center">
                      {member.name.charAt(0)}
                    </div>

                    <div className="flex-grow min-w-0 text-left space-y-1">
                      <div className="flex items-center justify-between">
                        <strong className="text-sm font-black text-slate-950 truncate block pr-1">{member.name}</strong>
                        <span className={`text-[8px] font-bold font-mono px-1.5 py-0.25 rounded-md leading-none ${
                          member.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {member.status}
                        </span>
                      </div>

                      <p className="text-[10px] font-mono font-bold text-amber-600 block leading-none">{member.role}</p>
                      <p className="text-[10px] text-gray-400 font-mono leading-none truncate pb-2">{member.email}</p>

                      <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] font-mono text-gray-400 leading-none">
                        <span>DEALS CLOSED: <strong className="text-slate-800 font-extrabold">{member.dealsClosed}</strong></span>
                        <span className="flex items-center">
                          SCORE: 
                          <span className="font-extrabold text-emerald-600 ml-1 bg-emerald-50 px-1 py-0.5 rounded">
                            {member.performanceScore}%
                          </span>
                        </span>
                      </div>

                      <div className="pt-3 flex justify-end">
                        <button
                          onClick={() => {
                            if (confirm(`Revoke team credential for ${member.name}? This takes effect instantly.`)) {
                              setTeamList(prev => prev.filter(t => t.id !== member.id));
                              displaySuccessNotification(`Credentials revoked for ${member.name}.`);
                            }
                          }}
                          className="text-[9px] uppercase tracking-wider font-bold text-rose-500 hover:underline cursor-pointer"
                        >
                          Revoke Access
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB CONTENT: ANALYTICS DASHBOARD */}
          {activeSubTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 text-left space-y-6"
            >
              <div>
                <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight font-sans">Dealership Metrics & Performance Analytical Suite</h3>
                <p className="text-xs text-gray-400 mt-0.5">Consolidated dealer leads, views distribution, and geographical performance indices.</p>
              </div>

              {/* METRIC VISUALIZATIONS SECTION */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Visual Chart 1: Leads Growth pipeline (GORGEOUS SVG BAR) */}
                <div className="border border-gray-150 p-5 rounded-2.5xl space-y-4">
                  <span className="text-[10px] font-mono font-bold text-slate-500 block uppercase tracking-wider">Showroom Volume Performance (May - June)</span>
                  
                  <div className="h-44 flex items-end justify-between px-4 pb-2 pt-6 font-mono text-[9px] relative">
                    {/* SVG background grid lines */}
                    <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
                      <div className="border-b border-gray-100 w-full" />
                      <div className="border-b border-gray-100 w-full" />
                      <div className="border-b border-gray-100 w-full" />
                      <div className="border-b border-gray-100 w-full" />
                    </div>

                    {[
                      { week: 'Wk 19', views: 320, performance: '34%' },
                      { week: 'Wk 20', views: 580, performance: '55%' },
                      { week: 'Wk 21', views: 1040, performance: '82%' },
                      { week: 'Wk 22', views: 890, performance: '71%' },
                      { week: 'Wk 23', views: 1420, performance: '100%' }
                    ].map((w, idx) => (
                      <div key={idx} className="flex flex-col items-center z-1 w-1/5 space-y-2">
                        <div className="text-[9px] text-gray-800 font-bold">${w.views * 20}</div>
                        <div 
                          style={{ height: w.performance }} 
                          className="w-8.5 bg-slate-950 hover:bg-amber-500 rounded-lg transition-all duration-300 relative group flex items-end justify-center shadow-md cursor-pointer"
                        >
                          <div className="absolute -top-10 scale-0 group-hover:scale-100 bg-slate-900 text-white rounded px-2 py-1 text-[8px] font-bold font-mono transition-transform duration-200 shadow-lg pointer-events-none whitespace-nowrap z-50">
                            {w.views} Active Direct Views
                          </div>
                        </div>
                        <div className="text-[9px] font-bold text-gray-400 mt-1">{w.week}</div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center text-[10px] text-gray-400">Monthly dealer volume gross margins in INR (₹)</div>
                </div>

                {/* Visual Chart 2: Lead Sources Distribution */}
                <div className="border border-gray-150 p-5 rounded-2.5xl flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 block uppercase tracking-wider">Active Marketing Traffic Acquisition</span>
                    <h4 className="text-xl font-bold text-slate-900 mt-1">Acquired Inbound leads</h4>
                  </div>

                  <div className="space-y-3 font-sans text-xs pt-4">
                    {[
                      { source: 'VelocityMoto Certified Portal', count: 48, percentage: '55%', color: 'bg-emerald-500' },
                      { source: 'Direct Search Engine queries', count: 22, percentage: '25%', color: 'bg-indigo-500' },
                      { source: 'Sponsored Booster Campaigns', count: 18, percentage: '20%', color: 'bg-amber-500' }
                    ].map((s, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-baseline font-semibold">
                          <span>{s.source}</span>
                          <span className="font-mono text-[10px] text-slate-600">{s.count} Leads ({s.percentage})</span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div style={{ width: s.percentage }} className={`h-full ${s.color} rounded-full`} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-[10px] text-gray-400 text-center pt-2 leading-tight">
                    Optimized algorithms show priority listing boosters are yielding +45% higher ROI.
                  </div>
                </div>

              </div>

              {/* SUMMARY STATISTICS BANNER */}
              <div className="bg-slate-50 rounded-2.5xl p-5 border border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div>
                  <span className="block text-[8px] text-gray-400 font-mono uppercase tracking-widest leading-none mb-1">CONVERSION METRIC</span>
                  <strong className="text-slate-900 font-black text-xl font-mono">11.4%</strong>
                  <p className="text-[9px] text-gray-400 leading-none mt-1">Lead-to-payout translation index</p>
                </div>
                <div className="border-t sm:border-t-0 sm:border-l border-gray-200 pt-3 sm:pt-0">
                  <span className="block text-[8px] text-gray-400 font-mono tracking-widest uppercase leading-none mb-1">AVERAGE RESPONSE</span>
                  <strong className="text-slate-900 font-black text-xl font-mono">1.2 Hrs</strong>
                  <p className="text-[9px] text-gray-400 leading-none mt-1">Regional chat response penalty</p>
                </div>
                <div className="border-t sm:border-t-0 sm:border-l border-gray-200 pt-3 sm:pt-0">
                  <span className="block text-[8px] text-gray-400 font-mono tracking-widest uppercase leading-none mb-1">COMPLIANCE GRADE</span>
                  <strong className="text-[#10b981] font-black text-xl font-mono">A+ Tier</strong>
                  <p className="text-[9px] text-gray-400 leading-none mt-1">Seattle inspection pass rate</p>
                </div>
              </div>

            </motion.div>
          )}

          {/* TAB CONTENT: FLEET SUBSCRIPTIONS */}
          {activeSubTab === 'subscription' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 text-left space-y-6"
            >
              <div className="border-b border-gray-100 pb-4">
                <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">Showroom Subscription Plan parameters</h3>
                <p className="text-xs text-gray-400 mt-0.5">Dealership commercial plans outline how many active, boosted and priority listings are allocated.</p>
              </div>

              {/* SUBSCRIBED PLANS CONTAINER */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
                
                {/* Tier 1: Starter */}
                <div className={`border rounded-2.5xl p-6 space-y-4 flex flex-col justify-between relative ${
                  activeSubscriptionTier === 'Starter' 
                    ? 'border-amber-500 bg-amber-500/5 ring-1 ring-amber-500' 
                    : 'border-gray-200'
                }`}>
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold font-mono text-gray-400 uppercase tracking-wide">Dealership Tier 1</span>
                    <h4 className="text-lg font-black text-slate-950">Starter Dealership</h4>
                    <p className="text-xs text-gray-500">Perfect for private boutique traders operating 1-2 lots monthly.</p>
                    <div className="pt-2">
                      <strong className="text-xl font-black text-slate-950 font-mono">₹9,840</strong>
                      <span className="text-xs text-gray-400 italic"> / Month</span>
                    </div>
                  </div>

                  <ul className="text-xs text-gray-650 space-y-2 border-t pt-3 border-gray-100">
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Max 5 Fleet listings</span>
                    </li>
                    <li className="flex items-center space-x-2 text-gray-400">
                      <X className="w-4 h-4 shrink-0" />
                      <span>No custom agency invites</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Standard chat messaging</span>
                    </li>
                  </ul>

                  <button
                    onClick={() => handleUpgradeSubscription('Starter')}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                      activeSubscriptionTier === 'Starter'
                        ? 'bg-[#10b981] text-white cursor-default'
                        : 'bg-slate-900 text-amber-400 hover:bg-slate-800 cursor-pointer text-left inline-block text-center'
                    }`}
                  >
                    {activeSubscriptionTier === 'Starter' ? 'Active Subscription' : 'Downgrade to Starter'}
                  </button>
                </div>

                {/* Tier 2: Premium Dealer */}
                <div className={`border rounded-2.5xl p-6 space-y-4 flex flex-col justify-between relative ${
                  activeSubscriptionTier === 'Premium Dealer' 
                    ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500 shadow-md' 
                    : 'border-gray-200'
                }`}>
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 font-mono text-[8px] font-black uppercase px-3 py-1 rounded-full shadow flex items-center space-x-0.5">
                    <Sparkles className="w-2.5 h-2.5 fill-slate-950 stroke-none animate-bounce" />
                    <span>POPULAR CHOICE</span>
                  </div>

                  <div className="space-y-1.5 pt-1.5">
                    <span className="text-[9px] font-bold font-mono text-amber-600 uppercase tracking-wide">Dealership Tier 2</span>
                    <h4 className="text-lg font-black text-slate-950">Premium Dealer Plus</h4>
                    <p className="text-xs text-gray-500">Tailored for established commercial multi-brand depots.</p>
                    <div className="pt-2">
                      <strong className="text-xl font-black text-slate-950 font-mono">₹28,700</strong>
                      <span className="text-xs text-gray-400 italic"> / Month</span>
                    </div>
                  </div>

                  <ul className="text-xs text-gray-650 space-y-2 border-t pt-3 border-gray-100">
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Max 50 active fleet listings</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Up to 10 Team profiles</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Priority Ad positioning</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>12 Priority Boost credits</span>
                    </li>
                  </ul>

                  <button
                    onClick={() => handleUpgradeSubscription('Premium Dealer')}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                      activeSubscriptionTier === 'Premium Dealer'
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-slate-900 text-amber-400 hover:bg-slate-800 cursor-pointer text-left inline-block text-center'
                    }`}
                  >
                    {activeSubscriptionTier === 'Premium Dealer' ? 'Active Program Plan' : 'Select Premium Upgrade'}
                  </button>
                </div>

                {/* Tier 3: Enterprise Elite */}
                <div className={`border rounded-2.5xl p-6 space-y-4 flex flex-col justify-between relative ${
                  activeSubscriptionTier === 'Enterprise Elite' 
                    ? 'border-amber-500 bg-amber-500/5 ring-1 ring-amber-500' 
                    : 'border-gray-200'
                }`}>
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-bold font-mono text-gray-400 uppercase tracking-wide">Dealership Tier 3</span>
                    <h4 className="text-lg font-black text-slate-950">Enterprise Elite Corporate</h4>
                    <p className="text-xs text-gray-500">Unleashes infinite performance allocations for nationwide car networks.</p>
                    <div className="pt-2">
                      <strong className="text-xl font-black text-slate-950 font-mono">₹69,700</strong>
                      <span className="text-xs text-gray-400 italic"> / Month</span>
                    </div>
                  </div>

                  <ul className="text-xs text-gray-650 space-y-2 border-t pt-3 border-gray-100 text-left">
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>UNLIMITED listings</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Unlimited team invitations</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Live credit check verification desk</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>50 Boost credits monthly</span>
                    </li>
                  </ul>

                  <button
                    onClick={() => handleUpgradeSubscription('Enterprise Elite')}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                      activeSubscriptionTier === 'Enterprise Elite'
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-slate-900 text-amber-400 hover:bg-slate-800 cursor-pointer text-left inline-block text-center'
                    }`}
                  >
                    {activeSubscriptionTier === 'Enterprise Elite' ? 'Active Program Plan' : 'Go Enterprise Elite'}
                  </button>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB CONTENT: INVOICE AND PAYMENTS */}
          {activeSubTab === 'payments' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 text-left space-y-6"
            >
              <div>
                <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">Dealership Financial Ledger</h3>
                <p className="text-xs text-gray-450 text-gray-405 mt-0.5">Keep track of subscription bills, commission statements, and transaction escrow payouts.</p>
              </div>

              {/* STRIPE PAYOUT ESCROW CARD CONFIG */}
              <div className="bg-slate-50 rounded-2.5xl p-6 border border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1 text-left">
                  <div className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">SECURE ESCROW PAYOUT</div>
                  <h4 className="text-base font-black text-slate-900">Configure Dealership Payout Router</h4>
                  <p className="text-xs text-gray-500 max-w-lg">
                    VelocityMoto distributes buyer credit deposits right to your linked bank ledger. Verify routing tags to release funds instantly.
                  </p>
                </div>

                {!showPayoutLinkSuccess ? (
                  <button
                    onClick={() => {
                      setShowPayoutLinkSuccess(true);
                      setTimeout(() => {
                        displaySuccessNotification("Secure bank ledger linked successfully via Plaid!");
                      }, 1000);
                    }}
                    className="px-5 py-2.5 bg-slate-950 font-black text-amber-400 hover:bg-slate-900 font-mono text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md inline-block whitespace-nowrap shrink-0"
                  >
                    Link Bank Account Securely
                  </button>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-250 text-[#10b981] font-mono px-4 py-2 rounded-xl text-xs font-bold leading-normal text-left">
                    <span className="block text-[8px] uppercase tracking-wide text-emerald-500">LINKED METRIC</span>
                    <span>● SEATTLE CRUISE CRES BANK (...9811)</span>
                  </div>
                )}
              </div>

              {/* BOOST PREMIUM PACKAGES SECTOR */}
              <div className="bg-amber-500/5 border border-amber-300 rounded-2.5xl p-6 space-y-4 text-left">
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider font-mono">Dealership Quick Booster Shop</h4>
                </div>
                <p className="text-xs text-gray-650 leading-relaxed max-w-2xl">
                  Dealer priority credits place your fleet at the absolute top of buy queries for 72 hours. Certified stats show boosted slots acquire 2.4x more phone inquiries.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs pt-2">
                  <div className="p-3 bg-white rounded-xl border flex items-center justify-between">
                    <div>
                      <strong className="block text-[#1e293b]">5x Priority Credits Pack</strong>
                      <span className="text-[10px] text-gray-400 font-sans leading-none block">Buy and apply instantly</span>
                    </div>
                    <button
                      onClick={() => purchaseBoosterAdCredits(5, 3690)}
                      className="px-3.5 py-1.5 bg-slate-905 hover:bg-slate-900 text-amber-400 font-bold uppercase text-[10px] rounded-lg animate-fade-in"
                    >
                      Buy ₹3,690
                    </button>
                  </div>

                  <div className="p-3 bg-white rounded-xl border flex items-center justify-between">
                    <div>
                      <strong className="block text-[#1e293b]">15x Priority Credits Pack</strong>
                      <span className="text-[10px] text-emerald-600 font-mono font-bold leading-none block">Save 15% bulk value</span>
                    </div>
                    <button
                      onClick={() => purchaseBoosterAdCredits(15, 9020)}
                      className="px-3.5 py-1.5 bg-slate-950 text-amber-400 font-bold uppercase text-[10px] rounded-lg"
                    >
                      Buy ₹9,020
                    </button>
                  </div>
                </div>
              </div>

              {/* INVOICE HISTORY RECORD TABLE */}
              <div className="space-y-3 pt-2">
                <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest block">May - June Billings History</span>
                <div className="border border-gray-150 rounded-2.5xl overflow-hidden font-mono text-[10px] text-left">
                  <div className="bg-slate-50 border-b border-gray-150 px-4 py-3 font-semibold text-gray-500 grid grid-cols-4">
                    <span>INVOICE TAG</span>
                    <span>BILLING DURATION</span>
                    <span>AMOUNT TAG</span>
                    <span className="text-right">PAID STATUS</span>
                  </div>
                  <div className="bg-white divide-y divide-gray-100">
                    {invoicesList.map((inv) => (
                      <div key={inv.id} className="px-4 py-3.5 card-invoice grid grid-cols-4 items-center">
                        <span className="font-bold text-slate-800">#{inv.id}</span>
                        <span className="text-slate-500">{inv.billingPeriod}</span>
                        <span className="font-bold text-slate-900">₹{inv.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        <div className="text-right">
                          <span className="inline-block px-2 py-0.5 text-[8px] font-bold text-emerald-600 bg-emerald-50 rounded-lg">
                            {inv.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </motion.div>
          )}

        </div>

      </div>

    </div>
  );
}
