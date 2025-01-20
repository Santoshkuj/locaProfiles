import React from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const FullScreenMap = () => {
  const navigate = useNavigate();
  const position = [51.505, -0.09]; // Example coordinates (London)

  useEffect(() => {
    // Initialize the map
    const map = L.map('map', {
      center: position,
      zoom: 13,
      scrollWheelZoom: true,
    });

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add marker
    L.marker(position)
      .addTo(map)
      .bindPopup(`Latitude: ${position[0]}, Longitude: ${position[1]}`)
      .openPopup();

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="relative w-full h-ful">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-14 bg-gray-800 text-white px-4 py-1 rounded-md shadow-md hover:bg-gray-700 z-50"
      >
        Back
      </button>

      {/* Map Container */}
      <div
        id="map"
        className="w-full h-full rounded-lg shadow-lg z-0"
        style={{
          borderRadius: '8px',
        }}
      ></div>
    </div>
  );
};

export default FullScreenMap;
