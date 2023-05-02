import { type LoginData } from '@/iam/models/interfaces/login.interface'
import { AuthServices } from '@/iam/services/auth.service'
import { createAsyncThunk, createSlice, type SliceCaseReducers } from '@reduxjs/toolkit'
import { STATUS, type AUTH_STATE } from '@/shared/config/store/types'
import { type UserStorage } from '@/iam/models/interfaces/user-storage.interface'

const getInitialState = (): AUTH_STATE => {
  const userJson = sessionStorage.getItem('user')
  if (!userJson) {
    return {
      user: null,
      authenticated: false,
      status: STATUS.IDLE
    }
  }

  return {
    user: JSON.parse(userJson),
    authenticated: true,
    status: STATUS.SUCCEEDED
  }
}

const INITIAL_STATE: AUTH_STATE = getInitialState()

export const login = createAsyncThunk('login', async (loginData: LoginData, thunkAPI) => {
  const authService = new AuthServices()
  return await authService.login(loginData)
    .then((response) => response)
    .catch((error) => {
      return thunkAPI.rejectWithValue(error)
    })
})

export const register = createAsyncThunk('register', async () => {

})

const authSlice = createSlice<AUTH_STATE, SliceCaseReducers<AUTH_STATE>>({
  name: 'auth',
  initialState: INITIAL_STATE,
  reducers: {
    logout: (state, action) => {
      const authService = new AuthServices()
      authService.logout()
      state = getInitialState()
    }
  },
  extraReducers (builder) {
    builder
      .addCase(login.pending, (state, action) => {
        state.status = STATUS.PENDING
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload
        state.authenticated = true
        state.status = STATUS.SUCCEEDED
      })
      .addCase(login.rejected, (state, action) => {
        state.status = STATUS.FAILED
      })
      // .addCase(register.pending, (state, action) => {
      //   state.status = AUTH_STATUS.LOADING
      // })
      // .addCase(register.fulfilled, (state, action) => {
      //   state.status = AUTH_STATUS.SUCCEEDED
      // })
      // .addCase(register.rejected, (state, action) => {
      //   state.status = AUTH_STATUS.FAILED
      //   state.error = action.error.message
      // })
  }
})

export const { logout } = authSlice.actions

export const getCurrentUser = (state: any): UserStorage => state.auth.user
export const isAuthenticated = (state: any): boolean => state.auth.authenticated

export default authSlice.reducer
