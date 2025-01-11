import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserData } from "../../types/api-types";

// Define the type for the state
interface UserState {
  user: UserData | null; // Make 'user' nullable
  token: string | null; // Make 'token' nullable
  isloading: boolean;
}

// Initial state with nullable user and token
const initialState: UserState = {
  user: null,
  token: null,
  isloading: true,
};

const userSlice = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    // Action to set user and token
    userExist: (state, action: PayloadAction<{ user: UserData }>) => {
      state.user = action.payload.user;
      state.token = action.payload.user.token;
      state.isloading = false;
    },
    // Action to handle login without the token
    loginSuccess: (
      state,
      action: PayloadAction<{ user: UserData; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token.replace(/^"|"$/g, "");
      state.isloading = false;
    },
    // Action to log out (set user and token to null)
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isloading = false;
    },
  },
});

// Export actions
export const { userExist, loginSuccess, logout } = userSlice.actions;

// Export reducer
export default userSlice;
