import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getRideDetails,
  joinRide,
  leaveRide,
  updateRide,
  updateSeats,
} from "../../actions/ride.action.js"; // Import additional actions
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar.jsx";
import { Button } from "../ui/button.jsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog.jsx";
import { Input } from "../ui/input.jsx";
import { CirclePlus, MessageCircleMore } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card.jsx";
import { fetchUser } from "@/actions/user.action.js";
import { Label } from "../ui/label.jsx";
import { DateTimePicker } from "../timePicker/date-time-picker.jsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select.jsx";
import { Textarea } from "../ui/textarea.jsx";

const RideDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [seatsToBook, setseatsToBook] = useState(1);
  const [formData, setFormData] = useState({
    departureTime: null,
    availableSeats: "",
    vehicleType: "",
    price: "",
    additionalInfo: "",
  });
  const { ride, loading, error } = useSelector((state) => state.ride);
  const { user: loggedInUser } = useSelector((state) => state.user); // Get the logged-in user from the store

  useEffect(() => {
    if (id) {
      dispatch(getRideDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (ride) {
      setFormData({
        // departureTime: ride.departureTime,
        availableSeats: ride.availableSeats,
        vehicleType: ride.vehicleType,
        price: ride.price,
        additionalInfo: ride.additionalInfo,
      });
    }
  }, [ride]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const UpdateRideFormSubmit = (e) => {
    e.preventDefault();
    dispatch(updateRide({ id, formData }));
  };

  const increamentSeats = () => {
    if (seatsToBook < ride?.availableSeats) {
      setseatsToBook((prevSeats) => prevSeats + 1);
    }
  };

  const decreamentSeats = () => {
    if (seatsToBook > 1) {
      setseatsToBook((prevSeats) => prevSeats - 1);
    }
  };

  const handleJoinRide = () => {
    dispatch(joinRide({ id, seatsToBook }));
    navigate("/ride-history");
  };

  const handleLeaveRide = () => {
    dispatch(leaveRide(id)).then(() => {
      // dispatch(fetchUser());
      navigate("/ride-history");
    });
  };

  const handleUpdateSeats = () => {
    dispatch(updateSeats({ id, newSeatsToBook: seatsToBook })).then(() =>
      dispatch(getRideDetails(id))
    );
    navigate(`/ride/${id}`);
  };

  const isDriver = loggedInUser?._id === ride?.driver?._id;
  const hasJoined = ride?.riders?.some(
    (rider) => rider.rider._id === loggedInUser?._id
  );

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <p className="self-center">Something went wrong</p>;
  }

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
                <AvatarImage src={ride?.driver?.avatar || "/Profile.png"} />
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
                  <AvatarImage src={rider.avatar || "/Profile.png"} />
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
        {/* Conditional Dialogs Based on User Type */}
        {isDriver ? (
          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-yellow-500 text-white">
                  Update Ride
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Ride</DialogTitle>
                  <DialogDescription>
                    update the field of ride, click update to save.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={UpdateRideFormSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="flex flex-col gap-1">
                      <Label>Departure Time</Label>
                      <DateTimePicker
                        value={formData.departureTime}
                        placeholder={ride.departureTime}
                        onChange={(date) => {
                          setFormData((prev) => ({
                            ...prev,
                            departureTime: date,
                          }));
                        }}
                      />
                    </div>
                    <div>
                      <Label>Available Seats</Label>
                      <Input
                        type="number"
                        name="availableSeats"
                        value={formData.availableSeats}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label>Vehicle Type</Label>
                      <Select
                        value={formData.vehicleType}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            vehicleType: value,
                          }))
                        }
                        className="w-full"
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mini">Mini</SelectItem>
                          <SelectItem value="sedan">Sedan</SelectItem>
                          <SelectItem value="suv">SUV</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Price</Label>
                      <Input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div>
                      <Label>Additional Information</Label>
                      <Textarea
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleInputChange}
                        rows="4"
                        className="border rounded p-2 w-full"
                        placeholder="Any additional details for the ride"
                      />
                    </div>
                  </div>
                  <DialogFooter className="mb-4">
                    {loading ? (
                      <ButtonLoading />
                    ) : (
                      <Button type="submit">Update</Button>
                    )}
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <Button className="bg-red-500 text-white">Delete Ride</Button>
          </div>
        ) : hasJoined ? (
          <div className="flex space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-yellow-500 text-white">
                  Update Seats
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Seats</DialogTitle>
                  <DialogDescription>
                    Update your booked seats:
                  </DialogDescription>
                  <div className="flex items-center">
                    <Button
                      onClick={decreamentSeats}
                      disabled={seatsToBook <= 1}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      value={seatsToBook}
                      readOnly
                      className="w-20 text-center mx-2"
                    />
                    <Button
                      onClick={increamentSeats}
                      disabled={seatsToBook >= ride?.availableSeats}
                    >
                      +
                    </Button>
                  </div>
                  <Button onClick={handleUpdateSeats}>Confirm</Button>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Button onClick={handleLeaveRide} className="bg-red-500 text-white">
              Leave Ride
            </Button>
          </div>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-sky-500 text-white hover:bg-sky-600 text-md gap-1">
                Join <CirclePlus />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join Ride</DialogTitle>
                <DialogDescription>
                  Choose the number of seats you want to book:
                </DialogDescription>
                <div className="flex items-center">
                  <Button onClick={decreamentSeats} disabled={seatsToBook <= 1}>
                    -
                  </Button>
                  <Input
                    type="number"
                    value={seatsToBook}
                    readOnly
                    className="w-20 text-center mx-2"
                  />
                  <Button
                    onClick={increamentSeats}
                    disabled={seatsToBook >= ride?.availableSeats}
                  >
                    +
                  </Button>
                </div>
                <Button onClick={handleJoinRide}>Confirm</Button>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
};

export default RideDetails;
