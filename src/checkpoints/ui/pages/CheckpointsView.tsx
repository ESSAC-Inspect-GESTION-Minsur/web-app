import Button from '@/shared/ui/components/Button'
import React, { type ReactElement, useEffect, useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { type Checkpoint } from '@/checkpoints/models/checkpoint.interface'
import { type CheckpointGroup } from '@/checkpoints/models/checkpoint-group.interface'
import { CheckpointGroupsService, CheckpointPDFServices } from '@/checkpoints/services/checkpoint-group.service'
import moment from 'moment'
import RoutesServices from '@/routes/services/route.service'
import { type Route } from '@/routes/models/route.interface'
import EyeIcon from '@/shared/ui/assets/icons/EyeIcon'
import ShowImageEvidence from '../components/ShowImageEvidence'

interface FieldSelected {
  url: string
  name: string
}

const CheckpointsView = (): ReactElement => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [group, setGroup] = useState<CheckpointGroup | null>(null)
  // const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])
  const [lastCheckpoint, setLastCheckpoint] = useState<Checkpoint | null>(null)

  const [route, setRoute] = useState<Route | null>(null)

  const [fieldSelected, setFieldSelected] = useState<FieldSelected>({
    name: '',
    url: ''
  })

  const [showImage, setShowImage] = useState<boolean>(false)
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false)

  const vehicle = useMemo(() => {
    const vehicle = route?.vehicles.find((vehicle) => !vehicle.vehicleType.isCart)
    return vehicle ?? null
  }, [route])

  useEffect(() => {
    const reportId = searchParams.get('report-id') ?? ''
    if (reportId === '') return

    const groupId = searchParams.get('group-id') ?? ''

    const checkpointGroupsService = new CheckpointGroupsService()
    void checkpointGroupsService.findAllByReportId(reportId)
      .then((response) => {
        const group = response.find((group) => group.id === groupId)
        console.log('group', group)
        if (group === undefined) return

        setGroup(group)
        // setCheckpoints(group.checkpoints)

        const groupCheckpoints = group.checkpoints
        groupCheckpoints.sort((a, b) => a.createdAt.localeCompare(b.createdAt))

        setLastCheckpoint(groupCheckpoints[groupCheckpoints.length - 1])
      })

    const routeId = searchParams.get('route-id') ?? ''
    if (routeId === '') return

    const routesService = new RoutesServices()

    void routesService.findById(routeId)
      .then((response) => {
        setRoute(response)
      })
  }, [])

  const imageEvidenceOnClick = (url: string, name: string): void => {
    setFieldSelected({ url, name })
    setShowImage(true)
  }

  const driver = useMemo(() => {
    return route?.routeProfiles.find((routeProfile) => routeProfile.role.toUpperCase() === 'CONDUCTOR') ?? null
  }, [route])

  const supervisor = useMemo(() => {
    return route?.routeProfiles.find((routeProfile) => routeProfile.role.toUpperCase() === 'SUPERVISOR') ?? null
  }, [route])

  const exportPdf = (): void => {
    setIsPdfLoading(true)
    const checkpointPDFService = new CheckpointPDFServices()
    void checkpointPDFService.exportPdf(lastCheckpoint?.id ?? '')
      .then(() => {
        setIsPdfLoading(false)
      })
  }

  return (
    <div className='container-page'>
      <div className='min-w-[600px] w-full'>
        <div className='flex justify-between items-end'>
          <p className='uppercase text-2xl font-semibold'>Supervisión {route?.name} - {group?.type}</p>
          <div className='flex gap-2'>
            <Button color='primary' onClick={exportPdf} isLoading={isPdfLoading}>Exportar PDF</Button>
            <Button color='secondary' onClick={() => { navigate(-1) }}>Volver</Button>
          </div>
        </div>
        <div className='h-[1px] bg-gray-400 w-full my-4'></div>

        <div className='border-[1px] border-b-0 border-black mx-auto h-full mb-10'>
          <div className='grid grid-cols-3 border-b border-black'>
            <div className='grid place-items-center border-r border-black'>
              <div className='p-5'>
                <img src="./logo-header.png" alt="" width={250} />
              </div>
            </div>
            <div className='flex flex-col border-r border-black'>
              <div className="grid place-items-center h-full">
                <p className='text-center uppercase font-semibold'>Inspección de vehículo {route?.reports[0].reportType.name}</p>
              </div>
            </div>
            <div className=''>
              <div className='h-1/2 border-b border-black'>
                <div className='h-full px-2 flex gap-2 items-center font-semibold'>
                  <p>Código:</p>
                  <p >{route?.code}</p>
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
                <p className='border-r border-black w-[30%] font-semibold'>Empresa:</p>
                <p className='w-[70%]'>{route?.vehicleCompany}</p>
              </div>
              <div>
                <p className='border-r border-black w-[30%] font-semibold'>Fecha:</p>
                <p className='w-[70%]'>{moment(route?.createdAt).format('DD/MM/YYYY')}</p>
              </div>
              <div>
                <p className='border-r border-black w-[30%] font-semibold'>Tipo de Vehículo:</p>
                <p className='w-[70%]'>{vehicle?.vehicleType.name}</p>
              </div>
              <div>
                <p className='border-r border-black w-[30%] font-semibold'>Placa de vehículo:</p>
                <p className='w-[70%]'>{vehicle?.licensePlate}</p>
              </div>
            </div>
            <div className='[&>div]:border-r [&>div]:border-b [&>div]:border-black'>
              <div>
                <p className='border-r border-black w-[30%] font-semibold'>Hora de ingreso:</p>
                <p className='w-[70%]'>-</p>
              </div>
              <div className=''>
                <p className='border-r border-black w-[30%] font-semibold'>Contratante:</p>
                <p className='w-[70%]'>{route?.vehicleContractor}</p>
              </div>
              <div>
                <p className='border-r border-black w-[30%] font-semibold'>Marca:</p>
                <p className='w-[70%]'>{vehicle?.brand}</p>
              </div>
              <div>
                <p className='border-r border-black w-[30%] font-semibold'>Año de fabricación:</p>
                <p className='w-[70%]'>-</p>
              </div>
            </div>
            <div className='[&>div]:border-b [&>div]:border-black '>
              <div>
                <p className='border-r border-black w-[30%] font-semibold'>Hora de salida:</p>
                <p className='w-[70%]'>-</p>
              </div>
              <div>
                <p className='border-r border-black w-[30%] font-semibold'>Tipo de Carga:</p>
                <p className='w-[70%]'>-</p>
              </div>
              <div>
                <p className='border-r border-black w-[30%] font-semibold'>KM:</p>
                <p className='w-[70%]'>-</p>
              </div>
              <div>
                <p className='border-r border-black w-[30%] font-semibold'>Prueba de Alcotest</p>
                <p className='w-[70%]'>-</p>
              </div>
            </div>
          </div>

          <div className='border-b-[1px] border-black bg-blue-dark text-white'>
            <div className='flex'>
              <div className='w-[25%] grid items-center border-white'>
                <p className='px-2'>Campo</p>
              </div>
              <div className='w-[60%] grid items-center border-l-[1px] border-white'>
                <p className='px-2'>Observación</p>
              </div>
              <div className='w-[15%] flex flex-col gap-2 border-l-[1px] border-white'>
                <p className='text-center'>Pendiente</p>
                <div className='flex text-center border-t-[1px] border-white'>
                  <p className='w-[50%]'>si</p>
                  <p className='w-[50%] border-l-[1px] border-white'>no</p>
                </div>
              </div>
            </div>
          </div>
          <div className=''>
            {
              lastCheckpoint?.observations.map(observation => {
                return (
                  <div key={observation.id} className='flex border-b border-black'>

                    <div className='w-[25%]'>
                      <div className='flex items-center gap-3 justify-between'>
                        <p className='py-1 px-2 font-semibold'>{observation.fieldName}</p>
                      </div>
                    </div>
                    <div className='w-[60%] border-l-[1px] border-black'>
                      <div className='py-1 px-1 flex justify-between items-center'>
                        <p className='py-1 px-2 font-semibold '>{observation.message}</p>
                        <div className='w-[10%] flex justify-center'>
                          {observation.imageEvidence !== '' && <EyeIcon className='w-6 h-6 cursor-pointer transition-all hover:text-red' onClick={() => { imageEvidenceOnClick(observation.imageEvidence, observation.fieldName) }}></EyeIcon>}
                        </div>
                      </div>
                    </div>

                    <div className='w-[15%] border-l border-black'>
                      <div className='grid grid-cols-2 text-center h-full'>
                        <p className='self-center'>{observation.status.toUpperCase() === 'PENDIENTE' && 'x'}</p>
                        <div className='border-l border-black flex justify-center'>
                          <p className='self-center'>{observation.status.toUpperCase() === 'LEVANTADO' && 'x'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>

          <div className='grid grid-cols-2 text-center border-b border-black'>
            <div className='border-r border-black'>
              <div className='border-b border-black bg-blue-dark text-white py-2'>
                <p>INSPECCIONADO POR CONDUCTOR</p>
              </div>
              <div className='py-2 flex flex-col justify-center border-b border-black'>
                <p>Nombre y apellido</p>
                <p className='font-bold'>{driver?.profile.fullName}</p>
              </div>
              <div className='text-start p-2 border-b border-black'>
                <p className='font-bold'>Nº licencia: <span className='font-normal'>{driver?.profile.license}</span></p>
              </div>
              <div className='text-start p-2'>
                <p className='font-bold'>Firma</p>
              </div>
            </div>
            <div>
              <div className='border-b border-black bg-blue-dark text-white py-2'>
                <p>INSPECCIONADO POR SUPERVISOR</p>
              </div>
              <div className='py-2 flex flex-col justify-center border-b border-black'>
                <p>Nombre y apellido</p>
                <p className='font-bold'>{supervisor?.profile.fullName}</p>
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
      </div>

      {showImage && <ShowImageEvidence isOpen={showImage} imageUrl={fieldSelected.url} name={fieldSelected.name} onClose={() => { setShowImage(false) }} />}
    </div>

  )
}

export default CheckpointsView
