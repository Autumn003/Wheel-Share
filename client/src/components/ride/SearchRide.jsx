import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/loading-button";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRides } from "../../actions/ride.action.js";
import { DateTimePicker } from "../timePicker/date-time-picker";
import { DatePicker } from "../ui/date-picker.jsx";

const libraries = ["places"];
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const SearchRide = () => {
  const dispatch = useDispatch();
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
        `/api/v1/map/place/autocomplete?input=${query}`
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
        `/api/v1/map/place/details?placeId=${placeId}`
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
      <h2 className="text-xl font-bold mb-4">Search for Rides</h2>
      <form onSubmit={handleSearch}>
        <div className="mb-4" ref={sourceInputRef}>
          <Label>Source Location</Label>
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
          <Label>Destination Location</Label>
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

        <div className="mb-4">
          <Label>Search Date</Label>
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
          <Label>Minimum Available Seats</Label>
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

        {loading ? (
          <ButtonLoading />
        ) : (
          <Button type="submit">Search Ride</Button>
        )}
      </form>

      {rides && rides.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Available Rides</h3>
          {/* Render available rides */}
          <ul>
            {rides.map((ride) => (
              <li key={ride._id} className="mb-2">
                <div>
                  <strong>Source:</strong> {ride.source.name}
                </div>
                <div>
                  <strong>Destination:</strong> {ride.destination.name}
                </div>
                <div>
                  <strong>Departure Time:</strong>{" "}
                  {new Date(ride.departureTime).toLocaleString()}
                </div>
                <div>
                  <strong>Available Seats:</strong> {ride.availableSeats}
                </div>
                <div>
                  <strong>Vehicle Type:</strong> {ride.vehicleType}
                </div>
                <div>
                  <strong>Price:</strong> ${ride.price}
                </div>
                <div>
                  <strong>Additional Info:</strong> {ride.additionalInfo}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchRide;
