// config.js
export const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // Ensure this is loaded from your environment
export const libraries = ["places"]; // Static array to avoid unnecessary re-renders
