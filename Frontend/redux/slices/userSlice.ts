import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  id: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  avatarUrl?: string | null;
  role: string;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  id: null,
  name: null,
  email: null,
  phone: null,
  avatarUrl: null,
  role: "user",
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state: UserState, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload, isAuthenticated: true };
    },
    logout: () => initialState,
  },
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;
