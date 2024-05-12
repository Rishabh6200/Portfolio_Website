import { createSlice } from '@reduxjs/toolkit'

const initialState = {
   user: null,
}

export const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers: {
      loginUser: (state, action) => {
         state.user = action.payload;
      },
      logOutUser: (state, action) => {
         state.user = null;
      }
   }
})

export const { loginUser, logOutUser } = authSlice.actions;
export default authSlice.reducer;