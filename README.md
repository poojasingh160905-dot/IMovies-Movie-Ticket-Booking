# 🍿 IMovies – Movie Ticket Booking System

A complete, beginner-friendly, full-stack **MERN (MongoDB, Express.js, React, Node.js)** web application built for the **SmartBridge MERN Stack** course. 

IMovies allows users to browse movies, filter by genres, search titles in real time, view movie showtimes, select seats interactively on an auditorium seat layout, book tickets with instant confirmation, and manage/cancel reservations. It features secure **JWT authentication**, **bcrypt password hashing**, and **backend atomic concurrency validation** to prevent double-booking of seats.

---

## 🌟 Features & Highlights

1. **Movie Catalog**: Displays 7+ rich sample blockbusters with high-res posters, descriptions, ratings, genres, and durations.
2. **Real-time Search & Genre Filters**: Instant live filtering across Action, Sci-Fi, Adventure, Drama, Crime, and Biography categories.
3. **Showtimes & Theaters**: Movie details page featuring theater information (Dolby Atmos, IMAX Laser, Prime 3D) and date tabs.
4. **Interactive Seat Map**: Graphical auditorium layout with a curved cinema screen, aisle spacing, and distinct visual states:
   - ⚪ **Available** (Dark steel grey)
   - 🟡 **Selected** (Luminous gold with real-time price calculation)
   - 🔴 **Sold Out / Booked** (Muted red, disabled)
5. **Double-Booking & Concurrency Safe**: Concurrency-safe backend validation using single-document atomic MongoDB updates (`$nin` seat verification and `$push`) ensuring two users cannot book the same seat simultaneously.
6. **JWT Authentication & Security**: User registration and login with bcrypt salted password hashing and JWT token authorization in HTTP headers.
7. **Instant Digital Ticket**: Confirmation modal showing a unique Booking ID (e.g. `BK-84920-1928`), movie details, seat numbers, and total price.
8. **My Bookings & Cancellation**: Reservation history page with one-click cancellation that atomically releases seats back into the theater seat map.
9. **Responsive Modern UI**: Styled with **Bootstrap 5**, Bootstrap Icons, and custom cinema dark-theme CSS.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | Fast, modern component-based UI framework |
| **Styling** | Bootstrap 5 + Custom CSS | Responsive layout, dark cinema aesthetics, Bootstrap Icons |
| **Backend** | Node.js + Express.js | RESTful API server with modular routing and controllers |
| **Database** | MongoDB + Mongoose ODM | Schema modeling, indexes, and atomic updates |
| **Authentication** | JWT + bcryptjs | Token-based stateless authentication and password hashing |
| **HTTP Client** | Axios | Asynchronous API communication with request interceptors |

---

## 📂 Project Structure

```text
minor project/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB Mongoose connection handler
│   ├── controllers/
│   │   ├── authController.js      # Register, Login, Me endpoints
│   │   ├── movieController.js     # Movies list, search, genres, single movie
│   │   ├── showtimeController.js  # Showtime & live seat availability
│   │   └── bookingController.js   # Atomic seat reservation & cancellation
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT token verification
│   │   └── errorHandler.js        # Centralized HTTP error handling
│   ├── models/
│   │   ├── User.js                # User schema with bcrypt pre-save hook
│   │   ├── Movie.js               # Movie schema with genres and ratings
│   │   ├── Showtime.js            # Showtime schema with bookedSeats array
│   │   └── Booking.js             # Booking record schema
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth
│   │   ├── movieRoutes.js         # /api/movies
│   │   ├── showtimeRoutes.js      # /api/showtimes
│   │   └── bookingRoutes.js       # /api/bookings
│   ├── .env.example               # Template environment configuration
│   ├── .env                       # Local environment variables (not committed)
│   ├── package.json               # Backend dependencies and scripts
│   ├── seed.js                    # Database seeder (movies, showtimes, users)
│   └── server.js                  # Express application entry point
│
├── frontend/
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── Footer.jsx         # Footer component
│   │   │   ├── MovieCard.jsx      # Movie poster card with hover zoom & meta
│   │   │   ├── Navbar.jsx         # Responsive navbar with search & auth status
│   │   │   └── SeatMap.jsx        # Graphical screen & seat selection grid
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # User session, JWT persistence, login/logout
│   │   ├── pages/
│   │   │   ├── HomePage.jsx       # Catalog, hero banner, genre filters, search
│   │   │   ├── MovieDetailsPage.js# Synopsis, cast, and showtime slots
│   │   │   ├── SeatSelectionPage.js# Live seat map, price summary & checkout
│   │   │   ├── MyBookingsPage.jsx # Reservation history and cancellation
│   │   │   ├── LoginPage.jsx      # Login form with 1-click Demo Fill
│   │   │   └── RegisterPage.jsx   # Registration form with validation
│   │   ├── services/
│   │   │   └── api.js             # Axios client with JWT interceptor
│   │   ├── App.jsx                # Route definitions & layout wrapper
│   │   ├── index.css              # Custom cinema theme & seat styles
│   │   └── main.jsx               # React DOM entry point
│   ├── index.html                 # HTML template with Google Fonts
│   ├── package.json               # Frontend dependencies & scripts
│   └── vite.config.js             # Vite configuration with /api backend proxy
│
├── .gitignore                     # Git ignore rules
└── README.md                      # Complete project documentation
```

