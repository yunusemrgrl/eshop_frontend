import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
const baseUrl = 'http://127.0.0.1:8000/'

export const getProductAsync = createAsyncThunk(
  'product/getProductAsync',
  async () => {
    try {
      const res = await axios.get(`${baseUrl.concat('api/product/get')}`)
      return res.data
    } catch (err) {
      // Hata yönetimi
      console.log('Hata oluştu:', err.message)
      alert('Ürünler getirelemedi!')
      throw err // Thunk durumunu rejected olarak ayarlamak için hatayı yeniden fırlatın
    }
  }
)

export const addProductAsync = createAsyncThunk(
  'product/addProductAsync',
  async ({ product, userId }) => {
    try {
      const res = await axios.post(
        `${baseUrl.concat('api/product/add')}`,
        { product, userId },
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      alert('Ürün ekleme işlemi başarılı 😋😋😋😋')
      return res.data
    } catch (err) {
      // Hata yönetimi
      console.log('Hata oluştu:', err.message)
      alert('Ürünler getirelemedi!')
      throw err // Thunk durumunu rejected olarak ayarlamak için hatayı yeniden fırlatın
    }
  }
)

export const addShoppingCartAsync = createAsyncThunk(
  'product/addShoppingCartAsync',
  async ({ id, qty }) => {
    try {
      const res = await axios.post(
        `${baseUrl.concat('api/product/addShoppingCart')}`,
        { id, qty }
      )
      return res.data
    } catch (err) {
      // Hata yönetimi
      console.log('Sepete eklenemedi:', err.message)
      alert('Sepete eklenemedi!')
      throw err // Thunk durumunu rejected olarak ayarlamak için hatayı yeniden fırlatın
    }
  }
)

export const addOrderAsync = createAsyncThunk(
  'product/addOrderAsync',
  async ({ product, total, adres, userId }) => {
    try {
      const res = await axios.post(
        `${baseUrl.concat('api/product/addOrder')}`,
        { product, total, adres, userId }
      )
      alert('Sipariş verildi.')
      return res.data
    } catch (err) {
      // Hata yönetimi
      alert('Sipariş verilirken hata oluştu!')
      throw err // Thunk durumunu rejected olarak ayarlamak için hatayı yeniden fırlatın
    }
  }
)

export const getOrderAsync = createAsyncThunk(
  'product/getOrderAsync',
  async (userId) => {
    try {
      const res = await axios.post(
        `${baseUrl.concat('api/product/getOrder')}`,
        { userId }
      )
      return res.data
    } catch (err) {
      // Hata yönetimi
      alert('Siparişlerim getirilirken hata oluştu!')
      throw err // Thunk durumunu rejected olarak ayarlamak için hatayı yeniden fırlatın
    }
  }
)

export const getAllOrder = createAsyncThunk(
  'product/getAllOrder',
  async () => {
    try {
      const res = await axios.post(
        `${baseUrl.concat('api/product/getAllOrder')}`,
      )
      return res.data
    } catch (err) {
      // Hata yönetimi
      alert('Siparişler getirilirken hata oluştu!')
      throw err // Thunk durumunu rejected olarak ayarlamak için hatayı yeniden fırlatın
    }
  }
)


export const confirmOrder = createAsyncThunk(
  'product/confirmOrder',
  async ({id, status}) => {
    try {
      const res = await axios.post(
        `${baseUrl.concat('api/product/confirmOrder')}`, {id, status}
      )
      return res.data
    } catch (err) {
      // Hata yönetimi
      alert('Onay verilemedi.')
      throw err // Thunk durumunu rejected olarak ayarlamak için hatayı yeniden fırlatın
    }
  }
)

export const getProductDetailAsync = createAsyncThunk(
  'product/getProductDetailAsync',
  async (id) => {
    try {
      const res = await axios.post(
        `${baseUrl.concat('api/product/getProduct')}`,
        { id }
      )
      return res.data
    } catch (err) {
      // Hata yönetimi
      alert('Siparişlerim getirilirken hata oluştu!')
      throw err // Thunk durumunu rejected olarak ayarlamak için hatayı yeniden fırlatın
    }
  }
)

const initialState = {
  products: [],
  product: [],
  shoppingCartProducts: [],
  total: '',
  orderedProduct: [],
  allOrderedProduct: [],
  confirmOrder: ''
}

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setShoppingCart: (state, action) => {
      state.shoppingCartProducts = action.payload
    },
    setTotalOrderValue: (state, action) => {
      state.total = parseFloat(action.payload).toFixed(2)
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getProductAsync.fulfilled, (state, action) => {
      state.products = action.payload
    })

    builder.addCase(addShoppingCartAsync.fulfilled, (state, action) => {
      console.log('addShoppingCartAsync', action.payload)
    })
    builder.addCase(addProductAsync.fulfilled, (state, action) => {
      console.log('addProductAsync', action.payload)
    })
    builder.addCase(addOrderAsync.fulfilled, (state, action) => {
      console.log('addOrderAsync', action.payload)
    })
    builder.addCase(getOrderAsync.fulfilled, (state, action) => {
      console.log('getOrderAsync', action.payload)
      state.orderedProduct = action.payload.reverse()
    })
    builder.addCase(getProductDetailAsync.fulfilled, (state, action) => {
      console.log('getProductDetailAsync', action.payload)
      state.product = action.payload
    })
    builder.addCase(getAllOrder.fulfilled, (state, action) => {
      console.log('getAllOrderAsync', action.payload)
      state.allOrderedProduct = action.payload.reverse()
    })
    builder.addCase(confirmOrder.fulfilled, (state, action) => {
      console.log('confirmOrder', action.payload)
      state.confirmOrder = action.payload
    })
  }
})

// Action creators are generated for each case reducer function
export const { setShoppingCart, setTotalOrderValue } = productSlice.actions

export default productSlice.reducer
