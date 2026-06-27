import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Percent, Shield, DollarSign, Calculator, HelpCircle, FileText, CheckCircle, Smartphone, Award, Clock } from 'lucide-react';

export default function Finance({ initialSubTab }: { initialSubTab: string }) {
  const [subTab, setSubTab] = useState<'calculator' | 'loan' | 'insurance' | 'eligibility'>('calculator');

  // Sync initial sub-tab route from Navbar/Home clicks
  React.useEffect(() => {
    if (initialSubTab) {
      setSubTab(initialSubTab as any);
    }
  }, [initialSubTab]);

  /* EMI Calculator State */
  const [loanAmount, setLoanAmount] = useState(2000000);
  const [downPayment, setDownPayment] = useState(400000);
  const [interestRate, setInterestRate] = useState(5.5);
  const [loanTenure, setLoanTenure] = useState(60); // months

  /* Loan Eligibility State */
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [existingEMI, setExistingEMI] = useState('');
  const [creditTier, setCreditTier] = useState<'Excellent' | 'Good' | 'Fair'>('Good');
  const [eligibilityResult, setEligibilityResult] = useState<{
    status: 'Pre-Approved' | 'Review Needed' | 'Ineligible';
    maxLimit: number;
    approvedEMI: number;
  } | null>(null);

  /* Insurance quote state */
  const [carClass, setCarClass] = useState('Sedan');
  const [ownerAge, setOwnerAge] = useState('30');
  const [coverageType, setCoverageType] = useState('Comprehensive');
  const [insuranceCost, setInsuranceCost] = useState<number | null>(null);

  /* Dynamic EMI equations calculations */
  const emiCalculations = useMemo(() => {
    const P = Math.max(0, loanAmount - downPayment);
    const r = interestRate / 12 / 100;
    const N = loanTenure;

    if (P === 0) return { emi: 0, totalInterest: 0, totalPayment: 0 };
    if (r === 0) return { emi: P / N, totalInterest: 0, totalPayment: P };

    const emi = (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
    const totalPayment = emi * N;
    const totalInterest = totalPayment - P;

    return {
      emi: Math.round(emi),
      totalInterest: Math.round(totalInterest),
      totalPayment: Math.round(totalPayment),
      principal: P
    };
  }, [loanAmount, downPayment, interestRate, loanTenure]);

  const handleCheckEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    if (!monthlyIncome || isNaN(Number(monthlyIncome)) || Number(monthlyIncome) <= 0) {
      alert("Please enter a valid monthly salary.");
      return;
    }

    const income = Number(monthlyIncome);
    const currentEMI = Number(existingEMI) || 0;

    // Direct mathematical rule for dynamic loan eligibility (FOIR - Debt Service limit)
    let debtServiceRatio = 0.5; // default 50% max allowable EMI
    if (creditTier === 'Excellent') debtServiceRatio = 0.65;
    if (creditTier === 'Fair') debtServiceRatio = 0.35;

    const maxAllowableEMI = Math.round((income * debtServiceRatio) - currentEMI);

    let status: 'Pre-Approved' | 'Review Needed' | 'Ineligible' = 'Pre-Approved';
    let maxLimit = 0;

    if (maxAllowableEMI <= 5000) {
      status = 'Ineligible';
      maxLimit = 0;
    } else {
      // Estimate max loan limits assuming 60 month loan at 6.0% rate
      const P = maxAllowableEMI * ((Math.pow(1 + 0.005, 60) - 1) / (0.005 * Math.pow(1 + 0.005, 60)));
      maxLimit = Math.min(10000000, Math.round(P));
      if (creditTier === 'Fair') status = 'Review Needed';
    }

    setEligibilityResult({
      status,
      maxLimit,
      approvedEMI: Math.max(0, maxAllowableEMI)
    });
  };

  const handleInsuranceQuote = (e: React.FormEvent) => {
    e.preventDefault();
    let baseRate = 120 * 82; // default primary rate
    if (carClass === 'SUV') baseRate = 150 * 82;
    if (carClass === 'Luxury') baseRate = 220 * 82;
    if (carClass === 'Hatchback') baseRate = 95 * 82;

    let driverAge = Number(ownerAge) || 30;
    let ageMultiplier = 1.0;
    if (driverAge < 25) ageMultiplier = 1.45;
    if (driverAge > 65) ageMultiplier = 1.15;

    let coverageMultiplier = 1.0;
    if (coverageType === 'Liability Only') coverageMultiplier = 0.45;
    if (coverageType === 'Collision Premium') coverageMultiplier = 0.8;

    const yearlyCost = Math.round(baseRate * ageMultiplier * coverageMultiplier * 12);
    setInsuranceCost(yearlyCost);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      
      {/* Intro Header */}
      <div id="finance-header" className="mb-10 text-center max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 font-mono">Financial Services Panel</span>
        <h1 className="text-3xl sm:text-4.5xl font-black text-slate-950 tracking-tight leading-tight mt-1">SMART USED-CAR FINANCING</h1>
        <p className="text-sm text-gray-500 mt-2">Adjust monthly payment schemes, access premium low APR interest deals, quote secure auto insurance packages, and run instant credit-limits eligibility checks.</p>

        {/* Buttons Sub-navigation */}
        <div className="flex justify-center border-b border-gray-150 mt-8 gap-3 sm:gap-6">
          <button 
            onClick={() => setSubTab('calculator')}
            className={`pb-3 text-xs sm:text-sm font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
              subTab === 'calculator' ? 'border-amber-500 text-slate-900' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Loan EMI Calculator
          </button>
          <button 
            onClick={() => setSubTab('eligibility')}
            className={`pb-3 text-xs sm:text-sm font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
              subTab === 'eligibility' ? 'border-amber-500 text-slate-900' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Credit eligibility
          </button>
          <button 
            onClick={() => setSubTab('insurance')}
            className={`pb-3 text-xs sm:text-sm font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
              subTab === 'insurance' ? 'border-amber-500 text-slate-900' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Car Auto Insurance
          </button>
          <button 
            onClick={() => setSubTab('loan')}
            className={`pb-3 text-xs sm:text-sm font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer ${
              subTab === 'loan' ? 'border-amber-500 text-slate-900' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Low-APR Loans
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          
          {/* Subtab 1: Interactive Loan EMI Calculator */}
          {subTab === 'calculator' && (
            <motion.div 
              key="calc-layout"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start"
            >
              
              {/* Sliders Input form */}
              <div className="bg-white border border-gray-150 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
                <div className="flex items-center space-x-2 pb-2 border-b border-gray-50">
                  <Calculator className="w-5 h-5 text-amber-500" />
                  <h3 className="text-sm font-extrabold uppercase text-slate-900 font-sans tracking-wide">Adjust Loan Configurations</h3>
                </div>

                {/* Amount slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-gray-700">
                    <span>Used Car Price Tag</span>
                    <span className="font-bold text-slate-950">₹{loanAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <input 
                    type="range" 
                    min={400000} 
                    max={8000000} 
                    step={50000}
                    value={loanAmount} 
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                    <span>₹4L</span>
                    <span>₹80L Max</span>
                  </div>
                </div>

                {/* Down payment slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-gray-700">
                    <span>Capital Down Payment Cash</span>
                    <span className="font-bold text-slate-950">₹{downPayment.toLocaleString('en-IN')}</span>
                  </div>
                  <input 
                    type="range" 
                    min={0} 
                    max={loanAmount * 0.8} 
                    step={10000}
                    value={downPayment} 
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                    <span>₹0 (Zero Down)</span>
                    <span>Up to 80% Max</span>
                  </div>
                </div>

                {/* Interest rate slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-gray-700">
                    <span>Annual Interest Rate (APR)</span>
                    <span className="font-bold text-slate-950">{interestRate}% APR</span>
                  </div>
                  <input 
                    type="range" 
                    min={1.9} 
                    max={15.0} 
                    step={0.1}
                    value={interestRate} 
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                    <span>1.9% Special Promo</span>
                    <span>15.0% Max</span>
                  </div>
                </div>

                {/* Tenure slider */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold text-gray-700">
                    <span>Loan Duration tenure</span>
                    <span className="font-bold text-slate-950">{loanTenure} Months ({Math.round(loanTenure/12)} Yrs)</span>
                  </div>
                  <input 
                    type="range" 
                    min={12} 
                    max={84} 
                    step={12}
                    value={loanTenure} 
                    onChange={(e) => setLoanTenure(Number(e.target.value))}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                    <span>12 M (1 Yr)</span>
                    <span>84 M (7 Yrs)</span>
                  </div>
                </div>

              </div>

              {/* Outputs panel display card */}
              <div className="bg-slate-900 text-white rounded-3xl p-6.5 md:p-8 flex flex-col justify-between h-full shadow-lg relative overflow-hidden border border-slate-800">
                
                <div className="space-y-6">
                  <div className="border-b border-white/10 pb-4 text-center">
                    <span className="text-[10px] uppercase font-mono text-amber-400 tracking-widest font-bold block mb-1">Monthly Payment Plan</span>
                    <p className="text-4xl sm:text-5xl font-black">₹{emiCalculations.emi.toLocaleString('en-IN')}<span className="text-lg font-medium text-slate-400">/mo</span></p>
                    <p className="text-xs text-slate-400 mt-1">Based on loan balance of ₹{(loanAmount - downPayment).toLocaleString('en-IN')}</p>
                  </div>

                  <div className="space-y-4 text-sm font-medium">
                    <div className="flex items-center justify-between py-1 text-slate-300">
                      <span>Total Down Payment</span>
                      <strong className="text-white">₹{downPayment.toLocaleString('en-IN')}</strong>
                    </div>

                    <div className="flex items-center justify-between py-1 text-slate-300">
                      <span>Net Financed Balance</span>
                      <strong className="text-white">₹{(loanAmount - downPayment).toLocaleString('en-IN')}</strong>
                    </div>

                    <div className="flex items-center justify-between py-1 text-slate-300">
                      <span>Accrued Interest Paid</span>
                      <strong className="text-white text-rose-400">₹{emiCalculations.totalInterest.toLocaleString('en-IN')}</strong>
                    </div>

                    <div className="flex items-center justify-between py-1 pt-2 border-t border-white/10 text-slate-200">
                      <span>Aggregate Lifetime Payments</span>
                      <strong className="text-white text-base">₹{emiCalculations.totalPayment.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>

                  {/* Visual Proportion Slider bar */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block tracking-widest">Financing Proportion</span>
                    <div className="w-full h-3 bg-rose-500 rounded-full flex overflow-hidden">
                      <div 
                        title="Principal chunk"
                        className="bg-amber-500 h-full" 
                        style={{ width: `${Math.round((emiCalculations.principal / (emiCalculations.totalPayment || 1)) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-450">
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span> Principal: {Math.round((emiCalculations.principal / (emiCalculations.totalPayment || 1)) * 100)}%</span>
                      <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-rose-500 rounded-full inline-block"></span> Interest: {Math.round((emiCalculations.totalInterest / (emiCalculations.totalPayment || 1)) * 100)}%</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setSubTab('eligibility')}
                  className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl mt-8 transition-all shadow cursor-pointer active:scale-95 text-center"
                >
                  Verify Approval Eligibility Matches &rarr;
                </button>

              </div>
            </motion.div>
          )}

          {/* Subtab 2: Dynamic Eligibility Validator Check */}
          {subTab === 'eligibility' && (
            <motion.div 
              key="elig-layout"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white border border-gray-150 rounded-3xl p-6.5 md:p-8 shadow-sm flex flex-col md:flex-row gap-8 items-start"
            >
              <form onSubmit={handleCheckEligibility} className="md:w-1/2 space-y-4">
                <div className="pb-3 border-b border-gray-100">
                  <h3 className="text-base font-extrabold text-slate-900 uppercase">Input Financial Profile</h3>
                  <p className="text-xs text-gray-500 mt-1">Estimate maximum credit limits we can secure from partner auto banks.</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5">Net Monthly salary (₹)</label>
                  <input 
                    type="number" 
                    min="0"
                    placeholder="e.g. 150000" 
                    value={monthlyIncome} 
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || parseFloat(val) >= 0) {
                        setMonthlyIncome(val);
                      }
                    }} 
                    onKeyDown={(e) => {
                      if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                        e.preventDefault();
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-150 rounded-xl text-xs" 
                    required 
                  />
                </div>
 
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5">Active Monthly Debt EMIs (₹)</label>
                  <input 
                    type="number" 
                    min="0"
                    placeholder="e.g. 15000 (Write 0 if none)" 
                    value={existingEMI} 
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || parseFloat(val) >= 0) {
                        setExistingEMI(val);
                      }
                    }} 
                    onKeyDown={(e) => {
                      if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                        e.preventDefault();
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-150 rounded-xl text-xs" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5">Current Credit Grade</label>
                  <select
                    value={creditTier}
                    onChange={(e) => setCreditTier(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-150 rounded-xl text-xs text-gray-800"
                  >
                    <option value="Excellent">Excellent Plus (750+ Credit points)</option>
                    <option value="Good">Good Average (650 - 750 points)</option>
                    <option value="Fair">Fair Credit Record (under 650 points)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase text-xs rounded-xl tracking-wider cursor-pointer"
                >
                  Verify Eligible Range
                </button>
              </form>

              {/* Eligibility output widgets */}
              <div className="p-6 bg-slate-50 border border-gray-150 rounded-2xl md:w-1/2 h-full flex flex-col justify-between">
                {eligibilityResult ? (
                  <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest font-mono text-gray-400 font-bold block mb-1">Pre-Qualification verdict</span>
                      <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-xl ${
                        eligibilityResult.status === 'Pre-Approved' 
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-300' 
                          : eligibilityResult.status === 'Review Needed'
                          ? 'bg-amber-500/10 text-amber-600 border border-amber-300'
                          : 'bg-rose-500/10 text-rose-500 border border-rose-300'
                      }`}>
                        {eligibilityResult.status}
                      </span>
                    </div>

                    {eligibilityResult.status !== 'Ineligible' ? (
                      <div className="space-y-4">
                        <div>
                          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-0.5">Approved Credit Capacity</span>
                          <p className="text-3xl font-black text-gray-950">₹{eligibilityResult.maxLimit.toLocaleString('en-IN')}</p>
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block mb-0.5">Maximum monthly installment allowable</span>
                          <p className="text-lg font-bold text-slate-800">₹{eligibilityResult.approvedEMI.toLocaleString('en-IN')}/mo</p>
                        </div>
                        <p className="text-xs text-gray-500 italic">This is an automated indicative bank checklist limit. Final interest factors depend on RTO inspection approvals.</p>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500 leading-relaxed">
                        Currently your Debt-to-Income ratios exceed safety parameters. Book an appointment with our trade agents to inspect current models for down-payment relief alternatives.
                      </p>
                    )}

                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400 h-full">
                    <Shield className="w-12 h-12 text-gray-300 mb-3" />
                    <h4 className="text-sm font-bold text-gray-700">Submit parameters to check eligibility</h4>
                    <p className="text-xs max-w-[200px] mt-1 text-gray-400 font-medium">Verify structural budget caps before choosing a showroom model.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Subtab 3: Responsive Insurance Quotes */}
          {subTab === 'insurance' && (
            <motion.div 
              key="ins-layout"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white border border-gray-150 rounded-3xl p-6.5 md:p-8 shadow-sm flex flex-col md:flex-row gap-8 items-start"
            >
              <form onSubmit={handleInsuranceQuote} className="md:w-1/2 space-y-4">
                <div className="pb-3 border-b border-gray-100">
                  <h3 className="text-base font-extrabold text-slate-900 uppercase">Auto Insurance Quotation</h3>
                  <p className="text-xs text-gray-500 mt-1">Acquire accurate pricing estimates for comprehensive coverage.</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5">Vehicle Type</label>
                  <select value={carClass} onChange={(e) => setCarClass(e.target.value)} className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-150 rounded-xl text-xs text-gray-800">
                    <option value="Hatchback">Hatchback / Small Segment</option>
                    <option value="Sedan">Sedan / Executive</option>
                    <option value="SUV">SUV / Offroad Crossover</option>
                    <option value="Luxury">Luxury Sports Car</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5">Driver & Owner Age</label>
                  <input 
                    type="number" 
                    min="0"
                    placeholder="e.g. 32" 
                    value={ownerAge} 
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || parseFloat(val) >= 0) {
                        setOwnerAge(val);
                      }
                    }} 
                    onKeyDown={(e) => {
                      if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                        e.preventDefault();
                      }
                    }}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-150 rounded-xl text-xs" 
                    required 
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5">Coverage Selection</label>
                  <select value={coverageType} onChange={(e) => setCoverageType(e.target.value)} className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-150 rounded-xl text-xs text-gray-800">
                    <option value="Comprehensive">Comprehensive Premium (Full bumper-to-bumper protection)</option>
                    <option value="Collision Premium">Standard Collision Coverage</option>
                    <option value="Liability Only">Third Party Liability Only</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase text-xs rounded-xl tracking-wider cursor-pointer"
                >
                  Generate Quotes
                </button>
              </form>

              <div className="p-6 bg-slate-50 border border-gray-150 rounded-2xl md:w-1/2 h-full flex flex-col justify-between">
                {insuranceCost ? (
                  <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                    <div>
                      <span className="text-[10px] uppercase font-mono text-gray-400 tracking-widest block mb-0.5">Estimated Yearly Premium Quote</span>
                      <p className="text-4xl font-black text-emerald-600">₹{insuranceCost.toLocaleString('en-IN')}<span className="text-xs text-gray-400 font-normal">/yr</span></p>
                      <p className="text-xs text-gray-500 mt-1">Equals code payments of ~₹{Math.round(insuranceCost / 12).toLocaleString('en-IN')}/mo.</p>
                    </div>

                    <div className="space-y-2.5">
                      <strong className="text-xs font-bold text-gray-800 block">Included Protections:</strong>
                      <div className="flex items-center space-x-2 text-xs text-gray-600"><CheckCircle className="w-4 h-4 text-emerald-500" /> <span>Cashless repairs on 1000+ certified garages</span></div>
                      <div className="flex items-center space-x-2 text-xs text-gray-600"><CheckCircle className="w-4 h-4 text-emerald-500" /> <span>Zero depreciation add-on availability</span></div>
                      <div className="flex items-center space-x-2 text-xs text-gray-600"><CheckCircle className="w-4 h-4 text-emerald-500" /> <span>24/7 towing and roadside flat recovery</span></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400 h-full">
                    <Shield className="w-12 h-12 text-gray-300 mb-3" />
                    <h4 className="text-sm font-bold text-gray-700 font-sans">Compare quotes in seconds</h4>
                    <p className="text-xs max-w-[200px] mt-1 text-gray-400 font-medium">Auto-calculates tailored premiums based on driver demographics.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Subtab 4: Low APR Loan Options summary */}
          {subTab === 'loan' && (
            <motion.div 
              key="loan-layout"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white border border-gray-150 rounded-3xl p-6.5 md:p-8 shadow-sm space-y-6"
            >
              <div className="pb-4 border-b border-gray-100">
                <h3 className="text-xl font-black text-gray-950 uppercase tracking-tight">Our Used-Car Loan Programs</h3>
                <p className="text-xs text-gray-500 mt-1">We tie up with top multi-national banks to secure premium rates exclusively for Velocity clients.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                <div className="p-5 border border-gray-100 bg-gray-50/50 rounded-2xl shadow-sm text-center">
                  <span className="text-[10px] font-mono font-bold uppercase text-amber-600 bg-amber-55/10 px-2.5 py-0.5 rounded-full">New Buyers Special</span>
                  <p className="text-3xl font-black text-gray-900 mt-3">3.5% <span className="text-xs font-normal text-gray-400">APR</span></p>
                  <p className="text-xs text-gray-500 mt-1 leading-normal">For certified plug-ins & electric model lines under 1 yr old.</p>
                </div>

                <div className="p-5 border border-red-200 bg-red-50/40 rounded-2xl shadow-sm text-center">
                  <span className="text-[10px] font-mono font-bold uppercase text-red-650 bg-red-10 px-2.5 py-0.5 rounded-full">Certified Platinum Class</span>
                  <p className="text-3xl font-black text-red-600 mt-3">4.75% <span className="text-xs font-normal text-gray-400">APR</span></p>
                  <p className="text-xs text-gray-500 mt-1 leading-normal">Available for all hand-vetted certified SUVs and luxury lines.</p>
                </div>

                <div className="p-5 border border-gray-100 bg-gray-50/50 rounded-2xl shadow-sm text-center">
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-650 bg-slate-10 px-2.5 py-0.5 rounded-full">Standard Used Package</span>
                  <p className="text-3xl font-black text-gray-900 mt-3">6.2% <span className="text-xs font-normal text-gray-400">APR</span></p>
                  <p className="text-xs text-gray-500 mt-1 leading-normal">General budget loans for first cars and mixed credit ratings.</p>
                </div>

              </div>

              <div className="bg-amber-500/10 border border-amber-300 p-5 rounded-2xl flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-sm text-slate-900">Why coordinate finance through Velocity?</strong>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-800 mt-2">
                    <div>✓ Zero hidden bank processing files charges</div>
                    <div>✓ Fully digital paperless workflows approval</div>
                    <div>✓ Flexible principal foreclosure allowances</div>
                    <div>✓ Pre-approvals lockable for up to 30 days</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
