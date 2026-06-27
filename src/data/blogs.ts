import { Blog } from '../types';

export const MOCK_BLOGS: Blog[] = [
  {
    id: 'blog-1',
    title: 'Top 5 Things to Inspect in a Used Car Before Buying',
    category: 'Buying Guides',
    summary: 'A step-by-step checklist matching bodywork, tire treads, diagnostic scans, and maintenance book records to prevent hidden costs.',
    content: `Buying a second-hand car is an excellent way to save money, but it is critical to perform a thorough inspection. Here are the top five things you must check:
    
1. **The Bodywork & Underbody**: Look for rust, mismatched panel gaps (often indicating previous unreported collisions), and paint overspray.
2. **Tire Condition**: Uneven tire wear usually points to suspension misalignment or worn shock absorbers.
3. **Engine and Diagnostics**: Check fluid levels, look for leak traces, and use an OBD-II scanner to read any silent error codes.
4. **Test Drive & Steering Feel**: Pay attention to braking response, gear shifting latency, and any unusual rattles or pulling to one side.
5. **Ownership History & Service Records**: Ensure the VIN numbers match the paper registration files perfectly and review the service history.`,
    image: '/images/BMW 330i M Sport.avif',
    date: 'May 28, 2026',
    author: 'Daniel Craig',
    readTime: '6 min read'
  },
  {
    id: 'blog-2',
    title: 'In-Depth Review: Tesla Model Y as a Second-hand Purchase',
    category: 'Car Reviews',
    summary: 'Reviewing battery levels, real-world range degradation, seat wear, and the infotainment tech suite for 2020-2022 models.',
    content: `The Tesla Model Y remains a global favorite. But how does it hold up after 30,000+ miles?
    
- **Battery Health**: The 2020-2022 models show average battery wear of only 3% to 5%, still delivering near-advertised range.
- **Build Quality**: Earlier builds from US factories can manifest minor squeaks or panel gap variations. Check weatherstripping and interior console elements.
- **Suspension Tune**: Prepare for a sporty, firm ride. Check if dampeners have been upgraded.
- **Value Retention**: Buying used saves you from the initial steep depreciation curve, making the 2-year old Model Y exceptionally competitive.`,
    image: '/images/Tesla Model Y Long Range.avif',
    date: 'June 01, 2026',
    author: 'Sarah Jenkins',
    readTime: '8 min read'
  },
  {
    id: 'blog-3',
    title: 'Routine Preventive Maintenance Tips for Solid Engine Life',
    category: 'Maintenance Tips',
    summary: 'The simple steps, interval timing, and fluid controls that prolong old engines and sustain high-value resale conditions.',
    content: `Simple maintenance ensures your pre-owned car remains reliable for many years:
 
- **Oil and Filter Intervals**: Change engine oil every 7,500 miles (or every 5,000 for high-mileage turbochargers). It is the single cheapest way to protect engines.
- **Spark Plugs and Ignitions**: Replacing them at designated intervals avoids engine misfires and preserves fuel economy.
- **Cooling Loops**: Flush the coolant reservoir every 2-3 years to protect the alloy heads and stop overheat risks.
- **Brake Linings**: Check pads regularly; replacing worn pad linings prevents permanent rotors damage.`,
    image: '/images/Porsche 911 Carrera S.webp',
    date: 'April 20, 2026',
    author: 'Marcus Vance',
    readTime: '5 min read'
  },
  {
    id: 'blog-4',
    title: 'Used Car Market Trends: Is 2026 the Perfect Year to Buy?',
    category: 'Market Trends',
    summary: 'Why interest rate adjustments, fresh lease returns, and EV inventory supply are softening pre-owned luxury and SUV prices.',
    content: `High inventories mean car buyers are gaining substantial leverage in 2026:
 
1. **Lease Return Wave**: A surge of high-spec 3-year lease returns is hitting used car showrooms.
2. **EV Pricing Stabilization**: High-volume electric cars have experienced significant pricing settling, making used EVs extreme bargains.
3. **Lower Average Deal Prices**: SUV segment prices have flattened by 4.2% year-on-year, creating incredible buying opportunities before the spring/summer surge.`,
    image: '/images/Ford Mustang GT Premium.jpg',
    date: 'May 15, 2026',
    author: 'Sophia Reynolds',
    readTime: '7 min read'
  },
  {
    id: 'blog-5',
    title: 'Best SUV under 10 Lakhs: Your Ultimate Pre-Owned Guide',
    category: 'Buying Guides',
    summary: 'A detailed breakdown of highly reliable SUVs like Hyundai Creta, Tata Nexon, and Mahindra XUV300 available under ₹10 Lakhs.',
    content: `Finding a spacious, safe, and dependable SUV under a ₹10 Lakh budget is a major goal for many Indian car buyers. In the pre-owned market, this budget opens up high-spec variants that would otherwise cost ₹15-18 Lakhs new.
 
1. **Hyundai Creta (2018-2020)**: Known for its premium interior fitments, smooth engine choices, and high road presence. You can easily find a well-maintained SX or SX(O) trim with petrol engines.
2. **Tata Nexon (2020-2022)**: Renowned for its 5-star GNCAP safety rating and robust build. The turbocharged petrol and diesel engines offer fantastic torque and high ground clearance.
3. **Mahindra XUV300 (2019-2021)**: Offering the widest cabin space in its price class, fantastic highway stability, and solid features like dual-zone climate control.`,
    image: '/images/Hyundai Creta SX.avif',
    date: 'June 03, 2026',
    author: 'Arjun Mehta',
    readTime: '5 min read'
  },
  {
    id: 'blog-6',
    title: 'How to Inspect a Used Car: 10 Golden Steps',
    category: 'Buying Guides',
    summary: 'Skip the guesswork. Master the structural engine checks, bodywork inspection, and test driving techniques used by certified experts.',
    content: `When purchasing a pre-owned car, performing a methodical physical inspection can save you from costly post-sale repairs:
 
- **Check Panel Alignment**: Uneven spacing between panels often indicates prior accident repairs.
- **Inspect Under the Cap**: Look for engine oil leaks, coolant residue, and verify brake fluid clarity.
- **Evaluate Tire Wear**: Uneven tire tread wear suggests suspension problems or deep alignment errors.
- **Test Electrical Controls**: Ensure that air conditioning, power windows, sunroofs, and the console screen are functional.
- **Underbody Check**: Ensure there is no severe corrosion, frame bend, or fluid drainage under the chassis.`,
    image: '/images/Toyota RAV4 Hybrid XLE.avif',
    date: 'May 31, 2026',
    author: 'Rohan Sharma',
    readTime: '7 min read'
  },
  {
    id: 'blog-7',
    title: 'Petrol vs Diesel vs Electric: Which Used Car Fuels Your Needs?',
    category: 'Market Trends',
    summary: 'Analysing fuel economics, monthly running costs, maintenance costs, and second-hand residual value retention to help you choose.',
    content: `Choosing the right powertrain for a pre-owned vehicle depends heavily on your daily driving routine and expected holding period:
 
- **Petrol Engine Cars**: Ideal for low daily commutes (<30 km/day). They have lower maintenance costs, silent refinement, and are highly compliant with long-term metropolitan emission rules.
- **Diesel Engine SUV/Sedans**: Perfect for high-frequency highway runners (>80 km/day). Superior fuel economy and immense low-end torque make them great for SUVs, though periodic diesel filter maintenance is vital.
- **Electric Cars (EVs)**: Exceptional for city stop-and-go commutes with near-zero fuel costs. Used EVs offer maximum savings but battery health and charging setups must be validated.`,
    image: '/images/Audi e-tron Sportback Prestige.jpg',
    date: 'June 02, 2026',
    author: 'Priya Iyer',
    readTime: '6 min read'
  }
];
