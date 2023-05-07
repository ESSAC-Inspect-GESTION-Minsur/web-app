import LoginView from '@/auth/ui/pages/LoginView'
import CheckpointsView from '@/checkpoints/ui/pages/CheckpointsView'
import FieldsView from '@/fields/ui/pages/FieldsView'
import CompaniesView from '@/profiles/ui/pages/CompaniesView'
import ProfileView from '@/profiles/ui/pages/ProfileView'
import ReportTypeGroupView from '@/reports/ui/pages/ReportTypeGroupView'
import ReportTypesView from '@/reports/ui/pages/ReportTypesView'
import RouteDetail from '@/routes/ui/pages/RouteDetail'
import RoutesView from '@/routes/ui/pages/RoutesView'
import AdminRequired from '@/shared/ui/components/layout/AdminRequired'
import Layout from '@/shared/ui/components/layout/Layout'
import Redirect from '@/shared/ui/components/layout/Redirect'
import ErrorPage from '@/shared/ui/pages/ErrorPage'
import Home from '@/shared/ui/pages/Home'
import NotFound from '@/shared/ui/pages/NotFound'
import TermsAndConditions from '@/shared/ui/pages/TermsAndConditions'
import UsersView from '@/users/ui/pages/UsersView'
import MaterialsView from '@/vehicles/ui/pages/MaterialsView'
import VehicleTypesView from '@/vehicles/ui/pages/VehicleTypesView'
import VehiclesView from '@/vehicles/ui/pages/VehiclesView'
import React from 'react'
import { createBrowserRouter, type RouteObject } from 'react-router-dom'

const authRequiredRoutes: RouteObject[] = [
  {
    index: true,
    path: '',
    element: <Redirect />
  },
  {
    path: 'inicio',
    element: <Home />
  },
  {
    path: 'recorridos',
    element: <RoutesView />
  },
  {
    path: 'detalle-recorrido',
    element: <RouteDetail />
  },
  {
    path: 'detalle-checkpoints',
    element: <CheckpointsView />
  },
  {
    path: 'admin',
    element: <AdminRequired />,
    children: [
      {
        path: 'usuarios',
        element: <UsersView />
      },
      {
        path: 'reportes',
        element: <ReportTypesView />
      },
      {
        path: 'grupos-reportes',
        element: <ReportTypeGroupView />
      },
      {
        path: 'campos',
        element: <FieldsView />
      },
      {
        path: 'tipo-vehiculos',
        element: <VehicleTypesView />
      },
      {
        path: 'vehiculos',
        element: <VehiclesView areCarts={false} />
      },
      {
        path: 'carretas',
        element: <VehiclesView areCarts={true} />
      },
      {
        path: 'tipo-materiales',
        element: <MaterialsView />
      },
      {
        path: 'empresas',
        element: <CompaniesView />
      }
    ]
  },
  {
    path: 'perfil',
    element: <ProfileView />
  }
]

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginView />
  },
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: authRequiredRoutes
  },
  {
    path: '/terminos-y-condiciones',
    element: <TermsAndConditions />
  },
  {
    path: '*',
    element: <NotFound />
  }
])

export default router
