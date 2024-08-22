import axios from "axios";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

// Your Google Maps API Key
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Place Autocomplete
const getPlaceAutocomplete = asyncHandler(async (req, res) => {
  const { input } = req.query;

  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json",
      {
        params: {
          input,
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    throw new ApiError(500, "Failed to fetch place autocomplete data");
  }
});

// Geocoding
const getGeocode = asyncHandler(async (req, res) => {
  const { latlng } = req.query;

  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          latlng,
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    throw new ApiError(500, "Failed to fetch geocode data");
  }
});

// Place details
const getPlaceDetails = asyncHandler(async (req, res) => {
  const { placeId } = req.query;

  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/details/json",
      {
        params: {
          placeid: placeId,
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    throw new ApiError(500, "Failed to fetch place details");
  }
});

export { getPlaceAutocomplete, getGeocode, getPlaceDetails };
