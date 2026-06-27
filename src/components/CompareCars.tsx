import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Scale, Trash2, Star, ShieldCheck, BadgeDollarSign, Gauge, Fuel, HelpCircle, Sparkles, PlusCircle } from 'lucide-react';
import { Car } from '../types';

interface CompareCarsProps {
  selectedCarsForCompare: string[];
  setSelectedCarsForCompare: React.Dispatch<React.SetStateAction<string[]>>;
  setActiveTab: (tab: string) => void;
  cars: Car[];
}

export default function CompareCars({
  selectedCarsForCompare,
  setSelectedCarsForCompare,
  setActiveTab,
  cars
}: CompareCarsProps) {
  const [dropdownSelectedId, setDropdownSelectedId] = useState('');

  const selectedCars = selectedCarsForCompare
    .map(id => cars.find(c => c.id === id))
    .filter((car): car is Car => !!car);

  const handleAddCar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dropdownSelectedId) return;
    if (selectedCarsForCompare.includes(dropdownSelectedId)) {
      alert("This car is already listed on your comparison sheet.");
      return;
    }
    if (selectedCarsForCompare.length >= 3) {
      alert("You can compare up to 3 cars at the same time.");
      return;
    }
    setSelectedCarsForCompare(prev => [...prev, dropdownSelectedId]);
    setDropdownSelectedId('');
  };

  const handleRemoveCar = (carId: string) => {
    setSelectedCarsForCompare(prev => prev.filter(id => id !== carId));
  };

  const handleClearAll = () => {
    setSelectedCarsForCompare([]);
  };

  // Remaining list of cars available to add (not currently in selected comparison)
  const availableCars = cars.filter(c => !selectedCarsForCompare.includes(c.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      
      {/* Header Info */}
      <div id="compare-hero-header" className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 font-mono">Model Evaluator</span>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Scale className="w-8 h-8 text-slate-800" />
            <span>COMPARE PRE-OWNED MODELS</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Cross-compare resale price tags, warranty certificates, engine horsepower, fuel layouts, and high-fidelity specifications side-by-side.</p>
        </div>

        {selectedCars.length > 0 && (
          <button 
            onClick={handleClearAll}
            className="mt-4 md:mt-0 text-xs font-bold uppercase tracking-wide text-red-500 hover:text-red-600 flex items-center space-x-1.5 cursor-pointer bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-xl transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Grid Selection</span>
          </button>
        )}
      </div>

      {/* Selector input for adding cars manually on-the-fly */}
      {selectedCars.length < 3 && (
        <form onSubmit={handleAddCar} className="mb-8 p-5 bg-white border border-gray-150 rounded-2xl shadow-sm flex flex-col sm:flex-row items-center gap-4 max-w-2xl">
          <div className="flex-1 w-full">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono mb-1.5">Add Vehicle to Compare Sheet</label>
            <select
              value={dropdownSelectedId}
              onChange={(e) => setDropdownSelectedId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-150 rounded-xl text-sm text-gray-800 focus:outline-none"
            >
              <option value="">-- Choose Car from inventory --</option>
              {availableCars.map(c => (
                <option key={c.id} value={c.id}>
                  {c.brand} {c.model} - {c.year} (₹{c.price.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={!dropdownSelectedId}
            className="w-full sm:w-auto px-5 py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-gray-100 text-white font-bold uppercase tracking-wider text-xs rounded-xl transition-all shadow active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 mt-4 sm:mt-5"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span>Insert Car</span>
          </button>
        </form>
      )}

      {/* Compare Grid */}
      {selectedCars.length === 0 ? (
        
        /* Empty State */
        <div id="compare-empty-sheet" className="bg-white border border-gray-150 rounded-3xl p-16 text-center max-w-2xl mx-auto shadow-sm">
          <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Scale className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-gray-950">Add cars to compare</h2>
          <p className="text-sm text-gray-500 leading-relaxed max-w-md mx-auto mt-2">
            No pre-owned cars have been selected yet. Browse from our inventory or use the dropdown selector above to build your direct comparison matrices.
          </p>
          <button 
            onClick={() => setActiveTab('buy')}
            className="mt-6 px-6 py-3 bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold uppercase text-xs tracking-wider rounded-xl transition-all shadow active:scale-95 cursor-pointer"
          >
            Explore Pre-Owned Inventory
          </button>
        </div>

      ) : (

        /* Comparison tables */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-white border border-gray-150/80 rounded-3xl p-6 md:p-8 shadow-sm">
          
          {/* Col 0: Specification labels (Sticky on desktop) */}
          <div className="hidden md:flex flex-col justify-between pt-[220px] text-gray-400 font-mono text-xs uppercase tracking-wider space-y-6">
            <div className="h-10 flex items-center font-bold text-gray-800 border-b border-gray-100 pb-2">Resale Capital Price</div>
            <div className="h-10 flex items-center font-bold text-gray-800 border-b border-gray-100 pb-2">Year Released</div>
            <div className="h-10 flex items-center font-bold text-gray-800 border-b border-gray-100 pb-2">Inspected Mileage</div>
            <div className="h-10 flex items-center font-bold text-gray-800 border-b border-gray-100 pb-2">Fuel Layout</div>
            <div className="h-10 flex items-center font-bold text-gray-800 border-b border-gray-100 pb-2">Gear Transmission</div>
            <div className="h-10 flex items-center font-bold text-gray-800 border-b border-gray-100 pb-2">Body Shape Type</div>
            <div className="h-10 flex items-center font-bold text-gray-800 border-b border-gray-100 pb-2">Engine Displacement</div>
            <div className="h-10 flex items-center font-bold text-gray-800 border-b border-gray-100 pb-2">Motive Power Output</div>
            <div className="h-10 flex items-center font-bold text-gray-800 border-b border-gray-100 pb-2">Previous Owners</div>
            <div className="h-10 flex items-center font-bold text-gray-800 border-b border-gray-100 pb-2">Inspection Grade</div>
          </div>

          {/* Col 1, 2, 3: Selected cars cards */}
          {selectedCars.map(car => (
            <div key={car.id} id={`compare-col-${car.id}`} className="flex flex-col border border-gray-50 rounded-2xl p-4.5 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all relative">
              
              {/* Image & Quick trash button */}
              <div className="relative h-32 rounded-xl overflow-hidden bg-white mb-4">
                <img src={car.image} alt={car.model} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveCar(car.id)}
                  className="absolute top-2 right-2 p-1.5 bg-white text-gray-600 hover:text-red-500 rounded-lg shadow cursor-pointer active:scale-90"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Title Header */}
              <div className="mb-5 h-16">
                <span className="text-[10px] uppercase font-mono text-gray-400 font-bold">{car.brand}</span>
                <h3 className="text-base font-black text-slate-950 tracking-tight leading-tight">{car.model}</h3>
                {car.isCertified && (
                  <span className="inline-block mt-1 bg-red-50 border border-red-100 text-red-600 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">Platinum Approved</span>
                )}
              </div>

              {/* Specs Values Rows - Mobile layout includes indicators too */}
              <div className="space-y-6 text-sm text-gray-800 border-t border-gray-100 pt-4">
                
                {/* Price tag */}
                <div className="h-10 flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="md:hidden font-mono text-[9px] uppercase text-gray-400">Resale Capital Price</span>
                  <strong className="text-lg text-slate-900">₹{car.price.toLocaleString('en-IN')}</strong>
                </div>

                {/* Year Released */}
                <div className="h-10 flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="md:hidden font-mono text-[9px] uppercase text-gray-400">Year Released</span>
                  <span className="font-semibold">{car.year}</span>
                </div>

                {/* Inspected Mileage */}
                <div className="h-10 flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="md:hidden font-mono text-[9px] uppercase text-gray-400">Inspected Mileage</span>
                  <span>{car.mileage.toLocaleString()} km</span>
                </div>

                {/* Fuel Layout */}
                <div className="h-10 flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="md:hidden font-mono text-[9px] uppercase text-gray-400">Fuel Layout</span>
                  <span className="font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md text-xs">{car.fuelType}</span>
                </div>

                {/* Gear Transmission */}
                <div className="h-10 flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="md:hidden font-mono text-[9px] uppercase text-gray-400">Gear Transmission</span>
                  <span>{car.transmission}</span>
                </div>

                {/* Body Shape Type */}
                <div className="h-10 flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="md:hidden font-mono text-[9px] uppercase text-gray-400">Body Shape Type</span>
                  <span>{car.bodyType}</span>
                </div>

                {/* Engine Displacement */}
                <div className="h-10 flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="md:hidden font-mono text-[9px] uppercase text-gray-400">Engine Displacement</span>
                  <span className="text-xs truncate max-w-[150px]" title={car.engine}>{car.engine}</span>
                </div>

                {/* Motive Power Output */}
                <div className="h-10 flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="md:hidden font-mono text-[9px] uppercase text-gray-400">Motive Power Output</span>
                  <span>{car.power}</span>
                </div>

                {/* Previous Owners */}
                <div className="h-10 flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="md:hidden font-mono text-[9px] uppercase text-gray-400">Previous Owners</span>
                  <span>{car.owners} Records</span>
                </div>

                {/* Inspection Grade */}
                <div className="h-10 flex items-center justify-between border-b border-gray-100 pb-2">
                  <span className="md:hidden font-mono text-[9px] uppercase text-gray-400">Inspection Grade</span>
                  <div className="flex items-center space-x-1 font-bold text-amber-500">
                    <Star className="w-4 h-4 fill-amber-500 stroke-none" />
                    <span>{car.rating} / 5.0</span>
                  </div>
                </div>

              </div>

              {/* Action buttons underneath compare specs */}
              <div className="mt-8 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('buy');
                    // Open BuyCars detail modal automatically by setting its search filter
                    alert(`To view comprehensive booking instructions for ${car.brand} ${car.model}, use its "View Details" action card.`);
                  }}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  View Details Sheet
                </button>
              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}
