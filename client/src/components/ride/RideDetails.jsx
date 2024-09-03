import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getRideDetails } from "../../actions/ride.action.js";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar.jsx";
import { Button } from "../ui/button.jsx";
import { CirclePlus, MessageCircleMore } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card.jsx";

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
    <>
      <Card className="md:mx-10 md:mt-10 rounded-none md:rounded-lg">
        <CardHeader>
          <CardTitle className="self-center mb-8">
            {new Date(ride.departureTime).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </CardTitle>
          <CardDescription className="flex justify-between items-center">
            <div className="flex items-center">
              <Avatar>
                <AvatarImage
                  src={ride?.driver?.avatar || "../../../public/Profile.png"}
                />
                <AvatarFallback>Profile</AvatarFallback>
              </Avatar>
              <strong className="mx-2">{ride?.driver?.name}</strong>
              <Button variant="outline" className="mx-2">
                <MessageCircleMore />
              </Button>
            </div>
            {new Date(ride.departureTime).toLocaleTimeString("en-US")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <strong className="italic">From:</strong> {ride?.source?.name}
          </div>
          <div className="mb-4">
            <strong className="italic">To:</strong> {ride?.destination?.name}
          </div>
          <div className="mb-4 flex justify-between py-5 border-secondary border-y-4 rounded-md">
            <p className="text-md">Total price for 1 passenger</p>
            <p className="text-xl">₹{ride?.price}</p>
          </div>
          <div className="mb-4">
            <i>Seats available :</i> {ride?.availableSeats}
          </div>
          <div className="mb-4">
            <i>Vehicle Type:</i> {ride?.vehicleType}
          </div>
          <div className="mb-4">
            <i>Additional Info:</i> {ride?.additionalInfo}
          </div>
          <div className="mb-4">
            <i>Published on: </i>
            {new Date(ride.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap justify-start">
          {ride?.riders?.map((rider, index) => (
            <div
              key={index}
              className="flex justify-between items-center w-full bg-secondary rounded-md p-2 my-2"
            >
              <div className="flex items-center m-2">
                <Avatar>
                  <AvatarImage
                    src={rider.avatar || "../../../public/Profile.png"}
                  />
                  <AvatarFallback>Rider</AvatarFallback>
                </Avatar>
                <p className="mx-2">{rider.rider.name}</p>
              </div>
              <div className="px-4">
                {rider.bookedSeats} <i>Seats</i>
              </div>
            </div>
          ))}
        </CardFooter>
      </Card>
      <div className="sticky bottom-0 p-6 bg-background flex justify-center">
        <Button className="bg-sky-500 text-white hover:bg-sky-600 text-md gap-1">
          Join <CirclePlus />
        </Button>
      </div>
    </>
  );
};

export default RideDetails;
