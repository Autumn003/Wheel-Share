import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ButtonLoading } from "@/components/ui/loading-button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createRide } from "../../actions/ride.action";
import { DialogTitle } from "@radix-ui/react-dialog";
import { DateTimePicker } from "../timePicker/date-time-picker";
import { useNavigate } from "react-router-dom";
import { Loader, MetaData } from "../index.js";

const libraries = ["places"];

const apiUrl = import.meta.env.VITE_BACKEND_URL;
const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const CreateRide = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.rides);

  // Load Google Maps script asynchronously with libraries
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey,
    libraries,
  });

  const [formData, setFormData] = useState({
    sourceName: "",
    destinationName: "",
    sourceLat: null,
    sourceLng: null,
    destinationLat: null,
    destinationLng: null,
    departureTime: null,
    availableSeats: "",
    vehicleType: "mini",
    price: "",
    additionalInfo: "",
  });

  const [selectedSource, setSelectedSource] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [mapType, setMapType] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMapClick = (e) => {
    const { latLng } = e;
    const lat = latLng.lat();
    const lng = latLng.lng();

    if (mapType === "source") {
      setSelectedSource({ lat, lng });
      reverseGeocode(lat, lng, "source");
    } else if (mapType === "destination") {
      setSelectedDestination({ lat, lng });
      reverseGeocode(lat, lng, "destination");
    }
  };

  const reverseGeocode = async (lat, lng, locationType) => {
    try {
      const response = await axios.get(
        `${apiUrl}/api/v1/map/geocode?latlng=${lat},${lng}`
      );
      const address =
        response.data.results[0]?.formatted_address || "Unknown location";

      if (locationType === "source") {
        setFormData((prev) => ({
          ...prev,
          sourceName: address,
          sourceLat: lat,
          sourceLng: lng,
        }));
      } else if (locationType === "destination") {
        setFormData((prev) => ({
          ...prev,
          destinationName: address,
          destinationLat: lat,
          destinationLng: lng,
        }));
      }
    } catch (error) {
      console.error("Error with reverse geocoding:", error);
    }
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
      setShowMap(true); // Show the map to confirm the location
    } catch (error) {
      console.error("Error fetching location details:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const createdRide = await dispatch(createRide(formData)).unwrap();
    if (createdRide?._id) {
      navigate(`/ride/${createdRide._id}`);
    } else {
      console.error("Ride creation failed: No ID found.");
    }
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

  if (!isLoaded) return <Loader />;

  return (
    <div className="p-6">
      <MetaData title="Share your carpool ride | Wheel Share" />
      <h2 className="text-2xl md:text-3xl font-semibold  mb-8 text-center">
        Create a New Ride
      </h2>
      <form
        onSubmit={handleSubmit}
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
              setMapType("source");
              const query = e.target.value;
              setLocationQuery(query);
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
              className="cursor-pointer hover:bg-[rgba(0,0,0,0.20)] rounded-md p-2 mt-2"
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
              setMapType("destination");
              const query = e.target.value;
              setLocationQuery(query);
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
              className="cursor-pointer hover:bg-[rgba(0,0,0,0.20)] rounded-md p-2 mt-2"
            >
              {suggestion.description}
            </p>
          ))}
        </div>

        <div className="mb-4 flex flex-col gap-1">
          <Label className="text-lg">Departure Time</Label>
          <DateTimePicker
            value={formData.departureTime}
            onChange={(date) => {
              setFormData((prev) => ({ ...prev, departureTime: date }));
            }}
          />
        </div>

        <div className="mb-4">
          <Label className="text-lg">Available Seats</Label>
          <Input
            type="number"
            name="availableSeats"
            value={formData.availableSeats}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-4">
          <Label className="text-lg">Vehicle Type</Label>
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

        <div className="mb-4">
          <Label className="text-lg">Price</Label>
          <Input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-4">
          <Label className="text-lg">Additional Information</Label>
          <Textarea
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleInputChange}
            rows="4"
            className="border rounded p-2 w-full"
            placeholder="Any additional details for the ride"
          />
        </div>

        <div className="text-center mt-16 mb-5">
          {loading ? (
            <ButtonLoading />
          ) : (
            <Button type="submit">Create Ride</Button>
          )}
        </div>
      </form>

      <Dialog open={showMap} onOpenChange={setShowMap}>
        <DialogTitle />
        <DialogContent>
          <GoogleMap
            mapContainerStyle={{ height: "400px", width: "100%" }}
            center={
              mapType === "source" && selectedSource
                ? selectedSource
                : mapType === "destination" && selectedDestination
                  ? selectedDestination
                  : { lat: 28.7041, lng: 77.1025 }
            }
            zoom={14}
            onClick={handleMapClick}
          >
            {selectedSource && <Marker position={selectedSource} />}
            {selectedDestination && <Marker position={selectedDestination} />}
          </GoogleMap>
          <DialogFooter>
            <Button onClick={() => setShowMap(false)}>Confirm Location</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateRide;
