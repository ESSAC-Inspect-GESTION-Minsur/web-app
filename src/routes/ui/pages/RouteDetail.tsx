/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { type ReactElement, useEffect, useState, useMemo, Fragment } from 'react'
import { REPORT_INITIAL_STATE, type Report } from '@/reports/models/report.interface'
import EyeIcon from '@/shared/ui/assets/icons/EyeIcon'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Button from '@/shared/ui/components/Button'
import RoutesServices, { RoutePDFServices } from '@/routes/services/route.service'
import { ReportsService } from '@/reports/services/reports.service'
import { ROUTE_INITIAL_STATE, type Route } from '@/routes/models/route.interface'
import { type FieldReport } from '@/fields/models/field-report.interface'
import { type FieldGroup } from '@/fields/models/group.interface'
import { type CheckpointGroup } from '@/checkpoints/models/checkpoint-group.interface'
import ShowImageEvidence from '@/checkpoints/ui/components/ShowImageEvidence'
import moment from 'moment'

interface FieldSelected {
  url: string
  name: string
}

const RouteDetail = (): ReactElement => {
  const routesService = new RoutesServices()
  const reportsService = new ReportsService()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [route, setRoute] = useState<Route>(ROUTE_INITIAL_STATE)
  const [report, setReport] = useState<Report>(REPORT_INITIAL_STATE)
  const [fieldReports, setFieldReports] = useState<Map<string, FieldReport[]>>(new Map<string, FieldReport[]>())
  const [groups, setGroups] = useState<FieldGroup[]>([])

  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false)

  const [fieldSelected, setFieldSelected] = useState<FieldSelected>({
    name: '',
    url: ''
  })
  const [showImage, setShowImage] = useState<boolean>(false)

  //! loading
  // Id -> context
  // Route -> useMemo
  // Report -> useMemo
  // FieldReports -> useMemo
  // Groups -> useMemo

  useEffect(() => {
    const id = searchParams.get('id') ?? 0
    if (id === 0) return
    void routesService.findById(id)
      .then(route => {
        setRoute(route)
        setReport(route.reports[0])

        void reportsService.findAllFieldsByReportId(route.reports[0].id)
          .then(groupFieldReports)
      })
  }, [])

  const groupFieldReports = (fieldReports: FieldReport[]): void => {
    const fieldReportsMap = new Map<string, FieldReport[]>()
    const reportGroups: FieldGroup[] = []

    fieldReports.forEach(fieldReport => {
      const groupId = fieldReport.group.id
      const groupIndex = reportGroups.findIndex(g => g.id === groupId)

      if (groupIndex === -1) reportGroups.push({ id: groupId, name: fieldReport.group.name })

      if (fieldReportsMap.has(groupId)) {
        fieldReportsMap.get(groupId)?.push(fieldReport)
      } else {
        fieldReportsMap.set(groupId, [fieldReport])
      }
    })

    const fieldReportsMapKeys = Array.from(fieldReportsMap.keys())
    const fieldReportsMapSorted = new Map<string, FieldReport[]>()

    fieldReportsMapKeys.forEach(key => {
      const fieldReports = fieldReportsMap.get(key)

      const reportGroup = reportGroups.find(group => group.id === key)

      if (reportGroup) {
        fieldReportsMapSorted.set(reportGroup.name, fieldReports ?? [])
      }
    })

    setFieldReports(fieldReportsMapSorted)
    setGroups(reportGroups)
  }

  const imageEvidenceOnClick = (url: string, name: string): void => {
    setFieldSelected({ url, name })
    setShowImage(true)
  }

  const driver = useMemo(() => {
    return route.routeProfiles.find((routeProfile) => routeProfile.role.toUpperCase() === 'CONDUCTOR') ?? null
  }, [route])

  const findDriverFullName = (): string => {
    const driver = route.routeProfiles.find((routeProfile) => routeProfile.role.toUpperCase() === 'CONDUCTOR')
    return driver?.profile.fullName ?? 'No hay conductor'
  }

  const findSupervisorFullName = (): string => {
    const supervisor = route.routeProfiles.find((routeProfile) => routeProfile.role.toUpperCase() === 'SUPERVISOR')
    return supervisor?.profile.fullName ?? 'No hay conductor'
  }

  const exportPdf = (): void => {
    setIsPdfLoading(true)
    const routePDFService = new RoutePDFServices()
    void routePDFService.exportPdf(route.code)
      .then(() => {
        setIsPdfLoading(false)
      })
  }

  const vehicle = useMemo(() => {
    const vehicle = route.vehicles.find((vehicle) => !vehicle.vehicleType.isCart)
    return vehicle ?? null
  }, [route])

  const cart = useMemo(() => {
    const cart = route.vehicles.find((vehicle) => vehicle.vehicleType.isCart)
    return cart ?? null
  }, [route])

  const showCheckpoint = (group: CheckpointGroup): void => {
    navigate(`/detalle-checkpoints?report-id=${report.id}&route-id=${route.id}&group-id=${group.id}`)
  }

  const groupsToShow = useMemo(() => {
    const entries = Array.from(fieldReports.entries())
    entries.sort((a, b) => a[0].localeCompare(b[0]))

    let fieldIndex = 1

    entries.forEach((entry) => {
      const aux = entry[1]

      aux.sort((a, b) => a.field.name.localeCompare(b.field.name))
      aux.forEach((field) => {
        field.index = fieldIndex++
      })
    })

    sessionStorage.setItem('fieldReports', JSON.stringify(entries))

    return entries
  }, [fieldReports])

  return (
    <div className='container-page'>
      <h1 className='text-2xl uppercase font-semibold'>Supervisión - Checklist Subida - {route.code}</h1>
      <p className='text-sm italic'>** La primera vez que se descargue el reporte, la espera será mayor **</p>
      <div className='flex gap-2 mt-2'>
        {
          report.checkpointGroups.filter((group) => group.type === 'Bajada').map((checkpointGroup) =>
            <Button
              key={checkpointGroup.id}
              color='secondary'
              onClick={() => { showCheckpoint(checkpointGroup) }}>Supervisión - Checklist {checkpointGroup.type}</Button>
          )
        }
        {route.code !== '' && <Button color='primary' onClick={exportPdf} isLoading={isPdfLoading}>Exportar PDF</Button>}
      </div>
      <div className='h bg-gray-400 w-full my-4'></div>
      <div className='border border-black border-b-0 mx-auto h-full mb-10'>
        <div className='grid grid-cols-3 border-b border-black'>
          <div className='grid place-items-center border-r border-black'>
            <div className='p-5'>
              <img src="./logo-header.png" alt="" width={250} />
            </div>
          </div>
          <div className='flex flex-col border-r border-black'>
            <div className="grid place-items-center h-full">
              <p className='text-center uppercase font-bold text-lg'>Inspección de vehículo {report.reportType.name}</p>
            </div>
          </div>
          <div className=''>
            <div className='h-1/2 border-b border-black'>
              <div className='h-full px-2 flex gap-2 items-center font-semibold'>
                <p>Código:</p>
                <p >{route.code}</p>
              </div>
            </div>
            <div className='h-1/2'>
              <div className='h-full flex gap-2 px-2 items-center'>
                <p className='text-sm'>Código de Autorización Torre de Control</p>
                <p></p>
              </div>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-3 border-b border-black'>
          <div className=' border-r border-black'>
            <p className='uppercase py-3 px-2 text-sm font-semibold'>Combustible</p>
          </div>
          <div className='border-r border-black'>
            <div className='py-3 px-2'>
              <p></p>
            </div>
          </div>
          <div className=''>
            <p className='py-3 px-2 text-sm font-semibold'>Guía de remisión</p>
          </div>
        </div>

        <div className='w-[100%] h-56 grid grid-cols-3 border-r text-sm [&>div>div>p]:py-1 [&>div>div]:flex [&>div>div]:gap-1 [&>div>div]:h-[25%] [&>div>div]:border-b [&>div>div]:border-black [&>div>div]:items-center [&>div>div]:overflow-hidden [&>div>div>p]:px-1 [&>div>div>p]:h-full'>
          <div className='[&>div]:border-r [&>div]:border-b [&>div]:border-black'>
            <div>
              <p className='border-r border-black w-[30%] font-bold'>Empresa:</p>
              <p className='w-[70%]'>{route.vehicleCompany}</p>
            </div>
            <div>
              <p className='border-r border-black w-[30%] font-bold'>Fecha:</p>
              <p className='w-[70%]'>{moment(route.createdAt).format('DD/MM/YYYY')}</p>
            </div>
            <div>
              <p className='border-r border-black w-[30%] font-bold'>Tipo de Vehículo:</p>
              <p className='w-[70%]'>{vehicle?.vehicleType.name}</p>
            </div>
            <div>
              <p className='border-r border-black w-[30%] font-bold'>Placa de vehículo:</p>
              <p className='w-[70%]'>{vehicle?.licensePlate}</p>
            </div>
          </div>
          <div className='[&>div]:border-r [&>div]:border-b [&>div]:border-black'>
            <div>
              <p className='border-r border-black w-[30%] font-bold'>Hora de ingreso:</p>
              <p className='w-[70%]'>-</p>
            </div>
            <div className=''>
              <p className='border-r border-black w-[30%] font-bold'>Contratante:</p>
              <p className='w-[70%]'>{route.vehicleContractor}</p>
            </div>
            <div>
              <p className='border-r border-black w-[30%] font-bold'>Marca:</p>
              <p className='w-[70%]'>{vehicle?.brand}</p>
            </div>
            <div>
              <p className='border-r border-black w-[30%] font-bold'>Año de fabricación:</p>
              <p className='w-[70%]'>-</p>
            </div>
          </div>
          <div className='[&>div]:border-b [&>div]:border-black '>
            <div>
              <p className='border-r border-black w-[30%] font-bold'>Hora de salida:</p>
              <p className='w-[70%]'>-</p>
            </div>
            <div>
              <p className='border-r border-black w-[30%] font-bold'>Tipo de Carga:</p>
              <p className='w-[70%]'>-</p>
            </div>
            <div>
              <p className='border-r border-black w-[30%] font-bold'>KM:</p>
              <p className='w-[70%]'>-</p>
            </div>
            <div>
              <p className='border-r border-black w-[30%] font-bold'>Prueba de Alcotest</p>
              <p className='w-[70%]'>-</p>
            </div>
          </div>
        </div>

        <div className='uppercase'>
          {
            groupsToShow.map(([key, value]) => {
              return (
                <div
                  key={key}
                  className=''
                >
                  <div className='border-b border-black bg-gray-500 text-white'>
                    <div className='flex'>
                      <div className='w-[70%] grid items-center'>
                        <p className='px-2 text-center text-lg font-bold'>{key.toUpperCase()}</p>
                      </div>
                      <div className='w-[30%] flex flex-col gap-2 border-l border-white font-bold'>
                        <p className='text-center'>cumple</p>
                        <div className='grid grid-cols-3 text-center border-t border-white'>
                          <p className=''>si</p>
                          <p className=' border-l border-white'>no</p>
                          <p className=' border-l border-white'>na</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=''>
                    {
                      value.map((fieldReport, index) => {
                        return (
                          <div key={fieldReport.fieldId} className='flex border-b border-black'>
                            <div className='w-[70%] flex items-center'>
                              <div className='h-full w-[10%] text-center border-r border-black grid place-items-center bg-gray-500 text-white font-bold'>
                                <p className='py-3'>{fieldReport.index}</p>
                              </div>
                              <div className='w-[90%]'>
                                <div className='flex items-center gap-3'>
                                  <p className='py-2 px-2 font-semibold'>{fieldReport.field.name}</p>
                                  {fieldReport.imageEvidence !== '' && <EyeIcon className='w-6 h-6 cursor-pointer transition-all hover:text-red' onClick={() => { imageEvidenceOnClick(fieldReport.imageEvidence, fieldReport.field.name) }}></EyeIcon>}
                                </div>
                              </div>
                            </div>
                            <div className='w-[30%] border-l border-black'>
                              <div className='grid grid-cols-3 text-center h-full'>
                                <p className='py-2 self-center'>{fieldReport.value.toUpperCase() === 'SI' && 'x'}</p>
                                <div className='py-2 border-l border-black flex justify-center'>
                                  <p className='self-center'>{fieldReport.value.toUpperCase() === 'NO' && 'x'}</p>
                                </div>
                                <div className='py-2 border-l border-black flex justify-center'>
                                  <p className='self-center'>{fieldReport.value.toUpperCase() === 'NO APLICA' && 'x'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              )
            })
          }
        </div>

        <div className='grid grid-cols-2 text-center border-b border-black'>
          <div className='border-r border-black'>
            <div className='border-b border-black bg-gray-500 text-white py-2'>
              <p>INSPECCIONADO POR CONDUCTOR</p>
            </div>
            <div className='py-2 flex flex-col justify-center border-b border-black'>
              <p>Nombre y apellido</p>
              <p className='font-bold'>{findDriverFullName()}</p>
            </div>
            <div className='text-start p-2 border-b border-black'>
              <p className='font-bold'>Nº licencia: <span className='font-normal'>{driver?.profile.license}</span></p>
            </div>
            <div className='text-start p-2'>
              <p className='font-bold'>Firma</p>
            </div>
          </div>
          <div>
            <div className='border-b border-black bg-gray-500 text-white py-2'>
              <p>INSPECCIONADO POR SUPERVISOR</p>
            </div>
            <div className='py-2 flex flex-col justify-center border-b border-black'>
              <p>Nombre y apellido</p>
              <p className='font-bold'>{findSupervisorFullName()}</p>
            </div>
            <div className='text-start p-2'>
              <p className='font-bold'>Firma</p>
            </div>
          </div>
        </div>

        <div className='border-b border-black'>
          <p className='px-2 py-3 italic font-semibold'>Nota:La verificación del documento y su validación se asume con las respectivas firmas del presente documento  (trabajador y supervisor )</p>
        </div>
      </div>

      {showImage && <ShowImageEvidence isOpen={showImage} imageUrl={fieldSelected.url} name={fieldSelected.name} onClose={() => { setShowImage(false) }} />}
    </div>

  )
}

export default RouteDetail
