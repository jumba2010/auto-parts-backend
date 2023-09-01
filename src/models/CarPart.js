const { Schema, model } = require('mongoose');

const carPartSchema = new Schema({
  name: String,
  vehicleId: String,
  brand: String,
  country: String,
  material: String,
  color: String,
  description: String,
  dimension: {
    length: Number,
    width: Number,
    height: Number,
    weight: Number,
  },
  features: [{ name: String, value: String }],
  specifications: [{ name: String, value: String }],
  images: [String], // Array of image URLs from S3
});

module.exports = model('CarPart', carPartSchema);
