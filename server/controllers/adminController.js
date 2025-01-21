import Address from "../models/addressModel.js";
import Profile from "../models/profileModel.js";
import {v2 as cloudinary} from 'cloudinary'

const addProfile = async (req, res) => {
  try {
    const { name,email, description, interests, address } = req.body;
    const photo = req.file;
    if (!name || !email || !photo || !description || !address || !interests) {
      return res.status(400).json({
        success: false,
        error:
          "All fields (name, image, description, and address) are required.",
      });
    }
    let imageUrl = '';

    if (photo) {
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(photo.path);
        imageUrl = cloudinaryResponse.secure_url;
      } catch (cloudinaryError) {
        return res.status(500).json({
          message: 'Error uploading image to Cloudinary',
          error: cloudinaryError.message,
        });
      }
    }

    const { street, city, state, zipCode,country } = address;
    if (!street || !city || !state || !zipCode || !country) {
      return res.status(400).json({
        success: false,
        error: "Address must include street, city, state, and zipCode.",
      });
    }
    let existingAddress = await Address.findOne(address);

    if (!existingAddress) {
      existingAddress = new Address(address);
      await existingAddress.save();
    }

    const duplicateProfile = await Profile.findOne({
      email,
      address: existingAddress._id,
    });
    if (duplicateProfile) {
      return res.status(400).json({
        success: false,
        error: "A profile with this name and emails already exists.",
      });
    }

    const newProfile = new Profile({
      name,
      email,
      interests,
      photo :imageUrl,
      description,
      address: existingAddress._id,
    });
    await newProfile.save();

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Internal server error. Please try again later.",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, description,interests, address } = req.body;

    const existingProfile = await Profile.findById(id);
    if (!existingProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    let existingAddress = await Address.findOne(address);
    if (!existingAddress) {
      existingAddress = await Address.create(address);
    }
    let updatedPhotoUrl = existingProfile.photo;

    // Handle photo update with Cloudinary
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profiles",
        public_id: existingProfile.photo
          ? existingProfile.photo.split("/").pop().split(".")[0]
          : undefined,
        overwrite: true,
      });

      updatedPhotoUrl = result.secure_url;
    }

    existingProfile.name = name || existingProfile.name;
    existingProfile.email = email || existingProfile.email;
    existingProfile.interests = interests || existingProfile.interests;
    existingProfile.photo = updatedPhotoUrl;
    existingProfile.description = description || existingProfile.description;
    existingProfile.address = existingAddress._id;

    await existingProfile.save();

    res
      .status(200)
      .json({
        success: true,
        message: "Profile updated successfully",
        existingProfile,
      });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await Profile.findById(id);

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }

    if (profile.photo) {
      const publicId = profile.photo.split('/').pop().split('.')[0];
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        return res.status(500).json({
          success: false,
          message: 'Error deleting image from Cloudinary',
          error: cloudinaryError.message,
        });
      }
    }

    // Check if there is an associated address and delete it if necessary
    if (profile.address) {
      const address = await Address.findById(profile.address);
      if (address) {
        const profilesWithSameAddress = await Profile.countDocuments({
          address: profile.address,
        });

        if (profilesWithSameAddress === 1) {
          await Address.deleteOne({ _id: profile.address });
        }
      }
    }

    // Delete the profile
    await Profile.deleteOne({ _id: id });

    res
      .status(200)
      .json({ success: true, message: "Profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


export { addProfile, updateProfile, deleteProfile };
