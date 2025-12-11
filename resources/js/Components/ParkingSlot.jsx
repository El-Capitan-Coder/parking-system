import React from "react";
import "../../css/Components/parking.css";

const ParkingSlot = ({ slotNumber, isOccupied, isSelected, onSelect }) => {
  let slotClass = "parking-slot ";
  if (isOccupied) slotClass += "parking-slot-occupied";
  else if (isSelected) slotClass += "parking-slot-selected";
  else slotClass += "parking-slot-available";

  return (
    <div className={slotClass} onClick={!isOccupied ? onSelect : undefined}>
      <span className="slot-number">{slotNumber}</span>
    </div>
  );
};

export default ParkingSlot;
