import React, { useState } from "react";
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

const libraries = ["places"];

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const CreateRide = () => {
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
    departureTime: "",
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
        `/api/v1/map/geocode?latlng=${lat},${lng}`
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

  const handleSuggestionClick = async (placeId) => {
    try {
      const response = await axios.get(
        `/api/v1/map/place/details?placeId=${placeId}`
      );
      const location = response.data.result.geometry.location;
      const address = response.data.result.formatted_address;

      if (mapType === "source") {
        setSelectedSource({ lat: location.lat, lng: location.lng });
        setFormData((prev) => ({
          ...prev,
          sourceName: address,
          sourceLat: location.lat,
          sourceLng: location.lng,
        }));
      } else if (mapType === "destination") {
        setSelectedDestination({ lat: location.lat, lng: location.lng });
        setFormData((prev) => ({
          ...prev,
          destinationName: address,
          destinationLat: location.lat,
          destinationLng: location.lng,
        }));
      }
      setShowMap(true); // Show the map to confirm the location
    } catch (error) {
      console.error("Error fetching location details:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    dispatch(createRide(formData));
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Create a New Ride</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <Label>Source Location</Label>
          <Input
            type="text"
            name="sourceName"
            value={formData.sourceName}
            onChange={(e) => {
              handleInputChange(e);
              setMapType("source");
              setLocationQuery(e.target.value);
              handleLocationSearch(e.target.value, "source");
            }}
          />
          {sourceSuggestions.map((suggestion) => (
            <p
              key={suggestion.place_id}
              onClick={() =>
                handleSuggestionClick(suggestion.place_id, "source")
              }
              className="cursor-pointer  hover:bg-[rgba(0,0,0,0.20)] rounded-md p-2"
            >
              {suggestion.description}
            </p>
          ))}
        </div>

        <div className="mb-4">
          <Label>Destination Location</Label>
          <Input
            type="text"
            name="destinationName"
            value={formData.destinationName}
            onChange={(e) => {
              handleInputChange(e);
              setMapType("destination");
              setLocationQuery(e.target.value);
              handleLocationSearch(e.target.value, "destination");
            }}
          />
          {destinationSuggestions.map((suggestion) => (
            <p
              key={suggestion.place_id}
              onClick={() =>
                handleSuggestionClick(suggestion.place_id, "destination")
              }
              className="cursor-pointer hover:bg-gray-100 p-2"
            >
              {suggestion.description}
            </p>
          ))}
        </div>

        <div className="mb-4">
          <Label>Departure Time</Label>
          <Input
            type="datetime-local"
            name="departureTime"
            value={formData.departureTime}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-4">
          <Label>Available Seats</Label>
          <Input
            type="number"
            name="availableSeats"
            value={formData.availableSeats}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-4">
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

        <div className="mb-4">
          <Label>Price</Label>
          <Input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="mb-4">
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

        {loading ? (
          <ButtonLoading />
        ) : (
          <Button type="submit">Create Ride</Button>
        )}

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      <Dialog open={showMap} onOpenChange={setShowMap}>
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
