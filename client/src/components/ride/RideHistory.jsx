import React from "react";
import { useSelector } from "react-redux";

const RideHistory = () => {
  const { ridesHistory } = useSelector((state) => state.user.user);
  return (
    <>
      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-800">Ride History</h3>
        <ul className="mt-2 text-gray-600">
          {ridesHistory.length > 0 ? (
            ridesHistory.map((ride, index) => (
              <li key={index}>Ride ID: {ride}</li>
            ))
          ) : (
            <p>No rides yet.</p>
          )}
        </ul>
      </div>
    </>
  );
};

export default RideHistory;
