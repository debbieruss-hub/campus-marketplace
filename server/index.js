import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly target server/uploads
const uploadsDir = path.resolve(__dirname, 'uploads');

// Ensure directory exists synchronously before server boot
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from server/uploads
app.use('/uploads', express.static(uploadsDir));

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `item-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// In-memory marketplace items
let items = [
  {
    id: 1,
    title: 'Vinod Triply Stainless Steel Multipan',
    price: 1800,
    category: 'Kitchenware',
    location: 'Pamplemousses Campus',
    description: 'Heavy-bottom tri-ply pan perfect for daily cooking, uniform heat distribution. Includes glass lid.',
    image_url: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop',
    seller_name: 'Deborah',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Panasonic 800W Multi-Function Blender',
    price: 2500,
    category: 'Appliances',
    location: 'Dorm Block B',
    description: 'Includes glass jug and dual dry mills for smoothie prep and grain milling. Excellent condition.',
    image_url: 'https://images.unsplash.com/photo-1570222020535-074461523c96?w=600&auto=format&fit=crop',
    seller_name: 'Deborah',
    created_at: new Date().toISOString(),
  },
];

// POST /api/auth/login - Student Verification Endpoint
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email address is required.' 
    });
  }

  const cleanEmail = email.trim().toLowerCase();

  // Enforce strict @alustudent.com domain restriction
  if (!cleanEmail.endsWith('@alustudent.com')) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You must use an official @alustudent.com email address.',
    });
  }

  // Generate a display name from email address
  const rawUsername = cleanEmail.split('@')[0];
  const formattedName = rawUsername
    .split('.')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  const user = {
    name: formattedName,
    email: cleanEmail,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formattedName)}&background=0D8ABC&color=fff`,
  };

  console.log(`Verified student login: ${cleanEmail}`);

  return res.json({
    success: true,
    message: 'Authentication successful.',
    user,
  });
});

// GET /api/items
app.get('/api/items', (req, res) => {
  res.json({ success: true, count: items.length, data: items });
});

// POST /api/items
app.post('/api/items', upload.single('image'), (req, res) => {
  try {
    console.log('--- POST /api/items received ---');
    console.log('File details:', req.file);
    console.log('Body details:', req.body);

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Item photo is required.' });
    }

    const imageUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;

    const newItem = {
      id: Date.now(),
      title: req.body.title,
      price: Number(req.body.price),
      category: req.body.category,
      location: req.body.location,
      description: req.body.description,
      image_url: imageUrl,
      seller_name: req.body.seller_name || 'Deborah',
      seller_email: req.body.seller_email || 'd.russellab@alustudent.com',
      created_at: new Date().toISOString(),
    };

    items.unshift(newItem);

    console.log('Successfully saved to:', req.file.path);

    res.status(201).json({
      success: true,
      message: 'Item listed successfully!',
      data: newItem,
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Uploads directory: ${uploadsDir}`);
});
