const express = require('express');
const bodyParser = require('body-parser');
const DynamoDBSchemaUpdater=require("./services/aws/DynamoDBSchemaUpdater")


const app = express();

// Middlewares
app.use(bodyParser.json());

DynamoDBSchemaUpdater.update();

// Routes
const carPartRoutes = require('./routes/carPartRoute');
const orderRoutes = require('./routes/orderRoute');
const paymentRoutes = require('./routes/paymentRoute');
const promotionRoutes = require('./routes/promotionRoute');
const userRoutes = require('./routes/userRoute');
const vehicleRoutes = require('./routes/vehicleRoute');
const fileUploadRoutes = require('./routes/fileUploadRoute');
const authRoutes = require('./routes/authRoute');

// Mount the route files
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/car-parts', carPartRoutes);
app.use('/orders', orderRoutes);
app.use('/payments', paymentRoutes);
app.use('/promotions', promotionRoutes);
app.use('/vehicles', vehicleRoutes);
app.use('/file-upload', fileUploadRoutes);

// Start your server
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});