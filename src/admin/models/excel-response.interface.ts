import { type User } from '@/iam/models/user.model'
import { type Vehicle } from '@/routes/models/vehicle.interface'

export interface ExcelResponse {
  data: User[] | Vehicle[]
  dataMissed: string[]
}
