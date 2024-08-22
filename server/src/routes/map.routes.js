import { Router } from "express";
import {
  getPlaceAutocomplete,
  getGeocode,
  getPlaceDetails,
} from "../controllers/map.controller.js";

const router = Router();

router.route("/place/autocomplete").get(getPlaceAutocomplete);
router.route("/geocode").get(getGeocode);
router.route("/place/details").get(getPlaceDetails);

export default router;
