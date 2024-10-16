// Importing necessary modules
const express = require('express'); // Import Express.js framework
const cors = require('cors'); // Import CORS middleware for handling cross-origin requests
const dotenv = require('dotenv'); // Import dotenv for loading environment variables from a .env file
dotenv.config(); // Load environment variables from .env file into process.env
const dbConnect = require('./Config/db'); // Import your database connection function
const routes=require('./Routes/Routers')
const cookieParser = require('cookie-parser')

const app = express(); // Initialize an Express application

// Middleware to parse incoming JSON requests
app.use(express.json()); // Allows the app to parse JSON data in the request body

// Enable Cross-Origin Resource Sharing (CORS) for all routes
app.use(cors({
  origin: true || process.dotenv.FRONTEND_URL,  // Ensure this matches the frontend URL
  credentials: true  // This must be true to allow cookies to be sent
})); // This middleware allows handling requests from different origins

// router define
app.use('/api/v1',routes)

// cookies
app.use(cookieParser())

// Define the port on which the server will run
const PORT = process.env.PORT || 5000; 

// Start the server only after the database connection is established
dbConnect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); // Log a message when the server starts
  });
}).catch((error) => {
  console.error('Database connection failed:', error);
});
