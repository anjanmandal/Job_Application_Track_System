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
app.use(cors({
  origin: process.env.CLIENT_URL, // your client URL
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// Serve uploaded files (resumes) statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: 'sessions'
    }),
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 20,
    }
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
