const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected for seeding');
    const csvFilePath = path.join(__dirname, '../data/ecommerce.csv');
    const stream = fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', async (row) => {
        try {
          await Product.create(row);
        } catch (err) {
          console.error('Error inserting row:', err.message);
        }
      })
      .on('end', () => {
        console.log('CSV file successfully processed');
        process.exit();
      })
      .on('error', (err) => {
        console.error('Error reading CSV file:', err.message);
        process.exit(1);
      });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  });
