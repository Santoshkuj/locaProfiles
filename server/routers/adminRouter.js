import { Router } from "express";
import { addProfile, deleteProfile, updateProfile } from "../controllers/adminController.js";
import { isAdmin } from "../controllers/authController.js";
import upload from "../config/multerConfig.js";

const router = Router()

router.post('/addprofile',isAdmin,upload.single('photo'),addProfile)
router.put('/update/:id',isAdmin,upload.single('photo'),updateProfile)
router.delete('/delete/:id',isAdmin,deleteProfile)

export default router