import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const baseUrl = 'http://127.0.0.1:8000/'

export const loginAsync = createAsyncThunk('auth/loginAsync', async (data) => {
  try {
    const res = await axios.post(`${baseUrl.concat('api/auth/login')}`, data)
    return res.data
  } catch (err) {
    // Hata yönetimi
    console.log('Giriş yaparken hata oluştu!:', err.message)
    alert('Giriş yaparken hata oluştu!')
    throw err // Thunk durumunu rejected olarak ayarlamak için hatayı yeniden fırlatın
  }
})

export const meAsync = createAsyncThunk('auth/meAsync', async (token) => {
  const headers = {
    Authorization: `Bearer ${token}` // Token Bearer authentikasyon kullanarak gönderiliyor
  }
  try {
    const res = await axios.post(
      `${baseUrl.concat('api/auth/me')}`,
      {},
      { headers: headers }
    )
    return res.data
  } catch (err) {
    // Hata yönetimi
    console.log('Kullanıcı bilgisi alınamadı!:', err.message)
    alert('Kullanıcı bilgisi alınamadı!')
    throw err // Thunk durumunu rejected olarak ayarlamak için hatayı yeniden fırlatın
  }
})

export const registerAsync = createAsyncThunk(
  'auth/registerAsync',
  async (data) => {
    try {
      const res = await axios.post(
        `${baseUrl.concat('api/auth/register')}`,
        data
      )
      return res.data
    } catch (err) {
      // Hata yönetimi
      console.log('Kayıt olurken hata oluştu!:', err.message)
      alert('Kayıt olurken hata oluştu!')
      throw err // Thunk durumunu rejected olarak ayarlamak için hatayı yeniden fırlatın
    }
  }
)

export const updateUserAsync = createAsyncThunk(
  'auth/updateUserAsync',
  async (updatedUser) => {
    try {
      const res = await axios.post(
        `${baseUrl.concat('api/auth/update')}`,
        updatedUser
      )
      return res.data
    } catch (err) {
      // Hata yönetimi
      console.log('Kayıt olurken hata oluştu!:', err.message)
      alert('Kayıt olurken hata oluştu!')
      throw err // Thunk durumunu rejected olarak ayarlamak için hatayı yeniden fırlatın
    }
  }
)

const initialState = {
  value: 100,
  user: {},
  token: null,
  status: null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(registerAsync.fulfilled, (state, action) => {
      state.user = action.payload.data
      state.status = action.payload.status
    })

    builder.addCase(loginAsync.fulfilled, (state, action) => {
      state.token = action.payload.access_token
    })

    builder.addCase(meAsync.fulfilled, (state, action) => {
      state.user = action.payload.user
    })
  }
})

// Action creators are generated for each case reducer function
export const {} = authSlice.actions

export default authSlice.reducer
