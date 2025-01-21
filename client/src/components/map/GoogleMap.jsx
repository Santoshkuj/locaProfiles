import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { fetchGeocode } from "../../redux/user/userSlice";
import { useLocation } from "react-router-dom";

const GoogleMapComponent = () => {
  const dispatch = useDispatch();
  const location = useLocation()
  const address = location?.state?.address
  const { geocode, loading, error } = useSelector((state) => state.user);

  // Call API to fetch geocode when address changes
  useEffect(() => {
    if (address) {
      dispatch(fetchGeocode(address));
    }
  }, [address, dispatch]);

  if (loading) return <p>Loading map...</p>;
  if (error) return <p>Error loading map: {error}</p>;
  return (
    geocode && (
      <div className="w-full h-[500px] md:h-[600px] lg:h-[800px] bg-gray-200 p-4 rounded-lg shadow-lg">
        <LoadScript googleMapsApiKey={import.meta.VITE_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            center={geocode}
            zoom={10}
            mapContainerStyle={{ width: "100%", height: "400px" }}
          >
            <Marker position={geocode} />
          </GoogleMap>
        </LoadScript>
      </div>
    )
  );
};

export default GoogleMapComponent;
