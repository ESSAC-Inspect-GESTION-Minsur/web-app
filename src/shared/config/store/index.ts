import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/shared/config/store/features/auth-slice'
import routesReducer from '@/shared/config/store/features/routes-slice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    routes: routesReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
