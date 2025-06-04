const express = require('express');
const { v4: uuidv4 } = require('uuid');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

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
      available: true,
    },
    // ... (other doctors omitted for brevity)
    {
      id: '15',
      name: 'Dr. Oscar',
      speciality: 'Pulmonology',
      rating: 4.2,
      experience: 8,
      consultationFee: 620,
      location: 'Portland',
      available: true,
    },
  ],
};

// Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

/**
 * User signup
 * @openapi
 * /api/signup:
 *   post:
 *     summary: User signup
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Signup successful with user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: User already exists
 */
app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }
  if (db.users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const user = { id: uuidv4(), name, email: email.toLowerCase(), password };
  db.users.push(user);
  res.json({ message: 'Signup successful', user: { id: user.id, name: user.name, email: user.email } });
});

/**
 * User login
 * @openapi
 * /api/login:
 *   post:
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful with user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 */
app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }
  const user = db.users.find(u => u.email === email.toLowerCase() && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email } });
});

/**
 * Doctor search with filters and sorting
 * @openapi
 * /api/doctors:
 *   get:
 *     summary: Doctor search with filters and sorting
 *     parameters:
 *       - in: query
 *         name: speciality
 *         schema:
 *           type: string
 *         description: Filter by speciality
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *       - in: query
 *         name: minRating
 *         schema:
 *           type: number
 *         description: Minimum rating filter
 *       - in: query
 *         name: minExperience
 *         schema:
 *           type: integer
 *         description: Minimum years of experience filter
 *       - in: query
 *         name: maxFee
 *         schema:
 *           type: integer
 *         description: Maximum consultation fee filter
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *         description: Availability filter
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [rating, experience, consultationFee, name]
 *         description: Field to sort by (default: rating)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order (default: desc)
 *     responses:
 *       200:
 *         description: Array of doctors matching filters
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   speciality:
 *                     type: string
 *                   rating:
 *                     type: number
 *                   experience:
 *                     type: integer
 *                   consultationFee:
 *                     type: integer
 *                   location:
 *                     type: string
 *                   available:
 *                     type: boolean
 */
app.get('/api/doctors', (req, res) => {
  const {
    speciality,
    location,
    minRating,
    minExperience,
    maxFee,
    available,
    sortBy = 'rating',
    order = 'desc',
  } = req.query;

  let results = db.doctors;

  if (speciality) {
    results = results.filter(d => d.speciality.toLowerCase() === speciality.toLowerCase());
  }

  if (location) {
    results = results.filter(d => d.location.toLowerCase() === location.toLowerCase());
  }

  if (minRating && !isNaN(parseFloat(minRating))) {
    results = results.filter(d => d.rating >= parseFloat(minRating));
  }

  if (minExperience && !isNaN(parseInt(minExperience))) {
    results = results.filter(d => d.experience >= parseInt(minExperience));
  }

  if (maxFee && !isNaN(parseInt(maxFee))) {
    results = results.filter(d => d.consultationFee <= parseInt(maxFee));
  }

  if (available !== undefined) {
    if (available === 'true' || available === 'false') {
      const boolVal = available === 'true';
      results = results.filter(d => d.available === boolVal);
    }
  }

  const validSortFields = ['rating', 'experience', 'consultationFee', 'name'];
  const sortField = validSortFields.includes(sortBy) ? sortBy : 'rating';
  const sortOrder = order === 'asc' ? 1 : -1;

  results.sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return aVal.localeCompare(bVal) * sortOrder;
    }
    return (aVal - bVal) * sortOrder;
  });

  res.json(results);
});

/**
 * Health check endpoint
 * @openapi
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     responses:
 *       200:
 *         description: Status OK with timestamp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 timestamp:
 *                   type: string
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
