import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import '../../../css/Home/vehiclehistory.css';

const vehicleHistoryData = [
  {
    plateNumber: 'ABC-1234',
    owner: 'John Doe',
    date: '2025-08-01',
    entryTime: '08:30 AM',
    exitTime: '12:45 PM',
    status: 'Completed'
  },
  {
    plateNumber: 'XYZ-5678',
    owner: 'Jane Smith',
    date: '2025-08-02',
    entryTime: '09:00 AM',
    exitTime: '01:30 PM',
    status: 'Completed'
  },
  {
    plateNumber: 'LMN-9012',
    owner: 'Mark Navarro',
    date: '2025-08-03',
    entryTime: '07:45 AM',
    exitTime: '11:15 AM',
    status: 'Completed'
  },
  // add more records as needed
];

const VehicleHistory = () => {
  return (
    <div className="vehicle-history-page">
      <div className="vehicle-history-container">
        <h2 className="vehicle-history-title">Vehicle History</h2>
        <div className="vehicle-history-grid">
          {vehicleHistoryData.map((record, index) => (
            <div key={index} className="vehicle-card">
              <div className="vehicle-info">
                <h3 className="plate-number">{record.plateNumber}</h3>
                <p><strong>Owner:</strong> {record.owner}</p>
                <p><strong>Date:</strong> {record.date}</p>
                <p><strong>Entry:</strong> {record.entryTime}</p>
                <p><strong>Exit:</strong> {record.exitTime}</p>
                <p><strong>Status:</strong> <span className={`status ${record.status.toLowerCase()}`}>{record.status}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VehicleHistory;
