import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './admin/adminSlice.js'
import authReducer from './auth/authSlice.js'
import userReducer from './user/userSlice.js'

const store = configureStore({
  reducer: {
    admin : adminReducer,
    auth : authReducer,
    user: userReducer
  },
});

export default store;
