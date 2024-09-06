import User from "../types/user";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: User = {
  uid: "",
  email: null,
  displayName: null,
  phoneNumber: null,
  photoURL: null,
  providerId: "",
  emailVerified: false,
  isAnonymous: true,
  loggedIn: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      return { ...action.payload };
    },
    logout(state) {
      return { ...initialState };
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice;
