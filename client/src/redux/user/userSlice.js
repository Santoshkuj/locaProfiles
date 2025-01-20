import { createSlice ,createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../config/axiosConfig";

const initialState =  {
    geocode: null,
    loading: false,
    error: null,
    center: {lat: 0, lng :0},
    zoom: 10,
    markers: [],
    profiles: [],
    userProfile:{}
  }

// Async actions for API calls
export const fetchProfiles = createAsyncThunk(
  'profiles/fetchProfiles',
  async ({ searchQuery = '', city = '', state = '' }, thunkAPI) => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('searchQuery', searchQuery);
      if (city) params.append('city', city);
      if (state) params.append('state', state);

      const response = await api.get(`/api/user/profiles?${params.toString()}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);


// Async thunk to fetch geocode
export const fetchGeocode = createAsyncThunk(
  'map/fetchGeocode',
  async (address, thunkAPI) => {
    try {
      const response = await api.post('/api/user/geocode', address);
      return response.data.geocode;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCenter: (state, action) => {
        state.center = action.payload;
      },
      setZoom: (state, action) => {
        state.zoom = action.payload;
      },
      addMarker: (state, action) => {
        state.markers.push(action.payload);
      },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGeocode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGeocode.fulfilled, (state, action) => {
        state.loading = false;
        state.geocode = action.payload;
      })
      .addCase(fetchGeocode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProfiles.pending,(state) =>{
        state.loading = true;
        state.error = null;
      }).addCase(fetchProfiles.fulfilled, (state,action)=>{
        state.loading = false,
        state.profiles = action.payload.profiles
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default userSlice.reducer;
export const { setCenter,setZoom,addMarker} = userSlice.actions