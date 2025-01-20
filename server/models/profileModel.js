import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    name: { type: String, required: true,},
    email: {type: String, required : true, unique: true},
    photo: { type: String },
    description: { type: String },
    address: { type: mongoose.Schema.Types.ObjectId, ref: "Address" },
    createdAt: { type: Date, default: Date.now }
  });
  
export default mongoose.model('Profile',profileSchema)