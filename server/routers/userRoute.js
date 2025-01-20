import { Router } from "express";
import { getGeocode, getProfiles } from "../controllers/userController.js";

const router = Router()

router.get('/profiles',getProfiles)
router.post('/geocode',getGeocode)

export default router