---

## ⚡ Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Either a free [MongoDB Atlas](https://www.mongodb.com/atlas) cloud cluster or a local MongoDB service.

---

### Step 1: Backend Setup

1. Open your terminal in the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```cmd
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env`:
     ```cmd
     copy .env.example .env
     ```
   - Open `.env` and verify your `MONGODB_URI`:
     ```env
     PORT=5000
     NODE_ENV=development
     MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/imovies?retryWrites=true&w=majority
     JWT_SECRET=imovies_super_secret_jwt_key_2024
     JWT_EXPIRES_IN=7d
     ```
4. Populate database with sample movies and showtimes:
   ```cmd
   npm run seed
   ```
5. Start the backend server:
   ```cmd
   npm run dev
   ```
   *(or `npm start`)*
   
   The backend will be running at `http://localhost:5000` (Health check: `http://localhost:5000/api/health`).

---

### Step 2: Frontend Setup

1. Open a new terminal in the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```cmd
   npm install
   ```
3. Start the Vite development server:
   ```cmd
   npm run dev
   ```
4. Open your browser and navigate to:
   ```text
   http://localhost:5173
   ```

---

## ☁️ MongoDB Atlas Configuration Guide

If you are using MongoDB Atlas (recommended for cloud submissions):

1. **Create a Free Cluster**:
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up / log in.
   - Click **Create a Deployment** and select the **M0 Free** shared tier.
   - Choose a region close to you and click **Create**.
2. **Create a Database User**:
   - In the **Security Quickstart**, choose **Username and Password**.
   - Enter a username (e.g. `imovies_user`) and password (e.g. `Pass123456`).
   - Click **Create User**.
3. **Configure Network Access**:
   - Under **Where would you like to connect from?**, select **My Local Environment**.
   - Add IP Address `0.0.0.0/0` (Allow Access from Anywhere) so your local machine and graders can connect without IP restrictions.
4. **Get Connection String**:
   - Click **Drivers** (Node.js).
   - Copy the connection string format:
     ```text
     mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/imovies?retryWrites=true&w=majority
     ```
   - Paste it into `backend/.env` as `MONGODB_URI`, replacing `<username>` and `<password>` with your database user credentials.
5. **Run the Seeder**:
   ```cmd
   cd backend
   npm run seed
   ```

---

## 🔑 Demo Credentials

For quick evaluation, the database seeder pre-configures a demo account:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Standard User** | `demo@imovies.com` | `password123` |
| **Administrator** | `admin@imovies.com` | `adminpassword123` |

*(Tip: On the Login page, click **"Auto-fill Demo Account"** to sign in with one click).*

---

## 🛡️ Double-Booking Prevention Strategy

### The Concurrency Problem
In high-traffic movie booking platforms, two users might click "Book" on seat `B4` at the exact same millisecond. If the system relies on read-then-write logic without concurrency locking:
1. User 1 checks: `B4` is free.
2. User 2 checks: `B4` is free.
3. User 1 writes booking.
4. User 2 writes booking $\rightarrow$ **Double Booking Occurs!**

### The Solution: Atomic Conditional Updates
IMovies solves this problem at the database engine level using MongoDB document-atomic operations:

```javascript
const updatedShowtime = await Showtime.findOneAndUpdate(
  {
    _id: showtimeId,
    bookedSeats: { $nin: requestedSeats } // Only matches if NONE of requested seats are booked
  },
  {
    $push: { bookedSeats: { $each: requestedSeats } } // Atomically pushes all selected seats
  },
  { new: true }
);

if (!updatedShowtime) {
  return res.status(409).json({
    success: false,
    message: "One or more seats have already been reserved. Please choose different seats."
  });
}
```

### Why this is superior:
1. **100% Concurrency Safe**: MongoDB serializes writes on a single document. Only the first request matches `$nin`; subsequent concurrent requests immediately fail and receive `null`.
2. **Zero Deployment Prerequisites**: Works universally on MongoDB standalone instances, replica sets, and free MongoDB Atlas M0 clusters without requiring multi-document transaction replica setups.
3. **Atomic Cancellation**: When a user cancels a booking, seats are released back using `$pull: { bookedSeats: { $in: seats } }`.

