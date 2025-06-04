const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.json());

// In-memory DB
const db = {
  users: [],
  doctors: [
    {
      id: '1',
      name: 'Dr. Alice',
      speciality: 'Cardiology',
      rating: 4.5,
      experience: 10,
      consultationFee: 600,
      location: 'New York',
      available: true
    },
    {
      id: '2',
      name: 'Dr. Bob',
      speciality: 'Dermatology',
      rating: 4.2,
      experience: 8,
      consultationFee: 400,
      location: 'Los Angeles',
      available: false
    },
    {
      id: '3',
      name: 'Dr. Charlie',
      speciality: 'Cardiology',
      rating: 4.8,
      experience: 15,
      consultationFee: 750,
      location: 'Chicago',
      available: true
    },
    {
      id: '4',
      name: 'Dr. Daisy',
      speciality: 'Neurology',
      rating: 4.6,
      experience: 12,
      consultationFee: 1000,
      location: 'Boston',
      available: true
    },
    {
      id: '5',
      name: 'Dr. Edward',
      speciality: 'Cardiology',
      rating: 4.1,
      experience: 7,
      consultationFee: 500,
      location: 'New York',
      available: false
    },
    {
      id: '6',
      name: 'Dr. Fiona',
      speciality: 'Pediatrics',
      rating: 4.7,
      experience: 9,
      consultationFee: 300,
      location: 'Austin',
      available: true
    },
    {
      id: '7',
      name: 'Dr. George',
      speciality: 'Orthopedics',
      rating: 4.3,
      experience: 11,
      consultationFee: 700,
      location: 'Seattle',
      available: true
    },
    {
      id: '8',
      name: 'Dr. Helen',
      speciality: 'Dermatology',
      rating: 4.0,
      experience: 6,
      consultationFee: 450,
      location: 'San Francisco',
      available: false
    },
    {
      id: '9',
      name: 'Dr. Ian',
      speciality: 'Gastroenterology',
      rating: 4.4,
      experience: 13,
      consultationFee: 650,
      location: 'Denver',
      available: true
    },
    {
      id: '10',
      name: 'Dr. Julia',
      speciality: 'Endocrinology',
      rating: 4.9,
      experience: 14,
      consultationFee: 900,
      location: 'Miami',
      available: true
    },
    {
      id: '11',
      name: 'Dr. Kevin',
      speciality: 'Psychiatry',
      rating: 4.1,
      experience: 10,
      consultationFee: 550,
      location: 'Atlanta',
      available: false
    },
    {
      id: '12',
      name: 'Dr. Laura',
      speciality: 'Ophthalmology',
      rating: 4.6,
      experience: 12,
      consultationFee: 480,
      location: 'San Diego',
      available: true
    },
    {
      id: '13',
      name: 'Dr. Mark',
      speciality: 'Urology',
      rating: 4.3,
      experience: 9,
      consultationFee: 530,
      location: 'Dallas',
      available: true
    },
    {
      id: '14',
      name: 'Dr. Nina',
      speciality: 'Rheumatology',
      rating: 4.7,
      experience: 11,
      consultationFee: 670,
      location: 'Philadelphia',
      available: false
    },
    {
      id: '15',
      name: 'Dr. Oscar',
      speciality: 'Pulmonology',
      rating: 4.2,
      experience: 8,
      consultationFee: 620,
      location: 'Portland',
      available: true
    }
  ]
};

// Signup
app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const user = { id: uuidv4(), name, email, password };
  db.users.push(user);
  res.json({ message: 'Signup successful', user });
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  res.json({ message: 'Login successful', user });
});

// Doctor search with advanced filters
app.get('/api/doctors', (req, res) => {
  const {
    speciality,
    location,
    minRating,
    minExperience,
    maxFee,
    available,
    sortBy = 'rating',
    order = 'desc'
  } = req.query;

  let results = db.doctors;

  if (speciality) {
    results = results.filter(d => d.speciality.toLowerCase() === speciality.toLowerCase());
  }

  if (location) {
    results = results.filter(d => d.location.toLowerCase() === location.toLowerCase());
  }

  if (minRating) {
    results = results.filter(d => d.rating >= parseFloat(minRating));
  }

  if (minExperience) {
    results = results.filter(d => d.experience >= parseInt(minExperience));
  }

  if (maxFee) {
    results = results.filter(d => d.consultationFee <= parseInt(maxFee));
  }

  if (available !== undefined) {
    const boolVal = available === 'true';
    results = results.filter(d => d.available === boolVal);
  }

  const validSortFields = ['rating', 'experience', 'consultationFee', 'name'];
  if (validSortFields.includes(sortBy)) {
    results.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (order === 'asc') return aVal > bVal ? 1 : -1;
      else return aVal < bVal ? 1 : -1;
    });
  }

  res.json(results);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);

  // Ping the health endpoint every 1 minute
  setInterval(async () => {
    try {
      const res = await fetch(`http://localhost:${PORT}/api/health`);
      const data = await res.json();
      console.log(`Health check at ${new Date().toISOString()}:`, data);
    } catch (error) {
      console.error('Health check failed:', error.message);
    }
  }, 60000);

  // Initial ping immediately
  (async () => {
    try {
      const res = await fetch(`http://localhost:${PORT}/api/health`);
      const data = await res.json();
      console.log(`Initial health check at ${new Date().toISOString()}:`, data);
    } catch (error) {
      console.error('Initial health check failed:', error.message);
    }
  })();
});
