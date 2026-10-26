import React from 'react';

const ROW_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

const SeatMap = ({
  rows = 6,
  cols = 10,
  bookedSeats = [],
  selectedSeats = [],
  onSeatToggle,
  maxSeats = 8
}) => {
  // Generate row identifiers based on number of rows
  const activeRows = ROW_LETTERS.slice(0, rows);

  return (
    <div className="w-100">
      {/* Curved Screen Visualization */}
      <div className="screen-container">
        <div className="cinema-screen"></div>
        <div className="screen-label">
          <i className="bi bi-display me-2"></i> All Eyes This Way • Cinema Screen
        </div>
      </div>

      {/* Seat Legend */}
      <div className="d-flex flex-wrap justify-content-center align-items-center gap-4 my-4 p-3 rounded-3 bg-dark bg-opacity-50 border border-secondary border-opacity-25">
        <div className="d-flex align-items-center gap-2">
          <span className="legend-box seat-available"></span>
          <span className="small text-secondary">Available</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="legend-box seat-selected"></span>
          <span className="small text-warning fw-semibold">Selected</span>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="legend-box seat-booked"></span>
          <span className="small text-danger">Sold Out / Booked</span>
        </div>
      </div>

      {/* Seats Grid */}
      <div className="seat-grid-container py-3">
        {activeRows.map((rowLetter) => (
          <div key={rowLetter} className="seat-row">
            {/* Left Row Label */}
            <span className="row-label">{rowLetter}</span>

            {/* Seat Columns */}
            {Array.from({ length: cols }, (_, i) => i + 1).map((colNum) => {
              const seatId = `${rowLetter}${colNum}`;
              const isBooked = bookedSeats.includes(seatId);
              const isSelected = selectedSeats.includes(seatId);
              const isAisle = colNum === Math.floor(cols / 2); // Aisle gap after half cols

              let seatClass = 'seat seat-available';
              if (isBooked) {
                seatClass = 'seat seat-booked';
              } else if (isSelected) {
                seatClass = 'seat seat-selected';
              }

              if (isAisle) {
                seatClass += ' aisle-gap';
              }

              return (
                <div
                  key={seatId}
                  className={seatClass}
                  title={
                    isBooked
                      ? `Seat ${seatId} (Booked)`
                      : isSelected
                      ? `Seat ${seatId} (Selected)`
                      : `Seat ${seatId} (Available)`
                  }
                  onClick={() => {
                    if (!isBooked) {
                      onSeatToggle(seatId);
                    }
                  }}
                >
                  {colNum}
                </div>
              );
            })}

            {/* Right Row Label */}
            <span className="row-label">{rowLetter}</span>
          </div>
        ))}
      </div>

      <div className="text-center text-secondary small mt-3">
        <i className="bi bi-info-circle me-1"></i> You can select up to {maxSeats} seats per booking.
      </div>
    </div>
  );
};

export default SeatMap;
