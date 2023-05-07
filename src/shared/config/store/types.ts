import { type Report } from '@/reports/models/report.interface'
import { type Route } from '@/routes/models/route.interface'
import { type DateRange } from '@/shared/types/date-range'
import { type UserToStorage } from '@/users/models/user.interface'

export enum STATUS {
  IDLE = 'idle',
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed'
}

export interface AUTH_STATE {
  user: UserToStorage | null | undefined
  authenticated: boolean
  status: STATUS
}

export interface ROUTES_STATE {
  routes: Route[]
  reports: Report[]
  dateRange: DateRange
  lastRequest: Date | null
  status: STATUS
}

export interface REPORTS_STATE {
  reports: Report[]
  lastRequest: Date | null
  status: STATUS
}
