import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchFn } from "../utils/fetchFn";
import safeAsync from "../utils/safeAsync";

interface User {
  id: string;
  role: "customer" | "shopkeeper" | "admin";
  email: string;
}

export const getCurrentUser = createAsyncThunk<User, void, { rejectValue: string }>(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    const [data, error] = await safeAsync(fetchFn("/auth/me", { method: "GET" }));

    if (error) {
      return rejectWithValue(error.message);
    }

    return data.user;
  },
);

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        console.log("User rehydrated successfully: ", state.user);
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload ?? "An unknown error occurred";
        console.log("User login failed:", state.error);
      });
  },
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;
