import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, Users, Car, Briefcase, CreditCard, BarChart2, FileText, 
  Flag, Settings, Image as ImageIcon, Check, X, ShieldAlert, AlertTriangle, 
  TrendingUp, ArrowUpRight, ArrowDownRight, Edit2, Play, Pause, Trash2, 
  UserCheck, Ban, Sparkles, CheckCircle, Plus, Send, RefreshCw, Eye
} from 'lucide-react';
import { MOCK_CARS } from '../data/cars';

interface AdminDashboardProps {
  user: { name: string; email: string } | null;
  setUser: React.Dispatch<React.SetStateAction<{ name: string; email: string } | null>>;
  setActiveTab: (tab: string) => void;
}

// Interfaces
interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: 'User' | 'Dealer' | 'Admin';
  registeredDate: string;
  status: 'Active' | 'Suspended';
  listingsCount: number;
}

interface AdminListingItem {
  id: string;
  brand: string;
  model: string;
  price: number;
  year: number;
  sellerName: string;
  sellerRole: 'User' | 'Dealer';
  status: 'Approved' | 'Pending Review' | 'Flagged';
  views: number;
}

interface AdminDealer {
  id: string;
  dealershipName: string;
  ownerName: string;
  email: string;
  fleetSize: number;
  subscriptionPlan: 'Starter' | 'Premium Dealer' | 'Enterprise Elite';
  status: 'Verified' | 'Pending Verification' | 'Rejected';
}

interface SystemTransaction {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  type: 'Ad Boost' | 'Dealer Subscription' | 'Premium Featured';
  date: string;
  status: 'Success' | 'Failed';
}

interface SystemReport {
  id: string;
  reportedId: string; // Listing or User ID
  reportedType: 'Listing' | 'User';
  reason: string;
  reportedBy: string;
  date: string;
  status: 'Open' | 'Resolved' | 'Dismissed';
}

interface SystemBlog {
  id: string;
  title: string;
  category: string;
  author: string;
  views: number;
  publishedDate: string;
  status: 'Published' | 'Draft';
}

interface AdBanner {
  id: string;
  title: string;
  placement: 'Home Hero' | 'Sidebar Banner' | 'Dealers Page Sticky';
  clicks: number;
  impressions: number;
  status: 'Active' | 'Paused';
}

