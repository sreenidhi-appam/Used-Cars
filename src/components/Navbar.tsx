import React, { useState } from 'react';
import { Menu, X, ChevronDown, Car, Percent, HelpCircle, FileText, Compass, Briefcase, Phone, Scale, Award, Heart, User, PlusCircle, LogOut, Search, LayoutDashboard, ShieldAlert } from 'lucide-react';
import { Car as CarType } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  setFinanceSubTab: (subTab: string) => void;
  setServiceSubTab: (subTab: string) => void;
  setBlogCategoryFilter: (category: string) => void;
  wishlist: string[];
  setWishlist: React.Dispatch<React.SetStateAction<string[]>>;
  user: { name: string; email: string; role: 'user' | 'dealer' | 'admin' } | null;
  setUser: React.Dispatch<React.SetStateAction<{ name: string; email: string; role: 'user' | 'dealer' | 'admin' } | null>>;
  sellSubTab?: 'valuation' | 'sell' | 'inspection';
  setSellSubTab?: React.Dispatch<React.SetStateAction<'valuation' | 'sell' | 'inspection'>>;
  cars: CarType[];
}

export default function Navbar({
  activeTab,
  setActiveTab,
  setFilters,
  setFinanceSubTab,
  setServiceSubTab,
  setBlogCategoryFilter,
  wishlist,
  setWishlist,
  user,
  setUser,
  sellSubTab,
  setSellSubTab,
  cars
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [navbarSearchText, setNavbarSearchText] = useState('');
  const [loginRole, setLoginRole] = useState<'user' | 'dealer' | 'admin'>('user');
  const [loginName, setLoginName] = useState('Arthur Pendragon');
  const [loginEmail, setLoginEmail] = useState('arthur@kamalot.org');

  const selectRolePreset = (role: 'user' | 'dealer' | 'admin') => {
    setLoginRole(role);
    if (role === 'user') {
      setLoginName('Arthur Pendragon');
      setLoginEmail('arthur@kamalot.org');
    } else if (role === 'dealer') {
      setLoginName('Speedsters Ltd');
      setLoginEmail('dealer@velocitymoto.com');
    } else if (role === 'admin') {
      setLoginName('Root Administrator');
      setLoginEmail('admin@velocitymoto.com');
    }
  };

  const handleBuyCarTab = (filterPreset?: string, value?: any) => {
    setActiveTab('buy');
    setActiveDropdown(null);
    setMobileMenuOpen(false);
    
    // Clear filters and apply specific preset
    const defaultFilters = {
      search: '',
      minPrice: '',
      maxPrice: '',
      bodyType: '',
      fuelType: '',
      isCertified: false,
      isBudget: false,
      isLuxury: false
    };

    if (filterPreset === 'all') {
      setFilters(defaultFilters);
    } else if (filterPreset === 'certified') {
      setFilters({ ...defaultFilters, isCertified: true });
    } else if (filterPreset === 'budget') {
      setFilters({ ...defaultFilters, maxPrice: '1640000', isBudget: true });
    } else if (filterPreset === 'luxury') {
      setFilters({ ...defaultFilters, minPrice: '3280000', isLuxury: true });
    } else if (filterPreset === 'bodyType' && value) {
      setFilters({ ...defaultFilters, bodyType: value });
    } else if (filterPreset === 'fuelType' && value) {
      setFilters({ ...defaultFilters, fuelType: value });
    }
  };

  const handleFinanceTab = (subTab: string) => {
    setActiveTab('finance');
    setFinanceSubTab(subTab);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  const handleServiceTab = (subTab: string) => {
    setActiveTab('services');
    setServiceSubTab(subTab);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  const handleBlogTab = (category?: string) => {
    setActiveTab('blog');
    setBlogCategoryFilter(category || 'All');
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  return (
    <header id="main-header" className="sticky top-0 z-50 w-full bg-white border-b border-gray-150 shadow-sm backdrop-blur-md/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div 
            id="brand-logo-container"
            onClick={() => {
              setActiveTab('home');
              setActiveDropdown(null);
              setMobileMenuOpen(false);
            }} 
            className="flex items-center space-x-2 cursor-pointer select-none flex-shrink-0"
          >
            <div className="p-2.5 bg-slate-900 rounded-xl text-amber-500">
              <Car className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="text-left">
              <span className="text-lg font-black text-slate-950 tracking-tight block leading-none">
                VELOCITY<span className="text-amber-500 font-black">MOTO</span>
              </span>
              <span className="text-[9px] text-gray-400 font-mono tracking-wider uppercase block leading-none mt-1">Pre-Owned Hub</span>
            </div>
          </div>

          {/* Inline Search bar next to logo */}
          <div className="hidden md:block relative w-36 lg:w-44 xl:w-56">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setActiveTab('buy');
                setFilters(prev => ({ ...prev, search: navbarSearchText }));
                setNavbarSearchText('');
              }}
              className="flex items-center relative w-full"
            >
              <input 
                type="text" 
                placeholder="Search Cars..." 
                value={navbarSearchText} 
                onChange={(e) => setNavbarSearchText(e.target.value)} 
                className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 text-xs rounded-xl focus:outline-none focus:border-amber-500 focus:bg-white text-gray-800 transition-all font-sans font-medium placeholder-gray-400 shadow-sm"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </form>

            {/* Suggestions Dropdown */}
            {navbarSearchText.trim() && (
              <div className="absolute left-0 mt-2 w-72 bg-white border border-gray-150 rounded-2xl shadow-xl z-[99] p-3 max-h-80 overflow-y-auto animate-[fadeIn_0.15s_ease-out]">
                <div className="text-[9px] font-bold font-mono text-gray-400 uppercase tracking-widest pb-1.5 border-b border-gray-50 mb-1.5">Available Cars for Purchase</div>
                {cars.filter(car => {
                  const query = navbarSearchText.toLowerCase().trim();
                  const brand = car.brand.toLowerCase();
                  const model = car.model.toLowerCase();
                  const combo = `${brand} ${model}`;
                  const words = query.split(/\s+/).filter(Boolean);
                  const matchesWords = words.length > 1 && words.every(w =>
                    brand.includes(w) || model.includes(w) || car.fuelType.toLowerCase().includes(w) || car.transmission.toLowerCase().includes(w)
                  );
                  return brand.includes(query) || model.includes(query) || combo.includes(query) || query.includes(brand) || query.includes(model) || matchesWords;
                }).length === 0 ? (
                  <p className="text-[11px] text-gray-500 py-2 text-center font-medium">No cars matching your search</p>
                ) : (
                  <div className="space-y-1.5">
                    {cars.filter(car => {
                      const query = navbarSearchText.toLowerCase().trim();
                      const brand = car.brand.toLowerCase();
                      const model = car.model.toLowerCase();
                      const combo = `${brand} ${model}`;
                      const words = query.split(/\s+/).filter(Boolean);
                      const matchesWords = words.length > 1 && words.every(w =>
                        brand.includes(w) || model.includes(w) || car.fuelType.toLowerCase().includes(w) || car.transmission.toLowerCase().includes(w)
                      );
                      return brand.includes(query) || model.includes(query) || combo.includes(query) || query.includes(brand) || query.includes(model) || matchesWords;
                    }).slice(0, 5).map(car => (
                      <button
                        key={car.id}
                        type="button"
                        onClick={() => {
                          setActiveTab('buy');
                          setFilters(prev => ({ 
                            ...prev, 
                            search: `${car.brand} ${car.model}`,
                            minPrice: '',
                            maxPrice: '',
                            bodyType: '',
                            fuelType: '',
                            isCertified: false,
                            isBudget: false,
                            isLuxury: false
                          }));
                          setNavbarSearchText('');
                        }}
                        className="w-full flex items-center justify-between p-1.5 hover:bg-amber-50 rounded-xl transition-all text-left cursor-pointer group/suggest border border-transparent hover:border-amber-100"
                      >
                        <div className="flex items-center space-x-2">
                          <img src={car.image} alt={car.model} className="w-10 h-8 object-cover rounded-md border flex-shrink-0" referrerPolicy="no-referrer" />
                          <div className="max-w-[130px] truncate">
                            <h4 className="text-[11px] font-bold text-gray-800 group-hover/suggest:text-amber-600 truncate">{car.brand} {car.model}</h4>
                            <span className="text-[9px] text-gray-400 font-mono">{car.year} • {car.fuelType}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-black text-gray-900 block">₹{car.price.toLocaleString('en-IN')}</span>
                          <span className="text-[8px] text-amber-600 font-sans font-bold">Buy Now</span>
                        </div>
                      </button>
                    ))}
                    {cars.filter(car => {
                      const query = navbarSearchText.toLowerCase().trim();
                      const brand = car.brand.toLowerCase();
                      const model = car.model.toLowerCase();
                      const combo = `${brand} ${model}`;
                      const words = query.split(/\s+/).filter(Boolean);
                      const matchesWords = words.length > 1 && words.every(w =>
                        brand.includes(w) || model.includes(w) || car.fuelType.toLowerCase().includes(w) || car.transmission.toLowerCase().includes(w)
                      );
                      return brand.includes(query) || model.includes(query) || combo.includes(query) || query.includes(brand) || query.includes(model) || matchesWords;
                    }).length > 5 && (
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('buy');
                          setFilters(prev => ({ 
                            ...prev, 
                            search: navbarSearchText,
                            minPrice: '',
                            maxPrice: '',
                            bodyType: '',
                            fuelType: '',
                            isCertified: false,
                            isBudget: false,
                            isLuxury: false
                          }));
                          setNavbarSearchText('');
                        }}
                        className="w-full text-center py-1.5 bg-gray-50 hover:bg-amber-500/10 text-amber-600 hover:text-amber-700 text-[10px] font-extrabold uppercase rounded-lg transition-colors border border-dashed border-gray-150"
                      >
                        View All {cars.filter(car => {
                          const query = navbarSearchText.toLowerCase().trim();
                          const brand = car.brand.toLowerCase();
                          const model = car.model.toLowerCase();
                          const combo = `${brand} ${model}`;
                          const words = query.split(/\s+/).filter(Boolean);
                          const matchesWords = words.length > 1 && words.every(w =>
                            brand.includes(w) || model.includes(w) || car.fuelType.toLowerCase().includes(w) || car.transmission.toLowerCase().includes(w)
                          );
                          return brand.includes(query) || model.includes(query) || combo.includes(query) || query.includes(brand) || query.includes(model) || matchesWords;
                        }).length} Cars
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden xl:flex items-center space-x-0.5">
            
            {/* Home Link */}
            <button
              id="nav-home"
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'home' ? 'bg-slate-100 text-gray-905' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-905'
              }`}
            >
              Home
            </button>

            {/* Buy Cars Dropdown */}
            <div 
              className="relative group py-2"
              onMouseEnter={() => setActiveDropdown('buy')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                id="nav-buy-cars"
                onClick={() => handleBuyCarTab('all')}
                className={`flex items-center space-x-0.5 px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'buy' ? 'bg-slate-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-905'
                }`}
              >
                <span>Buy Cars</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {activeDropdown === 'buy' && (
                <div id="dropdown-buy-cars" className="absolute left-0 mt-1 w-60 rounded-xl bg-white shadow-xl ring-1 ring-black/5 py-1.5 grid grid-cols-1 border border-gray-100 transition-all duration-200 z-50">
                  <div className="px-3 py-0.5 text-[9px] font-bold text-gray-400 font-mono tracking-widest uppercase border-b border-gray-50 mb-1">Collections</div>
                  <button onClick={() => handleBuyCarTab('all')} className="flex items-center px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-amber-500/10 hover:text-amber-600 rounded-lg mx-1.5 transition-all text-left">All Pre-Owned Inventory</button>
                  <button onClick={() => handleBuyCarTab('certified')} className="flex items-center justify-between px-4 py-2 text-xs font-semibold text-red-650 hover:bg-red-50 rounded-lg mx-1.5 transition-all text-left">
                    <span>Certified Platinum</span>
                    <Award className="w-3.5 h-3.5 text-red-500" />
                  </button>
                  <button onClick={() => handleBuyCarTab('budget')} className="flex items-center px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg mx-1.5 transition-all text-left">Budget Cars (under ₹16.4 Lakhs)</button>
                  <button onClick={() => handleBuyCarTab('luxury')} className="flex items-center px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-amber-50 hover:text-amber-600 rounded-lg mx-1.5 transition-all text-left">Luxury Collections</button>
                  
                  <div className="px-3 py-0.5 text-[9px] font-bold text-gray-400 font-mono tracking-widest uppercase border-t border-b border-gray-50 my-1">Body Styles</div>
                  <button onClick={() => handleBuyCarTab('bodyType', 'SUV')} className="flex items-center px-4 py-1.5 text-xs text-gray-600 hover:bg-gray-50 rounded-lg mx-1.5 transition-all text-left">SUVs & Crossovers</button>
                  <button onClick={() => handleBuyCarTab('bodyType', 'Sedan')} className="flex items-center px-4 py-1.5 text-xs text-gray-600 hover:bg-gray-50 rounded-lg mx-1.5 transition-all text-left">Premium Sedans</button>
                  <button onClick={() => handleBuyCarTab('bodyType', 'Hatchback')} className="flex items-center px-4 py-1.5 text-xs text-gray-600 hover:bg-gray-50 rounded-lg mx-1.5 transition-all text-left">Compact Hatchbacks</button>
                  <button onClick={() => handleBuyCarTab('fuelType', 'Electric')} className="flex items-center px-4 py-1.5 text-xs text-teal-605 hover:bg-teal-50 rounded-lg mx-1.5 transition-all font-bold text-left">Electric Vehicles (EV)</button>
                </div>
              )}
            </div>

            {/* Sell Car */}
            <button
              id="nav-sell-car"
              onClick={() => { setActiveTab('sell'); if (setSellSubTab) setSellSubTab('sell'); }}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'sell' && sellSubTab === 'sell' ? 'bg-slate-100 text-gray-905' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-905'
              }`}
            >
              Sell Car
            </button>

            {/* Compare Cars */}
            <button
              id="nav-compare-cars"
              onClick={() => { setActiveTab('compare'); }}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'compare' ? 'bg-slate-100 text-gray-905' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-905'
              }`}
            >
              Compare Cars
            </button>

            {/* Dealers */}
            <button
              id="nav-dealers"
              onClick={() => { setActiveTab('dealers'); }}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'dealers' ? 'bg-slate-100 text-gray-905' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-905'
              }`}
            >
              Dealers
            </button>

            {/* Financing */}
            <button
              id="nav-financing"
              onClick={() => { setActiveTab('finance'); setFinanceSubTab('calculator'); }}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'finance' ? 'bg-slate-100 text-gray-905' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-905'
              }`}
            >
              Financing
            </button>

            {/* Car Valuation */}
            <button
              id="nav-valuation"
              onClick={() => { setActiveTab('sell'); if (setSellSubTab) setSellSubTab('valuation'); }}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'sell' && sellSubTab === 'valuation' ? 'bg-slate-100 text-gray-905' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-905'
              }`}
            >
              Car Valuation
            </button>

            {/* Blog */}
            <button
              id="nav-blog"
              onClick={() => { handleBlogTab('All'); }}
              className={`px-3 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'blog' ? 'bg-slate-100 text-gray-905' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-905'
              }`}
            >
              Blog
            </button>

          </nav>

          {/* Right Side Navbar Items (Login/Register, Wishlist/Saved Cars, Highlighted Post Ad/Sell Car) */}
          <div id="nav-cta-container" className="hidden lg:flex items-center space-x-4">
            
            {/* 1. Wishlist / Saved Cars with counter badge */}
            <div className="relative">
              <button
                type="button"
                onClick={() => { setWishlistOpen(!wishlistOpen); setLoginModalOpen(false); }}
                className="p-2 hover:bg-gray-100 rounded-xl transition-all text-gray-700 hover:text-rose-500 relative cursor-pointer"
                title="View Saved Cars"
              >
                <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'text-rose-600 fill-rose-600' : ''}`} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-bold font-mono text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Wishlist Dropdown box */}
              {wishlistOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-150 rounded-2xl shadow-xl z-50 p-4 animate-[fadeIn_0.15s_ease-out]">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-2">
                    <span className="text-[10px] font-bold font-mono text-gray-400 uppercase tracking-widest">Saved Wishlist ({wishlist.length})</span>
                    <button 
                      onClick={() => setWishlistOpen(false)}
                      className="text-xs text-gray-400 hover:text-slate-950 font-bold"
                    >
                      Close
                    </button>
                  </div>

                  {wishlist.length === 0 ? (
                    <div className="py-6 text-center">
                      <Heart className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Your wishlist is empty.</p>
                      <button
                        onClick={() => { setActiveTab('buy'); setWishlistOpen(false); }}
                        className="mt-3.5 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-[10px] uppercase rounded-lg"
                      >
                        Explore Inventory
                      </button>
                    </div>
                  ) : (
                    <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
                      {wishlist.map(carId => {
                        const car = cars.find(c => c.id === carId);
                        if (!car) return null;
                        return (
                          <div key={car.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-xl group/item">
                            <div className="flex items-center space-x-2.5">
                              <img src={car.image} alt={car.model} className="w-12 h-10 object-cover rounded-lg border bg-gray-100 flex-shrink-0" />
                              <div className="max-w-[130px] truncate text-left">
                                <h4 className="text-xs font-black text-slate-900 leading-tight truncate">{car.brand} {car.model}</h4>
                                <span className="text-[10px] text-gray-500 font-mono">₹{car.price.toLocaleString('en-IN')}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => {
                                  setActiveTab('buy');
                                  setFilters(prev => ({ ...prev, search: car.model }));
                                  setWishlistOpen(false);
                                }}
                                className="p-1 hover:bg-amber-100 rounded text-amber-600 text-[10px] font-black tracking-wider uppercase cursor-pointer"
                              >
                                View
                              </button>
                              <button
                                onClick={() => {
                                  setWishlist(prev => prev.filter(id => id !== carId));
                                }}
                                className="p-1 hover:bg-rose-50 text-rose-500 rounded cursor-pointer"
                                title="Remove item"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. Login / Register Trigger or User greet dropdown */}
            {user ? (
              <div className="relative group/user z-50">
                <div className="flex items-center space-x-2 bg-slate-105 hover:bg-slate-200/80 px-3 py-1.5 rounded-xl cursor-pointer transition-all">
                  <div className="w-7 h-7 bg-slate-900 text-amber-400 font-black text-xs uppercase flex items-center justify-center rounded-lg shadow-sm font-mono">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden xl:block text-left">
                    <p className="text-[9px] font-mono font-bold text-gray-400 uppercase leading-none">Logged In</p>
                    <span className="text-xs font-bold text-slate-800 leading-none">{user.name.split(' ')[0]}</span>
                  </div>
                </div>
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-150 rounded-2xl shadow-xl p-2 invisible group-hover/user:visible hover:visible opacity-0 group-hover/user:opacity-100 hover:opacity-100 transition-all z-50 animate-[fadeIn_0.1s_ease-out]">
                  <div className="px-3 py-2 border-b border-gray-100 mb-1 text-left">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-slate-900 truncate max-w-[90px]">{user.name}</p>
                      <span className={`px-1.5 py-0.5 rounded text-[7px] font-mono font-bold leading-none uppercase ${
                        user.role === 'admin' ? 'bg-rose-100 text-rose-750 border border-rose-250' :
                        user.role === 'dealer' ? 'bg-amber-100 text-amber-700 border border-amber-250' :
                        'bg-blue-105 text-blue-700 border border-blue-200'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                    <p className="text-[9px] text-gray-400 font-mono truncate">{user.email}</p>
                  </div>
                  {user.role === 'user' && (
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="w-full flex items-center space-x-1.5 px-3 py-2 hover:bg-amber-500/10 hover:text-amber-600 rounded-xl text-xs font-semibold text-gray-700 transition-colors cursor-pointer text-left font-sans"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-amber-500" />
                      <span>User Dashboard</span>
                    </button>
                  )}
                  {user.role === 'dealer' && (
                    <button
                      onClick={() => setActiveTab('dealer-dashboard')}
                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-amber-500/10 hover:text-amber-600 rounded-xl text-xs font-semibold text-gray-700 transition-colors cursor-pointer text-left font-sans"
                    >
                      <div className="flex items-center space-x-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-amber-600" />
                        <span>Dealer Panel</span>
                      </div>
                      <span className="text-[8px] font-mono font-bold bg-amber-500 text-slate-950 px-1 rounded-sm leading-none py-0.5">PRO</span>
                    </button>
                  )}
                  {user.role === 'admin' && (
                    <button
                      onClick={() => setActiveTab('admin-dashboard')}
                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-amber-500/10 hover:text-rose-600 rounded-xl text-xs font-semibold text-gray-700 transition-colors cursor-pointer text-left font-sans"
                    >
                      <div className="flex items-center space-x-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                        <span>Admin Panel</span>
                      </div>
                      <span className="text-[8px] font-mono font-bold bg-rose-500 text-white px-1 rounded-sm leading-none py-0.5">STAFF</span>
                    </button>
                  )}
                  <button
                    onClick={() => setUser(null)}
                    className="w-full flex items-center space-x-1.5 px-3 py-2 hover:bg-rose-50 hover:text-rose-655 rounded-xl text-xs font-semibold text-gray-600 transition-colors cursor-pointer text-left font-sans mt-0.5"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Sign Out Account</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => { setLoginModalOpen(true); setWishlistOpen(false); }}
                className="px-4 py-2 text-xs font-bold text-slate-850 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all cursor-pointer flex items-center space-x-1 duration-100 font-sans"
              >
                <User className="w-3.5 h-3.5 text-slate-800" />
                <span>Login</span>
              </button>
            )}



          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 relative active:scale-90 transition-all"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="lg:hidden border-t border-gray-100 bg-white max-h-[calc(100vh-80px)] overflow-y-auto pb-8 shadow-inner animate-[fadeIn_0.2s_ease-out]">
          <div className="px-4 pt-4 pb-3 space-y-1.5 font-sans">
            
            {/* Mobile Auth User & Wishlist summary bar */}
            <div className="px-3.5 py-3.5 bg-slate-900 text-white rounded-2xl mb-3 space-y-3 shadow-inner">
              {user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8.5 h-8.5 rounded-xl bg-amber-500 text-slate-930 font-black flex items-center justify-center text-sm uppercase font-mono">
                      {user.name.charAt(0)}
                    </div>
                    <div className="text-left">
                      <h4 className="text-[9px] font-bold tracking-widest uppercase text-amber-400 font-mono">Authorized Profile</h4>
                      <p className="text-xs font-bold text-white leading-none">{user.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setUser(null)}
                    className="p-1.5 bg-white/10 hover:bg-rose-600/30 rounded-xl text-rose-300 transition-colors cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <h4 className="text-[9px] font-bold text-gray-400 font-mono uppercase tracking-wider">Ready to Trade?</h4>
                    <p className="text-xs font-bold text-white line-clamp-1">Join VelocityMoto platform</p>
                  </div>
                  <button
                    onClick={() => { setLoginModalOpen(true); setMobileMenuOpen(false); }}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg uppercase tracking-wider transition-all cursor-pointer"
                  >
                    Login / Register
                  </button>
                </div>
              )}

              {/* Wishlist Mobile Summary */}
              <div className="flex items-center justify-between pt-2.5 border-t border-white/10 text-[11px]">
                <span className="text-gray-300 font-mono uppercase tracking-widest font-bold">Saved Wishlist ({wishlist.length} items)</span>
                <button
                  onClick={() => {
                    setActiveTab('buy');
                    setMobileMenuOpen(false);
                  }}
                  className="text-amber-400 hover:underline font-bold cursor-pointer"
                >
                  Explore List &rarr;
                </button>
              </div>
            </div>

            {user && (
              <div className="space-y-2 mb-4">
                {user.role === 'user' && (
                  <button
                    onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-black uppercase tracking-wider text-white bg-slate-950 hover:bg-slate-900 rounded-xl shadow-md cursor-pointer transition-all active:scale-95"
                  >
                    <LayoutDashboard className="w-4.5 h-4.5 text-amber-500" />
                    <span>User Dashboard</span>
                  </button>
                )}
                {user.role === 'dealer' && (
                  <button
                    onClick={() => { setActiveTab('dealer-dashboard'); setMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-black uppercase tracking-wider text-slate-900 bg-amber-500 hover:bg-amber-600 rounded-xl shadow-md cursor-pointer transition-all active:scale-95 border-b-2 border-amber-600"
                  >
                    <Briefcase className="w-4.5 h-4.5 text-slate-950" />
                    <span>Dealer Dashboard</span>
                  </button>
                )}
                {user.role === 'admin' && (
                  <button
                    onClick={() => { setActiveTab('admin-dashboard'); setMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-black uppercase tracking-wider text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md cursor-pointer transition-all active:scale-95 border-b-2 border-rose-700"
                  >
                    <ShieldAlert className="w-4.5 h-4.5 text-white" />
                    <span>Admin Dashboard</span>
                  </button>
                )}
              </div>
            )}

            <button
              id="mobile-nav-home"
              onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
              className="flex w-full px-4 py-3 text-base font-semibold text-gray-900 hover:bg-gray-50 rounded-xl"
            >
              Home
            </button>

            {/* Buy Cars Sections */}
            <div className="bg-gray-50/50 rounded-2xl p-2.5 space-y-1">
              <span className="px-4 py-1.5 text-xs font-bold text-gray-400 font-mono tracking-wider uppercase">Buy Cars Category</span>
              <button onClick={() => handleBuyCarTab('all')} className="flex w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-white rounded-lg">All Pre-Owned Cars</button>
              <button onClick={() => handleBuyCarTab('certified')} className="flex w-full px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg">Certified Platinum Luxury</button>
              <button onClick={() => handleBuyCarTab('budget')} className="flex w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-white rounded-lg">Budget Special (Under ₹16.4 Lakhs)</button>
              <button onClick={() => handleBuyCarTab('bodyType', 'SUV')} className="flex w-full px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-white rounded-lg">SUVs / Crossovers</button>
              <button onClick={() => handleBuyCarTab('bodyType', 'Sedan')} className="flex w-full px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-white rounded-lg">Sedans Collection</button>
              <button onClick={() => handleBuyCarTab('bodyType', 'Hatchback')} className="flex w-full px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-white rounded-lg">Hatchbacks</button>
              <button onClick={() => handleBuyCarTab('fuelType', 'Electric')} className="flex w-full px-4 py-2.5 text-sm font-bold text-teal-600 hover:bg-teal-50 rounded-lg">Electric Vehicles (EV)</button>
            </div>

            {/* Sell Car Category */}
            <div className="bg-gray-50/50 rounded-2xl p-2.5 space-y-1">
              <span className="px-4 py-1.5 text-xs font-bold text-gray-400 font-mono tracking-wider uppercase">Sell Car Tools</span>
              <button onClick={() => { setActiveTab('sell'); setMobileMenuOpen(false); }} className="flex w-full px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-white rounded-lg">Instant Car Valuation</button>
              <button onClick={() => { setActiveTab('sell'); setMobileMenuOpen(false); }} className="flex w-full px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-white rounded-lg">Book 150pt Inspection</button>
            </div>

            {/* Finance Suite */}
            <div className="bg-gray-50/50 rounded-2xl p-2.5 space-y-1">
              <span className="px-4 py-1.5 text-xs font-bold text-gray-400 font-mono tracking-wider uppercase">Finance & Loans</span>
              <button onClick={() => handleFinanceTab('loan')} className="flex w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-white rounded-lg">Car Loan Programs</button>
              <button onClick={() => handleFinanceTab('calculator')} className="flex w-full px-4 py-2.5 text-sm font-bold text-amber-600 bg-amber-50 rounded-lg">EMI Calculator Widget</button>
              <button onClick={() => handleFinanceTab('insurance')} className="flex w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-white rounded-lg">Used Car Insurance</button>
              <button onClick={() => handleFinanceTab('eligibility')} className="flex w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-white rounded-lg">Check Loan Eligibility</button>
            </div>

            {/* Services Suite */}
            <div className="bg-gray-50/50 rounded-2xl p-2.5 space-y-1">
              <span className="px-4 py-1.5 text-xs font-bold text-gray-400 font-mono tracking-wider uppercase">RTO & Convenience</span>
              <button onClick={() => handleServiceTab('rc-transfer')} className="flex w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-white rounded-lg">RC Title Transfer</button>
              <button onClick={() => handleServiceTab('inspection')} className="flex w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-white rounded-lg">Full Inspection</button>
              <button onClick={() => handleServiceTab('insurance-renewal')} className="flex w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-white rounded-lg">Insurance Renewal</button>
              <button onClick={() => handleServiceTab('fastag')} className="flex w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-white rounded-lg">Prepaid Fastag</button>
              <button onClick={() => handleServiceTab('roadside')} className="flex w-full px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 rounded-lg">24/7 Roadside Assist</button>
            </div>

            {/* Compare */}
            <button
              onClick={() => { setActiveTab('compare'); setMobileMenuOpen(false); }}
              className="flex w-full px-4 py-3 text-base font-semibold text-gray-900 hover:bg-gray-50 rounded-xl"
            >
              Compare Cars
            </button>

            {/* Dealers */}
            <button
              onClick={() => { setActiveTab('dealers'); setMobileMenuOpen(false); }}
              className="flex w-full px-4 py-3 text-base font-semibold text-gray-900 hover:bg-gray-50 rounded-xl"
            >
              Our Showrooms
            </button>

            {/* Blog */}
            <button
              onClick={() => handleBlogTab('All')}
              className="flex w-full px-4 py-3 text-base font-semibold text-gray-900 hover:bg-gray-50 rounded-xl"
            >
              Blog & Buying Guides
            </button>

            {/* About & Contact */}
            <button
              onClick={() => { setActiveTab('about'); setMobileMenuOpen(false); }}
              className="flex w-full px-4 py-3 text-base font-semibold text-gray-900 hover:bg-gray-50 rounded-xl"
            >
              About Us
            </button>

            <button
              onClick={() => { setActiveTab('contact'); setMobileMenuOpen(false); }}
              className="flex w-full px-4 py-3 text-base font-semibold text-gray-900 hover:bg-gray-50 rounded-xl"
            >
              Contact Support
            </button>

          </div>
        </div>
      )}
      {/* Sleek simulated Auth Modal with distinct division of accounts */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-white border border-gray-100 rounded-3xl w-full max-w-md p-6 relative shadow-2xl space-y-4 text-left">
            <button
              onClick={() => setLoginModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-950 tracking-tight mt-2">Welcome to VelocityMoto</h3>
              <p className="text-xs text-gray-500">Choose your account division below to proceed</p>
            </div>

            {/* Account Type Tabs */}
            <div className="bg-gray-100 p-1 rounded-xl grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => selectRolePreset('user')}
                className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                  loginRole === 'user'
                    ? 'bg-white text-blue-650 shadow'
                    : 'text-gray-500 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Private User</span>
              </button>
              <button
                type="button"
                onClick={() => selectRolePreset('dealer')}
                className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                  loginRole === 'dealer'
                    ? 'bg-white text-amber-600 shadow'
                    : 'text-gray-500 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Partner Dealer</span>
              </button>
              <button
                type="button"
                onClick={() => selectRolePreset('admin')}
                className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                  loginRole === 'admin'
                    ? 'bg-white text-rose-600 shadow'
                    : 'text-gray-500 hover:text-slate-900'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Staff Admin</span>
              </button>
            </div>

            {/* Access Level description card */}
            <div className={`p-3 rounded-2xl text-[11px] leading-relaxed border ${
              loginRole === 'admin'
                ? 'bg-rose-50 border-rose-100 text-rose-700'
                : loginRole === 'dealer'
                ? 'bg-amber-50 border-amber-100 text-amber-850'
                : 'bg-blue-50 border-blue-105 text-blue-800'
            }`}>
              <span className="font-bold uppercase tracking-wider text-[9px] block mb-1">
                {loginRole === 'admin' ? '🛡️ Administration Privileges' : loginRole === 'dealer' ? '💼 Commercial Dealership Access' : '👤 Customer Account Tier'}
              </span>
              {loginRole === 'admin'
                ? 'Moderator power: inspect pending/flagged listings, verify newly applying dealers, view platform core metrics, and audit user states.'
                : loginRole === 'dealer'
                ? 'Commercial partner panel: post multiple showroom listings, manage dealership profiles, view prospective buyers and access valuation logs.'
                : 'Individual access: save custom vehicle wishlists, track personal mock inquiries, or list a personal car for sale with ease.'}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = (formData.get('name') as string) || loginName;
                const email = (formData.get('email') as string) || loginEmail;
                setUser({ name, email, role: loginRole });
                setLoginModalOpen(false);
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1">Full Name / Business Title</label>
                <input
                  required
                  type="text"
                  name="name"
                  placeholder="e.g. Arthur Pendragon"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-150 rounded-xl text-sm focus:outline-none focus:border-amber-500 text-gray-800 bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1">Email Connection</label>
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="e.g. arthur@kamalot.org"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-150 rounded-xl text-sm focus:outline-none focus:border-amber-500 text-gray-800 bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-450 font-mono mb-1">Passkey Pin</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  defaultValue="secret123"
                  className="w-full px-3 py-2 border border-gray-150 rounded-xl text-sm focus:outline-none focus:border-amber-500 text-gray-800 bg-gray-50/50"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer active:scale-95 text-white ${
                  loginRole === 'admin'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : loginRole === 'dealer'
                    ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                    : 'bg-slate-900 hover:bg-slate-800'
                }`}
              >
                Sign In as {loginRole === 'admin' ? 'Staff Administrator' : loginRole === 'dealer' ? 'Certified Dealer' : 'Private Custom User'}
              </button>
            </form>

            <div className="text-center text-[10px] text-gray-400 font-mono">
              By listing, you agree to our <span className="underline cursor-pointer">Security Inspections Rules</span>.
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
