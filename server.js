import express from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;
const uploadDir = path.join(__dirname, 'public', 'uploads');
const dbPath = path.join(__dirname, 'cars.db');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '.jpg';
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit per file
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) return cb(null, true);
    cb(new Error('Only image files are allowed'));
  }
});

sqlite3.verbose();

function openDb() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) return reject(err);
      resolve(db);
    });
  });
}

function run(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this);
    });
  });
}

function all(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function rowToCar(row) {
  return {
    id: row.id,
    brand: row.brand,
    model: row.model,
    year: Number(row.year),
    price: Number(row.price),
    mileage: Number(row.mileage),
    fuelType: row.fuelType,
    transmission: row.transmission,
    bodyType: row.bodyType,
    isCertified: Boolean(row.isCertified),
    image: row.image,
    power: row.power,
    engine: row.engine,
    owners: Number(row.owners),
    color: row.color,
    rating: Number(row.rating),
    features: typeof row.features === 'string' ? JSON.parse(row.features) : [],
    location: row.location || undefined,
    formattedPrice: row.formattedPrice || undefined,
    seating: row.seating ? Number(row.seating) : undefined
  };
}

const seedCars = [
  {
    id: 'car-1',
    brand: 'Tesla',
    model: 'Model Y Long Range',
    year: 2022,
    price: 43500,
    mileage: 28000,
    fuelType: 'Electric',
    transmission: 'Automatic',
    bodyType: 'SUV',
    isCertified: true,
    image: '/images/Tesla Model Y Long Range.avif',
    power: '384 hp',
    engine: 'Dual AC Electric Motor',
    owners: 1,
    color: 'Pearl White Multi-Coat',
    rating: 4.8,
    features: ['Autopilot', 'Panoramic Glass Roof', 'Premium Audio System']
  },
  {
    id: 'car-2',
    brand: 'BMW',
    model: '330i M Sport',
    year: 2021,
    price: 33800,
    mileage: 34500,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'Sedan',
    isCertified: true,
    image: '/images/BMW 330i M Sport.avif',
    power: '255 hp',
    engine: '2.0L TwinPower Turbo I4',
    owners: 1,
    color: 'Mineral Grey Metallic',
    rating: 4.7,
    features: ['M Sport Package', 'Adaptive Suspension', 'Harman Kardon Sound']
  },
  {
    id: 'car-3',
    brand: 'Toyota',
    model: 'RAV4 Hybrid XLE',
    year: 2020,
    price: 25900,
    mileage: 48000,
    fuelType: 'Hybrid',
    transmission: 'Automatic',
    bodyType: 'SUV',
    isCertified: true,
    image: '/images/Toyota RAV4 Hybrid XLE.avif',
    power: '219 hp',
    engine: '2.5L 4-Cylinder Hybrid',
    owners: 2,
    color: 'Magnetic Gray Metallic',
    rating: 4.9,
    features: ['All-Wheel Drive', 'Toyota Safety Sense', 'Power Moonroof']
  },
  {
    id: 'car-4',
    brand: 'Honda',
    model: 'Civic Hatchback Sport',
    year: 2019,
    price: 18500,
    mileage: 52000,
    fuelType: 'Petrol',
    transmission: 'Manual',
    bodyType: 'Hatchback',
    isCertified: false,
    image: '/images/Honda Civic Hatchback Sport.avif',
    power: '180 hp',
    engine: '1.5L Turbocharged 4-cylinder',
    owners: 1,
    color: 'Sonic Gray Pearl',
    rating: 4.6,
    features: ['Sport Pedals', 'Leather Wrap Steering', 'Apple CarPlay']
  },
  {
    id: 'car-5',
    brand: 'Porsche',
    model: '911 Carrera S',
    year: 2018,
    price: 98000,
    mileage: 21000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'Coupe',
    isCertified: true,
    image: '/images/Porsche 911 Carrera S.webp',
    power: '420 hp',
    engine: '3.0L Twin-Turbo Flat-6',
    owners: 1,
    color: 'Guards Red',
    rating: 4.9,
    features: ['Chrono Package', 'Sport Exhaust', 'PASM Suspension']
  },
  {
    id: 'car-6',
    brand: 'Audi',
    model: 'Q7 55 Premium Plus',
    year: 2021,
    price: 45900,
    mileage: 39000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    bodyType: 'SUV',
    isCertified: true,
    image: '/images/Audi Q7 55 Premium Plus.avif',
    power: '335 hp',
    engine: '3.0L Turbocharged V6 Mild Hybrid',
    owners: 1,
    color: 'Orca Black Metallic',
    rating: 4.8,
    features: ['3-Row Seating', 'Virtual Cockpit', 'Sunroof']
  },
  {
    id: 'car-7',
    brand: 'Chevrolet',
    model: 'Bolt EV Premier',
    year: 2020,
    price: 16200,
    mileage: 31000,
    fuelType: 'Electric',
    transmission: 'Automatic',
    bodyType: 'Hatchback',
    isCertified: false,
    image: '/images/Chevrolet Bolt EV Premier.jpg',
    power: '200 hp',
    engine: 'Electric Motor',
    owners: 1,
    color: 'Kinetic Blue Metallic',
    rating: 4.3,
    features: ['Heated Seats', 'Surround Vision', 'Fast Charging']
  },
  {
    id: 'car-8',
    brand: 'Hyundai',
    model: 'Elantra Limited',
    year: 2019,
    price: 15400,
    mileage: 61000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'Sedan',
    isCertified: false,
    image: '/images/Hyundai Elantra Limited.jpg',
    power: '147 hp',
    engine: '2.0L Atkinson Cycle',
    owners: 2,
    color: 'Symphony Silver',
    rating: 4.4,
    features: ['Premium Audio', 'Wireless Charger', 'Smart Cruise']
  },
  {
    id: 'car-9',
    brand: 'Nissan',
    model: 'Leaf SV Plus',
    year: 2021,
    price: 19500,
    mileage: 18000,
    fuelType: 'Electric',
    transmission: 'Automatic',
    bodyType: 'Hatchback',
    isCertified: true,
    image: '/images/Nissan Leaf SV Plus.avif',
    power: '214 hp',
    engine: '160 kW AC Motor',
    owners: 1,
    color: 'Gun Metallic',
    rating: 4.5,
    features: ['62 kWh Battery', 'ProPILOT Assist', 'e-Pedal Mode']
  },
  {
    id: 'car-10',
    brand: 'Mercedes-Benz',
    model: 'E450 4MATIC Sedan',
    year: 2020,
    price: 41800,
    mileage: 36000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'Luxury',
    isCertified: true,
    image: '/images/Mercedes-Benz E450 4MATIC Sedan.jpg',
    power: '362 hp',
    engine: '3.0L Inline-6 Turbo',
    owners: 1,
    color: 'Selenite Grey Metallic',
    rating: 4.8,
    features: ['Burmester Sound', 'Dual Displays', 'Nappa Leather']
  },
  {
    id: 'car-11',
    brand: 'Ford',
    model: 'Mustang GT Premium',
    year: 2019,
    price: 31900,
    mileage: 44000,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'Coupe',
    isCertified: false,
    image: '/images/Ford Mustang GT Premium.jpg',
    power: '460 hp',
    engine: '5.0L Ti-VCT V8',
    owners: 2,
    color: 'Shadow Black',
    rating: 4.7,
    features: ['Brembo Brakes', 'SYNC 3', 'Active Exhaust']
  },
  {
    id: 'car-12',
    brand: 'Audi',
    model: 'e-tron Sportback Prestige',
    year: 2021,
    price: 52000,
    mileage: 26000,
    fuelType: 'Electric',
    transmission: 'Automatic',
    bodyType: 'Luxury',
    isCertified: true,
    image: '/images/Audi e-tron Sportback Prestige.jpg',
    power: '402 hp',
    engine: 'Dual Electric Motors',
    owners: 1,
    color: 'Typhoon Gray Metallic',
    rating: 4.8,
    features: ['Bang & Olufsen', 'Head-Up Display', 'Massage Seats']
  },
  {
    id: 'car-indian-1',
    brand: 'Hyundai',
    model: 'Creta SX',
    year: 2019,
    price: 11500,
    mileage: 42000,
    fuelType: 'Petrol',
    transmission: 'Manual',
    bodyType: 'SUV',
    isCertified: true,
    image: '/images/Hyundai Creta SX.avif',
    power: '113 hp',
    engine: '1.5L MPi Engine',
    owners: 1,
    color: 'Polar White',
    rating: 4.6,
    features: ['Infotainment', 'Steering Controls', 'Camera', 'Sunroof'],
    location: 'Visakhapatnam'
  },
  {
    id: 'car-indian-2',
    brand: 'Tata',
    model: 'Nexon EV Empress',
    year: 2021,
    price: 17800,
    mileage: 18500,
    fuelType: 'Electric',
    transmission: 'Automatic',
    bodyType: 'SUV',
    isCertified: true,
    image: '/images/Tata Nexon EV Empress.avif',
    power: '127 hp',
    engine: 'Permanent Magnet AC Motor',
    owners: 1,
    color: 'Teal Blue',
    rating: 4.8,
    features: ['Regenerative Braking', 'Harman Sound', 'iRA Suite'],
    location: 'Mumbai'
  },
  {
    id: 'car-indian-3',
    brand: 'Maruti Suzuki',
    model: 'Swift VXI',
    year: 2018,
    price: 6800,
    mileage: 54000,
    fuelType: 'Petrol',
    transmission: 'Manual',
    bodyType: 'Hatchback',
    isCertified: false,
    image: '/images/Maruti Suzuki Swift VXI.jpg',
    power: '82 hp',
    engine: '1.2L K-Series',
    owners: 2,
    color: 'Fire Red',
    rating: 4.4,
    features: ['Dual Airbags', 'ABS with EBD', 'Keyless Entry'],
    location: 'Hyderabad'
  },
  {
    id: 'car-indian-4',
    brand: 'Honda',
    model: 'City i-VTEC V',
    year: 2020,
    price: 12500,
    mileage: 31000,
    fuelType: 'Petrol',
    transmission: 'Manual',
    bodyType: 'Sedan',
    isCertified: true,
    image: '/images/Honda City i-VTEC V.jpg',
    power: '117 hp',
    engine: '1.5L i-VTEC',
    owners: 1,
    color: 'Golden Brown Metallic',
    rating: 4.7,
    features: ['Keyless Entry', 'Cruise Control', 'Push Button', 'Auto Climate'],
    location: 'Bangalore'
  },
  {
    id: 'car-indian-5',
    brand: 'Mahindra',
    model: 'XUV500 W11 Option',
    year: 2019,
    price: 15200,
    mileage: 48050,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    bodyType: 'SUV',
    isCertified: true,
    image: '/images/Mahindra XUV500 W11 Option.avif',
    power: '155 hp',
    engine: '2.2L mHawk Turbodiesel',
    owners: 1,
    color: 'Mystic Copper',
    rating: 4.5,
    features: ['Leather Seats', 'All Wheel Drive', 'Sunroof', 'Smart Watch'],
    location: 'Delhi NCR'
  },
  {
    id: 'car-indian-6',
    brand: 'Audi',
    model: 'A4 Premium',
    year: 2017,
    price: 26500,
    mileage: 62000,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    bodyType: 'Luxury',
    isCertified: true,
    image: '/images/Audi A4 Premium.jpg',
    power: '190 hp',
    engine: '2.0L TDI Diesel',
    owners: 2,
    color: 'Floret Silver Metallic',
    rating: 4.8,
    features: ['Virtual Cockpit', 'Drive Select', 'Climatronics', 'LED Indicators'],
    location: 'Chennai'
  }
];

const bootstrap = async () => {
  const db = await openDb();
  await run(db, `
    CREATE TABLE IF NOT EXISTS cars (
      id TEXT PRIMARY KEY,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER NOT NULL,
      price INTEGER NOT NULL,
      mileage INTEGER NOT NULL,
      fuelType TEXT NOT NULL,
      transmission TEXT NOT NULL,
      bodyType TEXT NOT NULL,
      isCertified INTEGER NOT NULL DEFAULT 0,
      image TEXT NOT NULL,
      power TEXT,
      engine TEXT,
      owners INTEGER NOT NULL DEFAULT 1,
      color TEXT,
      rating REAL NOT NULL DEFAULT 0,
      features TEXT,
      location TEXT,
      formattedPrice TEXT,
      seating INTEGER,
      createdAt TEXT NOT NULL
    )
  `);

  const countResult = await all(db, 'SELECT COUNT(*) as count FROM cars');
  if (countResult[0].count === 0) {
    for (const car of seedCars) {
      await run(db, `
        INSERT INTO cars (id, brand, model, year, price, mileage, fuelType, transmission, bodyType, isCertified, image, power, engine, owners, color, rating, features, location, formattedPrice, seating, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        car.id,
        car.brand,
        car.model,
        car.year,
        car.price,
        car.mileage,
        car.fuelType,
        car.transmission,
        car.bodyType,
        car.isCertified ? 1 : 0,
        car.image,
        car.power,
        car.engine,
        car.owners,
        car.color,
        car.rating,
        JSON.stringify(car.features || []),
        car.location || null,
        car.formattedPrice || null,
        car.seating || null,
        new Date().toISOString()
      ]);
    }
  }

  // Migration: fix any absolute localhost image URLs → relative paths.
  // This handles previously uploaded cars that were saved with absolute URLs.
  const carsWithAbsoluteUrls = await all(db, `SELECT id, image FROM cars WHERE image LIKE 'http%/uploads/%'`);
  for (const row of carsWithAbsoluteUrls) {
    // Extract just the /uploads/filename part from the full URL
    const relativeUrl = row.image.replace(/^https?:\/\/[^/]+/, '');
    await run(db, `UPDATE cars SET image = ? WHERE id = ?`, [relativeUrl, row.id]);
    console.log(`Migrated image URL for car ${row.id}: ${relativeUrl}`);
  }
  if (carsWithAbsoluteUrls.length > 0) {
    console.log(`Fixed ${carsWithAbsoluteUrls.length} car image URL(s) to use relative paths.`);
  }

  app.locals.db = db;

  app.get('/api/cars', async (_req, res) => {
    try {
      const rows = await all(db, 'SELECT * FROM cars ORDER BY createdAt DESC');
      console.log(`Returning ${rows.length} cars from database`);
      res.json(rows.map(rowToCar));
    } catch (error) {
      console.error('Error fetching cars:', error);
      res.status(500).json({ error: 'Unable to load cars' });
    }
  });

  app.post('/api/cars/upload', (req, res, next) => {
    upload.array('images', 10)(req, res, (err) => {
      if (err) {
        console.error('Multer error:', err);
        
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File too large. Maximum size is 100MB per image.' });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({ error: 'Too many files. Maximum is 10 images.' });
        }
        if (err.message === 'Only image files are allowed') {
          return res.status(400).json({ error: 'Only image files (JPG, PNG, WebP, etc.) are allowed.' });
        }
        
        return res.status(400).json({ error: err.message || 'File upload error' });
      }
      
      try {
        const files = Array.isArray(req.files) ? req.files : [];
        
        if (files.length === 0) {
          return res.status(400).json({ error: 'No files uploaded' });
        }

        const urls = files.map((file) => `/uploads/${file.filename}`);
        
        console.log(`Successfully uploaded ${files.length} image(s)`);
        res.json({ urls });
      } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Image upload failed', details: error instanceof Error ? error.message : 'Unknown error' });
      }
    });
  });

  app.post('/api/cars', async (req, res) => {
    try {
      const car = req.body;
      const id = car.id || `car-custom-${Date.now()}`;
      const now = new Date().toISOString();
      
      console.log(`Inserting new car: ${car.brand} ${car.model} (ID: ${id})`);
      
      await run(db, `
        INSERT INTO cars (id, brand, model, year, price, mileage, fuelType, transmission, bodyType, isCertified, image, power, engine, owners, color, rating, features, location, formattedPrice, seating, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        id,
        car.brand,
        car.model,
        Number(car.year || 2022),
        Number(car.price || 0),
        Number(car.mileage || 0),
        car.fuelType || 'Petrol',
        car.transmission || 'Automatic',
        car.bodyType || 'SUV',
        car.isCertified ? 1 : 0,
        car.image || '/images/placeholder.jpg',
        car.power || 'N/A',
        car.engine || 'N/A',
        Number(car.owners || 1),
        car.color || 'Unknown',
        Number(car.rating || 4.5),
        JSON.stringify(car.features || []),
        car.location || null,
        car.formattedPrice || null,
        car.seating || null,
        now
      ]);

      console.log(`Car inserted successfully. Total cars in database:`);
      const countResult = await all(db, 'SELECT COUNT(*) as count FROM cars');
      console.log(`  ${countResult[0].count} cars`);
      
      res.status(201).json({ ...car, id, createdAt: now });
    } catch (error) {
      console.error('Error saving car:', error);
      res.status(500).json({ error: 'Unable to save car listing' });
    }
  });

  app.use(express.static(path.join(__dirname, 'public')));

  app.listen(port, () => {
    console.log(`Car inventory API listening on http://localhost:${port}`);
  });

  process.on('SIGINT', () => {
    db.close((err) => {
      if (err) console.error(err);
      process.exit(0);
    });
  });
};

bootstrap().catch((error) => {
  console.error('Database bootstrap failed:', error);
  process.exit(1);
});
