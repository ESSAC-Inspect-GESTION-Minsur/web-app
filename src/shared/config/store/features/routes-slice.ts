import { type Report } from '@/reports/models/report.interface'
import { type Route } from '@/routes/models/route.interface'
import RoutesServices, { type FindAllOptions } from '@/routes/services/route.services'
import { DateRange } from '@/shared/models/date-range'
import { createAsyncThunk, createSlice, type SliceCaseReducers } from '@reduxjs/toolkit'
import { type RootState } from '..'
import { type ROUTES_STATE, STATUS } from '../types'

const DEFAULT_STATE: ROUTES_STATE = {
  routes: [],
  reports: [],
  dateRange: new DateRange(),
  lastRequest: null,
  status: STATUS.IDLE
}

const getRoutesFromJson = (routesJson: string): ROUTES_STATE => {
  const routesJsonObject = JSON.parse(routesJson)
  const lastDate = routesJsonObject.lastRequest

  return {
    routes: routesJsonObject.routes,
    reports: routesJsonObject.reports,
    dateRange: DateRange.fromJson(routesJsonObject.dateRange),
    lastRequest: lastDate ? new Date(lastDate) : new Date(),
    status: STATUS.SUCCEEDED
  }
}

const getInitialState = (): ROUTES_STATE => {
  const routesJson = sessionStorage.getItem('routes-request')
  if (!routesJson) {
    return DEFAULT_STATE
  }
  return getRoutesFromJson(routesJson)
}

const INITIAL_STATE: ROUTES_STATE = getInitialState()

export const findAllRoutes = createAsyncThunk('findAllRoutes', async (options: FindAllOptions, thunkAPI) => {
  const routesService = new RoutesServices()
  return await routesService.findAll(options)
    .then((response) => response)
    .catch((error) => {
      return thunkAPI.rejectWithValue(error)
    })
})

const routesSlice = createSlice<ROUTES_STATE, SliceCaseReducers<ROUTES_STATE>>({
  name: 'routes',
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers (builder) {
    builder
      .addCase(findAllRoutes.pending, (state, action) => {
        state.status = STATUS.PENDING
      })
      .addCase(findAllRoutes.fulfilled, (state, action) => {
        state.routes = action.payload

        const routeRequest = JSON.parse(sessionStorage.getItem('routes-request') ?? '')

        state.lastRequest = routeRequest.lastRequest ? new Date(routeRequest.lastRequest) : new Date()
        state.dateRange = routeRequest.dateRange ? DateRange.fromJson(routeRequest.dateRange) : new DateRange()
        state.reports = routeRequest.reports
        state.status = STATUS.SUCCEEDED
      })
      .addCase(findAllRoutes.rejected, (state, action) => {
        state.status = STATUS.FAILED
      })
  }
})

export const getRoutes = ({ routes }: RootState): Route[] => routes.routes
export const getReports = ({ routes }: RootState): Report[] => routes.reports
export const getDateRange = ({ routes }: RootState): DateRange => routes.dateRange
export const getLastDateRequest = ({ routes }: RootState): Date | null => routes.lastRequest
export const getStatus = ({ routes }: RootState): STATUS => routes.status

export default routesSlice.reducer
