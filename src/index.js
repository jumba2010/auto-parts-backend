const express = require('express');
const bodyParser = require('body-parser');
const DynamoDBSchemaUpdater=require("./services/aws/DynamoDBSchemaUpdater")


const app = express();

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


// Middlewares
app.use(bodyParser.json());

//DynamoDBSchemaUpdater.update();

// Routes
const carPartRoutes = require('./routes/carPartRoute');
const orderRoutes = require('./routes/orderRoute');
const paymentRoutes = require('./routes/paymentRoute');
const promotionRoutes = require('./routes/promotionRoute');
const userRoutes = require('./routes/userRoute');
const vehicleRoutes = require('./routes/vehicleRoute');
const fileUploadRoutes = require('./routes/fileUploadRoute');
const authRoutes = require('./routes/authRoute');
const auditRoute = require('./routes/auditRoute');
const bestSellerRoute = require('./routes/bestSellerRoute');
const clientRoute = require('./routes/clientRoute');
const newArrivalsRoute = require('./routes/newArrivalsRoute');
const popularCategoryRoute = require('./routes/popularCategoryRoute');
const popularProductRoute = require('./routes/popularProductRoute');
const specialOfferRoute = require('./routes/specialOfferRoute');
const stockRoute = require('./routes/stockRoute');
const topRatedRoute = require('./routes/topRatedRoute');
const visitRoute = require('./routes/visitRoute');
const wishListRoute = require('./routes/wishListRoute');
const reviewRoute = require('./routes/reviewRoute');

// Mount the route files
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/car-parts', carPartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/promotions', promotionRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);
app.use('/api/v1/file-upload', fileUploadRoutes);
app.use('/api/v1/audit', auditRoute);
app.use('/api/v1/best-seller', bestSellerRoute);
app.use('/api/v1/client', clientRoute);
app.use('/api/v1/new-arrivals', newArrivalsRoute);
app.use('/api/v1/popular-category', popularCategoryRoute);
app.use('/api/v1/popular-product', popularProductRoute);
app.use('/api/v1/special-offer', specialOfferRoute);
app.use('/api/v1/stock', stockRoute);
app.use('/api/v1/top-rated', topRatedRoute);
app.use('/api/v1/visit', visitRoute);
app.use('/api/v1/wish-list', wishListRoute);
app.use('/api/v1/review', reviewRoute);

// Start your server
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});