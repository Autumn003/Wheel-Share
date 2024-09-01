import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getRideDetails } from "../../actions/ride.action.js";

const RideDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { ride, loading, error } = useSelector((state) => state.ride);

  useEffect(() => {
    if (id) {
      dispatch(getRideDetails(id));
    }
  }, [dispatch, id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Ride Details</h2>
      <div className="mb-4">
        <strong>Source:</strong> {ride?.source?.name}
      </div>
      <div className="mb-4">
        <strong>Destination:</strong> {ride?.destination?.name}
      </div>
      <div className="mb-4">
        <strong>Departure Time:</strong>{" "}
        {new Date(ride.departureTime).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}{" "}
        {new Date(ride.departureTime).toLocaleTimeString("en-US")}
      </div>
      <div className="mb-4">
        <strong>Price:</strong> ₹{ride?.price}
      </div>
      <div className="mb-4">
        <strong>Available Seats:</strong> {ride?.availableSeats}
      </div>
      {/* Add more ride details as needed */}
    </div>
  );
};

export default RideDetails;