export default function AdminDashboard({
  user,
  setUser,
  setActiveTab
}: AdminDashboardProps) {
  // Sidebar Tabs: dashboard, users, listings, dealers, payments, reports, blogs, ads, fraud, settings
  const [activeSubTab, setActiveSubTab] = useState<string>('dashboard');

  // Multi-state mock databases
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([
    { id: 'usr-101', name: 'Arthur Pendragon', email: 'arthur@kamalot.org', role: 'Dealer', registeredDate: '2026-01-14', status: 'Active', listingsCount: 2 },
    { id: 'usr-102', name: 'Marcus Aurelius', email: 'marcus@stoicphil.com', role: 'User', registeredDate: '2026-02-28', status: 'Active', listingsCount: 1 },
    { id: 'usr-103', name: 'Guinevere Lane', email: 'guinevere@kamalot.org', role: 'User', registeredDate: '2026-03-05', status: 'Active', listingsCount: 0 },
    { id: 'usr-104', name: 'Mordred Traitor', email: 'mordred@shadowy.net', role: 'User', registeredDate: '2026-05-19', status: 'Suspended', listingsCount: 3 }
  ]);

  const [adminListings, setAdminListings] = useState<AdminListingItem[]>([
    { id: 'ul-1', brand: 'BMW', model: '330i M Sport', price: 33800 * 82, year: 2021, sellerName: 'Arthur Pendragon', sellerRole: 'Dealer', status: 'Approved', views: 742 },
    { id: 'ul-2', brand: 'Toyota', model: 'RAV4 Hybrid XLE', price: 25900 * 82, year: 2020, sellerName: 'Arthur Pendragon', sellerRole: 'Dealer', status: 'Approved', views: 589 },
    { id: 'flag-99', brand: 'Ferrari', model: '488 GTB Spyder', price: 1800 * 82, year: 2019, sellerName: 'Mordred Traitor', sellerRole: 'User', status: 'Flagged', views: 4015 }
  ]);

  const [adminDealers, setAdminDealers] = useState<AdminDealer[]>([
    { id: 'dl-01', dealershipName: 'Alpha Velocity Motors', ownerName: 'Arthur Pendragon', email: 'arthur@kamalot.org', fleetSize: 3, subscriptionPlan: 'Premium Dealer', status: 'Verified' },
    { id: 'dl-02', dealershipName: 'Pristine Exotics Seattle', ownerName: 'Lancelot du Lac', email: 'lancelot@kamalot.org', fleetSize: 0, subscriptionPlan: 'Enterprise Elite', status: 'Pending Verification' },
    { id: 'dl-03', dealershipName: 'Apex Motor Group', ownerName: 'Gawain Bright', email: 'gawain@apex.com', fleetSize: 1, subscriptionPlan: 'Starter', status: 'Verified' }
  ]);

  const [transactions, setTransactions] = useState<SystemTransaction[]>([
    { id: 'tx-201', userId: 'usr-101', userName: 'Arthur Pendragon', amount: 28700.00, type: 'Dealer Subscription', date: '2026-06-01', status: 'Success' },
    { id: 'tx-202', userId: 'usr-102', userName: 'Marcus Aurelius', amount: 4018.00, type: 'Ad Boost', date: '2026-06-03', status: 'Success' },
    { id: 'tx-203', userId: 'usr-104', userName: 'Mordred Traitor', amount: 7298.00, type: 'Premium Featured', date: '2026-05-30', status: 'Failed' },
    { id: 'tx-204', userId: 'usr-103', userName: 'Guinevere Lane', amount: 28700.00, type: 'Dealer Subscription', date: '2026-06-04', status: 'Success' }
  ]);

  const [reports, setReports] = useState<SystemReport[]>([
    { id: 'rep-501', reportedId: 'flag-99', reportedType: 'Listing', reason: 'Suspicious pricing. Real market price is above ₹1.2 Crore. Possible deposit scam.', reportedBy: 'Sally Fields', date: '2026-06-02', status: 'Open' },
    { id: 'rep-502', reportedId: 'usr-104', reportedType: 'User', reason: 'Spamming message bins with off-platform payment links.', reportedBy: 'Arthur Pendragon', date: '2026-06-03', status: 'Open' }
  ]);

  const [blogs, setBlogs] = useState<SystemBlog[]>([
    { id: 'blg-1', title: 'Top 5 Hybrid Cruisers for 2026 Commuting Protocols', category: 'Buying Guides', author: 'Arthur Pendragon', views: 1840, publishedDate: '2026-05-10', status: 'Published' },
    { id: 'blg-2', title: 'Understanding Pre-Owned Tesla Battery Cycle Ratings', category: 'Tech Deep-Dives', author: 'Lancelot du Lac', views: 902, publishedDate: '2026-05-24', status: 'Published' },
    { id: 'blg-3', title: 'Ultimate Guide to Passing 150-Point Mechanics Audits', category: 'Maintenance Tips', author: 'Admin Staff', views: 0, publishedDate: '2026-06-04', status: 'Draft' }
  ]);

  const [adsBanners, setAdsBanners] = useState<AdBanner[]>([
    { id: 'ban-1', title: 'Summer Moto Rush 2026 Banners', placement: 'Home Hero', clicks: 840, impressions: 16500, status: 'Active' },
    { id: 'ban-2', title: 'Certified Seattle Used Fleet Drive Promos', placement: 'Sidebar Banner', clicks: 312, impressions: 9005, status: 'Active' },
    { id: 'ban-3', title: 'Velocita Premium Warranty Sticky Ads', placement: 'Dealers Page Sticky', clicks: 0, impressions: 0, status: 'Paused' }
  ]);

  // Settings mock state
  const [systemSettingMaintenance, setSystemSettingMaintenance] = useState(false);
  const [systemSettingRegisterOpen, setSystemSettingRegisterOpen] = useState(true);
  const [systemSettingRequireInspect, setSystemSettingRequireInspect] = useState(true);

  // Success notifications
  const [adminNotification, setAdminNotification] = useState<string | null>(null);

  const displayNotice = (msg: string) => {
    setAdminNotification(msg);
    setTimeout(() => setAdminNotification(null), 3000);
  };

  // KPI Computations
  const totalUsersCount = systemUsers.length;
  const activeListingsTotal = adminListings.filter(l => l.status === 'Approved').length;
  const revenueTotal = transactions.filter(t => t.status === 'Success').reduce((sum, item) => sum + item.amount, 0);
  const openReportsCount = reports.filter(r => r.status === 'Open').length;

  // Actions handlers
  const handleApproveListing = (id: string) => {
    setAdminListings(prev => prev.map(l => l.id === id ? { ...l, status: 'Approved' } : l));
    displayNotice(`Listing "${id}" approved successfully to public catalog.`);
  };

  const handleDeclineListing = (id: string) => {
    setAdminListings(prev => prev.filter(l => l.id !== id));
    displayNotice(`Listing "${id}" declined and removed.`);
  };

  const handleVerifyDealer = (id: string) => {
    setAdminDealers(prev => prev.map(d => d.id === id ? { ...d, status: 'Verified' } : d));
    displayNotice(`Dealer dealership identity verified. Privileged listings allowed.`);
  };

  const handleSuspendUser = (id: string, currentStatus: 'Active' | 'Suspended') => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    setSystemUsers(prev => prev.map(u => u.id === id ? { ...u, status: nextStatus } : u));
    displayNotice(`User ID "${id}" account state transitioned to "${nextStatus}".`);
  };

  const handleResolveReport = (reportId: string, action: 'Resolved' | 'Dismissed') => {
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: action } : r));
    displayNotice(`Report ${reportId} processed: marked as "${action}".`);
  };

  const handleToggleBanner = (bannerId: string) => {
    setAdsBanners(prev => prev.map(b => b.id === bannerId ? { ...b, status: b.status === 'Active' ? 'Paused' : 'Active' } : b));
    displayNotice(`Banner state toggled.`);
  };

  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    const titleInp = (e.target as any).blogTitle.value;
    const catInp = (e.target as any).blogCategory.value;
    if (!titleInp) return;

    const newBlog: SystemBlog = {
      id: `blg-${Date.now()}`,
      title: titleInp,
      category: catInp,
      author: 'Admin Staff',
      views: 0,
      publishedDate: new Date().toISOString().split('T')[0],
      status: 'Published'
    };
    setBlogs([newBlog, ...blogs]);
    (e.target as any).reset();
    displayNotice(`Successfully published new editorial content!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Admin Central Notification Banner */}
      <AnimatePresence>
        {adminNotification && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-55 w-full max-w-md px-4"
          >
            <div className="bg-slate-900 border border-slate-800 text-amber-400 p-4 rounded-2xl shadow-2xl flex items-center space-x-3 text-left">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
              <div className="flex-grow">
                <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wider block">Admin Control Sync</span>
                <p className="text-xs font-bold text-white leading-normal">{adminNotification}</p>
              </div>
              <button onClick={() => setAdminNotification(null)} className="p-1 text-gray-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header and greeting */}
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-150 pb-6">
        <div>
          <span className="text-[10px] font-bold font-mono text-amber-600 uppercase tracking-widest block mb-1">
            SITE STAFF INTERACTION
          </span>
          <h1 className="text-2xl md:text-3.5xl font-black text-slate-950 uppercase tracking-tight">
            Centralized Platform Registry Admin Panel
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Global management portal to auditing user profiles, authorizing dealer applications, inspecting logs, publishing site campaigns, and configuring systems.
          </p>
        </div>

        {/* Administration Identity badge */}
        <div className="flex items-center space-x-3 bg-white border border-gray-150 rounded-2xl px-5 py-3 shadow-xs font-sans">
          <div className="w-10 h-10 bg-rose-950 text-rose-300 font-mono font-black text-sm flex items-center justify-center rounded-xl shadow-md shrink-0">
            AD
          </div>
          <div className="text-left">
            <div className="flex items-center space-x-1">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight leading-none">Super Administrator</h4>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <p className="text-[9px] font-mono text-gray-400 mt-1 leading-none">admin@velocitymoto.com</p>
            <span className="text-[8px] font-mono font-bold text-rose-600 bg-rose-50 px-1.5 py-0.25 rounded block mt-1.5 w-max">ROOT PRIVILEGES</span>
          </div>
        </div>
      </div>

      {/* Bento Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR NAVIGATION TAB CONTROLLERS */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-gray-150 rounded-2xl p-4 shadow-sm space-y-1 text-left">
            <div className="pb-2 border-b border-gray-100 mb-2 px-2.5">
              <span className="text-[9px] font-bold font-mono text-gray-400 uppercase tracking-widest block">Core Hierarchy</span>
            </div>

            {[
              { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
              { id: 'users', label: 'Manage Users', icon: Users, count: systemUsers.length },
              { id: 'listings', label: 'Inspect Listings', icon: Car, count: adminListings.filter(l => l.status === 'Pending Review').length },
              { id: 'dealers', label: 'Verify Dealers', icon: Briefcase, count: adminDealers.filter(d => d.status === 'Pending Verification').length },
              { id: 'payments', label: 'Global Payments', icon: CreditCard },
              { id: 'reports', label: 'System Reports', icon: BarChart2 },
              { id: 'blogs', label: 'Manage Blogs', icon: FileText, count: blogs.filter(b => b.status === 'Draft').length },
              { id: 'ads', label: 'Ads & Campaigns', icon: ImageIcon },
              { id: 'fraud', label: 'Fraud Alerts', icon: Flag, count: openReportsCount },
              { id: 'settings', label: 'Platform Settings', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              
              // Custom colors for special hazard indicators
              const leadStyle = tab.id === 'fraud' && openReportsCount > 0 
                ? 'text-rose-500 font-extrabold' 
                : '';

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-all active:scale-[0.98] cursor-pointer ${
                    isActive 
                      ? 'bg-slate-950 text-amber-500 shadow-sm font-extrabold' 
                      : `text-gray-600 hover:bg-gray-50 ${leadStyle}`
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-500' : 'text-gray-400'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                      isActive 
                        ? 'bg-amber-400 text-slate-950' 
                        : tab.id === 'fraud' ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick System status readout */}
          <div className="bg-slate-950 text-white rounded-2xl p-5 border border-slate-900 text-left relative overflow-hidden shadow-md">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-rose-550 bg-rose-500/10 rounded-full" />
            <ShieldAlert className="w-6 h-6 text-rose-400 mb-3" />
            <h4 className="text-[10px] font-black uppercase tracking-wider text-rose-450 text-rose-400 font-mono">System Integrity Checked</h4>
            <p className="text-[10px] text-slate-400 mt-1 leading-relaxed font-sans">
              Gateway security is scrubbing traffic. Auto-inspection parameters: <strong className="text-teal-400 font-mono">STRICT</strong>.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-[9px] font-mono text-slate-500">
              <span>SSL: Active SEC-256</span>
              <span className="text-emerald-400 font-bold">NODE ONLINE</span>
            </div>
          </div>
        </div>

        {/* DETAILS SECTION AREA */}
        <div className="lg:col-span-3 space-y-6">
          
          <AnimatePresence mode="wait">
            
            {/* SUBTAB 1: Admin Dashboard Overview */}
            {activeSubTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 text-left font-sans"
              >
                
                {/* 4 Counter Widget blocks */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  
                  <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm">
                    <span className="text-[9px] font-bold font-mono text-gray-400 uppercase tracking-wider block">Total Members</span>
                    <strong className="text-2.5xl font-black text-slate-950 font-mono block mt-1">{totalUsersCount} Profiles</strong>
                    <p className="text-[10px] text-emerald-600 font-mono font-bold mt-1.5 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-0.5" />
                      <span>+8% registration</span>
                    </p>
                  </div>

                  <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm">
                    <span className="text-[9px] font-bold font-mono text-gray-400 uppercase tracking-wider block">Public Ads Approved</span>
                    <strong className="text-2.5xl font-black text-slate-950 font-mono block mt-1">{activeListingsTotal} Active</strong>
                    <p className="text-[10px] text-slate-500 font-semibold mt-1.5">Listed pre-owned units</p>
                  </div>

                  <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm">
                    <span className="text-[9px] font-bold font-mono text-gray-400 uppercase tracking-wider block">Gross Commission</span>
                    <strong className="text-2.5xl font-black text-slate-950 font-mono block mt-1">₹{revenueTotal.toLocaleString('en-IN')}</strong>
                    <p className="text-[10px] text-emerald-600 font-bold mt-1.5">Net billing payouts</p>
                  </div>

                  <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm">
                    <span className="text-[9px] font-bold font-mono text-gray-400 uppercase tracking-wider block">Fraud Resolution Rate</span>
                    <strong className="text-2.5xl font-black text-slate-950 font-mono block mt-1">94.8%</strong>
                    <p className="text-[10px] text-rose-500 font-bold mt-1.5 flex items-center space-x-1">
                      <ShieldAlert className="w-3 h-3" />
                      <span>{openReportsCount} flag cases pending</span>
                    </p>
                  </div>

                </div>

                {/* Sub layout: Quick action queues */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* PENDING APPROVAL LISTINGS QUEUE */}
                  <div className="bg-white border border-gray-150 rounded-2.5xl p-6 space-y-4">
                    <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                      <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider font-mono">Listings Verification Queue</h3>
                      <button onClick={() => setActiveSubTab('listings')} className="text-[10px] font-bold text-amber-600 hover:underline uppercase">
                        Inspect All ({adminListings.filter(l => l.status === 'Pending Review' || l.status === 'Flagged').length})
                      </button>
                    </div>

                    <div className="space-y-3">
                      {adminListings.map(listing => (
                        <div key={listing.id} className="p-3 bg-slate-50 border border-gray-100 rounded-xl flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-black text-slate-950">{listing.year} {listing.brand} {listing.model}</span>
                              <span className={`text-[8px] font-mono px-1.5 py-0.25 rounded uppercase font-bold ${
                                listing.status === 'Flagged' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {listing.status}
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-400 block font-mono mt-1">Seller: {listing.sellerName}</span>
                          </div>
                          
                          <div className="flex items-center space-x-1.5 shrink-0">
                            <button
                              onClick={() => handleApproveListing(listing.id)}
                              className="p-1.5 bg-white hover:bg-emerald-50 text-emerald-600 rounded-lg border border-gray-200 hover:border-emerald-200 transition-colors cursor-pointer"
                              title="Approve Public Sale"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeclineListing(listing.id)}
                              className="p-1.5 bg-white hover:bg-rose-50 text-rose-600 rounded-lg border border-gray-200 hover:border-rose-200 transition-colors cursor-pointer"
                              title="Decline / Reject"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PENDING DEALER VERIFICATIONS QUEUE */}
                  <div className="bg-white border border-gray-150 rounded-2.5xl p-6 space-y-4">
                    <div className="flex items-center justify-between border-b pb-3 border-gray-100">
                      <h3 className="text-xs font-black text-slate-950 uppercase tracking-wider font-mono">Dealer Licensure Audits</h3>
                      <button onClick={() => setActiveSubTab('dealers')} className="text-[10px] font-bold text-amber-600 hover:underline uppercase">
                        View Audits
                      </button>
                    </div>

                    <div className="space-y-3">
                      {adminDealers.map(dealer => (
                        <div key={dealer.id} className="p-3 bg-slate-50 border border-gray-100 rounded-xl flex items-center justify-between">
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className="text-xs font-black text-slate-950 block">{dealer.dealershipName}</span>
                              <span className={`text-[8px] font-mono bg-amber-500 text-slate-950 px-1 py-0.25 rounded font-bold`}>
                                {dealer.subscriptionPlan}
                              </span>
                            </div>
                            <span className="text-[9px] text-gray-400 font-mono block">Owner: {dealer.ownerName} • Fleet: {dealer.fleetSize} cars</span>
                          </div>

                          <div className="shrink-0">
                            {dealer.status === 'Pending Verification' ? (
                              <button
                                onClick={() => handleVerifyDealer(dealer.id)}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-[9px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                              >
                                Certify Verification
                              </button>
                            ) : (
                              <span className="text-[9px] font-mono text-emerald-500 font-bold bg-emerald-50 px-2 py-1 rounded">
                                Approved
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </motion.div>
            )}

            {/* SUBTAB 2: Users Profile Control Engine */}
            {activeSubTab === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 text-left space-y-6"
              >
                <div>
                  <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">System Profile Registries</h3>
                  <p className="text-xs text-gray-400 mt-0.5 font-sans">
                    Monitor registered users and dealerships. Temporarily suspend accounts reported for violating security guidelines.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-400 uppercase tracking-wider font-mono text-[9px]">
                        <th className="pb-3 font-black">ID</th>
                        <th className="pb-3 font-black">Name & Contact</th>
                        <th className="pb-3 font-black">Designation</th>
                        <th className="pb-3 font-black">System Status</th>
                        <th className="pb-3 font-black text-center">Listed Cars</th>
                        <th className="pb-3 font-black text-right">Moderations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {systemUsers.map(user => (
                        <tr key={user.id} className="hover:bg-slate-50/50">
                          <td className="py-3.5 font-mono text-gray-500">{user.id}</td>
                          <td className="py-3.5">
                            <span className="font-bold text-slate-950 block">{user.name}</span>
                            <span className="text-[10px] text-gray-400 font-mono block mt-0.5">{user.email}</span>
                          </td>
                          <td className="py-3.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              user.role === 'Dealer' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3.5">
                            <span className={`inline-flex items-center space-x-1 text-[10px] font-bold font-mono ${
                              user.status === 'Active' ? 'text-emerald-600' : 'text-rose-500'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                              <span>{user.status}</span>
                            </span>
                          </td>
                          <td className="py-3.5 text-center font-mono font-bold text-slate-800">{user.listingsCount} Units</td>
                          <td className="py-3.5 text-right space-x-2">
                            {user.status === 'Active' ? (
                              <button
                                onClick={() => handleSuspendUser(user.id, 'Active')}
                                className="px-2.5 py-1 text-[10px] font-mono uppercase bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                              >
                                Suspend Account
                              </button>
                            ) : (
                              <button
                                onClick={() => handleSuspendUser(user.id, 'Suspended')}
                                className="px-2.5 py-1 text-[10px] font-mono uppercase bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors cursor-pointer"
                              >
                                Reactive Account
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </motion.div>
            )}

            {/* SUBTAB 3: Private Listings Moderator Inspector */}
            {activeSubTab === 'listings' && (
              <motion.div
                key="listings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 text-left space-y-6"
              >
                <div>
                  <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">Listings Auditing Inspection</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Certify motor details to preserve catalog authenticity. Flagged coordinates are marked with visual warnings.
                  </p>
                </div>

                <div className="space-y-4">
                  {adminListings.map(listing => (
                    <div key={listing.id} className="border border-gray-150 rounded-2.5xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded leading-none ${
                            listing.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {listing.status}
                          </span>
                          <span className="text-[10px] text-gray-450 text-gray-400 font-mono">Views: {listing.views}</span>
                        </div>
                        <h4 className="text-base font-black text-slate-950 mt-1">{listing.year} {listing.brand} {listing.model}</h4>
                        <span className="text-xs font-mono text-emerald-700 block mt-0.5">₹{listing.price.toLocaleString('en-IN')}</span>
                        <p className="text-[10px] text-gray-400 mt-1 font-sans">Seller: <strong className="text-slate-800">{listing.sellerName}</strong> ({listing.sellerRole})</p>
                      </div>

                      <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
                        {listing.status !== 'Approved' && (
                          <button
                            onClick={() => handleApproveListing(listing.id)}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-[10px] uppercase rounded-xl cursor-pointer"
                          >
                            Approve Listing
                          </button>
                        )}
                        <button
                          onClick={() => handleDeclineListing(listing.id)}
                          className="px-3.5 py-2 border border-gray-200 text-rose-500 hover:bg-rose-50 font-mono font-bold text-[10px] uppercase rounded-xl cursor-pointer"
                        >
                          Reject Ad
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </motion.div>
            )}

            {/* SUBTAB 4: Dealer Verification and Auditing */}
            {activeSubTab === 'dealers' && (
              <motion.div
                key="dealers"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 text-left space-y-6"
              >
                <div>
                  <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">Dealership Commercial Applications</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Evaluate regional dealerships, check assigned fleet allocations limits, and verify security protocols.
                  </p>
                </div>

                <div className="space-y-4">
                  {adminDealers.map(dealer => (
                    <div key={dealer.id} className="border border-gray-150 rounded-2.5xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-[9.5px] font-mono leading-none bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-bold`}>
                            {dealer.subscriptionPlan} Plan
                          </span>
                          <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded leading-none ${
                            dealer.status === 'Verified' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {dealer.status}
                          </span>
                        </div>
                        <h4 className="text-base font-black text-slate-950 mt-1.5">{dealer.dealershipName}</h4>
                        <span className="text-xs text-gray-400 block mt-0.5">Contact: {dealer.ownerName} ({dealer.email})</span>
                        <span className="text-[10px] text-gray-500 block font-mono mt-1">Authorized Showroom Fleet Units Size: <strong>{dealer.fleetSize} Active</strong></span>
                      </div>

                      <div className="shrink-0 w-full md:w-auto text-right">
                        {dealer.status === 'Pending Verification' ? (
                          <button
                            onClick={() => handleVerifyDealer(dealer.id)}
                            className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-amber-500 font-mono font-bold text-[10px] uppercase rounded-xl cursor-pointer"
                          >
                            Authorize Dealership
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-550/10 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-200 uppercase font-mono">
                            ✓ SECURED DEALER
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

              </motion.div>
            )}

            {/* SUBTAB 5: Global Eearnings Transactions & Ledger */}
            {activeSubTab === 'payments' && (
              <motion.div
                key="payments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 text-left space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">Finances & Subscription Transactions</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      System ledger monitoring real-time commercial dealer monthly program subscriptions and booster priority ads fee.
                    </p>
                  </div>
                  <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2.5 rounded-2xl">
                    <span className="text-[9px] font-mono text-gray-400 block uppercase font-bold leading-none mb-1">TOTAL EARNINGS REVENUE</span>
                    <strong className="text-lg font-mono font-black">₹{revenueTotal.toLocaleString('en-IN')}</strong>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-400 uppercase tracking-wider font-mono text-[9px]">
                        <th className="pb-3 font-black">Invoice Reference</th>
                        <th className="pb-3 font-black">User Details</th>
                        <th className="pb-3 font-black">Type</th>
                        <th className="pb-3 font-black">Payment Date</th>
                        <th className="pb-3 font-black">Charged Price</th>
                        <th className="pb-3 font-black text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 font-mono">
                      {transactions.map(tx => (
                        <tr key={tx.id} className="hover:bg-slate-50/50">
                          <td className="py-3.5 font-bold text-slate-900">{tx.id}</td>
                          <td className="py-3.5 font-sans">
                            <strong className="text-slate-955 text-slate-950">{tx.userName}</strong>
                            <span className="text-[9px] font-mono text-gray-400 block mt-0.5">UID: {tx.userId}</span>
                          </td>
                          <td className="py-3.5">
                            <span className="text-[10px] font-sans font-semibold text-slate-700">{tx.type}</span>
                          </td>
                          <td className="py-3.5 text-gray-500">{tx.date}</td>
                          <td className="py-3.5 text-slate-950 font-bold">₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className="py-3.5 text-right">
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] font-sans ${
                              tx.status === 'Success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
                            }`}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </motion.div>
            )}

            {/* SUBTAB 6: Site Data Analytics and Reports */}
            {activeSubTab === 'reports' && (
              <motion.div
                key="reports"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 text-left space-y-6"
              >
                <div>
                  <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">Platform Performance & Audits</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Consolidated stats tracking regional traffic patterns, listing conversion coefficients, and audit logs.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-left">
                  
                  {/* Traffic Chart and logs mimic */}
                  <div className="border border-gray-150 rounded-2.5xl p-5 space-y-3 font-mono">
                    <span className="text-[9px] font-mono font-black uppercase text-amber-600">DAILY API HIT METRIC</span>
                    <div className="h-28 flex items-end gap-1.5 pt-4">
                      {[32, 45, 68, 59, 87, 92, 105, 120, 98, 110, 145].map((val, idx) => (
                        <div key={idx} className="flex-grow flex flex-col items-center">
                          <div 
                            style={{ height: `${val / 1.5}px` }} 
                            className="w-full bg-slate-950 hover:bg-amber-500 rounded-sm transition-all" 
                            title={`${val}k daily requests`}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-[9px] text-gray-400 font-bold mt-2">
                      <span>MAY 25</span>
                      <span>MAY 30</span>
                      <span>TODAY (JUNE 04)</span>
                    </div>
                  </div>

                  {/* System audit log feed */}
                  <div className="border border-gray-150 rounded-2.5xl p-5 space-y-3">
                    <span className="text-[9px] font-mono font-black uppercase text-slate-400 block pb-2 border-b">Live Server System Logs</span>
                    
                    <div className="space-y-3.5 font-mono text-[10px] leading-relaxed text-gray-500 max-h-40 overflow-y-auto">
                      <div className="flex items-start justify-between">
                        <div>
                          <strong className="text-emerald-700">[INFO]</strong> Secure Auth completed for arthur@kamalot.org
                        </div>
                        <span className="text-[8px] text-gray-400">05:40:12</span>
                      </div>
                      <div className="flex items-start justify-between">
                        <div>
                          <strong className="text-[#b45309]">[WARN]</strong> Filter trigger keyword scam block on Fermat-Y
                        </div>
                        <span className="text-[8px] text-gray-400">05:22:15</span>
                      </div>
                      <div className="flex items-start justify-between">
                        <div>
                          <strong className="text-blue-600">[INFO]</strong> Database rule compiled cleanly. Token checked.
                        </div>
                        <span className="text-[8px] text-gray-400">04:18:00</span>
                      </div>
                      <div className="flex items-start justify-between">
                        <div>
                          <strong className="text-rose-500">[ALERT]</strong> Invalid payout request block for User ID usr-904
                        </div>
                        <span className="text-[8px] text-gray-400">03:02:44</span>
                      </div>
                    </div>
                  </div>

                </div>

              </motion.div>
            )}

            {/* SUBTAB 7: Editorial & Blogs Management */}
            {activeSubTab === 'blogs' && (
              <motion.div
                key="blogs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 text-left space-y-6"
              >
                <div className="border-b border-gray-100 pb-4">
                  <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">Editorial Hub Management</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Publish informative guides, dealer tips, or technical breakdowns in the public blogs registry section.
                  </p>
                </div>

                {/* Add new blog inline block */}
                <form onSubmit={handleCreateBlog} className="bg-slate-50 border border-gray-150 p-4.5 rounded-2.5xl space-y-3.5 text-xs">
                  <span className="text-[9px] font-mono font-black text-gray-400 uppercase tracking-wider block">Write & Publish Blog Article</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input 
                      type="text" 
                      name="blogTitle" 
                      required 
                      placeholder="Article Headline (e.g. BMW xDrive Powertrain Reviews)..." 
                      className="sm:col-span-2 px-3.5 py-2 border border-gray-200 bg-white rounded-xl"
                    />
                    <select name="blogCategory" className="px-3.5 py-2 border border-gray-200 bg-white rounded-xl">
                      <option value="Buying Guides">Buying Guides</option>
                      <option value="Tech Deep-Dives">Tech Deep-Dives</option>
                      <option value="Maintenance Tips">Maintenance Tips</option>
                      <option value="Dealer Stories">Dealer Stories</option>
                    </select>
                  </div>
                  <div className="flex justify-end pt-1">
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-amber-400 font-bold uppercase text-[10px] tracking-wider rounded-xl cursor-pointer"
                    >
                      Publish Article Now
                    </button>
                  </div>
                </form>

                {/* Live blog listing */}
                <div className="space-y-3 font-sans">
                  {blogs.map(blog => (
                    <div key={blog.id} className="border border-gray-100 rounded-xl p-4 flex items-center justify-between hover:bg-slate-50/50">
                      <div>
                        <span className="text-[9px] font-mono font-bold text-amber-600 uppercase tracking-wider">{blog.category}</span>
                        <h4 className="text-xs font-bold text-slate-950 mt-1">{blog.title}</h4>
                        <span className="text-[10px] text-gray-405 text-gray-400 block font-mono mt-0.5">Author: {blog.author} • Published: {blog.publishedDate}</span>
                      </div>
                      <div className="flex items-center space-x-6 text-xs shrink-0 text-left">
                        <div className="font-mono">
                          <span className="block text-[8px] text-gray-400 leading-none">VIEWS</span>
                          <strong className="text-slate-800 leading-normal">{blog.views}</strong>
                        </div>
                        <button
                          onClick={() => {
                            setBlogs(prev => prev.filter(b => b.id !== blog.id));
                            displayNotice("Deleted editorial post.");
                          }}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </motion.div>
            )}

            {/* SUBTAB 8: Promo Ad Campaigns & Top Banners */}
            {activeSubTab === 'ads' && (
              <motion.div
                key="ads"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 text-left space-y-6"
              >
                <div>
                  <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">Promotional & Banner Placements</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Activate, pause, or swap high-conversion homepage placement banners for dealer sponsorship programs.
                  </p>
                </div>

                <div className="space-y-4">
                  {adsBanners.map(banner => (
                    <div key={banner.id} className="border border-gray-150 rounded-2.5xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className={`text-[9px] font-mono font-semibold px-2 py-0.5 rounded leading-none ${
                            banner.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {banner.status}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">Location: {banner.placement}</span>
                        </div>
                        <h4 className="text-sm font-black text-slate-950 mt-1.5">{banner.title}</h4>
                        <div className="flex items-center space-x-4 mt-2 font-mono text-[10px] text-gray-400">
                          <span>Impressions: <strong>{banner.impressions.toLocaleString()}</strong></span>
                          <span>•</span>
                          <span>Clicks: <strong>{banner.clicks.toLocaleString()}</strong></span>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center space-x-2 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => handleToggleBanner(banner.id)}
                          className={`px-3 py-1.5 font-mono font-bold text-[10px] uppercase rounded-xl transition-all cursor-pointer ${
                            banner.status === 'Active' 
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-600' 
                              : 'bg-slate-950 hover:bg-slate-900 text-amber-400'
                          }`}
                        >
                          {banner.status === 'Active' ? 'Pause Campaign' : 'Activate Campaign'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </motion.div>
            )}

            {/* SUBTAB 9: Severe Fraud Flags, moderation cases */}
            {activeSubTab === 'fraud' && (
              <motion.div
                key="fraud"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 text-left space-y-6"
              >
                <div>
                  <h3 className="text-lg font-black text-rose-600 uppercase tracking-tight flex items-center gap-1.5">
                    <Flag className="w-5 h-5 text-rose-500 animate-pulse" />
                    <span>Severe Fraud Alerts & Anti-Scam Moderation</span>
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Handle reported listings and suspicious behavior logs. Enforce strict marketplace operations immediately.
                  </p>
                </div>

                <div className="space-y-4 font-sans text-xs">
                  {reports.map(report => (
                    <div 
                      key={report.id} 
                      className={`border rounded-2.5xl p-5 relative overflow-hidden ${
                        report.status === 'Open' 
                          ? 'border-rose-200 bg-rose-500/5' 
                          : 'border-gray-150'
                      }`}
                    >
                      <div className="absolute top-0 right-0 bg-rose-500 text-white font-mono text-[8px] font-bold uppercase px-2 py-0.5 rounded-bl-lg">
                        Case ID: {report.id}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono text-rose-600 font-extrabold uppercase bg-rose-100 px-1.5 py-0.25 rounded">
                            {report.reportedType} Flagged
                          </span>
                          <span className="text-[10px] font-mono text-gray-400">Reported By: {report.reportedBy} • Date: {report.date}</span>
                        </div>

                        <div className="text-slate-950">
                          Target Identifier ID: <strong className="font-mono bg-white border border-gray-200 px-1.5 py-0.5 rounded text-[10px]">{report.reportedId}</strong>
                        </div>

                        <p className="text-[11px] text-gray-500 bg-white/70 p-3 rounded-xl border border-gray-150 leading-relaxed italic">
                          "{report.reason}"
                        </p>

                        <div className="flex items-center justify-end space-x-2 pt-2">
                          {report.status === 'Open' ? (
                            <>
                              <button
                                onClick={() => handleResolveReport(report.id, 'Resolved')}
                                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-mono font-bold text-[10px] uppercase rounded-xl cursor-pointer"
                              >
                                Take Action & Resolve Case
                              </button>
                              <button
                                onClick={() => handleResolveReport(report.id, 'Dismissed')}
                                className="px-3 py-1.5 border border-gray-300 text-slate-800 hover:bg-slate-50 font-mono font-bold text-[10px] uppercase rounded-xl cursor-pointer"
                              >
                                Dismiss Report
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded uppercase font-bold">
                              ✓ Resolved In Sync
                            </span>
                          )}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

              </motion.div>
            )}

            {/* SUBTAB 10: Global Admin system tuning parameter settings */}
            {activeSubTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 text-left space-y-6"
              >
                <div>
                  <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">System Configuration Settings</h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Fine-tune site-wide flags for maintenance modes, registration allowances, and dealer inspection thresholds.
                  </p>
                </div>

                <div className="space-y-4 text-xs font-sans">
                  
                  {/* Option 1: Maintenance protocol */}
                  <div className="p-4 bg-slate-50 border border-gray-150 rounded-2.5xl flex items-center justify-between">
                    <div>
                      <strong className="text-slate-950 font-bold block">Developer Maintenance Override Protocol</strong>
                      <span className="text-[10px] text-gray-400 block mt-0.5">Locks catalog viewing down for software updates if toggled active.</span>
                    </div>
                    <button
                      onClick={() => {
                        setSystemSettingMaintenance(!systemSettingMaintenance);
                        displayNotice(`Maintenance mode toggled to: "${!systemSettingMaintenance}".`);
                      }}
                      className={`px-3.5 py-1.5 font-mono font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                        systemSettingMaintenance 
                          ? 'bg-rose-600 text-white animate-pulse' 
                          : 'bg-white border border-gray-200 text-slate-700'
                      }`}
                    >
                      {systemSettingMaintenance ? 'STAGING LOCK' : 'NORMAL MODE'}
                    </button>
                  </div>

                  {/* Option 2: Active registration */}
                  <div className="p-4 bg-slate-50 border border-gray-150 rounded-2.5xl flex items-center justify-between">
                    <div>
                      <strong className="text-slate-950 font-bold block">Public Customer Verification & Registration</strong>
                      <span className="text-[10px] text-gray-400 block mt-0.5">Disable to block new accounts creation temporarily.</span>
                    </div>
                    <button
                      onClick={() => {
                        setSystemSettingRegisterOpen(!systemSettingRegisterOpen);
                        displayNotice(`Verification registration allowed set to ${!systemSettingRegisterOpen}.`);
                      }}
                      className={`px-3.5 py-1.5 font-mono font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                        systemSettingRegisterOpen 
                          ? 'bg-slate-950 text-amber-500' 
                          : 'bg-white border border-gray-200 text-slate-700'
                      }`}
                    >
                      {systemSettingRegisterOpen ? 'OPEN TO PUBLIC' : 'INVITE PRIVILEGED ONLY'}
                    </button>
                  </div>

                  {/* Option 3: Force inspection audits */}
                  <div className="p-4 bg-slate-50 border border-gray-150 rounded-2.5xl flex items-center justify-between">
                    <div>
                      <strong className="text-slate-950 font-bold block">Enforce 150-Point Mechanics Audit</strong>
                      <span className="text-[10px] text-gray-400 block mt-0.5">Requires mechanics inspection reports signature before commercial post publication.</span>
                    </div>
                    <button
                      onClick={() => {
                        setSystemSettingRequireInspect(!systemSettingRequireInspect);
                        displayNotice(`Mechanical pre-inspections verification set to: ${!systemSettingRequireInspect}`);
                      }}
                      className={`px-3.5 py-1.5 font-mono font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                        systemSettingRequireInspect 
                          ? 'bg-slate-950 text-emerald-450 text-emerald-450 text-emerald-450 text-emerald-450 text-emerald-400' 
                          : 'bg-white border border-gray-200 text-slate-705 text-slate-700'
                      }`}
                    >
                      {systemSettingRequireInspect ? 'MANDATORY INSPECT' : 'OPTIONAL REPORT'}
                    </button>
                  </div>

                </div>

              </motion.div>
            )}

          </AnimatePresence>

        </div>

      </div>

    </div>
  );
}
