import React, { type ReactElement, useEffect, useState } from 'react'
import { type FieldReport } from '@/reports/models/field-report.interface'
import { type Report } from '@/reports/models/report.interface'
import { ReportsService } from '@/reports/services/report.service'
import EyeIcon from '@/shared/ui/assets/icons/EyeIcon'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ShowImageEvidence from '../components/ShowImageEvidence'
import { type Route } from '../models/route.interface'
import RoutesServices, { RoutePDFServices } from '../services/route.services'
import { type FieldGroup } from '@/reports/models/group.interface'
import { type ReportType } from '@/reports/models/report-type.interface'
import Button from '@/shared/ui/components/Button'
import { REPORT_TYPE_GROUP_INITIAL_STATE } from '@/reports/models/report-type-group.interface'

const ROUTE_INITIAL_STATE: Route = {
  id: '',
  createdAt: '',
  updatedAt: '',
  startLocation: '',
  endLocation: '',
  materialType: '',
  name: '',
  code: '',
  checked: false,
  doubleLicensePlate: false,
  isFull: false,
  message: '',
  active: true,
  state: '',
  vehicles: [],
  reports: [],
  routeProfiles: []
}

const REPORT_TYPE_INITIAL_STATE: ReportType = {
  createdAt: '',
  updatedAt: '',
  id: '',
  name: '',
  active: true,
  company: '',
  vehicleTypes: [],
  reportTypeGroup: REPORT_TYPE_GROUP_INITIAL_STATE
}

