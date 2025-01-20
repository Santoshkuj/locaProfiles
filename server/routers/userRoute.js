import { Router } from "express";
import { getGeocode, getProfileById, getProfiles } from "../controllers/userController.js";

const router = Router()

router.get('/profiles',getProfiles)
router.get('/profile/:id',getProfileById)
router.get('/geocode',getGeocode)

export default router