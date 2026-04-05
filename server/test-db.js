require('dotenv').config();
const mongoose = require('mongoose');

console.log("MONGO_URI:", process.env.MONGO_URI); // 👈 check if loading

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.log("❌ FULL ERROR:");
    console.log(err.message);
  });
