require('dotenv').config();
const mongoose = require('mongoose');

console.log('Attempting to connect to MongoDB...');
console.log('URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ SUCCESS: MongoDB is connected!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ FAILURE: Could not connect to MongoDB.');
    console.error(err.message);
    process.exit(1);
  });
