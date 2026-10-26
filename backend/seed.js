require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Movie = require('./models/Movie');
const Showtime = require('./models/Showtime');
const Booking = require('./models/Booking');

const sampleMovies = [
  {
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
    genre: ['Sci-Fi', 'Action', 'Thriller'],
    duration: 148,
    language: 'English',
    rating: 8.8,
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy'],
    basePrice: 280,
    featured: true
  },
  {
    title: 'Interstellar',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    genre: ['Sci-Fi', 'Adventure', 'Drama'],
    duration: 169,
    language: 'English',
    rating: 8.7,
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&auto=format&fit=crop&q=80',
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
    basePrice: 300,
    featured: true
  },
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    genre: ['Action', 'Crime', 'Drama'],
    duration: 152,
    language: 'English',
    rating: 9.0,
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1600&auto=format&fit=crop&q=80',
    director: 'Christopher Nolan',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine'],
    basePrice: 260,
    featured: true
  },
  {
    title: 'Avengers: Endgame',
    description: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos actions and restore balance to the universe.',
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    duration: 181,
    language: 'English',
    rating: 8.4,
    posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1600&auto=format&fit=crop&q=80',
    director: 'Anthony Russo, Joe Russo',
    cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo', 'Chris Hemsworth'],
    basePrice: 320,
    featured: true
  },
  {
    title: 'Oppenheimer',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, exploring the moral and political turmoil of creating the ultimate weapon.',
    genre: ['Biography', 'Drama', 'History'],
    duration: 180,
    language: 'English',
    rating: 8.9,
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
    basePrice: 280,
    featured: false
  },
  {
    title: 'Spider-Man: Across the Spider-Verse',
    description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
    genre: ['Animation', 'Action', 'Adventure'],
    duration: 140,
    language: 'English',
    rating: 8.7,
    posterUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80',
    director: 'Joaquim Dos Santos, Kemp Powers',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Brian Tyree Henry', 'Oscar Isaac'],
    basePrice: 240,
    featured: false
  },
  {
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future.',
    genre: ['Action', 'Adventure', 'Sci-Fi'],
    duration: 166,
    language: 'English',
    rating: 8.6,
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&auto=format&fit=crop&q=80',
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
    basePrice: 290,
    featured: false
  }
];

// Helper to get formatted date string YYYY-MM-DD
const getDateOffset = (daysOffset) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};

const seedData = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/imovies';
    console.log(`Connecting to MongoDB for seeding: ${uri}...`);
    await mongoose.connect(uri);
    console.log('✔ Connected to MongoDB');

    // Clear existing records
    await Booking.deleteMany({});
    await Showtime.deleteMany({});
    await Movie.deleteMany({});
    await User.deleteMany({});
    console.log('✔ Cleared existing database collections');

    // 1. Seed Users
    const demoUser = await User.create({
      name: 'Demo Moviegoer',
      email: 'demo@imovies.com',
      password: 'password123',
      role: 'user'
    });

    const adminUser = await User.create({
      name: 'IMovies Admin',
      email: 'admin@imovies.com',
      password: 'adminpassword123',
      role: 'admin'
    });
    console.log(`✔ Created demo users:
   - User: demo@imovies.com / password123
   - Admin: admin@imovies.com / adminpassword123`);

    // 2. Seed Movies
    const createdMovies = await Movie.insertMany(sampleMovies);
    console.log(`✔ Inserted ${createdMovies.length} sample movies with rich metadata`);

    // 3. Seed Showtimes for each movie across 3 days
    const screens = [
      'Screen 1 - Dolby Atmos 4K',
      'Screen 2 - IMAX Laser',
      'Screen 3 - Prime 3D'
    ];
    const timeSlots = ['10:30 AM', '02:00 PM', '06:15 PM', '09:45 PM'];

    const showtimesToInsert = [];
    const dates = [getDateOffset(0), getDateOffset(1), getDateOffset(2)]; // Today, Tomorrow, Day After

    for (const movie of createdMovies) {
      for (const date of dates) {
        // Pick 2 random time slots per day per movie
        const slotsForDay = [timeSlots[0], timeSlots[2]];
        for (let i = 0; i < slotsForDay.length; i++) {
          const time = slotsForDay[i];
          const theater = screens[i % screens.length];
          // Pre-populate some occupied seats for realistic booking demonstration
          const preBooked = i === 0 ? ['A3', 'A4', 'C7'] : ['B2', 'B3'];

          showtimesToInsert.push({
            movie: movie._id,
            theater,
            date,
            time,
            price: movie.basePrice,
            totalSeats: 60,
            rows: 6,
            cols: 10,
            bookedSeats: preBooked
          });
        }
      }
    }

    const createdShowtimes = await Showtime.insertMany(showtimesToInsert);
    console.log(`✔ Created ${createdShowtimes.length} showtimes across upcoming dates`);

    // 4. Create a sample initial booking for demo user
    const sampleShowtime = createdShowtimes[0];
    await Booking.create({
      bookingId: 'BK-10293-8821',
      user: demoUser._id,
      movie: sampleShowtime.movie,
      showtime: sampleShowtime._id,
      seats: ['A3', 'A4'],
      seatCount: 2,
      ticketPrice: sampleShowtime.price,
      totalPrice: sampleShowtime.price * 2,
      status: 'CONFIRMED'
    });
    console.log('✔ Created sample initial booking record for demo user');

    console.log('\n\x1b[32m🎉 Database Seeding Completed Successfully!\x1b[0m\n');
    process.exit(0);
  } catch (error) {
    console.error('\x1b[31m✖ Seeding Error:\x1b[0m', error.message);
    process.exit(1);
  }
};

seedData();
