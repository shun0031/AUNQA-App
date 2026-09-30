const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'AUN-QA API is running' });
});

const path = require('path');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/evidence', require('./routes/evidence'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/report', require('./routes/report'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
