const express = require('express');
const bodyParser = require('body-parser');
const carPartRoutes = require('./routes/carPartRoutes');

const app = express();

// Middlewares
app.use(bodyParser.json());

// Routes
app.use('/api/carparts', carPartRoutes);

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
