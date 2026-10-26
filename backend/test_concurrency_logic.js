// Concurrency & Double Booking Prevention Simulation Test
console.log('Testing Double Booking Concurrency Algorithm...\n');

// Simulated database state for a theater showtime
const simulatedShowtime = {
  _id: 'showtime-101',
  title: 'Inception',
  bookedSeats: ['A1', 'A2', 'C5'] // A1, A2, C5 are already booked
};

// Simulated atomic findOneAndUpdate engine mimicking MongoDB's single-document write lock
const atomicFindOneAndUpdate = async (filter, update) => {
  // Simulate network latency / race condition delay
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 20));

  // Check filter: `bookedSeats: { $nin: requestedSeats }`
  const requested = update.$push.bookedSeats.$each;
  const hasConflict = requested.some((seat) => simulatedShowtime.bookedSeats.includes(seat));

  if (hasConflict) {
    // MongoDB returns null because the query condition failed
    return null;
  }

  // Atomically lock and push seats
  simulatedShowtime.bookedSeats.push(...requested);
  return { ...simulatedShowtime };
};

const simulateBookingAttempt = async (userName, requestedSeats) => {
  console.log(`[${userName}] Attempting to book seats: ${requestedSeats.join(', ')}...`);
  const result = await atomicFindOneAndUpdate(
    { _id: 'showtime-101', bookedSeats: { $nin: requestedSeats } },
    { $push: { bookedSeats: { $each: requestedSeats } } }
  );

  if (!result) {
    console.log(`\x1b[31m✖ [${userName}] Booking REJECTED (HTTP 409 Conflict): Seats already reserved!\x1b[0m`);
    return { success: false, user: userName, status: 409 };
  } else {
    console.log(`\x1b[32m✔ [${userName}] Booking CONFIRMED (HTTP 201 Created): Seats locked successfully!\x1b[0m`);
    return { success: true, user: userName, status: 201 };
  }
};

const runTest = async () => {
  console.log('--- TEST 1: Direct Double Booking Attempt on Pre-booked Seat ---');
  // Attempting to book 'A1' which is already booked
  const res1 = await simulateBookingAttempt('User Alice', ['A1', 'B1']);
  if (res1.status !== 409) throw new Error('Failed to prevent booking of already-booked seat!');

  console.log('\n--- TEST 2: Concurrent Race Condition (Simultaneous requests for Seat B4) ---');
  // Both Bob and Charlie attempt to book seat 'B4' concurrently at the exact same millisecond
  const [resBob, resCharlie] = await Promise.all([
    simulateBookingAttempt('User Bob', ['B4']),
    simulateBookingAttempt('User Charlie', ['B4'])
  ]);

  // Exactly one must succeed, and exactly one must fail with 409
  const successes = [resBob, resCharlie].filter((r) => r.success);
  const failures = [resBob, resCharlie].filter((r) => !r.success);

  if (successes.length === 1 && failures.length === 1 && failures[0].status === 409) {
    console.log(`\n\x1b[32m🎉 CONCURRENCY TEST PASSED! Exactly 1 user secured the seat, and the duplicate was rejected with HTTP 409 Conflict.\x1b[0m`);
    console.log(`Current occupied seats in showtime: [${simulatedShowtime.bookedSeats.join(', ')}]\n`);
  } else {
    throw new Error('Concurrency collision test failed!');
  }
};

runTest().catch((err) => {
  console.error(err);
  process.exit(1);
});