---

## 📡 REST API Documentation

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Private | Retrieve logged-in user profile (Requires Bearer token) |

### Movie Endpoints (`/api/movies`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/movies` | Public | List all movies with optional `?search=` and `?genre=` |
| `GET` | `/api/movies/genres` | Public | Get distinct list of available movie genres |
| `GET` | `/api/movies/:id` | Public | Get movie details by ID with associated showtimes |

### Showtime Endpoints (`/api/showtimes`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/showtimes/movie/:movieId` | Public | Get all showtimes for a specific movie |
| `GET` | `/api/showtimes/:id` | Public | Get showtime details with live `bookedSeats` layout |

### Booking Endpoints (`/api/bookings`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/bookings` | Private | Create booking with atomic seat reservation (`showtimeId`, `seats`) |
| `GET` | `/api/bookings/my-bookings` | Private | Fetch all reservations made by the current user |
| `PUT` | `/api/bookings/:id/cancel` | Private | Cancel reservation and release seats back to theater |

---

## 🧪 Testing Instructions

1. **Verify Movies Catalog**:
   - Open `http://localhost:5173`.
   - Verify that 7 movies are visible with posters, ratings, and genre tags.
   - Click genre pills (**Sci-Fi**, **Action**, **Adventure**) to verify filtering.
   - Type in the search box (e.g. *"Nolan"* or *"Dark"*) to test real-time search.
2. **Verify User Authentication**:
   - Click **Sign In**.
   - Click **"Auto-fill Demo Account"** and click **Sign In**.
   - Notice the Navbar greets the user with their name badge and enables the **"My Bookings"** tab.
3. **Verify Seat Selection & Booking**:
   - Click **"Book"** on any movie (e.g. *Inception*).
   - Select a date and showtime slot.
   - Choose 2 available seats on the seat map (e.g. `D4`, `D5`).
   - Observe real-time price calculation in the summary card.
   - Click **"Confirm Booking"**.
   - Verify the Digital Ticket Confirmation modal appears with a unique Booking ID (`BK-...`).
4. **Verify Booking History & Cancellation**:
   - Navigate to **"My Bookings"**.
   - Verify your newly booked tickets appear with status **CONFIRMED**.
   - Click **"Cancel Booking"** and confirm.
   - Verify status changes to **CANCELLED** and the seats are freed back in the auditorium seat map.

---

## 🚀 Push to GitHub Instructions

Follow these exact commands to push the project to your GitHub repository:

1. **Install Git** (if not already installed on your system from [git-scm.com](https://git-scm.com)).
2. Open terminal in the root `minor project/` directory:
   ```bash
   # Initialize git repository
   git init

   # Stage all project files (safe .gitignore prevents credentials or node_modules)
   git add .

   # Commit changes
   git commit -m "Initial commit: IMovies full-stack MERN movie ticket booking system"

   # Rename branch to main
   git branch -M main

   # Link to your GitHub repository (replace with your repo URL)
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/imovies-movie-ticket-booking.git

   # Push to GitHub
   git push -u origin main
   ```

---

## 📋 Requirements Checklist

- [x] **Frontend**: React.js with Vite
- [x] **Styling**: Bootstrap 5 + Bootstrap Icons + Custom Cinema CSS
- [x] **Backend**: Node.js and Express.js REST API
- [x] **Database**: MongoDB using Mongoose with organized models
- [x] **Authentication**: JWT stateless authentication with bcrypt salted password hashing
- [x] **API Communication**: Asynchronous JavaScript using Axios with request/response interceptors
- [x] **Home Page**: Displays 7 sample movies with posters, titles, genres, ratings, and descriptions
- [x] **Search & Genre Filter**: Real-time keyword search and genre category pills
- [x] **Movie Details & Showtimes**: Dedicated page with dates, screens, and showtime slots
- [x] **User Registration & Login**: Validated registration, login, and token storage
- [x] **Interactive Seat Selection**: Color-coded seat map (Available, Selected, Booked) with screen visual
- [x] **Booking Confirmation**: Generates unique Booking ID, movie summary, seats, and price breakdown
- [x] **My Bookings Page**: Displays current user's reservations
- [x] **Booking Cancellation**: One-click cancellation with atomic seat release
- [x] **Concurrency & Double-Booking Protection**: Atomic conditional MongoDB `$nin` seat locking
- [x] **Responsive Design**: Mobile and desktop friendly layouts
- [x] **Clean Project Structure**: Separate `backend/` and `frontend/` directories, `.gitignore`, `.env.example`, and seed data

---

## 📄 License
This project is open-source and created for educational purposes for the SmartBridge MERN Stack course.
