import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ================= LOGIN API =================
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "https://techfidants-hrms-be.onrender.com/user/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Login failed");
      }

      const token =
        data.token || data.data?.token || data.user?.token;

      const userData =
        data.user || data.data?.user || data;

      if (!token) {
        return rejectWithValue("Token not received");
      }

      return { token, userData };
    } catch (error) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

// =============== LOAD FROM STORAGE ===============
const loadAuthFromStorage = () => {
  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("userData");

  if (token && userData) {
    return {
      isLoggedIn: true,
      token,
      userData: JSON.parse(userData),
      loading: false,
      error: null,
    };
  }

  return {
    isLoggedIn: false,
    token: null,
    userData: null,
    loading: false,
    error: null,
  };
};

const authSlice = createSlice({
  name: "auth",
  initialState: loadAuthFromStorage(),
  reducers: {
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.userData = null;
      state.error = null;

      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("currentPage");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.token = action.payload.token;
        state.userData = action.payload.userData;

        localStorage.setItem("token", action.payload.token);
        localStorage.setItem(
          "userData",
          JSON.stringify(action.payload.userData)
        );
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.isLoggedIn = false;
        state.token = null;
        state.userData = null;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
