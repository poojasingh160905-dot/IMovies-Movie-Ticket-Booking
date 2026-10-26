const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Movie description is required']
    },
    genre: {
      type: [String],
      required: [true, 'At least one genre is required']
    },
    duration: {
      type: Number, // in minutes
      required: [true, 'Movie duration in minutes is required']
    },
    language: {
      type: String,
      default: 'English'
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 8.0
    },
    posterUrl: {
      type: String,
      required: [true, 'Movie poster URL is required']
    },
    bannerUrl: {
      type: String,
      default: ''
    },
    releaseDate: {
      type: Date,
      default: Date.now
    },
    director: {
      type: String,
      default: 'Director'
    },
    cast: {
      type: [String],
      default: []
    },
    basePrice: {
      type: Number,
      required: true,
      default: 250
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Index for search query
movieSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Movie', movieSchema);
