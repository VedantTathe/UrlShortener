const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const urlRoutes = require('./routes/urlRoutes'); // fixed path
const serverless = require('serverless-http');

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('DB error:', err));

app.use('/', urlRoutes); // routes defined in /routes/urlRoutes.js

module.exports.handler = serverless(app); // ✅ Required by Vercel
