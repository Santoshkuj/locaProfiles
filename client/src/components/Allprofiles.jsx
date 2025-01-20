import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Profile from "./Profile";
import { fetchProfiles } from "../redux/user/userSlice";

const Profiles = ({handleDelete,handleEdit}) => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState({ city: "", state: "" });
  const { profiles, loading, error } = useSelector((state) => state.user);
  const {token} = useSelector(state=> state.auth)

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };
  const debouncedSearch = useCallback(
    debounce((value) => setSearchQuery(value), 500),
    []
  );
  const handleSearchChange = (query)=>{
    setQuery(query);
    debouncedSearch(query);
  }

  const handleFilterChange = (key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
        dispatch(
          fetchProfiles({ searchQuery, city: filter.city, state: filter.state })
        );
  }, [searchQuery, filter, dispatch]);

  return (
    <div>
      {/* Search Input */}
      <div className="flex px-8 justify-between">
      <input
        className="p-1 bg-slate-200  outline-none border-none w-44 sm:w-52 rounded-sm placeholder:text-slate-700 text-slate-800 shadow-sm"
        type="text"
        placeholder="Search..."
        value={query}
        onChange={(e)=>handleSearchChange(e.target.value)}
      />

      {/* City Filter */}
      <div>
      <select
      className="bg-slate-200 mr-2 w-32 rounded-sm"
        value={filter.city}
        onChange={(e) => handleFilterChange("city", e.target.value)}
      >
        <option value="">Select City</option>
        <option value="scbh">scbh</option>
        <option value="Los Angeles">Los Angeles</option>
      </select>

      {/* State Filter */}
      <select
      className="bg-slate-200 w-32 rounded-sm"
        value={filter.state}
        onChange={(e) => handleFilterChange("state", e.target.value)}
      >
        <option value="">Select State</option>
        <option value="California">California</option>
        <option value="Texas">Texas</option>
      </select>
      </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {profiles.map((profile) => (
            <div
              key={profile.name}
              className=" flex flex-col items-center bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden max-w-64"
            >
              <Profile profile={profile} />

              {token && <div className="flex justify-between w-full p-2">
                <button
                  onClick={() => handleEdit(profile)}
                  className="bg-yellow-300 px-3 rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(profile?._id)}
                  className="bg-red-500 px-3 rounded-md"
                >
                  Delete
                </button>
              </div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profiles;
