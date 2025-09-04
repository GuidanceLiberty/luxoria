import express from 'express';
import dotenv from 'dotenv';
import connectToDb from './db/connectDB.js';
import cors from 'cors';
import authRoute from './routes/auth.route.js';
import productRoute from './routes/productRoutes.js';
import categoryRoute from './routes/category.route.js';
import paymentRoute from './routes/paymentRoute.js'; // ✅ import payment route

dotenv.config();

const CLIENT_URL = process.env.CLIENT_URL;
const app = express();

app.use(express.json());
app.use(cors({ origin: CLIENT_URL, credentials: true }));

// ROUTES
app.use('/api/auth', authRoute);
app.use('/api/products', productRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/payments', paymentRoute); // ✅ add payment route

// Custom error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "An internal server error occurred.",
    error: err.message
  });
});

const port = process.env.PORT || 6000;
app.listen(port, () => {
  connectToDb();
  console.log(`Server is running on port http://localhost:${port}`);
});
