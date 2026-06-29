/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import BuyCars from './components/BuyCars';
import SellCar from './components/SellCar';
import CompareCars from './components/CompareCars';
import Finance from './components/Finance';
import Dealers from './components/Dealers';
import Services from './components/Services';
import AboutContact from './components/AboutContact';
import BlogMain from './components/Blog';
import UserDashboard from './components/UserDashboard';
import DealerDashboard from './components/DealerDashboard';
import AdminDashboard from './components/AdminDashboard';
import { MOCK_CARS } from './data/cars';
import { Car } from './types';
import { API_BASE_URL } from './config';
import { Shield, Sparkles, MapPin, Phone, Mail, Award, CarFront, Facebook, Twitter, Instagram, Smartphone } from 'lucide-react';

export default function App() {
  // Shared inventory of cars
  const [cars, setCars] = useState<Car[]>(MOCK_CARS);

  useEffect(() => {
    const loadCars = async () => {
      try {
        const url = `${API_BASE_URL}/api/cars`;
        console.log('Loading cars from:', url);
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch cars: ${response.status}`);
        const data = await response.json();
        console.log('Loaded cars count:', data.length);
        setCars(data);
      } catch (error) {
        console.error('Could not load cars from backend:', error);
        console.log('Using mock cars as fallback');
      }
    };

    loadCars();
  }, []);

  // Navigation states
  const [activeTab, setActiveTab] = useState<string>('home');
  const [financeSubTab, setFinanceSubTab] = useState<string>('calculator');
  const [serviceSubTab, setServiceSubTab] = useState<string>('rc-transfer');
  const [blogCategoryFilter, setBlogCategoryFilter] = useState<string>('All');

  // Shared Filters State for matching cars across pages
  const [filters, setFilters] = useState({
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

  // Selected models comparison checklist state (stores car IDs)
  const [selectedCarsForCompare, setSelectedCarsForCompare] = useState<string[]>([]);

  // User auth state
  const [user, setUser] = useState<{ name: string; email: string; role: 'user' | 'dealer' | 'admin' } | null>({
    name: "Arthur Pendragon",
    email: "arthur@kamalot.org",
    role: "user"
  });

  // Wishlist state (car IDs)
  const [wishlist, setWishlist] = useState<string[]>(['car-2']);

  // Selected car requested from other pages for details view
  const [selectedCarToView, setSelectedCarToView] = useState<Car | null>(null);
  const [selectedCarViewRequest, setSelectedCarViewRequest] = useState<number>(0);

  const handleViewCarDetail = (car: Car) => {
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
    setSelectedCarToView(car);
    setSelectedCarViewRequest(prev => prev + 1);
    setActiveTab('buy');
  };

  // Sell sub-tabs state for deep-linking/navigation
  const [sellSubTab, setSellSubTab] = useState<'valuation' | 'sell' | 'inspection'>('valuation');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-amber-500 selection:text-slate-900">
      
      {/* 1. Sticky Navigation Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        setFilters={setFilters}
        setFinanceSubTab={setFinanceSubTab}
        setServiceSubTab={setServiceSubTab}
        setBlogCategoryFilter={setBlogCategoryFilter}
        wishlist={wishlist}
        setWishlist={setWishlist}
        user={user}
        setUser={setUser}
        sellSubTab={sellSubTab}
        setSellSubTab={setSellSubTab}
        cars={cars}
      />

      {/* 2. Main Tabbed router content wrapper */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {activeTab === 'home' && (
              <Home 
                setActiveTab={setActiveTab} 
                setFilters={setFilters}
                setSelectedCarsForCompare={setSelectedCarsForCompare}
                selectedCarsForCompare={selectedCarsForCompare}
                wishlist={wishlist}
                setWishlist={setWishlist}
                cars={cars}
                onViewCarDetail={handleViewCarDetail}
              />
            )}

            {activeTab === 'buy' && (
              <BuyCars 
                filters={filters} 
                setFilters={setFilters}
                selectedCarsForCompare={selectedCarsForCompare}
                setSelectedCarsForCompare={setSelectedCarsForCompare}
                wishlist={wishlist}
                setWishlist={setWishlist}
                cars={cars}
              />
            )}

            {activeTab === 'sell' && (
              <SellCar 
                subTab={sellSubTab} 
                setSubTab={setSellSubTab} 
                onAddCar={async (newCar) => {
                  try {
                    const url = `${API_BASE_URL}/api/cars`;
                    console.log('Adding car to:', url);
                    console.log('Car data:', newCar);
                    
                    const response = await fetch(url, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(newCar)
                    });

                    if (!response.ok) {
                      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                      throw new Error(`Unable to save car: ${response.status} - ${errorData.error || response.statusText}`);
                    }
                    
                    const savedCar = await response.json();
                    console.log('Car saved successfully:', savedCar);
                    setCars(prev => [savedCar, ...prev]);
                  } catch (error) {
                    console.error('Could not save car to backend:', error);
                    alert(`Failed to save car: ${error instanceof Error ? error.message : 'Unknown error'}`);
                  }

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
                  setActiveTab('buy');
                }}
              />
            )}

            {activeTab === 'finance' && (
              <Finance initialSubTab={financeSubTab} />
            )}

            {activeTab === 'compare' && (
              <CompareCars 
                selectedCarsForCompare={selectedCarsForCompare}
                setSelectedCarsForCompare={setSelectedCarsForCompare}
                setActiveTab={setActiveTab}
                cars={cars}
              />
            )}

            {activeTab === 'dealers' && (
              <Dealers />
            )}

            {activeTab === 'services' && (
              <Services initialSubTab={serviceSubTab} />
            )}

            {activeTab === 'blog' && (
              <BlogMain 
                categoryFilter={blogCategoryFilter} 
                setCategoryFilter={setBlogCategoryFilter} 
              />
            )}

            {activeTab === 'dashboard' && (
              user?.role === 'user' ? (
                <UserDashboard 
                  user={user} 
                  setUser={setUser} 
                  wishlist={wishlist} 
                  setWishlist={setWishlist} 
                  setActiveTab={setActiveTab}
                  setFilters={setFilters}
                  cars={cars}
                />
              ) : (
                <div id="user-access-denied" className="text-center py-20 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-500 mb-4">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-black text-slate-950 tracking-tight">Access Restricted</h2>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">This section is exclusively reserved for individual customer accounts. Please switch/sign in to a User account to view this dashboard.</p>
                  <button onClick={() => setActiveTab('home')} className="mt-6 px-5 py-2.5 bg-amber-500 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider shadow hover:bg-amber-600 transition-colors">Go Home</button>
                </div>
              )
            )}

            {activeTab === 'dealer-dashboard' && (
              user?.role === 'dealer' ? (
                <DealerDashboard 
                  user={user} 
                  setUser={setUser} 
                  setActiveTab={setActiveTab}
                />
              ) : (
                <div id="dealer-access-denied" className="text-center py-20 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-600 mb-4">
                    <Award className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-black text-slate-950 tracking-tight">Verified Dealers Only</h2>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">This portal is restricted to pre-approved dealership network accounts. Sign in using certified dealer credentials to view stock analytics.</p>
                  <button onClick={() => setActiveTab('home')} className="mt-6 px-5 py-2.5 bg-amber-500 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider shadow hover:bg-amber-600 transition-colors">Go Home</button>
                </div>
              )
            )}

            {activeTab === 'admin-dashboard' && (
              user?.role === 'admin' ? (
                <AdminDashboard 
                  user={user} 
                  setUser={setUser} 
                  setActiveTab={setActiveTab}
                />
              ) : (
                <div id="admin-access-denied" className="text-center py-20 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto text-rose-500 mb-4">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-black text-slate-950 tracking-tight text-rose-600">Administrative Access Denied</h2>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">Access to the moderation panel and system logs requires official staff credentials. Unauthorized connection requests are tracked.</p>
                  <button onClick={() => setActiveTab('home')} className="mt-6 px-5 py-2.5 bg-rose-650 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow hover:bg-rose-700 transition-colors">Go Home</button>
                </div>
              )
            )}

            {activeTab === 'about' && (
              <AboutContact />
            )}

            {activeTab === 'contact' && (
              <AboutContact />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Section 9 — High-Contrast Corporate Footer */}
      <footer id="corporate-footer" className="bg-slate-950 text-slate-400 pt-16 pb-10 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-10">
          
          {/* Column 1 — Company */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase font-mono tracking-widest text-amber-500">Company</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-amber-400 transition-colors cursor-pointer text-left">About Us</button>
              </li>
              <li>
                <button onClick={() => alert("VelocityMoto Careers: Join our certified technician or inspector program! Resumes can be sent to careers@velocitymoto.com")} className="hover:text-amber-400 transition-colors cursor-pointer text-left">Careers</button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about')} className="hover:text-amber-400 transition-colors cursor-pointer text-left">Contact</button>
              </li>
              <li>
                <button onClick={() => alert("VelocityMoto Press Room: Leading pre-owned car network raises Series B funding for nation-wide inspection expansion.")} className="hover:text-amber-400 transition-colors cursor-pointer text-left">Press</button>
              </li>
            </ul>
          </div>

          {/* Column 2 — Services */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase font-mono tracking-widest text-amber-500">Services</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <button onClick={() => { setActiveTab('buy'); }} className="hover:text-amber-400 transition-colors cursor-pointer text-left">Buy Car</button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('sell'); }} className="hover:text-amber-400 transition-colors cursor-pointer text-left">Sell Your Car</button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('finance'); }} className="hover:text-amber-400 transition-colors cursor-pointer text-left">Car Loans & EMI</button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('services'); }} className="hover:text-amber-400 transition-colors cursor-pointer text-left">Insurance Desk</button>
              </li>
            </ul>
          </div>

          {/* Column 3 — Resources */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase font-mono tracking-widest text-amber-500">Resources</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <button onClick={() => { setActiveTab('blog'); }} className="hover:text-amber-400 transition-colors cursor-pointer text-left">Latest News & Blog</button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('about'); }} className="hover:text-amber-400 transition-colors cursor-pointer text-left">FAQs</button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('about'); }} className="hover:text-amber-400 transition-colors cursor-pointer text-left">Help Center</button>
              </li>
            </ul>
          </div>

          {/* Column 4 — Legal */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase font-mono tracking-widest text-amber-500">Legal Policies</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <a href="#privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#terms" className="hover:text-amber-400 transition-colors">Terms & Conditions</a>
              </li>
              <li>
                <a href="#refund" className="hover:text-amber-400 transition-colors">Refund Warranty Policy</a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Footer Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Copyright & Slogan info */}
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <span className="text-sm font-black text-white tracking-widest">
                VELOCITY<span className="text-amber-500">MOTO</span>
              </span>
              <span className="text-[9px] font-bold text-slate-500 px-1.5 py-0.5 bg-slate-900 rounded font-mono uppercase">Pre-Owned</span>
            </div>
            <p className="text-[11px] text-slate-500">
              © 2026 VelocityMoto Certified Pre-Owned Network. All rights reserved. RTO transfers and verified inspection systems are legally backed by DMV authority.
            </p>
          </div>

          {/* Social media icons & App download links side by side */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            
            {/* Social Icons */}
            <div className="flex items-center space-x-4">
              <a href="#facebook" className="p-2 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-400 rounded-full transition-all cursor-pointer">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#twitter" className="p-2 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-400 rounded-full transition-all cursor-pointer">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#instagram" className="p-2 bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-slate-400 rounded-full transition-all cursor-pointer">
                <Instagram className="w-4 h-4" />
              </a>
            </div>

            {/* App downloads */}
            <div className="flex items-center gap-2">
              <a href="#appstore" onClick={() => alert("VelocityMoto App Store iOS release scheduled for Fall 2026.")} className="flex items-center gap-1.5 bg-slate-900 py-1.5 px-3 rounded-lg hover:bg-slate-800 border border-slate-800 transition-colors uppercase font-mono text-[9px] font-bold text-slate-200">
                <Smartphone className="w-3.5 h-3.5 text-amber-500" />
                <span>App Store</span>
              </a>
              <a href="#playstore" onClick={() => alert("VelocityMoto Android Play Store build is currently undergoing Beta testing.")} className="flex items-center gap-1.5 bg-slate-900 py-1.5 px-3 rounded-lg hover:bg-slate-800 border border-slate-800 transition-colors uppercase font-mono text-[9px] font-bold text-slate-200">
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>Google Play</span>
              </a>
            </div>

          </div>

        </div>
      </footer>

    </div>
  );
}
