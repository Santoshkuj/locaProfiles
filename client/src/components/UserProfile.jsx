import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const UserProfile = () => {
  const navigate = useNavigate();
  const location = useLocation()
  const user = location.state

  const {
    name,
    email,
    photo,
    description,
    address: { street, city, state, zipCode } = {},
  } = user;

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
      >
        &larr; Back
      </button>

      {/* User Profile Card */}
      <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4">
        {/* User Photo */}
        <div className="flex items-center flex-col">
          <img
            src={photo}
            alt={name}
            className="w-56 h-60 object-fill border border-gray-200"
          />
          <div>
            <h1 className="text-xl font-semibold text-gray-700">Name: <span className="text-gray-500">{name}</span></h1>
            <p className="text-gray-700">Email: <span className="text-gray-500">{email}</span></p>
          </div>
        </div>

        {/* Description */}
        {description && (
          <div className="mt-4 text-center">
            <h2 className="text-lg font-semibold text-gray-800">About</h2>
            <p className="mt-2 text-gray-600">{description}</p>
          </div>
        )}

        {/* Address Section */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-800">Address</h2>
          <div className="mt-2 text-gray-600">
            <p>Street: {street}</p>
            <p>City: {city}</p>
            <p>State: {state}</p>
            <p>ZipCode: {zipCode}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
