import React, { useState, useEffect, type ReactElement } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { findAllRoutes, getDateRange, getLastDateRequest, getRoutes, getStatus } from '@/shared/config/store/features/routes-slice'
import { STATUS } from '@/shared/config/store/types'
import { type AppDispatch } from '@/shared/config/store'

import { type Route } from '../models/route.interface'

import { useNavigate } from 'react-router-dom'
import { DateRange, type DateRangeObject, LOCALE_OPTIONS } from '@/shared/models/date-range'

import Table, { type Action, type Column } from '@/shared/ui/components/table/Table'

import Button from '@/shared/ui/components/Button'
import { goToGoogleMapsPage } from '../utils/maps-utils'

const RoutesView = (): ReactElement => {
  // const routeServices = new RoutesServices()
  const dispatch = useDispatch<AppDispatch>()

  const routes = useSelector(getRoutes)
  const lastDateRequest = useSelector(getLastDateRequest)
  const routeStatus = useSelector(getStatus)
  const dateRangeStore = useSelector(getDateRange)

  const [dateRange, setDateRange] = useState<DateRange>(new DateRange())
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showFilter, setShowFilter] = useState<boolean>(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [errorMessage, setErrorMessage] = useState<string>('')

  const navigate = useNavigate()

  useEffect(() => {
    const routesJson = sessionStorage.getItem('routes-request')
    if (!routesJson) {
      void dispatch(findAllRoutes({ dateRange: new DateRange(), profileId: '' }))
    }
  }, [])

  useEffect(() => {
    setIsLoading(routeStatus === STATUS.PENDING)
  }, [routeStatus])

  const findAll = (): void => {
    void dispatch(findAllRoutes({ dateRange, profileId: '' }))
      .catch(error => {
        const { message } = error.data
        setErrorMessage(message.toUpperCase())
      })
  }

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }

  const onChangeInputDate = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target
    const date = new Date(value)
    date.setHours(date.getHours() + 5)

    const aux: DateRangeObject = {
      'date-start': new Date(dateRange._dateStart).toISOString(),
      'date-end': new Date(dateRange._dateEnd).toISOString()
    }

    aux[name as keyof DateRangeObject] = date.toISOString()

    setDateRange(DateRange.fromJson(aux))
  }

  const ROUTE_COLUMNS: Array<Column<Route>> = [
    {
      id: 'code',
      columnName: 'Código Checklist',
      filterFunc: (route) => route.code,
      render: (route) => route.code,
      sortFunc: (a, b) => a.code > b.code ? 1 : -1
    },
    {
      id: 'name',
      columnName: 'Placa',
      filterFunc: (route) => route.name,
      render: (route) => route.name,
      sortFunc: (a, b) => a.name > b.name ? 1 : -1
    },
    {
      id: 'createdAt',
      columnName: 'Fecha de Creación',
      filterFunc: (route) => formatDate(route.createdAt),
      render: (route) => formatDate(route.createdAt),
      sortFunc: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    },
    {
      id: 'startLocation',
      columnName: 'Ubicación de Inicio',
      filterFunc: (route) => route.startLocation,
      render: (route) => {
        return (
          <p
            className='hover:text-red cursor-pointer'
            onClick={() => { goToGoogleMapsPage(route.startLocation) }}
          >
          {route.startLocation}
          </p>
        )
      },
      sortFunc: (a, b) => a.startLocation > b.startLocation ? 1 : -1
    },
    {
      id: 'endLocation',
      columnName: 'Ubicación de Llegada',
      filterFunc: (route) => route.endLocation ?? 'No terminada',
      render: (route) => {
        if (route.endLocation === null) return 'No terminada'

        return (
          <p
            className='hover:text-red cursor-pointe'
            onClick={() => { goToGoogleMapsPage(route.endLocation) }}
          >
          {route.endLocation}
          </p>
        )
      },
      sortFunc: (a, b) => {
        const endLocationA = a.endLocation ?? 'No terminada'
        const endLocationB = b.endLocation ?? 'No terminada'

        return endLocationA > endLocationB ? 1 : -1
      }
    },
    {
      id: 'reportType',
      columnName: 'Tipo de reporte',
      filterFunc: (route) => route.reports[0].reportType.name,
      render: (route) => route.reports[0].reportType.name,
      sortFunc: (a, b) => a.reports[0].reportType.name > b.reports[0].reportType.name ? 1 : -1
    },
    {
      id: 'checkpoints',
      columnName: 'Supervisiones',
      filterFunc: (route) => route.reports[0].checkpoints.length.toString(),
      render: (route) => route.reports[0].checkpoints.length.toString(),
      sortFunc: (a, b) => a.reports[0].checkpoints.length > b.reports[0].checkpoints.length ? 1 : -1
    },
    {
      id: 'supervisors',
      columnName: 'Supervisores',
      filterFunc: (route) => route.reports[0].checkpoints.map(checkpoint => checkpoint.profile.name).join(' '),
      render: (route) => {
        const checkpoints = route.reports[0].checkpoints

        if (checkpoints.length <= 0) {
          return 'No hay superviciones'
        }

        return (
          <select className='block w-full h-10 px-2 rounded-t-md border-b border-solid border-blue-dark outline-none capitalize'>
            {
              ...checkpoints.map(({ profile }) => (
                <option key={profile.id}>{profile.name}</option>
              ))
            }
          </select>
        )
      }
    },
    {
      id: 'doubleLicensePlate',
      columnName: 'Doble Placa',
      filterFunc: (route) => route.doubleLicensePlate ? 'Sí' : 'No',
      render: (route) => route.doubleLicensePlate ? 'Sí' : 'No',
      sortFunc: (a, b) => {
        const doubleLicensePlateA = a.doubleLicensePlate ? 'Sí' : 'No'
        const doubleLicensePlateB = a.doubleLicensePlate ? 'Sí' : 'No'

        return doubleLicensePlateA > doubleLicensePlateB ? 1 : -1
      }
    },
    {
      id: 'isFull',
      columnName: '¿Va llena?',
      filterFunc: (route) => route.isFull ? 'Si' : 'No',
      render: (route) => route.isFull ? 'Si' : 'No',
      sortFunc: (a, b) => {
        const isFullA = a.isFull ? 'Sí' : 'No'
        const isFullB = a.isFull ? 'Sí' : 'No'

        return isFullA > isFullB ? 1 : -1
      }
    }
  ]

  const PAGINATION = [5, 10, 15, 20]

  const onRowClick = (route: Route): void => {
    navigate(`/detalle-recorrido?id=${route.id}`)
  }

  const ROUTE_ACTIONS: Array<Action<Route>> = [
    {
      icon: () => (
        <Button color='primary'>Ver detalle</Button>
      ),
      actionFunc: onRowClick
    }
  ]

  return (
    <div className='container-page'>
      <div className='mt-4 mb-2 flex justify-between items-center'>
        <h2 className="font-bold text-3x text-left  uppercase text-3xl">Recorridos</h2>
        {routes.length > 0 && <Button color='primary' onClick={() => { setShowFilter(!showFilter) }}>{showFilter ? 'Ocultar filtros' : 'Mostrar filtros'}</Button>}
      </div>
      <div className='w-full border-b-2 mb-3'></div>
      <p className='font-medium uppercase'>Filtro</p>
      <div className='flex gap-7 items-center justify-between mt-2'>
        <div className='flex justify-between w-3/5 gap-5'>
          <div className='w-1/2'>
            <p>Fecha Inicio</p>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              type="date"
              name='date-start'
              value={dateRange.formattedDateStart()}
              onChange={onChangeInputDate}
            />
          </div>
          <div className='w-1/2'>
            <p>Fecha Fin</p>
            <input
              className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              type="date"
              name='date-end'
              value={dateRange.formattedDateEnd()}
              onChange={onChangeInputDate}
            />
          </div>
        </div>

        <div className='flex gap-3 justify-end items-center w-2/5'>
          <div>
            <p className='font-bold'>Fecha de última búsqueda</p>
            <p>{lastDateRequest !== null ? lastDateRequest.toLocaleDateString('es-PE', { ...LOCALE_OPTIONS, hour: '2-digit', minute: '2-digit', hourCycle: 'h12' }) : ''}</p>
            <p className='font-bold'>Rango de fecha solicitada</p>
            <div className='flex gap-2 font-semibold'>
              <p>{dateRangeStore.isoFormattedStringDateStart()}</p>
              <p>A</p>
              <p>{dateRangeStore.isoFormattedStringDateEnd()}</p>
            </div>
          </div>
          <Button color='secondary' onClick={findAll}>Buscar recorridos</Button>
        </div>
      </div>

      <div className='mb-6'></div>

      {
        isLoading
          ? '...loading'
          : routes.length > 0
            ? <Table columns={ROUTE_COLUMNS} data={routes} pagination={PAGINATION} showFilter={showFilter} actions={ROUTE_ACTIONS} />
            : <p className='text-center uppercase font-semibold text-red mt-10'>No hay recorridos en ese rango de fecha</p>
      }

    </div>
  )
}

export default RoutesView
