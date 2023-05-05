import { type RouteProfile } from '@/profiles/models/route-profile.interface'
import { type Report } from '@/reports/models/report.interface'
import { type Vehicle } from './vehicle.interface'
import moment from 'moment'

export interface Route {
  id: string
  createdAt: string
  updatedAt: string
  startLocation: string
  endLocation: string
  materialType: string
  name: string
  code: string
  message: string
  state: string
  checked: boolean
  doubleLicensePlate: boolean
  isFull: boolean
  active: boolean
  vehicles: Vehicle[]
  reports: Report[]
  routeProfiles: RouteProfile[]
}

const formatDate = (date: string): string => {
  return moment(date).format('DD/MM/YYYY, h:mm A')
}

export const routeToExcelRoute = (route: Route): Record<string, any> => {
  const { createdAt, startLocation, endLocation, materialType, name, code, message, state, doubleLicensePlate, isFull, vehicles, reports, routeProfiles } = route

  const excelRoute = {
    'FECHA DE CREACIÓN': formatDate(createdAt),
    'LUGAR DE INICIO': startLocation,
    'LUGAR DE FIN': endLocation ?? 'No terminado',
    CONDUCTOR: '',
    'VA LLENO': isFull ? 'Sí' : 'No',
    'TIPO DE MATERIAL': materialType,
    PLACA: name,
    CÓDIGO: code,
    ESTADO: state,
    'MENSAJE DE ESTADO': message,
    'DOBLE PLACA': doubleLicensePlate ? 'Sí' : 'No',
    VEHÍCULO: '',
    SEMIRREMOLQUE: '',
    OBSERVACIONES: 0
  }

  if (vehicles.length > 0) {
    vehicles.forEach((vehicle) => {
      if (vehicle.vehicleType.isCart) {
        excelRoute.SEMIRREMOLQUE = vehicle.licensePlate
      } else {
        excelRoute.VEHÍCULO = vehicle.licensePlate
      }
    })
  }

  if (reports.length > 0) {
    const checkpoints = reports[0].checkpoints
    if (checkpoints.length > 0) {
      excelRoute.OBSERVACIONES = checkpoints[checkpoints.length - 1].observations.length
    }
  }

  if (routeProfiles.length > 0) {
    const routeProfile = routeProfiles.find(routeProfile => routeProfile.role === 'conductor')
    if (routeProfile) {
      const { profile } = routeProfile
      excelRoute.CONDUCTOR = `${profile.name} ${profile.lastName}`
    }
  }

  return excelRoute
}
