import { type Route } from '@/routes/models/route.interface'
import moment from 'moment'

const formatDate = (date: string): string => {
  return moment(date).format('DD/MM/YYYY, h:mm A')
}

export const routeToExcelRoute = (route: Route): Record<string, any> => {
  const { createdAt, startLocation, endLocation, materialType, name, code, message, state, doubleLicensePlate, isFull, vehicles, routeProfiles } = route

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

  // if (reports.length > 0) {
  //   const checkpoints = reports[0].checkpoints
  //   if (checkpoints.length > 0) {
  //     excelRoute.OBSERVACIONES = checkpoints[checkpoints.length - 1].observations.length
  //   }
  // }

  if (routeProfiles.length > 0) {
    const routeProfile = routeProfiles.find(routeProfile => routeProfile.role === 'conductor')
    if (routeProfile) {
      const { profile } = routeProfile
      excelRoute.CONDUCTOR = `${profile.name} ${profile.lastName}`
    }
  }

  return excelRoute
}
