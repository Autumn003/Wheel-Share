import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/loading-button";
import { getRideDetails, getRides } from "../../actions/ride.action.js";
import { Card, CardContent } from "@/components/ui/card";
import { DatePicker } from "../ui/date-picker.jsx";
import { GitCommitHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

const libraries = ["places"];
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const SearchRide = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, rides } = useSelector((state) => state.rides);

  // Load Google Maps script asynchronously with libraries
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
    libraries,
  });

  const [formData, setFormData] = useState({
    sourceName: "",
    sourceLat: null,
    sourceLng: null,
    destinationName: "",
    destinationLat: null,
    destinationLng: null,
    searchDate: "",
    miniAvailableSeats: 1,
  });

  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationSearch = async (query, type) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/map/place/autocomplete?input=${query}`
      );
      if (type === "source") {
        setSourceSuggestions(response.data.predictions);
      } else if (type === "destination") {
        setDestinationSuggestions(response.data.predictions);
      }
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  };

  const handleSuggestionClick = async (placeId, type) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/map/place/details?placeId=${placeId}`
      );
      const location = response.data.result.geometry.location;
      const address = response.data.result.formatted_address;

      if (type === "source") {
        setSelectedSource({ lat: location.lat, lng: location.lng });
        setFormData((prev) => ({
          ...prev,
          sourceName: address,
          sourceLat: location.lat,
          sourceLng: location.lng,
        }));
        setSourceSuggestions([]);
      } else if (type === "destination") {
        setSelectedDestination({ lat: location.lat, lng: location.lng });
        setFormData((prev) => ({
          ...prev,
          destinationName: address,
          destinationLat: location.lat,
          destinationLng: location.lng,
        }));
        setDestinationSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching location details:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(getRides(formData));
  };

  const handleCardClick = (ride) => {
    dispatch(getRideDetails(ride));
    navigate(`ride/${ride}`);
  };

  const sourceInputRef = useRef();
  const destinationInputRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sourceInputRef.current &&
        !sourceInputRef.current.contains(e.target)
      ) {
        setSourceSuggestions([]); // Clear source suggestions if clicked outside
      }
      if (
        destinationInputRef.current &&
        !destinationInputRef.current.contains(e.target)
      ) {
        setDestinationSuggestions([]); // Clear destination suggestions if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl md:text-3xl font-semibold  mb-8 text-center">
        Search for Rides
      </h2>
      <form
        onSubmit={handleSearch}
        className="border md:p-10 px-4 py-8 rounded-lg"
      >
        <div className="mb-4" ref={sourceInputRef}>
          <Label className="text-lg">Source Location</Label>
          <Input
            type="text"
            name="sourceName"
            value={formData.sourceName}
            onChange={(e) => {
              handleInputChange(e);
              const query = e.target.value;
              if (query.trim()) {
                handleLocationSearch(query, "source");
              } else {
                setSourceSuggestions([]); // Clear suggestions if input is empty
              }
            }}
          />
          {sourceSuggestions.map((suggestion) => (
            <p
              key={suggestion.place_id}
              onClick={() =>
                handleSuggestionClick(suggestion.place_id, "source")
              }
              className="cursor-pointer hover:bg-[rgba(0,0,0,0.20)] rounded-md p-2"
            >
              {suggestion.description}
            </p>
          ))}
        </div>

        <div className="mb-4" ref={destinationInputRef}>
          <Label className="text-lg">Destination Location</Label>
          <Input
            type="text"
            name="destinationName"
            value={formData.destinationName}
            onChange={(e) => {
              handleInputChange(e);
              const query = e.target.value;
              if (query.trim()) {
                handleLocationSearch(query, "destination");
              } else {
                setDestinationSuggestions([]); // Clear suggestions if input is empty
              }
            }}
          />
          {destinationSuggestions.map((suggestion) => (
            <p
              key={suggestion.place_id}
              onClick={() =>
                handleSuggestionClick(suggestion.place_id, "destination")
              }
              className="cursor-pointer hover:bg-[rgba(0,0,0,0.20)] rounded-md p-2"
            >
              {suggestion.description}
            </p>
          ))}
        </div>

        <div className="mb-4 flex flex-col gap-1">
          <Label className="text-lg">Search Date</Label>
          <DatePicker
            onChange={(date) => {
              if (date) {
                const localDate = new Date(
                  date.getTime() - date.getTimezoneOffset() * 60000
                );
                setFormData((prev) => ({
                  ...prev,
                  searchDate: localDate.toISOString().split("T")[0],
                }));
              } else {
                setFormData((prev) => ({
                  ...prev,
                  searchDate: "",
                }));
              }
            }}
          />
        </div>

        <div className="mb-4">
          <Label className="text-lg">Minimum Available Seats</Label>
          <Input
            type="number"
            name="miniAvailableSeats"
            value={formData.miniAvailableSeats}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                miniAvailableSeats: parseInt(e.target.value, 10),
              }))
            }
            min="1"
            required
          />
        </div>
        <div className="text-center md:mt-16 md:mb-5 mt-10">
          {loading ? (
            <ButtonLoading />
          ) : (
            <Button type="submit">Search Ride</Button>
          )}
        </div>
      </form>

      {rides && rides.length > 0 && (
        <div className="md:mt-14 mt-8">
          <h3 className="text-2xl md:text-3xl font-semibold  mb-8 text-center">
            Available Rides
          </h3>
          <div>
            {rides.map((ride) => (
              <Card
                key={ride._id}
                onClick={() => handleCardClick(ride._id)}
                className="pt-3 cursor-pointer"
              >
                <CardContent>
                  <div className="flex mb-2">
                    <div className="w-1/2">{ride.source.name}</div>
                    <div className="self-center flex justify-center w-1/4">
                      <GitCommitHorizontal className="md:size-12 size-8" />
                    </div>
                    <div className="w-1/2">{ride.destination.name}</div>
                  </div>
                  <div>
                    {new Date(ride.departureTime).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    {new Date(ride.departureTime).toLocaleTimeString("en-US")}
                  </div>

                  <div>
                    <strong>₹{ride.price}</strong>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchRide;
