const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const { doctors, locations, specialities, users } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// #swagger.tags = ['Auth']
app.post('/signup', (req, res) => {
  /* #swagger.summary = 'User Signup' 
     #swagger.parameters['body'] = {
       in: 'body',
       description: 'User signup info',
       required: true,
       schema: { $name: "John Doe", $email: "john@example.com", $password: "strongpassword" }
     }
     #swagger.responses[201] = {
       description: 'Signup successful',
       schema: { message: 'Signup successful', user: { id: 'uuid', name: 'John Doe', email: 'john@example.com', password: 'hashed' } }
     }
     #swagger.responses[400] = { description: 'User already exists' }
  */
  const { name, email, password } = req.body;
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }
  const newUser = { id: uuidv4(), name, email, password };
  users.push(newUser);
  res.status(201).json({ message: 'Signup successful', user: newUser });
});

// #swagger.tags = ['Auth']
app.post('/login', (req, res) => {
  /* #swagger.summary = 'User Login'
     #swagger.parameters['body'] = {
       in: 'body',
       description: 'User login info',
       required: true,
       schema: { $email: "john@example.com", $password: "strongpassword" }
     }
     #swagger.responses[200] = {
       description: 'Login successful',
       schema: { message: 'Login successful', user: { id: 'uuid', name: 'John Doe', email: 'john@example.com' } }
     }
     #swagger.responses[401] = { description: 'Invalid credentials' }
  */
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  res.json({ message: 'Login successful', user });
});

// #swagger.tags = ['Master Data']
app.get('/locations', (req, res) => {
  /* #swagger.summary = 'Get All Locations'
     #swagger.responses[200] = {
       description: 'List of locations',
       schema: [{ id: '1', name: 'New York' }]
     }
  */
  res.json(locations);
});

// #swagger.tags = ['Master Data']
app.get('/specialities', (req, res) => {
  /* #swagger.summary = 'Get All Specialities'
     #swagger.responses[200] = {
       description: 'List of specialities',
       schema: [{ id: '1', name: 'Cardiology' }]
     }
  */
  res.json(specialities);
});

// #swagger.tags = ['Doctors']
app.get('/doctors', (req, res) => {
  /* #swagger.summary = 'Search Doctors with filters including name and sorting'
     #swagger.parameters['location'] = {
       in: 'query',
       description: 'Filter by location',
       required: false,
       type: 'string',
       example: 'New York'
     }
     #swagger.parameters['speciality'] = {
       in: 'query',
       description: 'Filter by speciality',
       required: false,
       type: 'string',
       example: 'Cardiology'
     }
     #swagger.parameters['available'] = {
       in: 'query',
       description: 'Filter by availability (true/false)',
       required: false,
       type: 'string',
       enum: ['true', 'false'],
       example: 'true'
     }
     #swagger.parameters['sortBy'] = {
       in: 'query',
       description: 'Sort by rating, consultationFee, or experience',
       required: false,
       type: 'string',
       enum: ['rating', 'consultationFee', 'experience'],
       example: 'rating'
     }
     #swagger.parameters['sortOrder'] = {
       in: 'query',
       description: 'Sort order asc or desc',
       required: false,
       type: 'string',
       enum: ['asc', 'desc'],
       example: 'desc'
     }
     #swagger.parameters['name'] = {
       in: 'query',
       description: 'Search doctors by name (partial, case-insensitive)',
       required: false,
       type: 'string',
       example: 'Alice'
     }
     #swagger.responses[200] = {
       description: 'List of doctors matching filters',
       schema: [{
         id: '1',
         name: 'Dr. Alice',
         speciality: 'Cardiology',
         rating: 4.5,
         experience: 10,
         consultationFee: 600,
         location: 'New York',
         available: true
       }]
     }
  */
  let { location, speciality, available, sortBy, sortOrder, name } = req.query;
  let result = [...doctors];

  if (location) result = result.filter(doc => doc.location === location);
  if (speciality) result = result.filter(doc => doc.speciality === speciality);
  if (available) result = result.filter(doc => doc.available.toString() === available);
  if (name) {
    const nameLower = name.toLowerCase();
    result = result.filter(doc => doc.name.toLowerCase().includes(nameLower));
  }

  if (sortBy) {
    const validSorts = ['rating', 'consultationFee', 'experience'];
    if (validSorts.includes(sortBy)) {
      // default to descending order
      const order = sortOrder === 'asc' ? 1 : -1;
      result.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return -1 * order;
        if (a[sortBy] > b[sortBy]) return 1 * order;
        return 0;
      });
    }
  }

  res.json(result);
});

app.get("/health", () => ({
  "status": "healthy"
}))

setTimeout(() => {
  fetch("https://machine-test-api.onrender.com/health");
  console.log("Health checking")
}, 10 * 60 * 1000)


app.listen(3000, () => {

  fetch("https://machine-test-api.onrender.com/health");
  console.log("Health checking")
  console.log('Server running on http://localhost:3000')
});
