import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BadgePercent, Shield, Scale, Calculator, CalendarCheck, CheckSquare, Sparkles, AlertCircle, FileText, ChevronRight, Star, Upload, Camera, ChevronLeft, ArrowRight, DollarSign, User, Mail, Phone, MapPin, Trash2 } from 'lucide-react';
import { ValuationResult, Car } from '../types';

interface SellCarProps {
  subTab?: 'valuation' | 'sell' | 'inspection';
  setSubTab?: React.Dispatch<React.SetStateAction<'valuation' | 'sell' | 'inspection'>>;
  onAddCar?: (car: Car) => void;
}

export default function SellCar({ subTab: propSubTab, setSubTab: propSetSubTab, onAddCar }: SellCarProps) {
  const [localSubTab, setLocalSubTab] = useState<'valuation' | 'sell' | 'inspection'>('valuation');
  const subTab = propSubTab !== undefined ? propSubTab : localSubTab;
  const setSubTab = propSetSubTab !== undefined ? propSetSubTab : setLocalSubTab;

  /* Valuation State */
  const [carBrand, setCarBrand] = useState('Toyota');
  const [carModel, setCarModel] = useState('');
  const [carYear, setCarYear] = useState('2021');
  const [carMileage, setCarMileage] = useState('45000');
  const [carBodyShape, setCarBodyShape] = useState('SUV');
  const [carCondition, setCarCondition] = useState<'Excellent' | 'Good' | 'Fair'>('Good');
  const [carOwners, setCarOwners] = useState('1');
  const [valuationReport, setValuationReport] = useState<ValuationResult | null>(null);

  /* Sell form state */
  const [sellName, setSellName] = useState('');
  const [sellPhone, setSellPhone] = useState('');
  const [sellEmail, setSellEmail] = useState('');
  const [sellComments, setSellComments] = useState('');
  const [sellSubmitted, setSellSubmitted] = useState(false);

  /* Step-by-step 5-Stage Form State */
  const [sellStep, setSellStep] = useState<number>(1);
  const [sellBrand, setSellBrand] = useState('Toyota');
  const [sellModel, setSellModel] = useState('');
  const [sellYear, setSellYear] = useState('2022');

  const [sellKms, setSellKms] = useState('45000');
  const [sellFuel, setSellFuel] = useState('Petrol');
  const [sellTransmission, setSellTransmission] = useState('Automatic');

  const [sellImages, setSellImages] = useState<string[]>([]);
  const [sellPrice, setSellPrice] = useState<number>(1968000);

  const [sellContactName, setSellContactName] = useState('');
  const [sellContactPhone, setSellContactPhone] = useState('');
  const [sellContactEmail, setSellContactEmail] = useState('');
  const [sellContactLocation, setSellContactLocation] = useState('Downtown Seattle Main Showroom');
  const [sellStepFormSubmitted, setSellStepFormSubmitted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleBeginSelling = () => {
    setSellBrand(carBrand);
    setSellModel(carModel);
    setSellYear(carYear);
    setSellKms(carMileage);
    // Suggest expected price based on valuation key if populated
    if (valuationReport) {
      setSellPrice(Math.round((valuationReport.estimatedLow + valuationReport.estimatedHigh) / 2));
    }
    setSellStep(1);
    setSubTab('sell');
  };

  /* Inspection Form State */
  const [inspectDate, setInspectDate] = useState('');
  const [inspectTime, setInspectTime] = useState('');
  const [inspectLocation, setInspectLocation] = useState('Downtown Seattle Main Showroom');
  const [inspectSubmitted, setInspectSubmitted] = useState(false);

  const calculateValuation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!carMileage || isNaN(Number(carMileage)) || Number(carMileage) < 0) {
      alert("Please specify a logical mileage count to estimate valuation.");
      return;
    }

    // Advanced dynamic valuation logic based on realistic metrics
    let baseStartingValue = 25000; // default Sedan
    if (carBodyShape === 'Hatchback') baseStartingValue = 18000;
    if (carBodyShape === 'SUV') baseStartingValue = 36000;
    if (carBodyShape === 'Luxury' || carBodyShape === 'Coupe') baseStartingValue = 75000;

    // Year depreciation factor (reference year: 2026)
    const age = 2026 - parseInt(carYear);
    const ageDepreciationMultiplier = Math.max(0.3, 1 - (age * 0.085));

    // Mileage depreciation: ₹5.00 per km driven equivalent (scaled)
    const mileageDepreciation = Number(carMileage) * 0.06;

    // Initial base computation
    let computedValue = (baseStartingValue * ageDepreciationMultiplier) - mileageDepreciation;
    
    // Safety guard
    if (computedValue < 3000) computedValue = 3200 + (baseStartingValue * 0.05);

    // Scale to Indian Rupees (approx 1 USD = 82 INR)
    computedValue = computedValue * 82;

    // Condition Multipliers
    let conditionMultiplier = 0.95; // Good
    if (carCondition === 'Excellent') conditionMultiplier = 1.12;
    if (carCondition === 'Fair') conditionMultiplier = 0.72;

    // Owners depreciation
    const ownersFactor = Math.max(0.8, 1 - ((parseInt(carOwners) - 1) * 0.045));

    // Final core valuation
    const finalEstimatedOffer = Math.round(computedValue * conditionMultiplier * ownersFactor);
    
    // Formatting high-low estimate bands
    const estimatedLow = Math.round(finalEstimatedOffer * 0.93);
    const estimatedHigh = Math.round(finalEstimatedOffer * 1.07);
    const excellentPrice = Math.round(finalEstimatedOffer * 1.12);
    const goodPrice = Math.round(finalEstimatedOffer * 0.98);
    const fairPrice = Math.round(finalEstimatedOffer * 0.76);

    setValuationReport({
      estimatedLow,
      estimatedHigh,
      excellentPrice,
      goodPrice,
      fairPrice
    });
  };

  const handleSellSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellName || !sellPhone || !sellEmail) {
      alert("Please ensure core contacts (Name, phone, and Email) are fully filled out.");
      return;
    }
    setSellSubmitted(true);
    setTimeout(() => {
      setSellSubmitted(false);
      setSellName('');
      setSellPhone('');
      setSellEmail('');
      setSellComments('');
      alert("Success! Your online vehicle portfolio has been generated. An acquisition advisor will send an instant cash proposal to your email within 1 hour.");
    }, 2000);
  };

  const uploadImages = async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    const response = await fetch('http://localhost:5000/api/cars/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Image upload failed');
    }

    const data = await response.json();
    return data.urls as string[];
  };

  const handleInspectionSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inspectDate || !inspectTime) {
      alert("Please complete the appointment timing and date calendar slots.");
      return;
    }
    setInspectSubmitted(true);
    setTimeout(() => {
      setInspectSubmitted(false);
      setInspectDate('');
      setInspectTime('');
      alert("Inspection Slot booked! Your vehicle inspection confirmation SMS has been dispatched. Please arrive with RTO titles and keys.");
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      
      {/* Visual Header */}
      <div id="sell-header" className="mb-10 text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 font-mono">Resale Trade-in Center</span>
        <h1 className="text-3xl sm:text-4.5xl font-black text-gray-900 tracking-tight leading-tight mt-1">SELL OR TRADE-IN YOUR CAR</h1>
        <p className="text-sm text-gray-500 mt-2">Get an algorithmic market valuation in seconds, list your model for a cash checkout offer, or secure a showroom safety inspection slot on-the-spot.</p>

        {/* Action sub-tabs */}
        <div className="flex justify-center border-b border-gray-150 mt-8 gap-3 sm:gap-6">
          <button 
            onClick={() => { setSubTab('valuation'); }}
            className={`pb-3 text-xs sm:text-sm font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
              subTab === 'valuation' ? 'border-amber-500 text-slate-900' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            1. Instant Valuation Calculator
          </button>
          <button 
            onClick={() => { setSubTab('sell'); }}
            className={`pb-3 text-xs sm:text-sm font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
              subTab === 'sell' ? 'border-amber-500 text-slate-900' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            2. Sell My Car Online
          </button>
          <button 
            onClick={() => { setSubTab('inspection'); }}
            className={`pb-3 text-xs sm:text-sm font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
              subTab === 'inspection' ? 'border-amber-500 text-slate-900' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            3. Book Showroom Inspection
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          
          {/* Subtab 1: Valuation Calculator Engine */}
          {subTab === 'valuation' && (
            <motion.div 
              key="valuation-sub"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
            >
              {/* Form Input fields */}
              <form onSubmit={calculateValuation} className="bg-white border border-gray-150 rounded-3xl p-6.5 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-50">
                  <Calculator className="w-5 h-5 text-amber-500" />
                  <h3 className="text-sm font-extrabold uppercase text-slate-900 font-sans tracking-wide">Configure Valuation Form</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5">Brand / Make</label>
                    <select value={carBrand} onChange={(e) => setCarBrand(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-150 rounded-xl text-xs text-gray-800">
                      <option value="Toyota">Toyota</option>
                      <option value="Honda">Honda</option>
                      <option value="Tesla">Tesla</option>
                      <option value="BMW">BMW</option>
                      <option value="Audi">Audi</option>
                      <option value="Ford">Ford</option>
                      <option value="Hyundai">Hyundai</option>
                      <option value="Nissan">Nissan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5">Model Family</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Civic, RAV4, 3 Series" 
                      value={carModel} 
                      onChange={(e) => setCarModel(e.target.value)} 
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-150 rounded-xl text-xs" 
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5">Production Year</label>
                    <select value={carYear} onChange={(e) => setCarYear(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-150 rounded-xl text-xs text-gray-800">
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                      <option value="2021">2021</option>
                      <option value="2020">2020</option>
                      <option value="2019">2019</option>
                      <option value="2018">2018</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5">Segment Body Style</label>
                    <select value={carBodyShape} onChange={(e) => setCarBodyShape(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-150 rounded-xl text-xs text-gray-800">
                      <option value="Hatchback">Hatchback / Compact</option>
                      <option value="Sedan">Sedan / Executive</option>
                      <option value="SUV">SUV & Crossover</option>
                      <option value="Luxury">Luxury Model</option>
                      <option value="Coupe">Coupe / Sport</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5">Odometer Mileage (km)</label>
                  <input 
                    type="number" 
                    min="0"
                    placeholder="e.g. 45000" 
                    value={carMileage} 
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || parseFloat(val) >= 0) {
                        setCarMileage(val);
                      }
                    }} 
                    onKeyDown={(e) => {
                      if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                        e.preventDefault();
                      }
                    }}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-150 rounded-xl text-xs" 
                    required 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5">Overall Physical State</label>
                    <select value={carCondition} onChange={(e) => setCarCondition(e.target.value as any)} className="w-full px-3 py-2 bg-gray-50 border border-gray-150 rounded-xl text-xs text-gray-800">
                      <option value="Excellent">Excellent (No defects, full history)</option>
                      <option value="Good">Good (Minor stone chips, clean inside)</option>
                      <option value="Fair">Fair (Needs styling / mechanical refresh)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5">Owners Record</label>
                    <select value={carOwners} onChange={(e) => setCarOwners(e.target.value)} className="w-full px-3 py-2 bg-gray-50 border border-gray-150 rounded-xl text-xs text-gray-800">
                      <option value="1">1 Owner (Private)</option>
                      <option value="2">2 Owners</option>
                      <option value="3">3+ Owners</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-amber-500 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer uppercase active:scale-95 flex items-center justify-center space-x-2"
                >
                  <Calculator className="w-4.5 h-4.5" />
                  <span>Estimate Market Price &rarr;</span>
                </button>
              </form>

              {/* Real Algorithmic Output panel */}
              <div id="valuation-result-panel" className="bg-white border border-gray-150 rounded-3xl p-6.5 shadow-sm h-full flex flex-col justify-between">
                {valuationReport ? (
                  <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                    <div className="bg-amber-500/10 border border-amber-300 rounded-2xl p-4 text-center">
                      <span className="text-[9px] uppercase tracking-widest font-mono text-amber-700 font-bold block mb-1">Calculated Resale Valuation</span>
                      <p className="text-3.5xl font-black text-gray-950">₹{valuationReport.estimatedLow.toLocaleString('en-IN')} - ₹{valuationReport.estimatedHigh.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-gray-500 mt-1">Guaranteed minimum instant trade-in quotation offer.</p>
                    </div>

                    <div className="space-y-3.5">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono">Resale Grades Analysis</h4>
                      
                      <div className="flex items-center justify-between text-sm py-2 border-b border-gray-50">
                        <span className="text-emerald-600 font-bold flex items-center gap-1">★ Excellent Price</span>
                        <strong>₹{valuationReport.excellentPrice.toLocaleString('en-IN')}</strong>
                      </div>

                      <div className="flex items-center justify-between text-sm py-2 border-b border-gray-50">
                        <span className="text-amber-600 font-bold flex items-center gap-1">★ Good Average Price</span>
                        <strong>₹{valuationReport.goodPrice.toLocaleString('en-IN')}</strong>
                      </div>

                      <div className="flex items-center justify-between text-sm py-2 pb-0">
                        <span className="text-gray-500 font-medium flex items-center gap-1">★ Fair Base Price</span>
                        <strong>₹{valuationReport.fairPrice.toLocaleString('en-IN')}</strong>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-gray-150 p-4 rounded-2xl flex items-start gap-2.5">
                      <Shield className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">Locked Resale Quote</span>
                        <p className="text-[11px] text-gray-500 leading-normal mt-0.5">Submit this configuration to book an inspection. Our physical cash guarantees hold reliable for up to 7 business days.</p>
                      </div>
                    </div>

                    <button 
                      onClick={handleBeginSelling} 
                      className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer uppercase flex items-center justify-center gap-1.5"
                    >
                      <span>Begin Selling Process</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-gray-400 h-full">
                    <Calculator className="w-16 h-16 text-gray-300 stroke-[1.5] mb-4" />
                    <h3 className="text-base font-bold text-gray-700">Valuation calculator pending</h3>
                    <p className="text-xs max-w-[260px] mx-auto mt-1 leading-normal">Enter your car model, manufacture year, body shape, and odometer count to compute accurate cash proposals.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Subtab 2: Sell online multi-step form */}
          {subTab === 'sell' && (
            <motion.div 
              key="sell-sub"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-sm text-left max-w-2xl mx-auto"
            >
              {/* Steps Progress Header Tracker */}
              <div id="wizard-progress-bar" className="mb-8">
                <div className="flex items-center justify-between pointer-events-none">
                  {[
                    { step: 1, label: "Basics" },
                    { step: 2, label: "Details" },
                    { step: 3, label: "Images" },
                    { step: 4, label: "Pricing" },
                    { step: 5, label: "Contact" }
                  ].map((s) => {
                    const isActive = sellStep === s.step;
                    const isCompleted = sellStep > s.step || sellStepFormSubmitted;
                    return (
                      <div key={s.step} className="flex flex-col items-center flex-1 relative">
                        {/* Connecting Line */}
                        {s.step > 1 && (
                          <div className={`absolute left-0 right-1/2 top-4 h-0.5 -translate-x-1/2 -z-10 ${
                            sellStep >= s.step ? 'bg-amber-500' : 'bg-gray-100'
                          }`} />
                        )}
                        
                        {/* Step Circle Bubble */}
                        <div className={`w-8.5 h-8.5 rounded-full flex items-center justify-center font-mono text-xs font-black transition-all border ${
                          isCompleted 
                            ? 'bg-amber-500 text-slate-950 border-amber-500'
                            : isActive 
                              ? 'bg-slate-950 text-amber-400 border-slate-950 ring-4 ring-amber-400/20' 
                              : 'bg-gray-50 text-gray-400 border-gray-200'
                        }`}>
                          {isCompleted ? "✓" : s.step}
                        </div>
                        <span className={`text-[10px] font-bold mt-2 font-sans uppercase tracking-wider ${
                          isActive ? 'text-slate-950 font-black' : isCompleted ? 'text-amber-600' : 'text-gray-400'
                        }`}>
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Wizard Content Shell */}
              <AnimatePresence mode="wait">
                
                {/* Success View */}
                {sellStepFormSubmitted ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10 space-y-6"
                  >
                    <div className="w-20 h-20 bg-emerald-50 border border-emerald-250 text-emerald-600 flex items-center justify-center rounded-3xl mx-auto shadow-sm">
                      <CheckSquare className="w-10 h-10 stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-950 uppercase tracking-tight">Active Listing Generated!</h3>
                      <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">Your car has been listed successfully. Our automated regional advisor network has synchronized this record.</p>
                    </div>

                    {/* Receipt Sheet */}
                    <div className="bg-slate-50 border border-gray-150 rounded-2xl p-5 text-left max-w-md mx-auto space-y-3 font-mono text-xs text-slate-700">
                      <div className="text-center pb-2 border-b border-gray-200 uppercase font-bold text-[10px] tracking-widest text-slate-400">
                        Listing Summary Voucher
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-bold uppercase">Vehicle:</span>
                        <strong className="text-slate-950 font-sans">{sellYear} {sellBrand} {sellModel || "Standard Family"}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-bold uppercase">Target Valuation:</span>
                        <strong className="text-emerald-700">₹{sellPrice.toLocaleString('en-IN')}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-bold uppercase">Odometer Specs:</span>
                        <strong className="text-slate-950">{Number(sellKms).toLocaleString()} km</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-bold uppercase">Fuel / Drive:</span>
                        <strong className="text-slate-950">{sellFuel} ({sellTransmission})</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-bold uppercase">Drop-off Depot:</span>
                        <strong className="text-slate-950 font-sans text-right truncate max-w-[180px]">{sellContactLocation}</strong>
                      </div>
                      <div className="pt-2 border-t border-dashed border-gray-200 text-center text-[10px] text-gray-400">
                        Code: LIST-{Math.floor(100000 + Math.random() * 900000)} • Verified Online
                      </div>
                    </div>

                    <div className="flex gap-3 justify-center max-w-md mx-auto">
                      <button
                        onClick={() => {
                          setSellStepFormSubmitted(false);
                          setSellStep(1);
                          setSellModel('');
                          setSellImages([]);
                        }}
                        className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase cursor-pointer"
                      >
                        List Another Car
                      </button>
                      <button
                        onClick={() => {
                          setSubTab('inspection');
                        }}
                        className="flex-1 py-3 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold uppercase cursor-pointer"
                      >
                        Schedule Inspection drive
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    
                    {/* STEP 1: Basics */}
                    {sellStep === 1 && (
                      <motion.div 
                        key="basics"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <div>
                          <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center space-x-2">
                            <Sparkles className="w-5 h-5 text-amber-500" />
                            <span>Step 1 — Car Basics & Make</span>
                          </h4>
                          <p className="text-xs text-gray-400 mt-0.5">Please specify the exact build parameters and manufacture timeline of your vehicle.</p>
                        </div>

                        <div className="space-y-3.5 pt-2">
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono mb-1.5">Brand / Manufacturer</label>
                            <select 
                              value={sellBrand} 
                              onChange={(e) => setSellBrand(e.target.value)} 
                              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-xl text-xs font-bold text-gray-800 outline-none"
                            >
                              <option value="Toyota">🚗 Toyota</option>
                              <option value="Honda">🚗 Honda</option>
                              <option value="Model Y">⚡ Tesla</option>
                              <option value="BMW">🇩🇪 BMW</option>
                              <option value="Audi">🇩🇪 Audi</option>
                              <option value="Ford">🇺🇸 Ford</option>
                              <option value="Hyundai">🇰🇷 Hyundai</option>
                              <option value="Nissan">🇯🇵 Nissan</option>
                              <option value="Chevrolet">🇺🇸 Chevrolet</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono mb-1.5">Model Name / Sub-brand</label>
                            <input 
                              type="text" 
                              placeholder="e.g. Camry, Civic, Model 3, X5, Mustang"
                              value={sellModel}
                              onChange={(e) => setSellModel(e.target.value)}
                              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-xl text-xs font-semibold text-gray-800 outline-none placeholder:text-gray-400"
                              required
                            />
                            
                            {/* Suggestions Tags */}
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              <span className="text-[10px] text-gray-400 py-0.5">Try:</span>
                              {["Civic", "RAV4", "Model 3", "3 Series"].map((suggest) => (
                                <button
                                  key={suggest}
                                  type="button"
                                  onClick={() => setSellModel(suggest)}
                                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold"
                                >
                                  +{suggest}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono mb-1.5">Year of Manufacture</label>
                            <select 
                              value={sellYear} 
                              onChange={(e) => setSellYear(e.target.value)} 
                              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-xl text-xs font-bold text-gray-800 outline-none"
                            >
                              {["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"].map((year) => (
                                <option key={year} value={year}>{year} Model</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-end">
                          <button
                            type="button"
                            disabled={!sellModel.trim()}
                            onClick={() => setSellStep(2)}
                            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold tracking-wider uppercase rounded-xl flex items-center space-x-1 cursor-pointer transition-all active:scale-95 shadow"
                          >
                            <span>Next: Details</span>
                            <ChevronRight className="w-4 h-4 text-amber-400 animate-pulse" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 2: Details */}
                    {sellStep === 2 && (
                      <motion.div 
                        key="details"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <div>
                          <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center space-x-2">
                            <FileText className="w-5 h-5 text-amber-500" />
                            <span>Step 2 — Vehicle Specific Details</span>
                          </h4>
                          <p className="text-xs text-gray-400 mt-0.5">Define mechanical systems, odometer mileage history, and engine transmissions.</p>
                        </div>

                        <div className="space-y-4 pt-2">
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono mb-1.5">Total Kilometers Driven (Odometer)</label>
                            <input 
                              type="number" 
                              placeholder="e.g. 45000"
                              value={sellKms}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === '' || parseFloat(val) >= 0) {
                                  setSellKms(val);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                                  e.preventDefault();
                                }
                              }}
                              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-xl text-xs font-bold text-gray-800 outline-none"
                              min="0"
                              required
                            />
                            <p className="text-[10px] text-gray-400 mt-1 leading-normal italic">High-mileage ranges remain valued with reliable engine warranty verification papers.</p>
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono mb-11 mb-1.5">Fuel Type Category</label>
                            <div className="grid grid-cols-4 gap-2">
                              {["Petrol", "Diesel", "Electric", "Hybrid"].map((fuel) => (
                                <button
                                  key={fuel}
                                  type="button"
                                  onClick={() => setSellFuel(fuel)}
                                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                                    sellFuel === fuel 
                                      ? 'bg-slate-900 border-slate-900 text-amber-400 shadow-sm'
                                      : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
                                  }`}
                                >
                                  {fuel === "Electric" ? "⚡ EV" : fuel}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono mb-1.5">Transmission Unit</label>
                            <div className="grid grid-cols-2 gap-2">
                              {["Automatic", "Manual"].map((trans) => (
                                <button
                                  key={trans}
                                  type="button"
                                  onClick={() => setSellTransmission(trans)}
                                  className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                                    sellTransmission === trans 
                                      ? 'bg-slate-900 border-slate-900 text-amber-400 shadow-sm'
                                      : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
                                  }`}
                                >
                                  {trans} Drive
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-between">
                          <button
                            type="button"
                            onClick={() => setSellStep(1)}
                            className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-slate-700 text-xs font-bold uppercase rounded-xl flex items-center space-x-1 cursor-pointer transition-all"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Back</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setSellStep(3)}
                            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold tracking-wider uppercase rounded-xl flex items-center space-x-1 cursor-pointer transition-all"
                          >
                            <span>Next: Images</span>
                            <ChevronRight className="w-4 h-4 text-amber-400" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 3: Upload Images */}
                    {sellStep === 3 && (
                      <motion.div 
                        key="images"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <div>
                          <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center space-x-2">
                            <Camera className="w-5 h-5 text-amber-500" />
                            <span>Step 3 — Upload Vehicle Images</span>
                          </h4>
                          <p className="text-xs text-gray-400 mt-0.5">Insert crisp vehicle snapshots. Highlight standard body outlines to captivate central dealer check bidding.</p>
                        </div>

                        {/* Interactive drag & drop file upload frame template */}
                        <div 
                          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                          onDragLeave={() => setIsDragging(false)}
                          onDrop={async (e) => {
                            e.preventDefault();
                            setIsDragging(false);
                            const files = Array.from(e.dataTransfer.files) as File[];
                            const validFiles = files.filter(f => f.type.startsWith('image/'));
                            if (validFiles.length === 0) return;

                            try {
                              const uploadedUrls = await uploadImages(validFiles);
                              setSellImages(prev => [...prev, ...uploadedUrls]);
                            } catch (error) {
                              console.error('Upload failed:', error);
                              alert('Image upload failed. Please try again.');
                            }
                          }}
                          className={`border-2 border-dashed rounded-3xl p-6.5 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                            isDragging ? 'border-amber-500 bg-amber-500/5 ring-4 ring-amber-400/10' : 'border-gray-250 hover:bg-gray-50'
                          }`}
                          onClick={() => {
                            document.getElementById('file-input-trigger')?.click();
                          }}
                        >
                          <input 
                            id="file-input-trigger" 
                            type="file" 
                            multiple 
                            accept="image/*" 
                            className="hidden" 
                            onChange={async (e) => {
                              if (e.target.files) {
                                const files = Array.from(e.target.files) as File[];
                                const validFiles = files.filter(f => f.type.startsWith('image/'));
                                if (validFiles.length === 0) return;

                                try {
                                  const uploadedUrls = await uploadImages(validFiles);
                                  setSellImages(prev => [...prev, ...uploadedUrls]);
                                } catch (error) {
                                  console.error('Upload failed:', error);
                                  alert('Image upload failed. Please try again.');
                                }
                              }
                            }}
                          />
                          <Upload className="w-10 h-10 text-gray-300 stroke-[1.5] mb-2.5" />
                          <p className="text-xs font-bold text-slate-800">Drag & Drop real vehicle photos here</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">or <span className="text-amber-600 font-extrabold underline">browse folders</span> from your device</p>
                          <p className="text-[9px] text-gray-400 mt-2 font-mono">Supports PNG, JPG, or WebP up to 8MB each</p>
                        </div>

                        {/* RENDER STOCK REPLACEMENTS option block (Amazing UX) */}
                        <div className="bg-slate-50 border border-gray-150 rounded-2xl p-4.5 space-y-3">
                          <span className="block text-[10px] font-black uppercase tracking-wider text-[#d97706] font-mono text-left">💡 No real photos? Choose matching stock renders:</span>
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              { label: "Sport Coupe", url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=300&q=80" },
                              { label: "Sedan", url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=300&q=80" },
                              { label: "Modern SUV", url: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=300&q=80" },
                              { label: "Mini Hatch", url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=300&q=80" }
                            ].map((preset, pIdx) => {
                              const isSelected = sellImages.includes(preset.url);
                              return (
                                <button
                                  key={pIdx}
                                  type="button"
                                  onClick={() => {
                                    if (isSelected) {
                                      setSellImages(prev => prev.filter(item => item !== preset.url));
                                    } else {
                                      setSellImages(prev => [...prev, preset.url]);
                                    }
                                  }}
                                  className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all ${
                                    isSelected ? 'border-amber-500 scale-98 shadow-md' : 'border-transparent opacity-85 hover:opacity-100'
                                  }`}
                                >
                                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                                  <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 text-[8px] font-mono font-bold text-center py-0.5 text-gray-200 tracking-tight leading-none truncate">
                                    {preset.label}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Rendering preview lists */}
                        {sellImages.length > 0 && (
                          <div className="space-y-2">
                            <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono text-left">Added Previews ({sellImages.length})</span>
                            <div className="flex flex-wrap gap-2">
                              {sellImages.map((img, idx) => (
                                <div key={idx} className="relative w-15 h-15 rounded-xl overflow-hidden border border-gray-150 group">
                                  <img src={img} alt="preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  <button
                                    type="button"
                                    onClick={() => setSellImages(prev => prev.filter((_, i) => i !== idx))}
                                    className="absolute inset-0 bg-red-600/80 text-white font-bold text-xs opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-sm cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="pt-4 border-t border-gray-100 flex justify-between">
                          <button
                            type="button"
                            onClick={() => setSellStep(2)}
                            className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-slate-700 text-xs font-bold uppercase rounded-xl flex items-center space-x-1 cursor-pointer transition-all"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Back</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setSellStep(4)}
                            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold tracking-wider uppercase rounded-xl flex items-center space-x-1 cursor-pointer transition-all"
                          >
                            <span>Next: Pricing</span>
                            <ChevronRight className="w-4 h-4 text-amber-400" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 4: Pricing */}
                    {sellStep === 4 && (
                      <motion.div 
                        key="pricing"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <div>
                          <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center space-x-2">
                            <DollarSign className="w-5 h-5 text-amber-500" />
                            <span>Step 4 — Define Target Pricing Range</span>
                          </h4>
                          <p className="text-xs text-gray-400 mt-0.5">Select a logical expected buyout price. View estimated buyer EMI breakdown instantly.</p>
                        </div>

                        <div className="bg-slate-950 text-white rounded-2.5xl p-6 border border-slate-900 space-y-4 text-center">
                          <div>
                            <span className="text-[10px] uppercase font-mono tracking-widest text-[#f59e0b] font-bold block mb-1">Your Expected Resale Value</span>
                            <span className="text-4xl font-black text-white">₹{sellPrice.toLocaleString('en-IN')}</span>
                          </div>

                          <input 
                            type="range"
                            min="246000"
                            max="9840000"
                            step="20000"
                            value={sellPrice}
                            onChange={(e) => setSellPrice(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 outline-none"
                          />
                          
                          <div className="flex items-center justify-between font-mono text-[9px] text-slate-400">
                            <span>Min: ₹2.46L</span>
                            <span>Median Market Ideal Range (approx. ₹20.5L)</span>
                            <span>Max: ₹98.4L</span>
                          </div>

                          {/* Quick Value Metrics Widgets */}
                          <div className="pt-4 border-t border-slate-900 grid grid-cols-2 gap-4 text-left font-mono">
                            <div>
                              <span className="block text-[8px] text-gray-400 uppercase tracking-wider">Estimated Buyer EMI</span>
                              <strong className="text-emerald-400 text-sm font-sans font-black">₹{Math.round(sellPrice * 0.02).toLocaleString('en-IN')} / Month</strong>
                              <span className="block text-[8px] text-slate-500 leading-none mt-0.5">Approx. 4.9% ARR over 60 mo</span>
                            </div>
                            <div>
                              <span className="block text-[8px] text-gray-400 uppercase tracking-wider">Direct Commission Fees</span>
                              <strong className="text-white text-sm font-sans font-black">₹0.00 FREE</strong>
                              <span className="block text-[8px] text-slate-500 leading-none mt-0.5">Direct seller exchange benefit</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-between">
                          <button
                            type="button"
                            onClick={() => setSellStep(3)}
                            className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-slate-700 text-xs font-bold uppercase rounded-xl flex items-center space-x-1 cursor-pointer transition-all"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Back</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setSellStep(5)}
                            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold tracking-wider uppercase rounded-xl flex items-center space-x-1 cursor-pointer transition-all"
                          >
                            <span>Next: Contact Details</span>
                            <ChevronRight className="w-4 h-4 text-amber-400" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* STEP 5: Contact Info */}
                    {sellStep === 5 && (
                      <motion.div 
                        key="contact"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                      >
                        <div>
                          <h4 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center space-x-2">
                            <User className="w-5 h-5 text-amber-500" />
                            <span>Step 5 — Contact & Listing Location</span>
                          </h4>
                          <p className="text-xs text-gray-400 mt-0.5">Verify your contact credentials to authorize real-time buyer bids on the vehicle.</p>
                        </div>

                        <div className="space-y-3.5 pt-2">
                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono mb-1.5">Your Full Name</label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-450 text-gray-400 pointer-events-none">
                                <User className="w-4 h-4" />
                              </span>
                              <input 
                                type="text"
                                placeholder="e.g. Liam Vance"
                                value={sellContactName}
                                onChange={(e) => setSellContactName(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-xl text-xs font-bold text-gray-800 outline-none placeholder:text-gray-400"
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono mb-1.5">Phone Number</label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                                  <Phone className="w-4 h-4" />
                                </span>
                                <input 
                                  type="tel"
                                  placeholder="Phone number"
                                  value={sellContactPhone}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    setSellContactPhone(val);
                                  }}
                                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-xl text-xs font-bold text-gray-800 outline-none placeholder:text-gray-400"
                                  required
                                />
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono mb-1.5">Email Address</label>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                                  <Mail className="w-4 h-4" />
                                </span>
                                <input 
                                  type="email"
                                  placeholder="e.g. contact@hub.com"
                                  value={sellContactEmail}
                                  onChange={(e) => setSellContactEmail(e.target.value)}
                                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-xl text-xs font-bold text-gray-800 outline-none placeholder:text-gray-400"
                                  required
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 font-mono mb-1.5">Drop-off Showroom Center Location</label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 pointer-events-none">
                                <MapPin className="w-4 h-4" />
                              </span>
                              <select
                                value={sellContactLocation}
                                onChange={(e) => setSellContactLocation(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-amber-500 rounded-xl text-xs font-bold text-gray-800 outline-none"
                              >
                                <option value="Downtown Seattle Main Showroom">Downtown Seattle main showroom (Union St)</option>
                                <option value="Portland South District Bay">Portland South District Inspection Bay</option>
                                <option value="Los Angeles Boulevard Hub">Los Angeles Boulevard certified showroom</option>
                                <option value="San Francisco Airport Depot">San Francisco Airport trade drop depot</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Direct Listing Action Box */}
                        <div className="pt-4 border-t border-gray-100 flex justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => setSellStep(4)}
                            className="px-4 py-2.5 border border-gray-200 hover:bg-gray-50 text-slate-700 text-xs font-bold uppercase rounded-xl flex items-center space-x-1 cursor-pointer transition-all"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span>Back</span>
                          </button>
                          
                          <button
                            type="button"
                            disabled={!sellContactName.trim() || !sellContactPhone.trim() || !sellContactEmail.trim()}
                            onClick={() => {
                              const newCar: Car = {
                                id: `car-custom-${Date.now()}`,
                                brand: sellBrand || 'Toyota',
                                model: sellModel || 'Standard Variant',
                                year: parseInt(sellYear) || 2022,
                                price: sellPrice || 1450000,
                                mileage: parseInt(sellKms) || 35000,
                                fuelType: (sellFuel as any) || 'Petrol',
                                transmission: (sellTransmission as any) || 'Automatic',
                                bodyType: (carBodyShape as any) || 'SUV',
                                isCertified: false,
                                image: sellImages[0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=1200',
                                power: '150 hp',
                                engine: '2.0L 4-Cylinder Engine',
                                owners: 1,
                                color: 'Alpine White',
                                rating: 4.6,
                                features: ['Direct Marketplace Sale', 'Full Service Record', 'Inspection Passed', 'Power windows'],
                                location: sellContactLocation || 'Hyderabad'
                              };
                              if (onAddCar) {
                                onAddCar(newCar);
                              }
                              setSellStepFormSubmitted(true);
                            }}
                            className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 text-xs font-black tracking-wider uppercase rounded-xl flex items-center space-x-2 cursor-pointer transition-all active:scale-95 shadow"
                          >
                            <span>Publish Active Listing Now</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Subtab 3: Physical Showroom Inspection check booking */}
          {subTab === 'inspection' && (
            <motion.div 
              key="inspect-sub"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white border border-gray-150 rounded-3xl p-8 shadow-sm"
            >
              <div className="max-w-xl mx-auto space-y-6">
                <div className="text-center pb-4 border-b border-gray-100">
                  <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Reserve Professional 150-Point Inspection Calendar</h3>
                  <p className="text-xs text-gray-500 mt-1">Get certified of body health, alloy scans, steering alignment, and exhaust diagnostics at any local showroom of choice.</p>
                </div>

                <form onSubmit={handleInspectionSubmission} className="space-y-4 pt-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5">Pick Showroom location</label>
                    <select
                      value={inspectLocation}
                      onChange={(e) => setInspectLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-150 rounded-xl text-xs text-gray-800 focus:outline-none"
                    >
                      <option value="Downtown Seattle Main Showroom">Downtown Seattle main showroom (Union St)</option>
                      <option value="Portland South District Bay">Portland South District Inspection Bay</option>
                      <option value="Los Angeles Boulevard Hub">Los Angeles Boulevard certified showroom</option>
                      <option value="San Francisco Airport Depot">San Francisco Airport trade drop depot</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5">Calendar Date</label>
                      <input 
                        type="date" 
                        value={inspectDate} 
                        onChange={(e) => setInspectDate(e.target.value)} 
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-150 rounded-xl text-xs text-gray-800 focus:outline-none" 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5">Appointment Timing Slot</label>
                      <select
                        value={inspectTime}
                        onChange={(e) => setInspectTime(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-150 rounded-xl text-xs text-gray-800 focus:outline-none"
                        required
                      >
                        <option value="">-- Choose Slot --</option>
                        <option value="09:00 AM">09:00 AM - 11:00 AM (Morning slots)</option>
                        <option value="11:30 AM">11:30 AM - 01:30 PM</option>
                        <option value="02:00 PM">02:00 PM - 04:00 PM (Afternoon slots)</option>
                        <option value="04:30 PM">04:30 PM - 06:30 PM (Evening check)</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-300 rounded-2xl p-4 flex gap-3 text-xs text-amber-900">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <div>
                      <strong>Required documentation checklist:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px] text-amber-850">
                        <li>RTO Title paper or clean financing release report</li>
                        <li>Manufacturer key fobs (Master + spares if available)</li>
                        <li>Government ID or legal photo identification matching ownership</li>
                      </ul>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4.5 bg-slate-900 hover:bg-slate-800 text-amber-500 font-bold uppercase tracking-wider text-xs rounded-xl transition-all shadow cursor-pointer active:scale-95 uppercase flex items-center justify-center gap-1.5"
                  >
                    <CalendarCheck className="w-4.5 h-4.5" />
                    <span>Confirm Inspection Booking Block</span>
                  </button>
                </form>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
