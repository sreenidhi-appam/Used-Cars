import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, Search, RotateCcw, HelpCircle, X, Shield, Star, Gauge, KeyRound, Check, Fuel, Calendar, CalendarDays, PhoneCall, Trash2, Award, Heart, MessageSquare, Compass, ChevronLeft, ChevronRight, Info, Phone } from 'lucide-react';
import { Car } from '../types';

interface BuyCarsProps {
  filters: {
    search: string;
    minPrice: string;
    maxPrice: string;
    bodyType: string;
    fuelType: string;
    isCertified: boolean;
    isBudget: boolean;
    isLuxury: boolean;
    brand?: string;
  };
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  selectedCarsForCompare: string[];
  setSelectedCarsForCompare: React.Dispatch<React.SetStateAction<string[]>>;
  wishlist: string[];
  setWishlist: React.Dispatch<React.SetStateAction<string[]>>;
  cars: Car[];
}

export default function BuyCars({
  filters,
  setFilters,
  selectedCarsForCompare,
  setSelectedCarsForCompare,
  wishlist,
  setWishlist,
  cars
}: BuyCarsProps) {
  // Mobile filter visibility toggle
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedCarDetail, setSelectedCarDetail] = useState<Car | null>(null);

  // Testdrive scheduling state
  const [bookingDate, setBookingDate] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userName, setUserName] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  // High-Fidelity Car Details View States
  const [selectedImgIdx, setSelectedImgIdx] = useState<number>(0);
  const [is360Mode, setIs360Mode] = useState<boolean>(false);
  const [angle360, setAngle360] = useState<number>(0);
  const [contactAlert, setContactAlert] = useState<string | null>(null);

  // In-memory filters
  const [search, setSearch] = useState(filters.search);
  const [minPrice, setMinPrice] = useState(filters.minPrice);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice);
  const [bodyType, setBodyType] = useState(filters.bodyType);
  const [fuelType, setFuelType] = useState(filters.fuelType);
  const [isCertified, setIsCertified] = useState(filters.isCertified);
  const [selectedBrand, setSelectedBrand] = useState(filters.brand || '');

  // Left Sidebar - Extra filters
  const [transmission, setTransmission] = useState('');
  const [maxMileage, setMaxMileage] = useState('');
  const [ownership, setOwnership] = useState('');
  const [year, setYear] = useState('');
  const [seating, setSeating] = useState('');
  const [color, setColor] = useState('');

  // Applied values of extra filters
  const [appliedTransmission, setAppliedTransmission] = useState('');
  const [appliedMaxMileage, setAppliedMaxMileage] = useState('');
  const [appliedOwnership, setAppliedOwnership] = useState('');
  const [appliedYear, setAppliedYear] = useState('');
  const [appliedSeating, setAppliedSeating] = useState('');
  const [appliedColor, setAppliedColor] = useState('');

  // Sorting Control State
  const [sortBy, setSortBy] = useState<string>('recommended');

  // Synchronize initial filters passed down from Navbar/Home clicks
  React.useEffect(() => {
    setSearch(filters.search);
    setMinPrice(filters.minPrice);
    setMaxPrice(filters.maxPrice);
    setBodyType(filters.bodyType);
    setFuelType(filters.fuelType);
    setIsCertified(filters.isCertified);
    setSelectedBrand(filters.brand || '');
  }, [filters]);

  React.useEffect(() => {
    setSelectedImgIdx(0);
    setIs360Mode(false);
    setAngle360(0);
    setContactAlert(null);
  }, [selectedCarDetail]);

  const uniqueBrands = useMemo(() => {
    return Array.from(new Set(cars.map(c => c.brand)));
  }, [cars]);

  const handleOpenCarDetail = (car: Car) => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      selection.removeAllRanges();
      return;
    }

    setSelectedCarDetail(car);
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      search: '',
      minPrice: '',
      maxPrice: '',
      bodyType: '',
      fuelType: '',
      isCertified: false,
      isBudget: false,
      isLuxury: false,
      brand: ''
    };
    setFilters(defaultFilters);
    setSearch('');
    setMinPrice('');
    setMaxPrice('');
    setBodyType('');
    setFuelType('');
    setIsCertified(false);
    setSelectedBrand('');

    setTransmission('');
    setMaxMileage('');
    setOwnership('');
    setYear('');
    setSeating('');
    setColor('');

    setAppliedTransmission('');
    setAppliedMaxMileage('');
    setAppliedOwnership('');
    setAppliedYear('');
    setAppliedSeating('');
    setAppliedColor('');
  };

  const handleApplyFilters = () => {
    setFilters({
      search,
      minPrice,
      maxPrice,
      bodyType,
      fuelType,
      isCertified,
      brand: selectedBrand,
      isBudget: maxPrice && parseInt(maxPrice) <= 1640000 ? true : false,
      isLuxury: minPrice && parseInt(minPrice) >= 3280000 ? true : false
    });
    setAppliedTransmission(transmission);
    setAppliedMaxMileage(maxMileage);
    setAppliedOwnership(ownership);
    setAppliedYear(year);
    setAppliedSeating(seating);
    setAppliedColor(color);
    setMobileFiltersOpen(false);
  };

  // Filter Cars logic
  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      // Search text
      if (filters.search) {
        const query = filters.search.trim().toLowerCase();
        const brand = car.brand.toLowerCase();
        const model = car.model.toLowerCase();
        const body = car.bodyType.toLowerCase();
        const fuel = car.fuelType.toLowerCase();
        const trans = car.transmission.toLowerCase();
        const color = (car.color || '').toLowerCase();
        const location = (car.location || '').toLowerCase();
        const fullCombo = `${brand} ${model}`;

        // Direct matching
        const matchesBrand = brand.includes(query) || query.includes(brand);
        const matchesModel = model.includes(query) || query.includes(model);
        const matchesCombo = fullCombo.includes(query) || query.includes(fullCombo);
        const matchesBody = body.includes(query);
        const matchesFuel = fuel.includes(query);
        const matchesTransmission = trans.includes(query);
        const matchesColor = color.includes(query);
        const matchesLocation = location.includes(query);

        // Split-word keyword matching
        const queryWords = query.split(/\s+/).filter(Boolean);
        const matchesAllWords = queryWords.length > 1 && queryWords.every(word => 
          brand.includes(word) ||
          model.includes(word) ||
          body.includes(word) ||
          fuel.includes(word) ||
          trans.includes(word) ||
          color.includes(word) ||
          location.includes(word) ||
          car.year.toString().includes(word)
        );

        if (!matchesBrand && !matchesModel && !matchesCombo && !matchesBody && !matchesFuel && !matchesTransmission && !matchesColor && !matchesLocation && !matchesAllWords) {
          return false;
        }
      }
      
      // Brand selector
      if (filters.brand && car.brand.toLowerCase() !== filters.brand.toLowerCase()) {
        return false;
      }

      // Min Price
      if (filters.minPrice && car.price < parseInt(filters.minPrice)) {
        return false;
      }

      // Max Price
      if (filters.maxPrice && car.price > parseInt(filters.maxPrice)) {
        return false;
      }

      // Body Type
      if (filters.bodyType && car.bodyType.toLowerCase() !== filters.bodyType.toLowerCase()) {
        return false;
      }

      // Fuel Type
      if (filters.fuelType && car.fuelType.toLowerCase() !== filters.fuelType.toLowerCase()) {
        return false;
      }

      // Certified status
      if (filters.isCertified && !car.isCertified) {
        return false;
      }

      // Budget status (<= ₹16.4L)
      if (filters.isBudget && car.price > 1640000) {
        return false;
      }

      // Luxury status (>= ₹32.8L)
      if (filters.isLuxury && car.price < 3280000) {
        return false;
      }

      // 4. Transmission
      if (appliedTransmission && car.transmission.toLowerCase() !== appliedTransmission.toLowerCase()) {
        return false;
      }

      // 5. KM driven (mileage)
      if (appliedMaxMileage && car.mileage > parseInt(appliedMaxMileage)) {
        return false;
      }

      // 6. Ownership (owners counts)
      if (appliedOwnership && car.owners !== parseInt(appliedOwnership)) {
        return false;
      }

      // 7. Year
      if (appliedYear && car.year !== parseInt(appliedYear)) {
        return false;
      }

      // 8. Seating
      const estimatedSeats = car.seating || (car.bodyType === 'SUV' ? 7 : (car.bodyType === 'Coupe' ? 4 : 5));
      if (appliedSeating && estimatedSeats !== parseInt(appliedSeating)) {
        return false;
      }

      // 9. Color
      if (appliedColor && !car.color.toLowerCase().includes(appliedColor.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [filters, appliedTransmission, appliedMaxMileage, appliedOwnership, appliedYear, appliedSeating, appliedColor, cars]);

  // Derived sorted listing
  const sortedAndFilteredCars = useMemo(() => {
    const list = [...filteredCars];
    if (sortBy === 'price-low') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-high') {
      return list.sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'kms-low') {
      return list.sort((a, b) => a.mileage - b.mileage);
    }
    if (sortBy === 'year-new') {
      return list.sort((a, b) => b.year - a.year);
    }
    return list; // recommended
  }, [filteredCars, sortBy]);

  const handleToggleCompare = (carId: string) => {
    setSelectedCarsForCompare(prev => {
      if (prev.includes(carId)) {
        return prev.filter(id => id !== carId);
      }
      if (prev.length >= 3) {
        alert("You can compare up to 3 models simultaneously.");
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

  const handleInquireTestDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userPhone || !bookingDate) {
      alert("Please check that all client details are correctly complete.");
      return;
    }
    setIsBooked(true);
    setTimeout(() => {
      setIsBooked(false);
      setBookingDate('');
      setUserPhone('');
      setUserName('');
      setSelectedCarDetail(null);
      alert("Inspection/Test Drive booking confirmed successfully! Our showrooms manager will call you within 15 minutes.");
    }, 2000);
  };

  // Helper to apply quick filters while resetting others cleanly
  const applyQuickCategory = (customFilters: Partial<typeof filters>) => {
    const defaultFilters = {
      search: '',
      minPrice: '',
      maxPrice: '',
      bodyType: '',
      fuelType: '',
      isCertified: false,
      isBudget: false,
      isLuxury: false,
      brand: ''
    };

    // Reset local/sidebar filters
    setTransmission('');
    setMaxMileage('');
    setOwnership('');
    setYear('');
    setSeating('');
    setColor('');

    setAppliedTransmission('');
    setAppliedMaxMileage('');
    setAppliedOwnership('');
    setAppliedYear('');
    setAppliedSeating('');
    setAppliedColor('');

    // Update parent filters with the custom properties merged over defaults
    setFilters({ ...defaultFilters, ...customFilters });
  };

  // Quick categories selectors (Pills at the top of grid)
  const quickCategories = [
    { 
      label: 'All Pre-owned', 
      action: () => applyQuickCategory({}), 
      isActive: !filters.bodyType && !filters.isCertified && !filters.fuelType && !filters.isBudget && !filters.isLuxury 
    },
    { 
      label: 'Certified Platinum', 
      action: () => applyQuickCategory({ isCertified: true }), 
      isActive: !!filters.isCertified 
    },
    { 
      label: 'SUVs & Crossovers', 
      action: () => applyQuickCategory({ bodyType: 'SUV' }), 
      isActive: filters.bodyType === 'SUV' 
    },
    { 
      label: 'Electric Vehicles', 
      action: () => applyQuickCategory({ fuelType: 'Electric' }), 
      isActive: filters.fuelType === 'Electric' 
    },
    { 
      label: 'Budget Hatchbacks', 
      action: () => applyQuickCategory({ bodyType: 'Hatchback', isBudget: true, maxPrice: '1640000' }), 
      isActive: filters.bodyType === 'Hatchback' && filters.isBudget 
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Search Header Banner */}
      <div id="buy-header" className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">BUY CERTIFIED USED VEHICLES</h1>
        <p className="text-sm text-gray-500 mt-1">Refine and discover hand-certified, thoroughly-vetted pre-owned cars in pristine condition.</p>
        
        {/* Quick Category Tab Pills */}
        <div className="flex flex-wrap gap-2.5 mt-5">
          {quickCategories.map((pill, idx) => (
            <button
              key={idx}
              onClick={pill.action}
              className={`px-4.5 py-2 text-xs font-bold tracking-wider uppercase rounded-xl border transition-all cursor-pointer ${
                pill.isActive
                  ? 'bg-slate-900 text-amber-400 border-slate-900 shadow-md'
                  : 'bg-white text-gray-600 border-gray-150 hover:bg-gray-50'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side Filters Sidebar - Desktop */}
        <aside id="desktop-filters-sidebar" className="hidden lg:block bg-white border border-gray-150/80 rounded-2xl p-6 shadow-sm h-[calc(100vh-130px)] overflow-y-auto sticky top-24 pr-4">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
            <span className="text-xs font-bold tracking-widest font-mono text-gray-400 uppercase">Filters & Sort</span>
            <button 
              onClick={handleResetFilters}
              className="text-xs font-semibold text-gray-400 hover:text-amber-500 flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All</span>
            </button>
          </div>

          <div className="space-y-6">
            
            {/* Search keywords */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-2">Search Model</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="e.g. Model Y, 330i..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-150 rounded-xl text-sm focus:outline-none focus:border-amber-500 text-gray-800 bg-gray-50/50"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />

                {/* BuyCars Sidebar Suggestions */}
                {search.trim() && (
                  <div className="absolute left-0 right-0 mt-1.5 bg-white border border-gray-150 rounded-xl shadow-xl z-30 p-2 max-h-48 overflow-y-auto">
                    {cars.filter(car => 
                      car.brand.toLowerCase().includes(search.toLowerCase()) || 
                      car.model.toLowerCase().includes(search.toLowerCase()) || 
                      `${car.brand} ${car.model}`.toLowerCase().includes(search.toLowerCase())
                    ).length === 0 ? (
                      <p className="text-[10px] text-gray-400 py-1 text-center font-medium">No matches</p>
                    ) : (
                      <div className="space-y-1">
                        {cars.filter(car => 
                          car.brand.toLowerCase().includes(search.toLowerCase()) || 
                          car.model.toLowerCase().includes(search.toLowerCase()) || 
                          `${car.brand} ${car.model}`.toLowerCase().includes(search.toLowerCase())
                        ).slice(0, 3).map(car => (
                          <button
                            key={car.id}
                            type="button"
                            onClick={() => {
                              setSearch(`${car.brand} ${car.model}`);
                              setFilters(prev => ({ ...prev, search: `${car.brand} ${car.model}` }));
                              setSelectedCarDetail(car);
                            }}
                            className="w-full flex items-center justify-between p-1 hover:bg-amber-50 rounded-lg text-left cursor-pointer group/suggestion"
                          >
                            <div className="flex items-center space-x-1.5 min-w-0">
                              <img src={car.image} alt={car.model} className="w-6 h-5 object-cover rounded border flex-shrink-0" referrerPolicy="no-referrer" />
                              <span className="text-[10px] font-bold text-gray-700 group-hover/suggestion:text-amber-600 truncate">{car.brand} {car.model}</span>
                            </div>
                            <span className="text-[9px] font-black font-mono text-gray-900 pr-0.5">₹{car.price.toLocaleString('en-IN')}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Brand Checkbox */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-2">Resale Brand</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2 border border-gray-150 rounded-xl text-sm focus:outline-none focus:border-amber-500 text-gray-700 bg-gray-50/50"
              >
                <option value="">All Brands</option>
                {uniqueBrands.map(bar => (
                  <option key={bar} value={bar}>{bar}</option>
                ))}
              </select>
            </div>

            {/* Body Type */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-2">Body Style</label>
              <select
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-150 rounded-xl text-sm focus:outline-none focus:border-amber-500 text-gray-700 bg-gray-50/50"
              >
                <option value="">Any Body Type</option>
                <option value="SUV">SUVs</option>
                <option value="Sedan">Sedans</option>
                <option value="Hatchback">Hatchbacks</option>
                <option value="Luxury">Luxury Models</option>
                <option value="Coupe">Coupes & Sport</option>
              </select>
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-2">Fuel Type</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-150 rounded-xl text-sm focus:outline-none focus:border-amber-500 text-gray-700 bg-gray-50/50"
              >
                <option value="">All Fuel</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric (EV)</option>
              </select>
            </div>

            {/* Prices Brackets */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-2 font-semibold">Budget Range</label>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="number" 
                  min="0"
                  placeholder="Min ₹" 
                  value={minPrice}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || parseFloat(val) >= 0) {
                      setMinPrice(val);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                      e.preventDefault();
                    }
                  }}
                  className="w-full px-2.5 py-2 border border-gray-150 rounded-xl text-xs text-gray-800 bg-gray-50/50 focus:outline-none"
                />
                <input 
                  type="number" 
                  min="0"
                  placeholder="Max ₹" 
                  value={maxPrice}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || parseFloat(val) >= 0) {
                      setMaxPrice(val);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                      e.preventDefault();
                    }
                  }}
                  className="w-full px-2.5 py-2 border border-gray-150 rounded-xl text-xs text-gray-800 bg-gray-50/50 focus:outline-none"
                />
              </div>
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-2">Transmission</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
                className="w-full px-3 py-2 border border-gray-150 rounded-xl text-sm focus:outline-none focus:border-amber-500 text-gray-700 bg-gray-50/50"
              >
                <option value="">Any Transmission</option>
                <option value="Manual">Manual</option>
                <option value="Automatic">Automatic</option>
              </select>
            </div>

            {/* KM Driven */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-2">KM Driven (Max)</label>
              <select
                value={maxMileage}
                onChange={(e) => setMaxMileage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-150 rounded-xl text-sm focus:outline-none focus:border-amber-500 text-gray-700 bg-gray-50/50"
              >
                <option value="">Any Mileage</option>
                <option value="15000">Up to 15,000 km</option>
                <option value="30000">Up to 30,000 km</option>
                <option value="50000">Up to 50,000 km</option>
                <option value="80000">Up to 80,000 km</option>
                <option value="120000">Up to 120,000 km</option>
              </select>
            </div>

            {/* Ownership */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-2">Ownership count</label>
              <select
                value={ownership}
                onChange={(e) => setOwnership(e.target.value)}
                className="w-full px-3 py-2 border border-gray-150 rounded-xl text-sm focus:outline-none focus:border-amber-500 text-gray-700 bg-gray-50/50"
              >
                <option value="">Any Ownership</option>
                <option value="1">1st Owner</option>
                <option value="2">2nd Owner</option>
                <option value="3">3rd Owner +</option>
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-2">Registration Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-150 rounded-xl text-sm focus:outline-none focus:border-amber-500 text-gray-700 bg-gray-50/50"
              >
                <option value="">Any Year</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
                <option value="2018">2018</option>
                <option value="2017">2017</option>
                <option value="2016">2016</option>
              </select>
            </div>

            {/* Seating */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-2">Seating Capacity</label>
              <select
                value={seating}
                onChange={(e) => setSeating(e.target.value)}
                className="w-full px-3 py-2 border border-gray-150 rounded-xl text-sm focus:outline-none focus:border-amber-500 text-gray-700 bg-gray-50/50"
              >
                <option value="">Any Seating</option>
                <option value="4">4-Seater</option>
                <option value="5">5-Seater</option>
                <option value="7">7-Seater / 3-Row</option>
              </select>
            </div>

            {/* Color */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-2">Exterior Color</label>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-150 rounded-xl text-sm focus:outline-none focus:border-amber-500 text-gray-700 bg-gray-50/50"
              >
                <option value="">Any Color</option>
                <option value="White">White</option>
                <option value="Black">Black</option>
                <option value="Red">Red</option>
                <option value="Blue">Blue</option>
                <option value="Silver">Silver</option>
                <option value="Gray">Gray</option>
              </select>
            </div>

            {/* Certified Only */}
            <div className="flex items-center space-x-2.5 pt-2 border-t border-gray-50">
              <input 
                type="checkbox" 
                id="certified-check"
                checked={isCertified}
                onChange={(e) => setIsCertified(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 border-gray-300 accent-amber-500"
              />
              <label htmlFor="certified-check" className="text-sm font-semibold text-gray-700 cursor-pointer select-none">
                Platinum Certified Only
              </label>
            </div>

            <button
              onClick={handleApplyFilters}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer active:scale-95"
            >
              Apply Filter Matches
            </button>

          </div>
        </aside>

        {/* Right Side Used Cars Grid */}
        <section id="cars-grid" className="lg:col-span-3">
          
          {/* Top Controls: Showing count and Sort selector */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-150/80">
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold font-mono tracking-wider text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded uppercase">Verified Inventory</span>
              </div>
              <p className="text-lg font-black text-slate-900 mt-1">
                Showing <span className="text-amber-500 font-extrabold">{sortedAndFilteredCars.length}</span> <span className="text-gray-400 font-medium font-sans">certified cars</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Mobile filter button nested in controls list */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="flex lg:hidden items-center space-x-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <Filter className="w-3.5 h-3.5 text-amber-400" />
                <span>Filters</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase text-gray-400 font-mono">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3.5 py-2 border border-gray-150 rounded-xl text-xs font-bold text-gray-750 bg-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 cursor-pointer shadow-sm"
                >
                  <option value="recommended">⭐ Recommended</option>
                  <option value="price-low">💵 Price: Low to High</option>
                  <option value="price-high">📈 Price: High to Low</option>
                  <option value="kms-low">⚡ KM Driven: Low to High</option>
                  <option value="year-new">📅 Year: Newest First</option>
                </select>
              </div>
            </div>
          </div>

          {sortedAndFilteredCars.length === 0 ? (
            <div id="no-matches" className="bg-white border border-gray-150 rounded-2xl p-12 text-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-950">No Inventory Cars found</h3>
              <p className="text-sm text-gray-500 max-w-sm mx-auto mt-1">Try resetting the current search query, budget ranges, or brand checkboxes to see all inventory.</p>
              <button 
                onClick={handleResetFilters}
                className="mt-5 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {sortedAndFilteredCars.map(car => {
                const isAddedToCompare = selectedCarsForCompare.includes(car.id);
                return (
                  <motion.div 
                    key={car.id}
                    layoutId={`car-layout-${car.id}`}
                    onClick={() => handleOpenCarDetail(car)}
                    className="bg-white border border-gray-150/80 rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col group relative cursor-pointer"
                  >
                    {/* Upper cover photo with rich interactive overlays */}
                    <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                      <img 
                        src={car.image} 
                        alt={car.model} 
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />

                      {/* Verified Badge & Certified Pill */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
                        {car.isCertified && (
                          <div className="bg-amber-550 bg-amber-500 text-slate-950 font-mono text-[8px] font-black tracking-wider px-2 py-0.5 rounded shadow-sm border border-amber-400 uppercase flex items-center space-x-0.5">
                            <Star className="w-2 h-2 fill-slate-950 stroke-none" />
                            <span>Certified</span>
                          </div>
                        )}
                        <div className="bg-emerald-600 text-white font-mono text-[8px] font-black tracking-widest px-2 py-0.5 rounded shadow-sm uppercase flex items-center space-x-0.5">
                          <Check className="w-2 h-2 stroke-[3.5]" />
                          <span>Verified</span>
                        </div>
                      </div>

                      {/* Wishlist Heart Icon (Favorite Button) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleWishlist(car.id);
                        }}
                        className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg backdrop-blur-md transition-all cursor-pointer flex items-center justify-center shadow-md z-10 ${
                          wishlist.includes(car.id)
                            ? 'bg-rose-500 text-white hover:bg-rose-600'
                            : 'bg-black/45 text-white hover:bg-black/65'
                        }`}
                        title={wishlist.includes(car.id) ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Heart className={`w-3.5 h-3.5 ${wishlist.includes(car.id) ? 'fill-current' : ''}`} />
                      </button>

                      {/* Compare Checkbox Toggle */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleCompare(car.id);
                        }}
                        className={`absolute top-2.5 right-11 py-1 px-2.5 rounded-lg text-[10px] font-bold backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 shadow-md z-10 ${
                          isAddedToCompare 
                            ? 'bg-slate-900 border border-amber-500 text-amber-400 font-black' 
                            : 'bg-black/55 text-white hover:bg-black/75 border border-white/10'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isAddedToCompare}
                          readOnly
                          className="w-3 h-3 rounded text-amber-550 border-gray-300 pointer-events-none bg-white accent-amber-500 rounded-sm"
                        />
                        <span className="font-mono text-[8px] uppercase tracking-wider">Compare</span>
                      </button>

                      <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[9px] uppercase font-mono tracking-wider font-bold px-1.5 py-0.5 rounded backdrop-blur-xs">
                        {car.transmission} | {car.fuelType}
                      </div>
                    </div>

                    {/* Meta info body */}
                    <div className="p-4.5 flex-1 flex flex-col">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-gray-400">{car.year} Resale</span>
                        <div className="flex items-center space-x-0.5 text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-500 stroke-none" />
                          <span className="text-[10px] font-bold text-gray-600">{car.rating}</span>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-gray-950 mt-1 leading-snug group-hover:text-amber-500 transition-colors">
                        {car.brand} {car.model}
                      </h3>

                      {/* Secondary metrics (Basic specs) */}
                      <div className="grid grid-cols-2 gap-1 my-3 bg-gray-50 p-2 rounded-xl text-[11px] text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Gauge className="w-3.5 h-3.5 text-gray-400" />
                          <span>{car.mileage.toLocaleString()} km</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <KeyRound className="w-3.5 h-3.5 text-gray-400" />
                          <span>{car.owners} Owners</span>
                        </div>
                      </div>

                      {/* Resale Price */}
                      <div className="flex items-end justify-between mt-auto pt-2 border-t border-gray-50">
                        <div>
                          <p className="text-[9px] text-gray-400 font-mono uppercase tracking-widest leading-none">Resale Value</p>
                          <span className="text-xl font-extrabold text-gray-900 leading-none">₹{car.price.toLocaleString('en-IN')}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenCarDetail(car);
                          }}
                          className="px-4 py-2 bg-gray-900 hover:bg-slate-800 text-white font-bold uppercase tracking-wider text-[10px] rounded-xl transition-all cursor-pointer active:scale-95"
                        >
                          View Details
                        </button>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

        </section>

      </div>

      {/* Mobile Drawer Slide for Filters */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-end">
          <div className="w-80 max-w-full bg-white h-full p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-150 mb-5">
                <span className="text-xs font-bold tracking-widest font-mono text-gray-500 uppercase">Filters</span>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-5">
                {/* Search keywords */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-450 font-mono mb-2">Keyword Search</label>
                  <input 
                    type="text" 
                    placeholder="e.g. BMW, SUV, Sedan" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-150 rounded-xl text-sm"
                  />
                </div>

                {/* Brands dropdown */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-450 font-mono mb-2">Manufacturers</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-150 rounded-xl text-sm"
                  >
                    <option value="">All Brands</option>
                    {uniqueBrands.map(bm => <option key={bm} value={bm}>{bm}</option>)}
                  </select>
                </div>

                {/* Body Type */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-450 font-mono mb-2">Body Shape</label>
                  <select
                    value={bodyType}
                    onChange={(e) => setBodyType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-150 rounded-xl text-sm"
                  >
                    <option value="">All Types</option>
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>

                {/* Transmission */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-450 font-mono mb-2">Transmission</label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-150 rounded-xl text-sm bg-white"
                  >
                    <option value="">Any Transmission</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                  </select>
                </div>

                {/* KM Driven */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-450 font-mono mb-2">KM Driven (Max)</label>
                  <select
                    value={maxMileage}
                    onChange={(e) => setMaxMileage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-150 rounded-xl text-sm bg-white"
                  >
                    <option value="">Any Mileage</option>
                    <option value="15000">Up to 15,000 km</option>
                    <option value="30000">Up to 30,000 km</option>
                    <option value="50000">Up to 50,000 km</option>
                    <option value="80000">Up to 80,000 km</option>
                    <option value="120000">Up to 120,000 km</option>
                  </select>
                </div>

                {/* Ownership */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-450 font-mono mb-2">Ownership count</label>
                  <select
                    value={ownership}
                    onChange={(e) => setOwnership(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-150 rounded-xl text-sm bg-white"
                  >
                    <option value="">Any Ownership</option>
                    <option value="1">1st Owner</option>
                    <option value="2">2nd Owner</option>
                    <option value="3">3rd Owner +</option>
                  </select>
                </div>

                {/* Year */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-450 font-mono mb-2">Registration Year</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-150 rounded-xl text-sm bg-white"
                  >
                    <option value="">Any Year</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                    <option value="2018">2018</option>
                    <option value="2017">2017</option>
                    <option value="2016">2016</option>
                  </select>
                </div>

                {/* Seating */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-450 font-mono mb-2">Seating Capacity</label>
                  <select
                    value={seating}
                    onChange={(e) => setSeating(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-150 rounded-xl text-sm bg-white"
                  >
                    <option value="">Any Seating</option>
                    <option value="4">4-Seater</option>
                    <option value="5">5-Seater</option>
                    <option value="7">7-Seater / 3-Row</option>
                  </select>
                </div>

                {/* Color */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-450 font-mono mb-2">Exterior Color</label>
                  <select
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-150 rounded-xl text-sm bg-white"
                  >
                    <option value="">Any Color</option>
                    <option value="White">White</option>
                    <option value="Black">Black</option>
                    <option value="Red">Red</option>
                    <option value="Blue">Blue</option>
                    <option value="Silver">Silver</option>
                    <option value="Gray">Gray</option>
                  </select>
                </div>

                {/* Certified */}
                <div className="flex items-center space-x-2.5">
                  <input 
                    type="checkbox" 
                    id="mob-cert-check"
                    checked={isCertified}
                    onChange={(e) => setIsCertified(e.target.checked)}
                    className="w-4 h-4 text-amber-500 border-gray-350"
                  />
                  <label htmlFor="mob-cert-check" className="text-sm font-semibold text-gray-700">Certified Only</label>
                </div>
              </div>
            </div>

            <button 
              onClick={handleApplyFilters}
              className="w-full py-3 bg-slate-900 text-white font-bold uppercase tracking-wider text-xs rounded-xl mt-8"
            >
              Apply Filter Matches
            </button>
          </div>
        </div>
      )}

      {/* Specification Details Modal + Book Testdrive or Inspection */}
      <AnimatePresence>
        {selectedCarDetail && (() => {
          // Calculate active specs
          const monthlyEmi = Math.round(((selectedCarDetail.price * 0.85) * 1.35) / 60);
          const insuranceStatus = `Comprehensive Active (Till Nov 2027)`;
          const registrationRto = selectedCarDetail.id === 'car-1' ? 'WA-70-DL-4122 (Seattle West DMV)' : (selectedCarDetail.id === 'car-2' ? 'CA-55-MA-9103 (Los Angeles Hub)' : 'WA-82-BK-5011 (Tacoma Office)');
          const inspectionScore = selectedCarDetail.rating ? (selectedCarDetail.rating * 2).toFixed(1) : "9.4";

          // Simulate similar cars
          const similarCarsList = cars
            .filter(c => c.id !== selectedCarDetail.id)
            .filter(c => c.bodyType === selectedCarDetail.bodyType || Math.abs(c.price - selectedCarDetail.price) < 1500000)
            .slice(0, 3);

          // Standard alternate angle image galleries
          const alternatesList = [
            { title: "Main Exterior", url: selectedCarDetail.image },
            { title: "Leather Cockpit", url: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80" },
            { title: "Frontal Headlight", url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80" },
            { title: "Passenger Cabin", url: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80" }
          ];

          // Map angle state to a designated image gallery index to simulate spinning view
          const activeImageIndex = is360Mode 
            ? Math.min(3, Math.floor(angle360 / 90)) 
            : selectedImgIdx;

          const angleTitles = [
            "Front view (0°)",
            "Diagonal Side view (90°)",
            "Rear Aerodynamics (180°)",
            "Cabin cockpit (360°)"
          ];

          return (
            <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="bg-white rounded-3xl overflow-hidden shadow-2xl max-w-6xl w-full text-left relative max-h-[92vh] overflow-y-auto border border-gray-100 flex flex-col"
              >
                
                {/* Modal Top Header with Title and Close Trigger */}
                <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-800 text-white sticky top-0 z-20">
                  <div className="flex items-center space-x-3">
                    <span className="p-1 px-2.5 bg-amber-500 text-slate-950 font-mono text-[9px] font-black rounded uppercase">Certified Pre-Owned</span>
                    <h2 className="text-sm font-bold font-mono text-gray-300">Detailed Verification Sheet #{selectedCarDetail.id.slice(-4).toUpperCase()}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedCarDetail(null)}
                    className="p-1.5 hover:bg-white/10 rounded-xl transition-all cursor-pointer text-gray-300 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Main Body Grid */}
                <div className="p-6 lg:p-8 space-y-8 overflow-y-auto">
                  
                  {/* Top Section: Left (Visual Area) & Right (Checkout Pane) */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    
                    {/* LEFT PANEL: Media Suite (Image Gallery / 360 viewer) */}
                    <div className="space-y-4">
                      
                      {/* Live Viewport Screen */}
                      <div className="relative h-80 rounded-2xl overflow-hidden bg-slate-100 border border-gray-150 shadow-inner group">
                        <img 
                          src={alternatesList[activeImageIndex].url} 
                          alt={alternatesList[activeImageIndex].title} 
                          className="w-full h-full object-cover select-none transition-all duration-300"
                          referrerPolicy="no-referrer"
                        />

                        {/* Compass and Mode Badge Overlays */}
                        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 z-10">
                          {is360Mode ? (
                            <span className="bg-amber-500 text-slate-950 font-mono text-[9px] font-bold px-2.5 py-1 rounded-md shadow-md uppercase tracking-wider flex items-center gap-1">
                              <Compass className="w-3.5 h-3.5 animate-spin-slow text-slate-950" />
                              360° SPIN ACTIVE
                            </span>
                          ) : (
                            <span className="bg-slate-900/80 text-white font-mono text-[9px] font-bold px-2.5 py-1 rounded-md shadow-md uppercase tracking-wider">
                              📸 HIGH-RES SHOT
                            </span>
                          )}
                          <span className="bg-white/90 text-slate-900 font-mono text-[9px] font-bold px-2 py-1 rounded-md shadow-sm border border-gray-100">
                            {alternatesList[activeImageIndex].title}
                          </span>
                        </div>

                        {/* Direct Left/Right Navigation inside Viewport (only for manual Gallery Mode) */}
                        {!is360Mode && (
                          <>
                            <button 
                              onClick={() => setSelectedImgIdx(prev => (prev === 0 ? 3 : prev - 1))}
                              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/55 hover:bg-black/85 text-white cursor-pointer transition-all shadow-md group-hover:opacity-100"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setSelectedImgIdx(prev => (prev === 3 ? 0 : prev + 1))}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/55 hover:bg-black/85 text-white cursor-pointer transition-all shadow-md group-hover:opacity-100"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {/* Stanza indicator text bar */}
                        {is360Mode && (
                          <div className="absolute bottom-3 left-3 bg-slate-950/90 text-gray-300 font-mono text-[10px] px-3 py-1.5 rounded-lg border border-slate-800">
                             Viewing: <span className="text-amber-400 font-bold">{angleTitles[activeImageIndex]}</span>
                          </div>
                        )}
                      </div>

                      {/* Mode Toggles Desktop View */}
                      <div className="flex gap-2.5">
                        <button
                          onClick={() => { setIs360Mode(false); setSelectedImgIdx(0); }}
                          className={`flex-1 py-2.5 rounded-xl font-bold uppercase tracking-wider font-mono text-[10px] transition-all border flex items-center justify-center space-x-1.5 ${
                            !is360Mode 
                              ? 'bg-slate-900 text-white border-slate-900' 
                              : 'bg-white hover:bg-gray-50 text-slate-700 border-gray-200'
                          }`}
                        >
                          <span>📸 Angle Gallery</span>
                        </button>
                        <button
                          onClick={() => { setIs360Mode(true); setAngle360(90); }}
                          className={`flex-1 py-2.5 rounded-xl font-bold uppercase tracking-wider font-mono text-[10px] transition-all border flex items-center justify-center space-x-1.5 ${
                            is360Mode 
                              ? 'bg-amber-500 text-slate-950 border-amber-500' 
                              : 'bg-white hover:bg-gray-50 text-slate-700 border-gray-200'
                          }`}
                        >
                          <Compass className="w-3.5 h-3.5" />
                          <span>🔄 Interactive 360° SPIN</span>
                        </button>
                      </div>

                      {/* Conditional control helper (Slider for 360, Thumbnail set for Gallery) */}
                      {is360Mode ? (
                        <div className="bg-slate-50 p-4 rounded-2xl border border-gray-150 space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                            <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-[#d97706] font-bold">
                              <Compass className="w-4 h-4" /> Drag to Rotate
                            </span>
                            <span className="font-mono text-[11px] bg-slate-200 px-2 py-0.5 rounded leading-none text-slate-800">{angle360}° Angle</span>
                          </div>
                          <input 
                            type="range"
                            min="0"
                            max="359"
                            value={angle360}
                            onChange={(e) => setAngle360(parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500 outline-none"
                          />
                          <p className="text-[10px] text-gray-400 font-medium text-center italic">Drag the slider left or right to inspect alternate angles of the vehicle in a 360-degree rotation view.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-4 gap-2">
                          {alternatesList.map((alt, idx) => (
                            <button
                              key={idx}
                              onClick={() => { setSelectedImgIdx(idx); setIs360Mode(false); }}
                              className={`aspect-[4/3] rounded-xl overflow-hidden border-2 relative transition-all bg-gray-100 ${
                                selectedImgIdx === idx && !is360Mode ? 'border-amber-500 ring-2 ring-amber-400/25 scale-98' : 'border-transparent opacity-70 hover:opacity-100'
                              }`}
                            >
                              <img src={alt.url} alt={alt.title} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/10 hover:bg-transparent" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* System Alerts and feedback messages banner */}
                      {contactAlert && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-emerald-50 border border-emerald-250 p-3.5 rounded-2xl flex items-start gap-2.5 text-emerald-800 text-xs"
                        >
                          <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-extrabold text-emerald-950 uppercase text-[9px] tracking-wider font-mono">Real-time Connection Triggered</p>
                            <p className="font-medium mt-0.5 leading-relaxed">{contactAlert}</p>
                          </div>
                        </motion.div>
                      )}

                    </div>

                    {/* RIGHT PANEL: Pricing Specs & Inquiry Actions Desk */}
                    <div className="space-y-6">
                      
                      {/* Name, rating, certificate credentials */}
                      <div className="space-y-2 text-left">
                        <div className="flex items-center gap-2">
                          {selectedCarDetail.isCertified ? (
                            <span className="flex items-center gap-1 text-[9px] font-mono font-bold uppercase bg-rose-50 border border-rose-200 text-rose-600 px-2.5 py-0.5 rounded">
                              <Award className="w-3.5 h-3.5 text-rose-500" />
                              Platinum Certified
                            </span>
                          ) : (
                            <span className="text-[9px] font-mono font-bold uppercase bg-slate-50 border border-gray-250 text-gray-500 px-2 py-0.5 rounded">
                              Verified Standard
                            </span>
                          )}
                          <span className="text-[9px] font-mono font-bold uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded flex items-center gap-1">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                            ID: {selectedCarDetail.id}
                          </span>
                        </div>

                        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                          {selectedCarDetail.brand} <span className="text-amber-500">{selectedCarDetail.model}</span>
                        </h1>
                        <p className="text-xs font-semibold text-gray-400 font-mono uppercase tracking-wider">{selectedCarDetail.color} • {selectedCarDetail.bodyType} Category Layout</p>
                      </div>

                      {/* High-contrast pricing segment with calculated EMI widget */}
                      <div className="bg-slate-950 text-white rounded-2xl p-5 border border-slate-900 shadow-md text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <span className="block text-[8px] uppercase font-mono tracking-widest text-[#f59e0b] font-bold">Uncompromising Buy Price</span>
                          <span className="text-3xl font-black text-white">₹{selectedCarDetail.price.toLocaleString('en-IN')}</span>
                          <span className="text-xs text-slate-500 font-medium block mt-0.5">All local taxes, registration, and documentation assist handled in escrow.</span>
                        </div>
                        <div className="border-t sm:border-t-0 sm:border-l border-slate-900 pt-3 sm:pt-0 sm:pl-5 flex flex-col">
                          <span className="text-[8px] uppercase font-mono tracking-widest text-emerald-400 font-semibold">Calculated EMI Options</span>
                          <span className="text-lg font-extrabold text-[#10b981]">₹{monthlyEmi.toLocaleString('en-IN')}/month</span>
                          <span className="text-[10px] text-slate-400 font-semibold font-mono">15% Down @ 5yr tenure</span>
                        </div>
                      </div>

                      {/* Verified Seller Info card layout */}
                      <div className="bg-slate-50 border border-gray-150 p-4 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-left">
                          <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 font-mono text-sm font-black flex items-center justify-center border border-amber-400">
                            PS
                          </div>
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <h4 className="text-xs font-extrabold text-slate-900">Priya Sharma</h4>
                              <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-650 text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded font-mono">Verified advisor</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-medium font-mono leading-none mt-1">VelocityMoto Seattle Central Appraiser • rating 4.9★</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="block text-[8px] font-bold font-mono uppercase tracking-widest text-emerald-600">● Live Status</span>
                          <span className="text-[10px] text-slate-400 font-semibold">Responding under 5 min</span>
                        </div>
                      </div>

                      {/* Directly accessible Action triggers Call & Whatsapp block */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            window.location.href = 'tel:+9182044460';
                            setContactAlert(`Calling specialist at +91 82044 4460 for the ${selectedCarDetail.year} ${selectedCarDetail.brand} ${selectedCarDetail.model}.`);
                          }}
                          className="py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-center text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shadow active:scale-95 transition-all text-ellipsis"
                        >
                          <Phone className="w-4 h-4 text-emerald-400" />
                          <span>Call Specialist</span>
                        </button>
                        <button
                          onClick={() => {
                            const prefilledText = `Hello VelocityMoto! I am interested in inquiring about the certified pre-owned ${selectedCarDetail.year} ${selectedCarDetail.brand} ${selectedCarDetail.model} (ID: ${selectedCarDetail.id}) listed for ₹${selectedCarDetail.price.toLocaleString('en-IN')}. Is this car currently available for a callback or showroom test drive?`;
                            window.open(`https://wa.me/9182044460?text=${encodeURIComponent(prefilledText)}`, '_blank', 'noopener,noreferrer');
                            setContactAlert(`Direct secure WhatsApp link has been opened for the ${selectedCarDetail.year} ${selectedCarDetail.brand} ${selectedCarDetail.model}. Prefilled chat inquiry loaded on your client.`);
                          }}
                          className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-center text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer shadow active:scale-95 transition-all"
                        >
                          <svg className="w-4 h-4 fill-current text-white shrink-0" viewBox="0 0 24 24">
                            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.432 2.56 1.288 3.552l-.837 3.05 3.122-.818c.954.522 2.025.797 3.119.797 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.586-5.781-5.792-5.781zm3.385 8.163c-.15.422-.76.772-1.05.812-.29.04-.58.07-.98.07-.3.0-.76-.09-1.34-.33-.58-.24-1.29-.68-1.87-1.26s-1.02-1.29-1.26-1.87c-.24-.58-.33-1.04-.33-1.34 0-.4.03-.69.07-.98.04-.29.39-.9.81-1.05.15-.05.3-.08.45-.08.15 0 .3.03.35.15.09.24.47 1.14.51 1.23.04.09.07.18.01.3-.06.12-.12.18-.21.3-.09.12-.19.24-.27.33s-.18.19-.07.38c.11.19.49.81 1.05 1.31s1.08.68 1.27.79c.19.11.3-.01.39-.11s.39-.45.49-.6c.11-.15.22-.12.35-.07.13.05.81.38.95.45.14.07.24.11.27.17.03.06.03.36-.12.78zM12 0C5.373 0 0 5.373 0 12c0 2.114.547 4.102 1.506 5.845L0 24l6.327-1.464C7.994 23.362 9.947 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22.031c-1.895 0-3.753-.51-5.373-1.472l-.385-.229-3.993.924.94-3.649-.251-.4c-1.056-1.681-1.616-3.623-1.616-5.635 0-5.53 4.499-10.029 10.029-10.029 5.53 0 10.029 4.499 10.029 10.029s-4.499 10.029-10.029 10.029z"/>
                          </svg>
                          <span>WhatsApp Chat</span>
                        </button>
                      </div>

                      {/* Form: Book direct Showroom Test Drive Desk */}
                      <div className="bg-slate-50/50 p-5 rounded-2xl border border-gray-150 text-left">
                        <div className="flex items-center space-x-2 mb-3">
                          <CalendarDays className="w-4 h-4 text-[#d97706]" />
                          <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wide">Request Showroom Test Drive Or Hub Inspection</h4>
                        </div>
                        <form onSubmit={handleInquireTestDrive} className="space-y-2.5">
                          <div className="grid grid-cols-2 gap-2">
                            <input 
                              type="text" 
                              placeholder="Your full name" 
                              value={userName} 
                              onChange={(e) => setUserName(e.target.value)} 
                              className="w-full px-3 py-2 border border-gray-200 bg-white rounded-xl text-xs font-semibold placeholder:text-gray-400 focus:outline-none focus:border-amber-500"
                              required
                            />
                            <input 
                              type="tel" 
                              placeholder="Phone number" 
                              value={userPhone} 
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setUserPhone(val);
                              }} 
                              className="w-full px-3 py-2 border border-gray-200 bg-white rounded-xl text-xs font-semibold placeholder:text-gray-400 focus:outline-none focus:border-amber-500"
                              required
                            />
                          </div>
                          <div>
                            <input 
                              type="date" 
                              value={bookingDate} 
                              onChange={(e) => setBookingDate(e.target.value)} 
                              className="w-full px-3 py-2 border border-gray-200 bg-white rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:border-amber-500"
                              required
                            />
                          </div>
                          <button
                            type="submit"
                            disabled={isBooked}
                            className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-100 text-slate-950 text-xs font-black uppercase tracking-widest rounded-xl transition-all shadow cursor-pointer text-center uppercase"
                          >
                            {isBooked ? 'Transmitting Schedule request...' : 'Book Direct Showroom Test Drive'}
                          </button>
                        </form>
                      </div>

                    </div>

                  </div>

                  {/* BOTTOM SECTION 1: Technical Spec parameters Grid Table */}
                  <div className="border-t border-gray-150 pt-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#94a3b8] font-mono mb-4 text-left">Detailed Technical Component Specs</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                      
                      <div className="bg-slate-50 p-3 rounded-2xl text-left border border-gray-100">
                        <span className="block text-[8px] font-bold uppercase tracking-wider text-gray-400 font-mono">Reg. Year</span>
                        <span className="text-xs font-bold text-slate-800">{selectedCarDetail.year} Model</span>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-2xl text-left border border-gray-100">
                        <span className="block text-[8px] font-bold uppercase tracking-wider text-gray-400 font-mono">Fuel Type</span>
                        <span className="text-xs font-bold text-slate-800">{selectedCarDetail.fuelType} Type</span>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-2xl text-left border border-gray-100">
                        <span className="block text-[8px] font-bold uppercase tracking-wider text-gray-400 font-mono">Transmission</span>
                        <span className="text-xs font-bold text-slate-800">{selectedCarDetail.transmission}</span>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-2xl text-left border border-gray-100">
                        <span className="block text-[8px] font-bold uppercase tracking-wider text-gray-400 font-mono">Ownership count</span>
                        <span className="text-xs font-bold text-slate-800">{selectedCarDetail.owners} Owner{selectedCarDetail.owners > 1 ? 's' : ''}</span>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-2xl text-left border border-gray-100 col-span-1">
                        <span className="block text-[8px] font-bold uppercase tracking-wider text-gray-400 font-mono">Insurance policy</span>
                        <span className="text-xs font-bold text-slate-800 text-ellipsis overflow-hidden block whitespace-nowrap" title={insuranceStatus}>Comprehensive</span>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-2xl text-left border border-gray-100 col-span-1">
                        <span className="block text-[8px] font-bold uppercase tracking-wider text-gray-400 font-mono">Registration Plate</span>
                        <span className="text-xs font-bold text-slate-800 text-ellipsis overflow-hidden block whitespace-nowrap" title={registrationRto}>{registrationRto.slice(0, 10)}...</span>
                      </div>

                      <div className="bg-slate-50 p-3 rounded-2xl text-left border border-gray-100">
                        <span className="block text-[8px] font-bold uppercase tracking-wider text-gray-400 font-mono font-black text-amber-600">Inspection index</span>
                        <span className="text-xs font-extrabold text-[#d97706]">{inspectionScore} / 10 Score</span>
                      </div>

                    </div>
                  </div>

                  {/* BOTTOM SECTION 2: Dynamic green/red diagnostics checklist */}
                  <div className="border-t border-gray-150 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-black uppercase tracking-widest text-[#94a3b8] font-mono text-left">Vetted Diagnostic Inspection Scorecard</h3>
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 font-mono font-bold px-2 py-0.5 rounded leading-none">Passed 140-point verification</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      
                      {/* Engine */}
                      <div className="border border-emerald-100 bg-emerald-50/20 p-4 rounded-2xl text-left">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-black text-slate-800">1. Engine & Power</span>
                          <span className="text-[9px] font-black font-mono uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Pass</span>
                        </div>
                        <p className="text-[11px] text-gray-505 text-slate-650 leading-normal">Zero compression drops, verified silent cylinder block, smooth ignition phase.</p>
                      </div>

                      {/* Tyres */}
                      <div className="border border-emerald-100 bg-emerald-50/20 p-4 rounded-2xl text-left">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-black text-slate-800">2. Tyres & Wheels</span>
                          <span className="text-[9px] font-black font-mono uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Pass</span>
                        </div>
                        <p className="text-[11px] text-[#2e7d32] text-slate-650 leading-normal">Uniform wear, tire tread depth measured at 6.8mm (~85% remaining life).</p>
                      </div>

                      {/* Brakes */}
                      <div className="border border-emerald-100 bg-emerald-50/20 p-4 rounded-2xl text-left">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-black text-slate-800">3. Braking System</span>
                          <span className="text-[9px] font-black font-mono uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Pass</span>
                        </div>
                        <p className="text-[11px] text-slate-650 leading-normal">ABS sensors calibrated perfectly, pads pristine with thickness exceeding safety levels.</p>
                      </div>

                      {/* Paint Work */}
                      <div className="border border-amber-200 bg-amber-500/5 p-4 rounded-2xl text-left">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-black text-slate-800">4. Paint Coating</span>
                          <span className="text-[9px] font-black font-mono uppercase bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Scratch</span>
                        </div>
                        <p className="text-[11px] text-slate-650 leading-normal">Original premium metal coat. Minor cosmetic scratch on bumper edge polished nicely.</p>
                      </div>

                      {/* Battery */}
                      <div className="border border-emerald-100 bg-emerald-50/20 p-4 rounded-2xl text-left">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-black text-slate-800">5. Battery Health</span>
                          <span className="text-[9px] font-black font-mono uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">Pass</span>
                        </div>
                        <p className="text-[11px] text-slate-650 leading-normal">Voltage delivery registered constant 12.8V. Certified 100% load life performance.</p>
                      </div>

                    </div>
                  </div>

                  {/* BOTTOM SECTION 3: Similar Recommended Cars */}
                  {similarCarsList.length > 0 && (
                    <div className="border-t border-gray-150 pt-6">
                      <h3 className="text-xs font-black uppercase tracking-widest text-[#94a3b8] font-mono mb-4 text-left">Similar Recommendations Match List</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {similarCarsList.map(item => (
                          <div 
                            key={item.id}
                            onClick={() => setSelectedCarDetail(item)}
                            className="bg-slate-50 hover:bg-slate-100 p-3 rounded-2xl flex items-center gap-3.5 border border-gray-150 cursor-pointer shadow-sm hover:shadow-md transition-all text-left"
                          >
                            <img src={item.image} alt={item.model} className="w-16 h-12 object-cover rounded-lg shrink-0 border border-gray-200" />
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs font-extrabold text-slate-900 truncate leading-tight">{item.brand} {item.model}</h4>
                              <p className="text-[10px] text-gray-500 font-semibold font-mono mt-0.5">{item.year} • {item.transmission} • {item.fuelType}</p>
                              <p className="text-xs font-extrabold text-slate-800 mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                            </div>
                            <button
                              type="button"
                              className="px-2.5 py-1.5 bg-white text-slate-900 hover:bg-slate-900 hover:text-white border border-gray-200 text-[10px] font-bold rounded-lg transition-all"
                            >
                              Explore
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}
