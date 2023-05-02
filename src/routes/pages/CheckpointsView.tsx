import { type Checkpoint } from '@/reports/models/checkpoint.interface'
import { ReportsService } from '@/reports/services/report.service'
import Button from '@/shared/ui/components/Button'
import React, { type ReactElement, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ObservationDetail from '../components/ObservationDetail'
import RoutesServices from '../services/route.services'

const CheckpointsView = (): ReactElement => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const reportsService = new ReportsService()
  const routesService = new RoutesServices()
  const [checkpoints, setCheckpoints] = useState<Checkpoint[]>([])
  const [routeName, setRouteName] = useState<string>('')

  useEffect(() => {
    const reportId = searchParams.get('report-id') ?? ''
    if (reportId === '') return
    void reportsService.findAllCheckpoints(reportId)
      .then(setCheckpoints)

    const routeId = searchParams.get('route-id') ?? ''
    if (routeId === '') return
    void routesService.findById(routeId)
      .then(response => {
        setRouteName(response.name)
      })
  }, [])

  return (
    <div className='container-page'>
      <div className='min-w-[600px] w-full'>
        <div className='flex justify-between items-end'>
          <p className='uppercase text-2xl font-semibold'>Recorrido {routeName}</p>
          <Button color='secondary' onClick={() => { navigate(-1) }}>Volver</Button>
        </div>
        <div className='w-full border-b-2 mt-2'></div>
        <div className='mt-3'>
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
        </div>

      </div>
    </div>

  )
}

export default CheckpointsView
