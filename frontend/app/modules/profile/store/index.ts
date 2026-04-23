import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Profile } from "~/modules/profile/types";

export interface ProfileState {
  profile: Profile | null
}

const initialState: ProfileState = {
  profile: null
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, data: PayloadAction<Profile>) => {
      state.profile = data.payload
    },
  },
})

export const { setProfile } = profileSlice.actions

export default profileSlice.reducer