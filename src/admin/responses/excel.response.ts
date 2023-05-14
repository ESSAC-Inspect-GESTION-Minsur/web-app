import { type Vehicle } from '@/vehicles/models/vehicle.interface'
import { type Company } from '@/profiles/models/company.interface'
import { type Profile } from '@/profiles/models/profile.interface'

export interface ExcelResponse {
  data: Profile[] | Vehicle[] | Company[]
  dataMissed: string[]
}
