import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type User = {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  providerId: string;
  emailVerified: boolean;
  isAnonymous: boolean;
};

//@ts-ignore
const initialState: User = null;

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      return { ...action.payload };
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice;
