import Button from '@/shared/ui/components/Button'
import React, { type ReactElement, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
// import ObservationDetail from '../components/ObservationDetail'

import { type Checkpoint } from '@/checkpoints/models/checkpoint.interface'
import { type CheckpointGroup } from '@/checkpoints/models/checkpoint-group.interface'
import { CheckpointGroupsService } from '@/checkpoints/services/checkpoint-group.service'
import moment from 'moment'
import RoutesServices from '@/routes/services/route.service'
import { type Route } from '@/routes/models/route.interface'
// import EyeIcon from '@/shared/ui/assets/icons/EyeIcon'

const CheckpointsView = (): ReactElement => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [group, setGroup] = useState<CheckpointGroup | null>(null)
  // const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])
  const [lastCheckpoint, setLastCheckpoint] = useState<Checkpoint | null>(null)

  const [route, setRoute] = useState<Route | null>(null)

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

  return (
    <div className='container-page'>
      <div className='min-w-[600px] w-full'>
        <div className='flex justify-between items-end'>
          <p className='uppercase text-2xl font-semibold'>Supervisión {route?.name} - {group?.type}</p>
          <Button color='secondary' onClick={() => { navigate(-1) }}>Volver</Button>
        </div>
        <div className='h-[1px] bg-gray-400 w-full my-4'></div>

        <div className='border-[1px] border-black border-b-0 mx-auto h-full mb-10'>
          <div className='flex justify-center  border-b-[1px] border-black'>
            <div className='w-[30%] grid place-items-center border-r-[1px] border-black'>
              <div className='p-5'>
                <img src="./logo-header.png" alt="" width={250} />
              </div>
            </div>
            <div className='w-[30%] border-r-[1px] border-black'>
              <div className='border-b-[1px] border-black py-2 bg-blue-dark text-white'>
                <p className='text-center uppercase font-semibold'>Registro</p>
              </div>

              <div className='border-b-[1px] border-black'>
                <div className='px-2 flex gap-2 '>
                  <p>Codigo:</p>
                  <p >{route?.code}</p>
                </div>
              </div>
              <div className='border-b-[1px] border-black'>
                <p className='px-2'>Version: 2</p>
              </div>
              <div className=''>
                <div className='flex gap-2 px-2'>
                  <p>Fecha de elaboración</p>
                  <p></p>
                  <p>{moment(route?.createdAt).format('DD/MM/YYYY')}</p>
                </div>
              </div>
            </div>
            <div className='w-[40%] flex flex-col border-r-[1px] border-black'>
              <div className='h-[65%] border-b-[1px] border-black grid place-items-center'>
                <p className='text-center uppercase font-semibold'>Inspección de {route?.reports[0].reportType.name}</p>
                <p></p>
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
              <p className='py-3 px-2'>{lastCheckpoint?.profile.fullName}</p>
            </div>
            <div className='w-[10%] border-r-[1px] border-black bg-blue-dark text-white text-center'>
              <p className='uppercase py-3 px-2'>Fecha</p>
            </div>
            <div className='w-[20%]'>
              <p className='py-3 px-2'>{moment(lastCheckpoint?.createdAt).format('DD/MM/YYYY, h:mm A')}</p>
            </div>
          </div>
          <div className='h-[1px] bg-gray-400 w-full my-4'></div>
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
          <div className='border-b-[1px] border-black'>
            {
              lastCheckpoint?.observations.map(observation => {
                return (
                  <div key={observation.id} className='flex'>
                    <div className='py-1 w-[25%] grid items-center border-black'>
                      <div className='flex gap-3'>
                        <p className='py-1 px-2 font-semibold w-1/3'>{observation.fieldName}</p>
                        {/* {observation.imageEvidence !== '' && <EyeIcon className='w-6 h-6 cursor-pointer transition-all hover:text-red' onClick={() => { imageEvidenceOnClick(observation.imageEvidence, observation.fieldName) }}></EyeIcon>} */}
                      </div>
                    </div>
                    <div className='py-1 w-[60%] grid items-center border-l-[1px] border-black'>
                      <p className='py-1 px-2 font-semibold w-1/3'>{observation.message}</p>
                    </div>
                    <div className='w-[15%] flex text-center border-l-[1px] border-black'>
                      <p className='py-1 w-[50%]'>{observation.status.toUpperCase() === 'PENDIENTE' && 'x'}</p>
                      <p className='py-1 w-[50%] border-l-[1px] border-black'>{observation.status.toUpperCase() === 'LEVANTADO' && 'x'}</p>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>
        {/* <div className='mt-3'>
          {
            checkpoints.map((checkpoint, index) => {
              return (
                <div key={checkpoint.id} className='my-2 shadow-card p-4 transition-all rounded-xl'>
                  <h3 className='uppercase font-bold'>Checkpoint #{index + 1}</h3>
                  <div className='mt-2'>
                    <p className='uppercase'>Creado Por</p>
                    <div className='w-[50%] border-b-2'></div>
                    <p>Nombre: {checkpoint.profile.fullName}</p>
                    <p>Dni: {checkpoint.profile.dni}</p>
                  </div>
                  <div className='mt-2'>
                    <p>Observaciones</p>
                    <div className='w-[50%] border-b-2'></div>
                    <div className='flex gap-10 flex-wrap'>
                      {
                        checkpoint.observations.map((observation, index) => {
                          return <ObservationDetail observation={observation} key={observation.id} index={index} />
                        })
                      }
                    </div>

                  </div>

                </div>
              )
            })
          }
        </div> */}

      </div>
    </div>

  )
}

export default CheckpointsView
