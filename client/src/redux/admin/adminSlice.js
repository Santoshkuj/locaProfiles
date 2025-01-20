import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/axiosConfig';


export const addProfile = createAsyncThunk('profiles/addProfile', async (profileData, thunkAPI) => {
  try {
    const response = await api.post('/api/admin/addprofile', profileData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const updateProfile = createAsyncThunk('profiles/updateProfile', async ({ id, profileData }, thunkAPI) => {
  console.log(id,profileData);
  try {
    const response = await api.put(`/api/admin/update/${id}`, profileData);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

export const deleteProfile = createAsyncThunk('profiles/deleteProfile', async (id, thunkAPI) => {
  try {
    await api.delete(`/api/admin/delete/${id}`);
    return id;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data);
  }
});

// Profile slice
const adminSlice = createSlice({
  name: 'profiles',
  initialState: {
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
      // Add Profile
    builder
      .addCase(addProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProfile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Profile
      .addCase(deleteProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProfile.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminSlice.reducer;
