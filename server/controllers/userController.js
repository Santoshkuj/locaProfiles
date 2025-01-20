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


const getProfiles = async (req, res) => {
  const { searchQuery, city, state, page = 1 } = req.query;
  const limit = 10;
  const skip = (page - 1) * limit;

  try {
    const match = {};

    if (searchQuery) {
      match.$or = [
        { name: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { 'address.city': { $regex: searchQuery, $options: 'i' } },
        { 'address.state': { $regex: searchQuery, $options: 'i' } },
        { 'address.zipcode': { $regex: searchQuery, $options: 'i' } },
      ];
    }

    if (city || state) {
      match.$and = [];
      if (city) match.$and.push({ "address.city": { $regex: city, $options: 'i' } });
      if (state) match.$and.push({ "address.state": { $regex: state, $options: 'i' } });
    }

    const profiles = await Profile.aggregate([
      {
        $lookup: {
          from: "addresses",
          localField: "address",
          foreignField: "_id",
          as: "address",
        },
      },
      { $unwind: "$address" }, // Unwind the populated address field
      { $match: match }, // Apply match conditions
      { $skip: skip }, // Skip for pagination
      { $limit: limit }, // Limit for pagination
    ]);

    const totalProfiles = await Profile.aggregate([
      {
        $lookup: {
          from: "addresses",
          localField: "address",
          foreignField: "_id",
          as: "address",
        },
      },
      { $unwind: "$address" },
      { $match: match },
      { $count: "total" }, // Count matching documents
    ]);

    const totalCount = totalProfiles[0]?.total || 0;
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
      success: true,
      profiles,
      totalProfiles: totalCount,
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


export { getGeocode, getProfiles };
