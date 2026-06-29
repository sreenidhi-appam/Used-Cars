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

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
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
  limits: { fileSize: 8 * 1024 * 1024 },
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
    features: ['Autopilot', 'Panoramic Glass Roof', 'Premium Audio System'],
    location: 'Bengaluru'
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

  app.locals.db = db;

  app.get('/api/cars', async (_req, res) => {
    try {
      const rows = await all(db, 'SELECT * FROM cars ORDER BY createdAt DESC');
      res.json(rows.map(rowToCar));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Unable to load cars' });
    }
  });

  app.post('/api/cars/upload', upload.array('images', 10), (req, res) => {
    try {
      const files = Array.isArray(req.files) ? req.files : [];
      
      if (files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const urls = files.map((file) => `${baseUrl}/uploads/${file.filename}`);
      
      console.log(`Successfully uploaded ${files.length} image(s) to ${baseUrl}/uploads`);
      res.json({ urls });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Image upload failed', details: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  app.post('/api/cars', async (req, res) => {
    try {
      const car = req.body;
      const id = car.id || `car-custom-${Date.now()}`;
      const now = new Date().toISOString();
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

      res.status(201).json({ ...car, id, createdAt: now });
    } catch (error) {
      console.error(error);
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
