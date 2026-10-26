const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');
const memoryStore = require('../services/inMemoryStore');

const generateBookingId = () => {
  const timestamp = Date.now().toString().slice(-5);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `BK-${timestamp}-${random}`;
};

const createBooking = async (req, res, next) => {
  try {
    const { showtimeId, seats } = req.body;

    if (!showtimeId) {
      return res.status(400).json({
        success: false,
        message: 'Showtime ID is required'
      });
    }

    if (!seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please select at least one seat to book'
      });
    }

    const requestedSeats = [...new Set(seats.map((s) => String(s).trim().toUpperCase()))];

    if (mongoose.connection.readyState === 1) {
      // 1. Atomic query on Mongoose document
      const updatedShowtime = await Showtime.findOneAndUpdate(
        {
          _id: showtimeId,
          bookedSeats: { $nin: requestedSeats }
        },
        {
          $push: { bookedSeats: { $each: requestedSeats } }
        },
        { new: true }
      ).populate('movie', 'title posterUrl duration');

      if (!updatedShowtime) {
        const existingShowtime = await Showtime.findById(showtimeId);
        if (!existingShowtime) {
          return res.status(404).json({
            success: false,
            message: 'Showtime not found'
          });
        }

        const alreadyBooked = requestedSeats.filter((seat) =>
          existingShowtime.bookedSeats.includes(seat)
        );

        return res.status(409).json({
          success: false,
          message: `Double booking prevented: Seat(s) [${alreadyBooked.join(', ')}] have already been reserved by another customer. Please choose different seats.`,
          conflictingSeats: alreadyBooked
        });
      }

      const ticketPrice = updatedShowtime.price;
      const totalPrice = ticketPrice * requestedSeats.length;
      const bookingId = generateBookingId();

      let newBooking;
      try {
        newBooking = await Booking.create({
          bookingId,
          user: req.user._id,
          movie: updatedShowtime.movie._id,
          showtime: updatedShowtime._id,
          seats: requestedSeats,
          seatCount: requestedSeats.length,
          ticketPrice,
          totalPrice,
          status: 'CONFIRMED'
        });
      } catch (bookingError) {
        await Showtime.findByIdAndUpdate(showtimeId, {
          $pull: { bookedSeats: { $in: requestedSeats } }
        });
        throw bookingError;
      }

      const populatedBooking = await Booking.findById(newBooking._id)
        .populate('movie', 'title posterUrl duration rating genre')
        .populate('showtime', 'theater date time price');

      return res.status(201).json({
        success: true,
        message: 'Tickets booked successfully! Enjoy your movie.',
        data: populatedBooking
      });
    } else {
      // Memory Store fallback with atomic concurrency protection
      const result = await memoryStore.createBooking({
        userId: req.user._id,
        showtimeId,
        seats: requestedSeats
      });

      if (result.conflict) {
        return res.status(409).json({
          success: false,
          message: `Double booking prevented: Seat(s) [${result.conflictingSeats.join(', ')}] have already been reserved. Please choose different seats.`,
          conflictingSeats: result.conflictingSeats
        });
      }

      if (result.error) {
        return res.status(result.status || 400).json({
          success: false,
          message: result.error
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Tickets booked successfully! Enjoy your movie.',
        data: result.booking
      });
    }
  } catch (error) {
    next(error);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const bookings = await Booking.find({ user: req.user._id })
        .populate('movie', 'title posterUrl duration genre rating')
        .populate('showtime', 'theater date time price')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    } else {
      const bookings = await memoryStore.getMyBookings(req.user._id);
      return res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings
      });
    }
  } catch (error) {
    next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const booking = await Booking.findById(req.params.id);

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking reservation not found'
        });
      }

      if (
        booking.user.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to cancel this booking'
        });
      }

      if (booking.status === 'CANCELLED') {
        return res.status(400).json({
          success: false,
          message: 'This booking has already been cancelled'
        });
      }

      await Showtime.findByIdAndUpdate(booking.showtime, {
        $pull: { bookedSeats: { $in: booking.seats } }
      });

      booking.status = 'CANCELLED';
      await booking.save();

      const updatedBooking = await Booking.findById(booking._id)
        .populate('movie', 'title posterUrl')
        .populate('showtime', 'theater date time');

      return res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully. The seats have been released.',
        data: updatedBooking
      });
    } else {
      const result = await memoryStore.cancelBooking(req.params.id, req.user._id);
      if (result.error) {
        return res.status(result.status || 400).json({
          success: false,
          message: result.error
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully. The seats have been released.',
        data: result.booking
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking
};
