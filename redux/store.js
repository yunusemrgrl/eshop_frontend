import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../redux/auth-slice/index'
import commonReducer from '../redux/common-slice/index'
import productReducer from '../redux/product-slice/index'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    common: commonReducer,
    product: productReducer
  }
})
