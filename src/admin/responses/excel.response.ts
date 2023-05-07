import { type Vehicle } from '@/vehicles/models/vehicle.interface'
import { type User } from '@/users/models/user.interface'
import { type Company } from '@/profiles/models/company.interface'

export interface ExcelResponse {
  data: User[] | Vehicle[] | Company[]
  dataMissed: string[]
}
