import React, { type ReactElement } from 'react'
import { type Route } from '@/routes/models/route.interface'
import Table, { type Action, type Column } from '@/shared/ui/components/table/Table'
import Button from '@/shared/ui/components/Button'
import { useNavigate } from 'react-router-dom'
import { formatDate } from '@/shared/utils'
import { goToGoogleMapsPage } from '@/routes/utils/maps-utils'

interface RoutesTableProps {
  routes: Route[]
  showFilter: boolean
  setRoutesFiltered: (routes: Route[]) => void
}

const RoutesTable = ({ routes, showFilter, setRoutesFiltered }: RoutesTableProps): ReactElement => {
  const navigate = useNavigate()

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
    // {
    //   id: 'checkpoints',
    //   columnName: 'Supervisiones',
    //   filterFunc: (route) => route.reports[0].checkpoints.length.toString(),
    //   render: (route) => route.reports[0].checkpoints.length.toString(),
    //   sortFunc: (a, b) => a.reports[0].checkpoints.length > b.reports[0].checkpoints.length ? 1 : -1
    // },
    // {
    //   id: 'supervisors',
    //   columnName: 'Supervisores',
    //   filterFunc: (route) => route.reports[0].checkpoints.map(checkpoint => checkpoint.profile.name).join(' '),
    //   render: (route) => {
    //     const checkpoints = route.reports[0].checkpoints

    //     if (checkpoints.length <= 0) {
    //       return 'No hay superviciones'
    //     }

    //     const filteredArray = checkpoints.filter(
    //       (obj, index, self) => index === self.findIndex((o) => o.id === obj.id || o.profile.id === obj.profile.id)
    //     )

    //     return (
    //       <select className='block w-full h-10 px-2 rounded-t-md border-b border-solid border-blue-dark outline-none capitalize'>
    //         {
    //           ...filteredArray.map(({ profile }) => (
    //             <option key={profile.id}>{profile.name}</option>
    //           ))
    //         }
    //       </select>
    //     )
    //   }
    // },
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
    <main>
      {
        routes.length > 0
          ? <Table setDataFiltered={setRoutesFiltered} columns={ROUTE_COLUMNS} data={routes} pagination={PAGINATION} showFilter={showFilter} actions={ROUTE_ACTIONS} />
          : <p className='text-center uppercase font-semibold text-red mt-10'>No hay recorridos en ese rango de fecha</p>
      }
    </main>
  )
}

export default RoutesTable
