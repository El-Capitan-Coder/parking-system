import React, { useState, useEffect } from "react";
import ParkingSlot from "./ParkingSlot";
import axios from "axios";
import "../../css/Components/parking.css";

const ParkingMap = ({ onSlotSelect, selectedSlot }) => {
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const slotsPerPage = 10;

  useEffect(() => {
    loadParkingSlots();
  }, []);

  const loadParkingSlots = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("You are not logged in.");
        return;
      }

      const response = await axios.get("/api/parking-slots", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSlots(response.data);
      setError("");
    } catch (err) {
      console.error("Error loading parking slots:", err);
      setError("Failed to load parking slots.");
    }
  };

  const handleSlotSelect = (slot) => {
    if (!slot.occupied) onSlotSelect(slot);
  };

  const renderParkingGrid = () => {
    const indexOfLastSlot = currentPage * slotsPerPage;
    const indexOfFirstSlot = indexOfLastSlot - slotsPerPage;
    const currentSlots = slots.slice(indexOfFirstSlot, indexOfLastSlot);

    const rowSize = 5;
    const rows = [];
    for (let i = 0; i < currentSlots.length; i += rowSize) {
      rows.push(currentSlots.slice(i, i + rowSize));
    }

    return rows.map((rowSlots, rowIndex) => (
      <div className="parking-row" key={rowIndex}>
        {rowSlots.map((slot) => (
          <ParkingSlot
            key={slot.id}
            slotNumber={slot.slot_number}
            isOccupied={slot.occupied}
            isSelected={selectedSlot?.id === slot.id}
            onSelect={() => handleSlotSelect(slot)}
          />
        ))}
      </div>
    ));
  };

  const totalPages = Math.ceil(slots.length / slotsPerPage);

  return (
    <div className="parking-map-card">
      {error && <div className="error-message">{error}</div>}

      <div className="parking-grid">{renderParkingGrid()}</div>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            className="btn-pagination"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            ← Prev
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn-pagination"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next →
          </button>
        </div>
      )}

      <div className="selected-slot-display">
        <strong>Selected Slot:</strong>{" "}
        {selectedSlot ? selectedSlot.slot_number : "None"}
      </div>

      <div className="entrance-label">Entrance</div>
    </div>
  );
};

export default ParkingMap;
