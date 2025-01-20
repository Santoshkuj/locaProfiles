import axios from "axios";
import Profile from "../models/profileModel.js";

const getGeocode = async (req, res) => {
  const { street, city, state, country, zipCode } = req.body;

  if (!street || !city || !state || !country || !zipCode) {
    return res.status(400).json({
      success: false,
      message: "Invalid address. All fields are required: street, city, state, country, zipCode.",
    });
  }
  const address = `${street}, ${city}, ${state}, ${zipCode}, ${country}`;

  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: address,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }
    );

    if (response.data.status === "OK") {
      const geocode = response.data.results[0].geometry.location;
      res.status(200).json({ success: true, geocode });
    } else {
      res
        .status(400)
        .json({
          success: false,
          message: "Geocoding failed Please check the address provided.",
          error: response.data.status,
        });
    }
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error with geocoding API",
        error: error.message,
      });
  }
};

const getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await Profile.findById(id).populate("address");

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    res.status(200).json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const getProfiles = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const limit = 10;
    const skip = (page - 1) * limit;

    const profiles = await Profile.find()
      .skip(skip)
      .limit(limit)
      .populate("address");

    const totalProfiles = await Profile.countDocuments();
    const totalPages = Math.ceil(totalProfiles / limit);

    res.status(200).json({
      success: true,
      profiles,
      totalProfiles,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export { getGeocode, getProfileById, getProfiles };
