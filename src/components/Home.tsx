import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search, Shield, BadgePercent, ThumbsUp, MapPin, Gauge, Fuel, Zap, Star, Heart,
  ChevronLeft, ChevronRight, Calendar, MessageSquare, Award, Clock, ArrowRight, NotebookTabs, Coins
} from 'lucide-react';
import { MOCK_BLOGS } from '../data/blogs';
import { Car } from '../types';

interface HomeProps {
  setActiveTab: (tab: string) => void;
  setFilters: (filters: any) => void;
  setSelectedCarsForCompare: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCarsForCompare: string[];
  wishlist: string[];
  setWishlist: React.Dispatch<React.SetStateAction<string[]>>;
  cars: Car[];
  onViewCarDetail: (car: Car) => void;
}

export default function Home({
  setActiveTab,
  setFilters,
  setSelectedCarsForCompare,
  selectedCarsForCompare,
  wishlist,
  setWishlist,
  cars,
  onViewCarDetail
}: HomeProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedBudget, setSelectedBudget] = useState('');

  // Extract unique brands for the hero select dropdown
  const uniqueBrands = Array.from(new Set(cars.map(c => c.brand)));

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveTab('buy');
    setFilters({
      search: searchQuery,
      minPrice: '',
      maxPrice: selectedBudget ? selectedBudget : '',
      bodyType: '',
      fuelType: '',
      isCertified: false,
      isBudget: selectedBudget && parseInt(selectedBudget) <= 1640000 ? true : false,
      brand: selectedBrand
    });
  };

  const handleFeaturedCategoryClick = (type: 'body' | 'fuel' | 'transmission' | 'budget' | 'luxury', val?: string) => {
    setActiveTab('buy');
    setFilters({
      search: type === 'transmission' ? (val || '') : '',
      minPrice: '',
      maxPrice: '',
      bodyType: type === 'body' ? (val || '') : '',
      fuelType: type === 'fuel' ? (val || '') : '',
      isCertified: false,
      isBudget: type === 'budget',
      isLuxury: type === 'luxury',
      brand: ''
    });
  };

  const handleToggleCompare = (carId: string) => {
    setSelectedCarsForCompare(prev => {
      if (prev.includes(carId)) {
        return prev.filter(id => id !== carId);
      }
      if (prev.length >= 3) {
        alert("You can compare up to 3 cars at a time.");
        return prev;
      }
      return [...prev, carId];
    });
  };

  const handleToggleWishlist = (carId: string) => {
    setWishlist(prev => 
      prev.includes(carId) 
        ? prev.filter(id => id !== carId) 
        : [...prev, carId]
    );
  };

  // Top rated/featured cars (Certified first, highest rating)
  const featuredCars = cars.filter(c => c.isCertified).slice(0, 3);
  // Indian pre-owned models for Section 3 — Featured Cars
  const featuredIndianCars = cars.filter(c => !!c.location);

  // EMI Calculator State Inputs
  const [emiVehiclePrice, setEmiVehiclePrice] = useState<number>(950000); // Standard price (e.g. ₹9.5 Lakh Creta)
  const [emiDownPayment, setEmiDownPayment] = useState<number>(190000);  // 20% down payment
  const [emiInterestRate, setEmiInterestRate] = useState<number>(8.5);    // Lowest interest rate starting point
  const [emiTenure, setEmiTenure] = useState<number>(5);                  // 5 Years tenure

  // Dynamic EMI Calculation output
  const calculateEMIOutput = () => {
    const loanAmount = Math.max(0, emiVehiclePrice - emiDownPayment);
    const monthlyRate = (emiInterestRate / 100) / 12;
    const months = emiTenure * 12;

    if (loanAmount <= 0) return 0;
    if (monthlyRate === 0) return Math.round(loanAmount / months);

    const emiValue = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emiValue);
  };

  const calculatedMonthlyEMI = calculateEMIOutput();

  // Carousel Testimonials State
  const [activeReviewIdx, setActiveReviewIdx] = useState<number>(0);

  const customerReviewsList = [
    {
      id: 'rev-1',
      name: 'Arun Kumar',
      location: 'Visakhapatnam',
      carPurchased: 'Hyundai Creta SX (2019)',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      rating: 5,
      reviewText: 'Honestly, I was super skeptical buying a used car, but the 150-point inspection and complete test reports of my Hyundai Creta totally put me at ease. No squeaks, beautiful condition, and on-spot financial approval saved my days!',
      dateBadge: 'Purchased 2 Months Ago'
    },
    {
      id: 'rev-2',
      name: 'Shruti Iyer',
      location: 'Mumbai',
      carPurchased: 'Tata Nexon EV Empress (2021)',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      rating: 5,
      reviewText: 'Got a stellar deal on an electric vehicle. Smooth, transparent processing with zero paperwork hassle. The team in Mumbai showed incredible warmth, explaining battery degradation tests thoroughly. Highly recommended!',
      dateBadge: 'Purchased 1 Month Ago'
    },
    {
      id: 'rev-3',
      name: 'Vikram Rathore',
      location: 'Delhi NCR',
      carPurchased: 'Mahindra XUV500 (2019)',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      rating: 5,
      reviewText: 'Sold my sedan and upgraded to a used XUV500 for highway roadtrips. The easy financing feature took less than 2 hours to clear. The car drives exactly like new and has outstanding high-speed cruise comfort!',
      dateBadge: 'Purchased 3 Weeks Ago'
    },
    {
      id: 'rev-4',
      name: 'Anjali Sharma',
      location: 'Bangalore',
      carPurchased: 'Honda City i-VTEC (2020)',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      rating: 5,
      reviewText: 'Loved the 7-day moneyback guarantee promise. The car was shipped clean and sanitized with all service history sheets neatly filed. Unmatched reliability and premium executive sedan comfort under budget.',
      dateBadge: 'Purchased 4 Months Ago'
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* 1. Hero Section and Search */}
      <section id="hero-banner" className="relative bg-slate-950 overflow-hidden py-28 px-4 sm:px-6 lg:px-8">
        
        {/* Background cinematic overlay representation */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1600"
            alt="Premium sports car background"
            className="w-full h-full object-cover opacity-25 object-center"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-500/10 text-amber-500 border border-amber-500/20 mb-6 font-mono"
          >
            <Shield className="w-3.5 h-3.5" /> Platinum Certified Used Car Marketplace
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4 text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6 uppercase"
          >
            Find Your Perfect<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">
              Pre-Owned Car.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-sans"
          >
            Explore thoroughly inspected pre-owned cars with 1-year warranties, 7-day money-backs, and immediate financial approval.
          </motion.p>

          {/* Search Engine Widget */}
          <motion.form 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onSubmit={handleHeroSearchSubmit}
            className="bg-white p-4 sm:p-5 rounded-2xl shadow-2xl max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-3 text-left border border-gray-100 mb-8"
          >
            <div className="relative">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5">Search Keywords</label>
              <div className="absolute left-3.5 top-[34px] text-gray-400">
                <Search className="w-4.5 h-4.5" />
              </div>
              <input 
                type="text" 
                placeholder="Model, fuel, trans..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-150 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-gray-400 text-gray-800"
              />

              {/* Autocomplete Suggestions */}
              {searchQuery.trim() && (
                <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-150 rounded-2xl shadow-2xl z-40 p-3 max-h-60 overflow-y-auto animate-[fadeIn_0.15s_ease-out]">
                  <div className="text-[9px] font-bold font-mono text-gray-400 uppercase tracking-widest pb-1.5 border-b border-gray-50 mb-1.5">Available In-Stock Cars</div>
                  {cars.filter(car => {
                    const query = searchQuery.toLowerCase().trim();
                    const brand = car.brand.toLowerCase();
                    const model = car.model.toLowerCase();
                    const combo = `${brand} ${model}`;
                    const words = query.split(/\s+/).filter(Boolean);
                    const matchesWords = words.length > 1 && words.every(w =>
                      brand.includes(w) || model.includes(w) || car.fuelType.toLowerCase().includes(w) || car.transmission.toLowerCase().includes(w)
                    );
                    return brand.includes(query) || model.includes(query) || combo.includes(query) || query.includes(brand) || query.includes(model) || matchesWords;
                  }).length === 0 ? (
                    <p className="text-[11px] text-gray-500 py-1.5 text-center font-medium">No matches found</p>
                  ) : (
                    <div className="space-y-1.5">
                      {cars.filter(car => {
                        const query = searchQuery.toLowerCase().trim();
                        const brand = car.brand.toLowerCase();
                        const model = car.model.toLowerCase();
                        const combo = `${brand} ${model}`;
                        const words = query.split(/\s+/).filter(Boolean);
                        const matchesWords = words.length > 1 && words.every(w =>
                          brand.includes(w) || model.includes(w) || car.fuelType.toLowerCase().includes(w) || car.transmission.toLowerCase().includes(w)
                        );
                        return brand.includes(query) || model.includes(query) || combo.includes(query) || query.includes(brand) || query.includes(model) || matchesWords;
                      }).slice(0, 4).map(car => (
                        <button
                          key={car.id}
                          type="button"
                          onClick={() => {
                            setActiveTab('buy');
                            setFilters({
                              search: `${car.brand} ${car.model}`,
                              minPrice: '',
                              maxPrice: '',
                              bodyType: '',
                              fuelType: '',
                              isCertified: false,
                              isBudget: false,
                              isLuxury: false,
                              brand: ''
                            });
                            setSearchQuery('');
                          }}
                          className="w-full flex items-center justify-between p-1.5 hover:bg-amber-50 rounded-xl transition-all text-left cursor-pointer group/item border border-transparent hover:border-amber-100"
                        >
                          <div className="flex items-center space-x-2">
                            <img src={car.image} alt={car.model} className="w-9 h-7 object-cover rounded-md border" referrerPolicy="no-referrer" />
                            <div className="max-w-[125px] truncate">
                              <h4 className="text-[11px] font-black text-gray-800 group-hover/item:text-amber-600 truncate">{car.brand} {car.model}</h4>
                              <p className="text-[9px] text-gray-400 font-mono">{car.year} • {car.fuelType}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-bold text-slate-900 block">₹{car.price.toLocaleString('en-IN')}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5">Select Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-155 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition-colors text-gray-750 cursor-pointer"
              >
                <option value="">All Brands</option>
                {uniqueBrands.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5">Max Budget</label>
              <select
                value={selectedBudget}
                onChange={(e) => setSelectedBudget(e.target.value)}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-155 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition-colors text-gray-750 cursor-pointer"
              >
                <option value="">Any Budget</option>
                <option value="1230000">Under ₹12.3 Lakhs</option>
                <option value="1640000">Under ₹16.4 Lakhs</option>
                <option value="2460000">Under ₹24.6 Lakhs</option>
                <option value="4100000">Under ₹41 Lakhs</option>
              </select>
            </div>

            <div className="flex items-end">
              <button 
                type="submit"
                className="w-full py-2.5 px-6 bg-amber-505 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold tracking-wide rounded-xl uppercase text-xs transition-colors shadow-md flex items-center justify-center space-x-1 cursor-pointer"
              >
                <span>Find Matches</span>
              </button>
            </div>
          </motion.form>

          {/* Core Navigation Call To Actions */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center justify-center gap-4 mt-6"
          >
            <button
              onClick={() => {
                setActiveTab('buy');
                setFilters({
                  search: '',
                  minPrice: '',
                  maxPrice: '',
                  bodyType: '',
                  fuelType: '',
                  isCertified: false,
                  isBudget: false,
                  isLuxury: false,
                  brand: ''
                });
              }}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg active:scale-95"
            >
              Buy Car
            </button>
            
            <button
              onClick={() => setActiveTab('sell')}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg border border-slate-800 active:scale-95"
            >
              Sell Car
            </button>
          </motion.div>

        </div>
      </section>

      {/* 3. Search by Category Bento Grid */}
      <section id="categories-grid" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 font-mono">Curated Inventory</span>
              <h2 className="text-2xl sm:text-3.5xl font-black text-slate-950 tracking-tight mt-1">Explore Popular Car Types</h2>
            </div>
            <button 
              onClick={() => handleFeaturedCategoryClick('body', '')}
              className="mt-2 sm:mt-0 text-sm font-bold text-slate-800 hover:text-amber-600 transition-colors uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            >
              <span>View All Inventory &rarr;</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            
            {/* SUVs */}
            <div 
              onClick={() => handleFeaturedCategoryClick('body', 'SUV')}
              className="group relative h-44 rounded-2xl overflow-hidden shadow-sm cursor-pointer border border-gray-100 bg-white"
            >
              <img 
                src="https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&q=80&w=400" 
                alt="SUVs" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-left text-white">
                <span className="text-[9px] font-bold tracking-widest font-mono text-amber-400 uppercase">Class-Leading</span>
                <h3 className="text-sm font-black tracking-tight leading-tight mt-0.5">SUVs</h3>
              </div>
            </div>

            {/* Sedans */}
            <div 
              onClick={() => handleFeaturedCategoryClick('body', 'Sedan')}
              className="group relative h-44 rounded-2xl overflow-hidden shadow-sm cursor-pointer border border-gray-100 bg-white"
            >
              <img 
                src="https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=400" 
                alt="Sedans" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-left text-white">
                <span className="text-[9px] font-bold tracking-widest font-mono text-amber-400 uppercase">Sleek Design</span>
                <h3 className="text-sm font-black tracking-tight leading-tight mt-0.5">Sedans</h3>
              </div>
            </div>

            {/* Hatchbacks */}
            <div 
              onClick={() => handleFeaturedCategoryClick('body', 'Hatchback')}
              className="group relative h-44 rounded-2xl overflow-hidden shadow-sm cursor-pointer border border-gray-100 bg-white"
            >
              <img 
                src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=400" 
                alt="Hatchbacks" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-left text-white">
                <span className="text-[9px] font-bold tracking-widest font-mono text-amber-400 uppercase">Urban</span>
                <h3 className="text-sm font-black tracking-tight leading-tight mt-0.5">Hatchbacks</h3>
              </div>
            </div>

            {/* Luxury */}
            <div 
              onClick={() => handleFeaturedCategoryClick('luxury')}
              className="group relative h-44 rounded-2xl overflow-hidden shadow-sm cursor-pointer border border-gray-100 bg-white"
            >
              <img 
                src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=400" 
                alt="Luxury" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-left text-white">
                <span className="text-[9px] font-bold tracking-widest font-mono text-amber-400 uppercase">Premium</span>
                <h3 className="text-sm font-black tracking-tight leading-tight mt-0.5">Luxury</h3>
              </div>
            </div>

            {/* Automatic */}
            <div 
              onClick={() => handleFeaturedCategoryClick('transmission', 'Automatic')}
              className="group relative h-44 rounded-2xl overflow-hidden shadow-sm cursor-pointer border border-gray-100 bg-white"
            >
              <img 
                src="https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&q=80&w=400" 
                alt="Automatic Gear" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-left text-white">
                <span className="text-[9px] font-bold tracking-widest font-mono text-amber-400 uppercase">Seamless</span>
                <h3 className="text-sm font-black tracking-tight leading-tight mt-0.5">Automatic</h3>
              </div>
            </div>

            {/* Budget Cars */}
            <div 
              onClick={() => handleFeaturedCategoryClick('budget')}
              className="group relative h-44 rounded-2xl overflow-hidden shadow-sm cursor-pointer border border-gray-100 bg-white"
            >
              <img 
                src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400" 
                alt="Budget Cars" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-left text-white">
                <span className="text-[9px] font-bold tracking-widest font-mono text-amber-400 uppercase">Under ₹16.4L</span>
                <h3 className="text-sm font-black tracking-tight leading-tight mt-0.5">Budget Cars</h3>
              </div>
            </div>

            {/* Electric Cars */}
            <div 
              onClick={() => handleFeaturedCategoryClick('fuel', 'Electric')}
              className="group relative h-44 rounded-2xl overflow-hidden shadow-sm cursor-pointer border border-gray-100 bg-white"
            >
              <img 
                src="https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=400" 
                alt="Electric Cars" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-950/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4 text-left text-white">
                <span className="text-[9px] font-bold tracking-widest font-mono text-teal-400 uppercase">Eco Electric</span>
                <h3 className="text-sm font-black tracking-tight leading-tight mt-0.5">Electric Cars</h3>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Special Offers and Promotions */}
      <section id="promo-banner-section" className="py-6 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 sm:p-10 text-slate-950 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-md">
            {/* Decors */}
            <div className="absolute right-0 bottom-0 w-64 h-64 rounded-full bg-amber-400/20 translate-x-20 translate-y-20 blur-2xl"></div>
            
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <span className="inline-block px-2.5 py-1 bg-slate-950 text-white text-[10px] font-bold rounded-md font-mono tracking-wider uppercase mb-1">June Mega Sale Promo</span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">Special Offer: 0% APR Financing for up to 24 Months!</h3>
              <p className="text-sm font-medium text-slate-900/80">Select Certified Premium and Electric models qualify if compiled before June 15th. Check eligibility now.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => { setActiveTab('finance'); }} 
                className="px-6 py-3 bg-slate-950 hover:bg-slate-900 text-white font-bold tracking-wider text-xs uppercase rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Apply for Loan
              </button>
              <button 
                onClick={() => {
                  setActiveTab('buy');
                  setFilters({
                    search: '',
                    minPrice: '',
                    maxPrice: '',
                    bodyType: '',
                    fuelType: '',
                    isCertified: true,
                    isBudget: false,
                    isLuxury: false,
                    brand: ''
                  });
                }} 
                className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-950 font-bold tracking-wider text-xs uppercase rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Browse Qualifying
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3 — Featured Cars */}
      <section id="section-featured-cars" className="py-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-md">Spotlight Premium Inventory</span>
              <h2 className="text-2xl sm:text-4.5xl font-black text-slate-950 tracking-tight mt-3 uppercase">Featured Cars</h2>
              <p className="text-sm text-gray-500 mt-2 max-w-xl font-sans">
                Explore hand-selected certified models with verified locations, complete registration records, and ready-to-test drive status.
              </p>
            </div>
            <button 
              onClick={() => {
                setActiveTab('buy');
                setFilters({
                  search: '',
                  minPrice: '',
                  maxPrice: '',
                  bodyType: '',
                  fuelType: '',
                  isCertified: false,
                  isBudget: false,
                  isLuxury: false,
                  brand: ''
                });
              }}
              className="mt-4 sm:mt-0 px-6 py-3 bg-slate-950 hover:bg-amber-500 hover:text-slate-950 transition-colors duration-200 text-white font-black uppercase text-xs tracking-wider rounded-xl shadow-md cursor-pointer active:scale-95"
            >
              See All Inventory &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredIndianCars.map(car => {
              const isAddedToCompare = selectedCarsForCompare.includes(car.id);
              return (
                <div 
                  key={car.id} 
                  id={`featured-${car.id}`}
                  onClick={() => onViewCarDetail(car)}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-150/70 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group relative cursor-pointer"
                >
                  {/* Positionable Image Wrapper */}
                  <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                    <img 
                      src={car.image} 
                      alt={`${car.brand} ${car.model}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Platinum Certified Seal */}
                    {car.isCertified && (
                      <div className="absolute top-4 left-4 bg-red-600 text-white font-mono text-[9px] font-black tracking-widest px-3 py-1 rounded-lg uppercase shadow-lg flex items-center gap-1.5">
                        <Star className="w-3 h-3 fill-white stroke-none animate-pulse" />
                        <span>Certified</span>
                      </div>
                    )}

                    {/* Quick Wishlist Spark */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleWishlist(car.id);
                      }}
                      className={`absolute top-4 right-4 p-2.5 rounded-xl backdrop-blur-md transition-all shadow-md cursor-pointer flex items-center justify-center ${
                        wishlist.includes(car.id)
                          ? 'bg-rose-500 text-white hover:bg-rose-600'
                          : 'bg-black/45 text-white hover:bg-black/60'
                      }`}
                      title={wishlist.includes(car.id) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart className={`w-4 h-4 ${wishlist.includes(car.id) ? 'fill-current' : ''}`} />
                    </button>

                    {/* Quick Compare Trigger Tag */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleCompare(car.id);
                      }}
                      className={`absolute bottom-4 left-4 p-2 py-1 text-[9px] font-bold tracking-widest uppercase bg-slate-900/80 text-white backdrop-blur-sm rounded-lg hover:bg-amber-500 hover:text-slate-950 transition-all shadow-md cursor-pointer ${
                        isAddedToCompare ? '!bg-amber-500 !text-slate-950' : ''
                      }`}
                    >
                      {isAddedToCompare ? '✓ In Compare' : '+ Compare'}
                    </button>

                    {/* Fuel Type & Transmission ribbon */}
                    <div className="absolute bottom-4 right-4 bg-slate-900/80 text-white text-[9px] uppercase font-mono tracking-widest font-black px-2.5 py-1 rounded-lg backdrop-blur-sm">
                      {car.fuelType} • {car.transmission}
                    </div>
                  </div>

                  {/* Body Content card details */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-mono font-bold text-slate-400">{car.year} Model</span>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-amber-500 stroke-none" />
                        <span className="text-xs font-black text-gray-755 font-mono">{car.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-extrabold text-slate-950 tracking-tight leading-tight group-hover:text-amber-600 transition-colors duration-200">
                      {car.brand} {car.model}
                    </h3>

                    {/* Real-time Location Indicator */}
                    <div className="flex items-center gap-1 text-gray-400 mt-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-xs font-medium text-slate-500">{car.location || 'Pan-India Distribution'}</span>
                    </div>

                    {/* Specifications row as required: Year, Fuel, KM driven */}
                    <div className="flex items-center justify-between mt-4 mb-5 border-t border-b border-slate-100 py-3 text-xs text-slate-600 font-sans font-semibold">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400 font-normal">Year:</span>
                        <span>{car.year}</span>
                      </div>
                      <div className="flex items-center gap-1 border-l border-slate-150 pl-2">
                        <span className="text-slate-400 font-normal">Fuel:</span>
                        <span>{car.fuelType}</span>
                      </div>
                      <div className="flex items-center gap-1 border-l border-slate-150 pl-2">
                        <span className="text-slate-400 font-normal">Driven:</span>
                        <span className="text-slate-900">{car.mileage.toLocaleString()} KM</span>
                      </div>
                    </div>

                    {/* Price and View Details block */}
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <div>
                        <span className="block text-[9px] text-gray-400 font-mono tracking-widest uppercase mb-0.5 font-semibold">Assured Price</span>
                        <span className="text-2xl font-black text-slate-950 font-sans tracking-tight">
                          {car.formattedPrice || `₹${car.price.toLocaleString('en-IN')}`}
                        </span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewCarDetail(car);
                        }}
                        className="py-2.5 px-5 bg-amber-500 hover:bg-amber-600 hover:scale-[1.02] transition-colors text-slate-950 font-black uppercase tracking-wider text-xs rounded-xl cursor-pointer shadow-md duration-100 font-sans"
                      >
                        View Details
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 4 — Why Choose Us */}
      <section id="section-why-choose-us" className="py-20 bg-white border-b border-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 bg-amber-500/10 px-3 py-1.5 rounded-full">
              Trust & Transparency
            </span>
            <h2 className="text-2xl sm:text-4.5xl font-black text-slate-950 tracking-tight mt-4 uppercase">
              Why Choose Us
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mt-2 font-sans">
              At Kamalot Cars, we make pre-owned transactions as transparent, secure, and hassle-free as purchasing a brand-new vehicle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Block 1: Verified Cars */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100/50 hover:bg-slate-100/45 hover:shadow-md transition-all duration-300 flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-6 shadow-sm">
                <Shield className="w-7 h-7 stroke-[2]" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-950 tracking-tight mb-2">Verified Cars</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans mb-3">
                Every vehicle in our catalog passes structural background audits, registration histories checks, and includes full title certifications. No hidden liabilities, ever.
              </p>
              <ul className="text-xs font-bold text-slate-700 space-y-1.5 mt-auto">
                <li className="flex items-center gap-1.5 text-amber-600">
                  <span className="text-amber-500">✓</span> 150-Point Certified Tag
                </li>
                <li className="flex items-center gap-1.5 text-amber-600">
                  <span className="text-amber-500">✓</span> Clean Title Guarantee
                </li>
              </ul>
            </div>

            {/* Block 2: Free Inspection */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100/50 hover:bg-slate-100/45 hover:shadow-md transition-all duration-300 flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center mb-6 shadow-sm">
                <Gauge className="w-7 h-7 stroke-[2]" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-950 tracking-tight mb-2">Free Inspection</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans mb-3">
                Access comprehensive mechanical inspection reports absolutely free. Download diagnostic charts detailing transmission, suspension, and braking performance.
              </p>
              <ul className="text-xs font-bold text-slate-700 space-y-1.5 mt-auto">
                <li className="flex items-center gap-1.5 text-teal-600">
                  <span className="text-teal-500">✓</span> Free Diagnostics Report
                </li>
                <li className="flex items-center gap-1.5 text-teal-600">
                  <span className="text-teal-500">✓</span> Master Mechanics Evaluated
                </li>
              </ul>
            </div>

            {/* Block 3: Easy Financing */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100/50 hover:bg-slate-100/45 hover:shadow-md transition-all duration-300 flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-6 shadow-sm">
                <BadgePercent className="w-7 h-7 stroke-[2]" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-950 tracking-tight mb-2">Easy Financing</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans mb-3">
                Secure immediate financing approval with options catering to various credit scores. Low-interest rates and flexible tenures make pre-owned pricing even better.
              </p>
              <ul className="text-xs font-bold text-slate-700 space-y-1.5 mt-auto">
                <li className="flex items-center gap-1.5 text-blue-600">
                  <span className="text-blue-500">✓</span> Immediate Approval Desk
                </li>
                <li className="flex items-center gap-1.5 text-blue-600">
                  <span className="text-blue-500">✓</span> Zero Down-Payment Options
                </li>
              </ul>
            </div>

            {/* Block 4: Secure Payments */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100/50 hover:bg-slate-100/45 hover:shadow-md transition-all duration-300 flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-pink-500/10 text-pink-600 flex items-center justify-center mb-6 shadow-sm">
                <ThumbsUp className="w-7 h-7 stroke-[2]" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-950 tracking-tight mb-2">Secure Payments</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-sans mb-3">
                All transactions are encrypted and processed through fully secure escrow gateways. Your deposits are guarded by our verified 7-day moneyback guarantee.
              </p>
              <ul className="text-xs font-bold text-slate-700 space-y-1.5 mt-auto">
                <li className="flex items-center gap-1.5 text-pink-600">
                  <span className="text-pink-500">✓</span> Encrypted Escrow Accounts
                </li>
                <li className="flex items-center gap-1.5 text-pink-600">
                  <span className="text-pink-500">✓</span> 7-Day Refund Policy
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* Section 5 — Sell Your Car */}
      <section id="section-sell-car" className="py-20 bg-slate-950 text-white relative overflow-hidden">
        
        {/* Background ambient accents */}
        <div className="absolute inset-0 z-0 opacity-10">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left side: content */}
            <div className="lg:col-span-5 text-left">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full">
                Guaranteed Highest Appraisal
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.1] mt-5 uppercase">
                Sell Your Car
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed font-sans">
                Ready for an upgrade? Sell your current vehicle to us and receive competitive, market-best valuations in minutes. Zero middleman fees, secure transfers, and completely free commercial pick-up.
              </p>
              
              <div className="mt-8">
                <button
                  onClick={() => setActiveTab('sell')}
                  className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-lg active:scale-95 duration-150 inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            </div>

            {/* Right side: 3 steps visualization */}
            <div className="lg:col-span-7">
              <div className="bg-slate-900/60 border border-slate-800 p-8 sm:p-10 rounded-3xl backdrop-blur-sm self-stretch">
                <h3 className="text-2xl font-black tracking-tight mb-8 text-white uppercase text-left">
                  Sell Your Car in 3 Easy Steps
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                  
                  {/* Step 1 */}
                  <div className="flex flex-col items-start text-left relative group">
                    <span className="text-6xl font-black text-amber-500/15 group-hover:text-amber-500/30 transition-colors pointer-events-none absolute -top-5 -left-1 font-mono">1</span>
                    <div className="z-10 mt-2">
                      <h4 className="text-lg font-extrabold text-white tracking-tight mb-1">Instant Appraisal</h4>
                      <p className="text-[11px] sm:text-xs text-slate-400 font-sans leading-relaxed">
                        Input registration parameters online to receive a highly precise instant price evaluation matching prevailing local market indices.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex flex-col items-start text-left relative group">
                    <span className="text-6xl font-black text-amber-500/15 group-hover:text-amber-500/30 transition-colors pointer-events-none absolute -top-5 -left-1 font-mono">2</span>
                    <div className="z-10 mt-2">
                      <h4 className="text-lg font-extrabold text-white tracking-tight mb-1">Free Door Inspection</h4>
                      <p className="text-[11px] sm:text-xs text-slate-400 font-sans leading-relaxed">
                        Schedule an inspection wherever you are. An expert mobile supervisor evaluates engine health and cosmetics on-site at zero cost.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex flex-col items-start text-left relative group">
                    <span className="text-6xl font-black text-amber-500/15 group-hover:text-amber-500/30 transition-colors pointer-events-none absolute -top-5 -left-1 font-mono">3</span>
                    <div className="z-10 mt-2">
                      <h4 className="text-lg font-extrabold text-white tracking-tight mb-1">Instant Payment</h4>
                      <p className="text-[11px] sm:text-xs text-slate-400 font-sans leading-relaxed">
                        Agree upon the final price and enjoy instant banks transfer before keys exchange. We manage all RTO and transfer paperwork for free.
                      </p>
                    </div>
                  </div>

                </div>

                <div className="mt-8 pt-6 border-t border-slate-800 text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span>Average selling cycle: **under 24 hours** from submission</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-400 font-mono tracking-widest uppercase">Verified by 5,000+ Sellers</span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Section 6 — Finance & EMI */}
      <section id="section-finance-emi" className="py-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-blue-600 bg-blue-500/10 px-3 py-1.5 rounded-full">
              Seamless Finance Desk
            </span>
            <h2 className="text-2xl sm:text-4.5xl font-black text-slate-950 tracking-tight mt-4 uppercase">
              Finance & EMI
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mt-2 font-sans">
              Take the stress out of budgeting. Calculate monthly payouts instantly and access low-interest pre-owned auto credit lines with our prime lending partners.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left side: EMI calculator card */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-3xl border border-gray-150 shadow-sm">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-950 uppercase tracking-tight">Interactive EMI Calculator</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Quick approximate loan schedule simulation tool</p>
                </div>
                <div className="text-right">
                  <span className="block text-[8px] font-mono tracking-widest uppercase text-slate-400 font-bold">Prime Rate Starts At</span>
                  <span className="text-lg font-black text-teal-600 font-mono">7.9%* p.a.</span>
                </div>
              </div>

              <div className="space-y-6">
                
                {/* Car Price */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-black uppercase text-slate-700 tracking-wide">Vehicle Valuation (₹)</label>
                    <span className="text-sm font-black text-slate-950 font-mono">₹{(emiVehiclePrice / 100000).toFixed(2)} Lakhs <span className="text-xs text-gray-400 font-normal">({emiVehiclePrice.toLocaleString()})</span></span>
                  </div>
                  <input 
                    type="range" 
                    min={300000} 
                    max={5000000} 
                    step={25000}
                    value={emiVehiclePrice} 
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setEmiVehiclePrice(val);
                      // Auto-adjust downpayment if it exceeds price
                      if (emiDownPayment >= val) {
                        setEmiDownPayment(Math.round(val * 0.2));
                      }
                    }}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
                    <span>₹3L</span>
                    <span>₹25L</span>
                    <span>₹50L</span>
                  </div>
                </div>

                {/* Down Payment */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-xs font-black uppercase text-slate-700 tracking-wide">Down Payment (₹)</label>
                    <span className="text-sm font-black text-slate-950 font-mono">₹{(emiDownPayment / 100000).toFixed(2)} Lakhs <span className="text-xs text-gray-400 font-normal">({Math.round((emiDownPayment / emiVehiclePrice) * 100)}%)</span></span>
                  </div>
                  <input 
                    type="range" 
                    min={0} 
                    max={emiVehiclePrice - 50000} 
                    step={10000}
                    value={emiDownPayment} 
                    onChange={(e) => setEmiDownPayment(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
                    <span>₹0</span>
                    <span>Max {((emiVehiclePrice - 50000)/100000).toFixed(1)}L</span>
                  </div>
                </div>

                {/* Grid Inputs for Rate and Tenure */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Interest rate with direct input indicator */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-xs font-black uppercase text-slate-700 tracking-wide">Interest Rate (% p.a.)</label>
                      <span className="text-sm font-black text-slate-950 font-mono">{emiInterestRate.toFixed(2)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min={7.9} 
                      max={18.0} 
                      step={0.1}
                      value={emiInterestRate} 
                      onChange={(e) => setEmiInterestRate(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-teal-600"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
                      <span>7.9% (Prime)</span>
                      <span>18%</span>
                    </div>
                  </div>

                  {/* Loan Tenure years select */}
                  <div>
                    <label className="block text-xs font-black uppercase text-slate-700 tracking-wide mb-2">Loan Tenure Period</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[3, 5, 7].map((yr) => (
                        <button
                          key={yr}
                          type="button"
                          onClick={() => setEmiTenure(yr)}
                          className={`py-2 text-xs font-black rounded-xl font-mono border transition-all cursor-pointer ${
                            emiTenure === yr 
                              ? 'bg-slate-950 border-slate-950 text-white shadow-md' 
                              : 'bg-white border-gray-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {yr} Yrs
                        </button>
                      ))}
                      {/* Short summary label */}
                      <div className="flex items-center justify-center text-[10px] font-bold text-gray-400 font-mono">
                        {emiTenure * 12} Mos
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Dynamic summary block output */}
              <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-slate-150 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block font-semibold">Estimated Installment</span>
                  <span className="text-3xl font-black text-slate-950 font-mono">₹{calculatedMonthlyEMI.toLocaleString()}<span className="text-sm font-normal text-gray-500"> / month</span></span>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('finance');
                    // auto fill custom finance request context if applicable
                  }}
                  className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-md inline-flex items-center gap-1.5"
                >
                  Apply For Funding
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Right side: Bank partners & lowest interest rates highlights */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Box 1: Rates highliner */}
              <div className="p-8 rounded-3xl bg-teal-950 text-white border border-teal-800 relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 w-44 h-44 bg-teal-600 rounded-full opacity-10 blur-xl"></div>
                <div className="w-12 h-12 bg-teal-600/20 text-teal-400 rounded-2xl flex items-center justify-center mb-6">
                  <Coins className="w-6 h-6" />
                </div>
                <span className="text-[9px] font-mono font-black uppercase tracking-widest text-teal-400">Lowest Interest Rates</span>
                <h4 className="text-3xl font-black mt-1 leading-tight uppercase font-sans">Starting from 7.9%* p.a.</h4>
                <p className="text-xs text-teal-200/80 leading-relaxed mt-2 font-sans">
                  Benefit from our preferred tier status with top financial conglomerates to unlock zero processing fees, minimal document cycles, and prompt disbursals.
                </p>
                <div className="mt-4 pt-4 border-t border-teal-800 text-[10px] text-teal-300 font-mono">
                  *T&C apply. Rate based on credit history credit scores.
                </div>
              </div>

              {/* Box 2: Premium Loan Partners */}
              <div className="p-8 bg-white border border-gray-150 rounded-3xl shadow-sm">
                <span className="text-[9px] font-mono font-black uppercase tracking-widest text-gray-400 block mb-4">Official Banking Partners</span>
                
                <h4 className="text-lg font-black text-slate-900 tracking-tight leading-snug mb-5 uppercase text-left">Trusted Financial Partners</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* HDFC Partner card */}
                  <div className="p-3 border border-gray-100 rounded-2xl bg-slate-50 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-extrabold text-blue-900 tracking-tight">HDFC BANK</span>
                    <span className="text-[9px] font-mono text-gray-450 mt-1">Rates from 8.1%*</span>
                  </div>

                  {/* ICICI Partner card */}
                  <div className="p-3 border border-gray-100 rounded-2xl bg-slate-50 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-extrabold text-amber-700 tracking-tight">ICICI Bank</span>
                    <span className="text-[9px] font-mono text-gray-450 mt-1">Rates from 8.25%*</span>
                  </div>

                  {/* IDFC Partner card */}
                  <div className="p-3 border border-gray-100 rounded-2xl bg-slate-50 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-extrabold text-rose-800 tracking-tight">IDFC FIRST</span>
                    <span className="text-[9px] font-mono text-gray-450 mt-1">Rates from 7.9%*</span>
                  </div>

                  {/* Kotak Partner card */}
                  <div className="p-3 border border-gray-100 rounded-2xl bg-slate-50 flex flex-col items-center justify-center text-center">
                    <span className="text-sm font-extrabold text-red-900 tracking-tight">KOTAK BANK</span>
                    <span className="text-[9px] font-mono text-gray-450 mt-1">Rates from 8.4%*</span>
                  </div>

                </div>

                <p className="text-[11px] text-gray-400 leading-relaxed font-sans mt-5 text-center">
                  Enjoy custom loan matching engine comparisons inside our finances tab.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Section 7 — Customer Reviews */}
      <section id="section-reviews" className="py-20 bg-white border-b border-gray-100 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 bg-amber-500/10 px-3 py-1.5 rounded-full">
              Satisfied Buyers Hub
            </span>
            <h2 className="text-2xl sm:text-4.5xl font-black text-slate-950 tracking-tight mt-4 uppercase">
              Customer Reviews
            </h2>
            <p className="text-sm text-gray-500 mt-2 font-sans">
              Thousands of happy journeys began right here. Read verified owner journals after full delivery.
            </p>
          </div>

          {/* Testimonial Active Slider View */}
          <div className="relative bg-slate-50 border border-slate-150/60 p-8 sm:p-12 rounded-3xl shadow-sm overflow-hidden min-h-[300px] flex flex-col justify-between">
            
            {/* Quote visual element background decoration */}
            <div className="absolute -top-6 -left-4 text-slate-200/60 text-9xl font-serif select-none pointer-events-none font-black">“</div>

            <div className="relative z-10">
              
              <div className="flex items-center gap-1 mb-5">
                {Array.from({ length: customerReviewsList[activeReviewIdx].rating }).map((_, rIdx) => (
                  <Star key={rIdx} className="w-5 h-5 fill-amber-500 stroke-none" />
                ))}
              </div>

              <blockquote className="text-base sm:text-lg text-slate-800 leading-relaxed font-medium italic font-sans text-left">
                "{customerReviewsList[activeReviewIdx].reviewText}"
              </blockquote>

            </div>

            {/* Buyer profile bottom strip */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-8 mt-8 border-t border-slate-200/80">
              <div className="flex items-center gap-4 text-left">
                <img 
                  src={customerReviewsList[activeReviewIdx].image} 
                  alt={customerReviewsList[activeReviewIdx].name} 
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-base font-black text-slate-950 tracking-tight leading-snug">
                    {customerReviewsList[activeReviewIdx].name}
                  </h4>
                  <span className="text-xs font-semibold text-slate-500 font-sans block mt-0.5">
                    Verified Buyer from {customerReviewsList[activeReviewIdx].location}
                  </span>
                  <p className="text-[10px] font-mono text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-md inline-block font-bold mt-1.5 uppercase">
                    Purchased: {customerReviewsList[activeReviewIdx].carPurchased}
                  </p>
                </div>
              </div>

              {/* Slider controllers layout inside card bottom row */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveReviewIdx(prev => (prev === 0 ? customerReviewsList.length - 1 : prev - 1))}
                  className="w-11 h-11 bg-white hover:bg-slate-950 hover:text-white rounded-full border border-gray-200 flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <span className="text-xs font-bold font-mono text-slate-400">
                  {activeReviewIdx + 1} / {customerReviewsList.length}
                </span>

                <button
                  type="button"
                  onClick={() => setActiveReviewIdx(prev => (prev === customerReviewsList.length - 1 ? 0 : prev + 1))}
                  className="w-11 h-11 bg-white hover:bg-slate-950 hover:text-white rounded-full border border-gray-200 flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Section 8 — Latest Blog Articles */}
      <section id="section-latest-blogs" className="py-20 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-md">
                Resource Center Guides
              </span>
              <h2 className="text-2xl sm:text-4.5xl font-black text-slate-950 tracking-tight mt-3 uppercase">
                Latest Blog Articles
              </h2>
              <p className="text-sm text-gray-500 mt-2 max-w-xl font-sans">
                Stay updated with insights, buying parameters, comparison sheets, and professional maintenance advice curated by our engineering desk.
              </p>
            </div>
            <button 
              onClick={() => {
                setActiveTab('blog');
              }}
              className="mt-4 sm:mt-0 px-6 py-3 bg-slate-950 hover:bg-amber-600 hover:text-slate-950 transition-colors text-white font-black uppercase text-xs tracking-wider rounded-xl shadow-md cursor-pointer active:scale-95 duration-150"
            >
              Browse Resource Hub &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Filter targeted MOCK_BLOGS for special display titles */}
            {MOCK_BLOGS.slice(4, 7).map((blog) => (
              <article 
                key={blog.id}
                className="bg-white rounded-3xl overflow-hidden border border-gray-150 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group"
              >
                {/* Visual Cover image */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-100">
                  <img 
                    src={blog.image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-slate-950/75 text-white backdrop-blur-sm text-[9px] font-bold font-mono tracking-widest uppercase px-2.5 py-1 rounded-md">
                    {blog.category}
                  </div>
                </div>

                {/* Article textual details */}
                <div className="p-6 flex-1 flex flex-col text-left">
                  <div className="flex items-center gap-3 text-slate-400 text-xs font-mono mb-2.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {blog.date}
                    </span>
                    <span>•</span>
                    <span>{blog.readTime}</span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-950 tracking-tight leading-tight group-hover:text-amber-600 transition-colors duration-150 mb-3">
                    {blog.title}
                  </h3>

                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-sans mb-5 line-clamp-3">
                    {blog.summary}
                  </p>

                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-450 uppercase tracking-wide font-mono">By {blog.author}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('blog');
                        // Expand the article in detail if desired
                      }}
                      className="text-xs font-bold text-slate-955 hover:text-amber-600 transition-colors tracking-wide flex items-center gap-1"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </article>
            ))}

          </div>

        </div>
      </section>

      {/* Floating Compare Action Bar if cars preselected */}
      {selectedCarsForCompare.length > 0 && (
        <div id="compare-indicator" className="fixed bottom-6 right-6 z-40 bg-white border border-gray-100 shadow-2xl rounded-2xl p-4 flex items-center space-x-4 max-w-md animate-bounce-short">
          <div className="flex -space-x-2">
            {selectedCarsForCompare.map(id => {
              const item = cars.find(c => c.id === id);
              return item ? (
                <img 
                  key={id}
                  src={item.image} 
                  alt={item.model} 
                  className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-sm bg-gray-50"
                  title={`${item.brand} ${item.model}`}
                />
              ) : null;
            })}
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900">{selectedCarsForCompare.length} Car{selectedCarsForCompare.length > 1 ? 's' : ''} Selected</p>
            <p className="text-[10px] text-gray-400 font-mono">Ready to compare specifications side-by-side</p>
          </div>
          <button 
            onClick={() => setActiveTab('compare')}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold tracking-wider uppercase text-[10px] rounded-xl transition-all shadow cursor-pointer active:scale-95"
          >
            Compare Now
          </button>
        </div>
      )}

    </div>
  );
}
