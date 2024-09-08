import { getRideDetails } from "@/actions/ride.action";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const RideHistory = () => {
  const navigate = useNavigate();
  const { ridesHistory } = useSelector((state) => state.user.user);

  const handleRideClick = (id) => {
    if (id) {
      getRideDetails(id);
      navigate(`/ride/${id}`);
    } else {
      console.log("Ride id not found");
    }
  };

  return (
    <>
      <div className="m-5">
        <h2 className="text-2xl font-semibold">Rides History</h2>
        <div className="mt-5">
          <div className="mt-3">
            {ridesHistory.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 cursor-pointer">
                {ridesHistory.map((ride) => (
                  <div
                    key={ride._id}
                    className="p-4 border rounded-lg shadow-md md:flex justify-between"
                    onClick={() => handleRideClick(ride.rideId)}
                  >
                    <div>
                      <p className="">
                        From:{" "}
                        <span className="text-gray-400">
                          {ride.source.name}
                        </span>
                      </p>
                      <p className="">
                        To:{" "}
                        <span className="text-gray-400">
                          {ride.destination.name}
                        </span>
                      </p>
                    </div>
                    <p className="text-gray-500">
                      {new Date(ride.departureTime).toDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No rides published yet.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RideHistory;
