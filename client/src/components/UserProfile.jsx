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
    interests,
    address: { street, city, state, zipCode, country } = {},
  } = user;

  return (
    <div className="container mx-auto p-2 max-w-3xl">
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
        <div className="flex mx-auto w-[80%] items-center justify-center gap-6">
        {description && (
          <div className="mt-2 text-center w-1/2 bg-slate-200 rounded-md p-2">
            <h2 className="text-lg font-semibold text-gray-800 underline">About</h2>
            <p className="mt-2 text-gray-700">{description}</p>
          </div>
        )}
        {interests && (
          <div className="mt-2 text-center w-1/2 bg-slate-200 rounded-md p-2">
            <h2 className="text-lg font-semibold text-gray-700 underline">Interests</h2>
            <p className="mt-2 text-gray-700">{interests}</p>
          </div>
        )}
        </div>

        {/* Address Section */}
        <div className="mt-4 ml-4 flex gap-10">
          <h2 className="text-lg font-semibold text-gray-800">Address:</h2>
          <div className=" text-gray-600 grid grid-cols-2 gap-2">
            <span>Street: {street}</span>
            <span>City: {city}</span>
            <span>State: {state}</span>
            <span>Country: {country}</span>
            <span>ZipCode: {zipCode}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
