const { v4: uuidv4 } = require('uuid');

exports.users = [];

exports.locations = [
  'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix',
  'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose',
  'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte'
].map(name => ({ id: uuidv4(), name }));

exports.specialities = [
  'Cardiology', 'Neurology', 'Dermatology', 'Orthopedics', 'Pediatrics',
  'Gastroenterology', 'Psychiatry', 'Endocrinology', 'Ophthalmology', 'Pulmonology',
  'Rheumatology', 'Nephrology', 'Gynecology', 'Urology', 'Oncology'
].map(name => ({ id: uuidv4(), name }));

exports.doctors = [
  {
    name: 'Dr. Alice', speciality: 'Cardiology', rating: 4.5, experience: 10,
    consultationFee: 600, location: 'New York', available: true
  },
  {
    name: 'Dr. Bob', speciality: 'Neurology', rating: 4.8, experience: 8,
    consultationFee: 800, location: 'Los Angeles', available: false
  },
  {
    name: 'Dr. Carol', speciality: 'Dermatology', rating: 4.2, experience: 5,
    consultationFee: 500, location: 'Chicago', available: true
  },
  {
    name: 'Dr. Daniel', speciality: 'Orthopedics', rating: 4.6, experience: 12,
    consultationFee: 750, location: 'Houston', available: true
  },
  {
    name: 'Dr. Eva', speciality: 'Pediatrics', rating: 4.7, experience: 9,
    consultationFee: 550, location: 'Phoenix', available: false
  },
  {
    name: 'Dr. Frank', speciality: 'Gastroenterology', rating: 4.4, experience: 11,
    consultationFee: 700, location: 'Philadelphia', available: true
  },
  {
    name: 'Dr. Grace', speciality: 'Psychiatry', rating: 4.3, experience: 7,
    consultationFee: 650, location: 'San Antonio', available: true
  },
  {
    name: 'Dr. Henry', speciality: 'Endocrinology', rating: 4.1, experience: 6,
    consultationFee: 600, location: 'San Diego', available: false
  },
  {
    name: 'Dr. Irene', speciality: 'Ophthalmology', rating: 4.9, experience: 13,
    consultationFee: 900, location: 'Dallas', available: true
  },
  {
    name: 'Dr. Jason', speciality: 'Pulmonology', rating: 4.0, experience: 4,
    consultationFee: 500, location: 'San Jose', available: false
  },
  {
    name: 'Dr. Karen', speciality: 'Rheumatology', rating: 4.6, experience: 10,
    consultationFee: 720, location: 'Austin', available: true
  },
  {
    name: 'Dr. Leo', speciality: 'Nephrology', rating: 4.5, experience: 9,
    consultationFee: 780, location: 'Jacksonville', available: true
  },
  {
    name: 'Dr. Maria', speciality: 'Gynecology', rating: 4.8, experience: 11,
    consultationFee: 850, location: 'Fort Worth', available: false
  },
  {
    name: 'Dr. Nathan', speciality: 'Urology', rating: 4.3, experience: 6,
    consultationFee: 690, location: 'Columbus', available: true
  },
  {
    name: 'Dr. Olivia', speciality: 'Oncology', rating: 4.7, experience: 14,
    consultationFee: 950, location: 'Charlotte', available: true
  }
].map(doc => ({ id: uuidv4(), ...doc }));
