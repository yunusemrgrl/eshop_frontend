import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  shoppingCartStatus: false,
  products: []
}

export const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    ShoppingCartModel: (state, action) => {
      state.shoppingCartStatus = action.payload
    }
  }
})

// Action creators are generated for each case reducer function
export const { ShoppingCartModel } = commonSlice.actions

export default commonSlice.reducer
