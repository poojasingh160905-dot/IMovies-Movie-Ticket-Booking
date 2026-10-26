const bcrypt = require('bcryptjs');

// Helper to get formatted date YYYY-MM-DD
const getDateOffset = (daysOffset) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
};

const initialMovies = [
  {
    _id: '66a100010000000000000001',
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
    _id: '66a100010000000000000002',
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
    _id: '66a100010000000000000003',
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
    _id: '66a100010000000000000004',
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
    _id: '66a100010000000000000005',
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
    _id: '66a100010000000000000006',
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
    _id: '66a100010000000000000007',
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

class InMemoryStore {
  constructor() {
    this.users = [];
    this.movies = [...initialMovies];
    this.showtimes = [];
    this.bookings = [];

    this.init();
  }

  async init() {
    // 1. Create demo users
    const salt = await bcrypt.genSalt(10);
    const demoHashedPassword = await bcrypt.hash('password123', salt);

    this.users = [
      {
        _id: '66a200000000000000000001',
        name: 'Demo Moviegoer',
        email: 'demo@imovies.com',
        password: demoHashedPassword,
        role: 'user',
        createdAt: new Date()
      },
      {
        _id: '66a200000000000000000002',
        name: 'IMovies Admin',
        email: 'admin@imovies.com',
        password: demoHashedPassword,
        role: 'admin',
        createdAt: new Date()
      }
    ];

    // 2. Generate Showtimes
    const screens = [
      'Screen 1 - Dolby Atmos 4K',
      'Screen 2 - IMAX Laser',
      'Screen 3 - Prime 3D'
    ];
    const timeSlots = ['10:30 AM', '02:00 PM', '06:15 PM', '09:45 PM'];
    const dates = [getDateOffset(0), getDateOffset(1), getDateOffset(2)];

    let showtimeCounter = 1;
    for (const movie of this.movies) {
      for (const date of dates) {
        const slotsForDay = [timeSlots[0], timeSlots[2]];
        for (let i = 0; i < slotsForDay.length; i++) {
          const hexId = showtimeCounter.toString(16).padStart(24, '0');
          const preBooked = i === 0 ? ['A3', 'A4', 'C7'] : ['B2', 'B3'];

          this.showtimes.push({
            _id: hexId,
            movie: movie._id,
            theater: screens[i % screens.length],
            date,
            time: slotsForDay[i],
            price: movie.basePrice,
            totalSeats: 60,
            rows: 6,
            cols: 10,
            bookedSeats: [...preBooked]
          });
          showtimeCounter++;
        }
      }
    }

    // 3. Sample initial booking
    const sampleSt = this.showtimes[0];
    this.bookings.push({
      _id: '66a300000000000000000001',
      bookingId: 'BK-10293-8821',
      user: this.users[0]._id,
      movie: sampleSt.movie,
      showtime: sampleSt._id,
      seats: ['A3', 'A4'],
      seatCount: 2,
      ticketPrice: sampleSt.price,
      totalPrice: sampleSt.price * 2,
      status: 'CONFIRMED',
      createdAt: new Date()
    });
  }

  // --- Users ---
  async findUserByEmail(email) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  async findUserById(id) {
    return this.users.find((u) => u._id.toString() === id.toString());
  }

  async createUser({ name, email, password }) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = {
      _id: '66a2' + Date.now().toString(16).padStart(20, '0').slice(-20),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'user',
      createdAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  // --- Movies ---
  async getMovies({ search, genre } = {}) {
    let list = [...this.movies];
    if (genre && genre !== 'All') {
      list = list.filter((m) =>
        m.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
      );
    }
    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q)
      );
    }
    return list;
  }

  async getMovieById(id) {
    const movie = this.movies.find((m) => m._id.toString() === id.toString());
    if (!movie) return null;
    const showtimes = this.showtimes.filter(
      (st) => st.movie.toString() === movie._id.toString()
    );
    return { ...movie, showtimes };
  }

  async getMovieGenres() {
    const genres = new Set();
    this.movies.forEach((m) => m.genre.forEach((g) => genres.add(g)));
    return Array.from(genres).sort();
  }

  // --- Showtimes ---
  async getShowtimeById(id) {
    const showtime = this.showtimes.find((st) => st._id.toString() === id.toString());
    if (!showtime) return null;
    const movie = this.movies.find((m) => m._id.toString() === showtime.movie.toString());
    return { ...showtime, movie };
  }

  async getShowtimesByMovie(movieId) {
    return this.showtimes.filter(
      (st) => st.movie.toString() === movieId.toString()
    );
  }

  // --- Bookings (with atomic seat reservation) ---
  async createBooking({ userId, showtimeId, seats }) {
    const showtime = this.showtimes.find((st) => st._id.toString() === showtimeId.toString());
    if (!showtime) {
      return { error: 'Showtime not found', status: 404 };
    }

    const requestedSeats = [...new Set(seats.map((s) => String(s).trim().toUpperCase()))];

    // Concurrency atomic check:
    const conflicts = requestedSeats.filter((seat) =>
      showtime.bookedSeats.includes(seat)
    );

    if (conflicts.length > 0) {
      return {
        conflict: true,
        conflictingSeats: conflicts,
        status: 409
      };
    }

    // Atomically lock seats
    showtime.bookedSeats.push(...requestedSeats);

    const ticketPrice = showtime.price;
    const totalPrice = ticketPrice * requestedSeats.length;
    const bookingId = `BK-${Date.now().toString().slice(-5)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const movie = this.movies.find((m) => m._id.toString() === showtime.movie.toString());

    const newBooking = {
      _id: '66a3' + Date.now().toString(16).padStart(20, '0').slice(-20),
      bookingId,
      user: userId,
      movie: {
        _id: movie._id,
        title: movie.title,
        posterUrl: movie.posterUrl,
        duration: movie.duration,
        rating: movie.rating
      },
      showtime: {
        _id: showtime._id,
        theater: showtime.theater,
        date: showtime.date,
        time: showtime.time,
        price: showtime.price
      },
      seats: requestedSeats,
      seatCount: requestedSeats.length,
      ticketPrice,
      totalPrice,
      status: 'CONFIRMED',
      createdAt: new Date()
    };

    this.bookings.push(newBooking);
    return { success: true, booking: newBooking };
  }

  async getMyBookings(userId) {
    return this.bookings
      .filter((b) => b.user.toString() === userId.toString())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async cancelBooking(bookingId, userId) {
    const booking = this.bookings.find((b) => b._id.toString() === bookingId.toString());
    if (!booking) {
      return { error: 'Booking not found', status: 404 };
    }

    if (booking.user.toString() !== userId.toString()) {
      return { error: 'Unauthorized to cancel this booking', status: 403 };
    }

    if (booking.status === 'CANCELLED') {
      return { error: 'Booking already cancelled', status: 400 };
    }

    // Atomically release seats
    const showtime = this.showtimes.find(
      (st) => st._id.toString() === (booking.showtime._id || booking.showtime).toString()
    );
    if (showtime) {
      showtime.bookedSeats = showtime.bookedSeats.filter(
        (s) => !booking.seats.includes(s)
      );
    }

    booking.status = 'CANCELLED';
    return { success: true, booking };
  }
}

const memoryStore = new InMemoryStore();
module.exports = memoryStore;
