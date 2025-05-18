import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import axiosInstance from '../../helper/axiosInstance';

const initialState = {
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true' || false,
  data: JSON.parse(localStorage.getItem('data')) || {},
  loading: false,
  error: null,
};

export const register = createAsyncThunk('/auth/signup', async (data) => {
  try {
    const res = axiosInstance.post('user/register', data);
    toast.promise(res, {
      loading: 'Wait, creating your account',
      success: (data) => data?.data?.message,
      error: 'Failed to create account',
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Something went wrong');
    throw error;
  }
});

export const login = createAsyncThunk('/auth/login', async (data) => {
  try {
    const res = axiosInstance.post('user/login', data);
    toast.promise(res, {
      loading: 'Wait, authentication is in progress',
      success: (data) => data?.data?.message,
      error: 'Failed to login',
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Something went wrong');
    throw error;
  }
});

export const logout = createAsyncThunk('/auth/logout', async () => {
  try {
    const res = axiosInstance.post('user/logout');
    toast.promise(res, {
      loading: 'Wait, logout is in progress',
      success: (data) => data?.data?.message,
      error: 'Failed to logout',
    });
    return (await res).data;
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Something went wrong');
    throw error;
  }
});

export const getUserData = createAsyncThunk('/user/details', async () => {
  try {
    const res = await axiosInstance.get('user/me');
    return res.data;
  } catch (error) {
    toast.error(error?.message || 'Failed to fetch user data');
    throw error;
  }
});

export const updateUserProfile = createAsyncThunk('/user/editprofile', async (formData, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post('user/editprofile', formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update profile";
    toast.error(message);
    return rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        if (action?.payload?.user) {
          localStorage.setItem('data', JSON.stringify(action.payload.user));
          localStorage.setItem('isLoggedIn', 'true');
          state.isLoggedIn = true;
          state.data = action.payload.user;
        }
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to register';
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        if (action?.payload?.user) {
          localStorage.setItem('data', JSON.stringify(action.payload.user));
          localStorage.setItem('isLoggedIn', 'true');
          state.isLoggedIn = true;
          state.data = action.payload.user;
        } else {
          localStorage.removeItem('data');
          localStorage.removeItem('isLoggedIn');
          state.isLoggedIn = false;
          state.data = {};
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to login';
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        localStorage.clear();
        state.isLoggedIn = false;
        state.data = {};
        state.loading = false;
        state.error = null;
      })
      // Get User Data
      .addCase(getUserData.fulfilled, (state, action) => {
        if (action?.payload?.user) {
          localStorage.setItem('data', JSON.stringify(action.payload.user));
          localStorage.setItem('isLoggedIn', 'true');
          state.isLoggedIn = true;
          state.data = action.payload.user;
        }
      })
      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (action?.payload?.user) {
          localStorage.setItem('data', JSON.stringify(action.payload.user));
          state.data = action.payload.user;
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update profile';
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;