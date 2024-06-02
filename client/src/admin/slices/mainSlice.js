import { createSlice } from '@reduxjs/toolkit'

const initialState = {
   address: null,
   info: null,
}

export const allSlice = createSlice({
   name: 'all',
   initialState,
   reducers: {
      setAddress: (state, action) => {
         state.address = action.payload;
      },
      setinfo: (state, action) => {
         state.info = action.payload;
      }
   }
})

export const { setAddress, setinfo } = allSlice.actions;
export default allSlice.reducer;