import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

const createAdmin = async () => {
  try {
    const admin = {
      name: "admin",
      email: "admin@email.com",
      role: "admin",
    };

    const adminExists = await User.findOne({ role: "admin" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin1234", 10);

      const adminUser = new User({
        ...admin,
        password: hashedPassword,
      });

      await adminUser.save();
      console.log("Admin user created");
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.error("Error creating admin:", error);
  }
};

export default createAdmin