const REPORT_INITIAL_STATE: Report = {
  createdAt: '',
  updatedAt: '',
  id: '',
  location: '',
  checked: false,
  active: true,
  type: '',
  checkpoints: [],
  routeId: '',
  reportType: REPORT_TYPE_INITIAL_STATE
}

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
      const groupIndex = groups.findIndex(g => g.id === groupId)

      if (groupIndex === -1) reportGroups.push({ id: groupId, name: fieldReport.group.name })

      if (fieldReportsMap.has(groupId)) {
        fieldReportsMap.get(groupId)?.push(fieldReport)
      } else {
        fieldReportsMap.set(groupId, [fieldReport])
      }
    })

    setFieldReports(fieldReportsMap)
    setGroups(reportGroups)
  }

  const imageEvidenceOnClick = (url: string, name: string): void => {
    setFieldSelected({ url, name })
    setShowImage(true)
  }

  const findDriverFullname = (): string => {
    const driver = route.routeProfiles.find((routeProfile) => routeProfile.role.toUpperCase() === 'CONDUCTOR')
    return driver?.profile.fullName ?? 'No hay conductor'
  }

  const exportPdf = (): void => {
    setIsPdfLoading(true)
    const routePDFService = new RoutePDFServices()
    void routePDFService.exportPdf(route.code)
      .then(() => {
        setIsPdfLoading(false)
      })
  }

  return (
    <div className='container-page'>
      <div className='flex justify-between'>
        <h1 className='text-2xl uppercase font-semibold'>Checklist - {route.code}</h1>
        <div className='flex gap-2'>
          {report.checkpoints.length > 0 && <Button color='primary' onClick={() => { navigate(`/detalle-checkpoints?report-id=${report.id}&route-id=${route.id}`) }}>Ver Observaciones</Button>}
          <Button color='primary' onClick={exportPdf} isLoading={isPdfLoading}>Exportar PDF</Button>
        </div>
      </div>
      <div className='h-[1px] bg-gray-400 w-full my-4'></div>
      <div className='border-[1px] border-black border-b-0 mx-auto h-full mb-10'>
        <div className='flex justify-center  border-b-[1px] border-black'>
          <div className='w-[30%] grid place-items-center border-r-[1px] border-black'>
            <div className='p-5'>
              <img src="./logo-header.png" alt="" width={250}/>
            </div>
          </div>
          <div className='w-[30%] border-r-[1px] border-black'>
            <div className='border-b-[1px] border-black py-2 bg-blue-dark text-white'>
              <p className='text-center uppercase font-semibold'>Registro</p>
            </div>

            <div className='border-b-[1px] border-black'>
              <div className='px-2 flex gap-2 '>
                <p>Codigo:</p>
                <p >{route.code}</p>
              </div>
            </div>
            <div className='border-b-[1px] border-black'>
              <p className='px-2'>Version: 2</p>
            </div>
            <div className=''>
              <div className='flex gap-2 px-2'>
                <p>Fecha de elaboracion</p>
                <p>{new Date(route.createdAt).toLocaleDateString('Es-es', { year: 'numeric', month: '2-digit', day: '2-digit' })}</p>
              </div>
            </div>
          </div>
          <div className='w-[40%] flex flex-col border-r-[1px] border-black'>
            <div className='h-[65%] border-b-[1px] border-black grid place-items-center'>
              <p className='text-center uppercase font-semibold'>Insepcción de {report.reportType.name}</p>
            </div>
            <div className='h-[30%] grid place-items-center'>
              <p className=''>Área: Seguridad y Salud Ocupacional</p>
            </div>
          </div>
        </div>
        <div className='h-3'></div>
        <div className='flex border-t-[1px] border-b-[1px] border-black'>
          <div className='w-[20%] border-r-[1px] border-black bg-blue-dark text-white text-center'>
            <p className='uppercase py-3 px-2'>Inspector</p>
          </div>
          <div className='w-[50%] border-r-[1px] border-black'>
            <p className='py-3 px-2'>Juan Perez</p>
          </div>
          <div className='w-[10%] border-r-[1px] border-black bg-blue-dark text-white text-center'>
            <p className='uppercase py-3 px-2'>Fecha</p>
          </div>
          <div className='w-[20%]'>
            <p className='py-3 px-2'>2023-02-01</p>
          </div>
        </div>
        <div className='py-3 border-b-[1px] border-black'>
          <p className='px-4 font-bold uppercase'>1. Información General de la Unidad de Transporte</p>
        </div>
        <div className='flex'>
          <div className='w-[100%] border-r-[1px] border-black'>
            <div className='border-b-[1px] border-black bg-blue-dark text-white'>
              <p className='p-2 uppercase'>1.1 Datos de la Unidad de transporte</p>
            </div>
            <div className='border-b-[1px] border-black'>
              <div className='p-2 flex gap-5'>
                <p>1. Propietario:</p>
                <p >{findDriverFullname()}</p>
              </div>
            </div>
            <div className='border-b-[1px] border-black'>
              <div className='p-2 flex gap-5'>
                <p>2. Placa de Camión / Tracto:</p>
                <p>{route.doubleLicensePlate ? (route.vehicles[1] ? route.vehicles[1].licensePlate : '') : (route.vehicles[0] ? route.vehicles[0].licensePlate : '')}</p>
              </div>
            </div>
            <div className='border-b-[1px] border-black'>
              <div className='p-2 flex gap-5'>
                <p>3. Placa de Remolque / Semirremolque:</p>
                <p>{route.doubleLicensePlate ? (route.vehicles[0] ? route.vehicles[0].licensePlate : '') : 'NO APLICA'}</p>
              </div>
            </div>
            <div className=''>
              <div className='p-2 flex gap-5'>
                <p>4. Marca y modelo:</p>
                <p>
                  {route.doubleLicensePlate ? route.vehicles[1] ? `${route.vehicles[1].brand} ${route.vehicles[1].model}` : '' : route.vehicles[0] ? `${route.vehicles[0].brand} ${route.vehicles[0].model}` : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='border-b-[1px] border-t-[1px] border-black'>
          <div className='p-2 flex justify-evenly gap-4'>
            <p><span className='font-bold'>NORMAL: </span> No impide continuar con la operación</p>
            <p><span className='font-bold'>CRITICO: </span> Impide continuar con la operación</p>
            <p><span className='font-bold'>NA: </span> No aplica</p>
          </div>

        </div>
        <div className='py-3 border-black'>
          <p className='px-4 font-bold uppercase'>2. Inspecciones a realizar</p>
        </div>
        <div className='uppercase'>
          {
            Array.from(fieldReports.entries()).sort((a, b) => a[0] > b[0] ? 1 : -1).map(([key, value], index) => {
              const group = groups.find((g) => g.id === key)
              return (
                <div
                  key={key}
                  className='border-t-[1px] border-black'
                >
                  <div className='border-b-[1px] border-black bg-blue-dark text-white'>
                    <div className='flex'>
                      <div className='w-[10%] text-center grid items-center'>
                        <p>critico</p>
                      </div>
                      <div className='w-[10%] text-center grid items-center border-l-[1px] border-white'>
                        <p>Normal</p>
                      </div>
                      <div className='w-[65%] grid items-center border-l-[1px] border-white'>
                        <p className='px-2'>2.{index + 1}. {group?.name.toUpperCase()}</p>
                      </div>
                      <div className='w-[15%] flex flex-col gap-2 border-l-[1px] border-white'>
                        <p className='text-center'>cumple</p>
                        <div className='flex text-center border-t-[1px] border-white'>
                          <p className='w-[33.3%]'>si</p>
                          <p className='w-[33.3%] border-l-[1px] border-white'>no</p>
                          <p className='w-[33.3%] border-l-[1px] border-white'>na</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='border-b-[1px] border-black'>
                    {
                      value.map(fieldReport => {
                        return (
                          <div key={fieldReport.fieldId} className='flex'>

                            <div className='py-1 w-[10%] text-center grid items-center'>
                              <p>{fieldReport.isCritical && 'X'}</p>
                            </div>
                            <div className='py-1 w-[10%] text-center grid items-center border-l-[1px] border-black'>
                              <p>{!fieldReport.isCritical && 'X'}</p>
                            </div>
                            <div className='py-1 w-[65%] grid items-center border-l-[1px] border-black'>
                              <div className='flex gap-3'>
                                <p className='py-1 px-2 font-semibold w-1/3'>{fieldReport.field.name}</p>
                                {fieldReport.imageEvidence !== '' && <EyeIcon className='w-6 h-6 cursor-pointer transition-all hover:text-red' onClick={() => { imageEvidenceOnClick(fieldReport.imageEvidence, fieldReport.field.name) }}></EyeIcon>}
                              </div>
                            </div>
                            <div className='w-[15%] flex text-center border-l-[1px] border-black'>
                              <p className='py-1 w-[33.3%]'>{fieldReport.value.toUpperCase() === 'SI' && 'x'}</p>
                              <p className='py-1 w-[33.3%] border-l-[1px] border-black'>{fieldReport.value.toUpperCase() === 'NO' && 'x'}</p>
                              <p className='py-1 w-[33.3%] border-l-[1px] border-black'>{fieldReport.value.toUpperCase() === 'NO APLICA' && 'x'}</p>
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
      </div>

      {showImage && <ShowImageEvidence imageUrl={fieldSelected.url} name={fieldSelected.name} close={() => { setShowImage(false) }} />}
    </div>

  )
}

export default RouteDetail
