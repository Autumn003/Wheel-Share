import { getRideDetails } from "@/actions/ride.action";
import { fetchUser } from "@/actions/user.action";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { MetaData } from "..";

const RideHistory = () => {
  const dispatch = useDispatch();
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

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return (
    <>
      <MetaData title="Your previous rides | Wheel Share" />
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
              <>
                <div className="flex flex-col items-center justify-center md:h-56 lg:h-96 h-24">
                  <h3 className="text-secondary text-xl font-semibold my-10">
                    No rides in your history. Create or join a new ride.
                  </h3>
                  <div className="space-x-4">
                    <Link
                      to="/create-ride"
                      className="self-center my-5 rounded-full bg-sky-500 hover:bg-sky-600 text-white duration-150 text-md py-3 px-4 font-semibold"
                    >
                      Create Ride
                    </Link>
                    <Link
                      to="/search-ride"
                      className="self-center my-5 rounded-full bg-sky-500 hover:bg-sky-600 text-white duration-150 text-md py-3 px-4 font-semibold"
                    >
                      Search Ride
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RideHistory;
