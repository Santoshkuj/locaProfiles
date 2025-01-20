import mongoose from 'mongoose'

const addressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    fullAddress: { type: String },
    createdAt: { type: Date, default: Date.now }
  });

  addressSchema.pre("save", function (next) {
    this.fullAddress = `${this.street}, ${this.city}, ${this.state}, ${this.zipCode}`;
    next();
  });

export default mongoose.model('Address',addressSchema)