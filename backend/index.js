require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const path = require('path');

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const app = express();

// Debugging: Log all environment variables (remove in production)
//console.log('Environment Variables:', process.env);

// Connect DB
connectDB();
console.log('MONGO_URI:', process.env.MONGO_URL);

// Middlewares
// server.js (CORS Configuration)
app.use(cors({
  origin: (origin, callback) => {
    console.log("Request from origin:", origin);  // Debugging log
    if (origin === process.env.CLIENT_URL || origin === process.env.EXTENSION_URL) {
      callback(null, true);  // Allow requests from both the client and extension
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  // allowedHeaders:true  // Ensure cookies are included in requests
}));




app.use(express.json());
app.use(morgan('dev'));


app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: 'sessions',
    }),
    cookie: {
      httpOnly: true,  // Prevent access to cookie from JavaScript
      secure: process.env.NODE_ENV === 'production',  // Use `true` in production, `false` in development
      // sameSite: 'None',  // Required for cross-origin requests (like from Chrome extension)
      maxAge: 1000 * 60 * 20,  // 20 minutes
    },
  })
);


// Passport
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/applications', applicationRoutes);

// Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
