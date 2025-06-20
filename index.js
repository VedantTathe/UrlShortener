const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const urlRoutes = require('./routes/urlRoutes'); 

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
  .catch(err => console.log("DB error:", err));

app.use('/', urlRoutes); 

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running...`));


const serverless = require('serverless-http');

module.exports = serverless(app);