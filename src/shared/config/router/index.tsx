import React from 'react'
import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import LoginView from '@/iam/ui/pages/LoginView'
import RoutesView from '@/routes/pages/RoutesView'
import Layout from '@/shared/ui/components/Layout'
import NotFound from '@/shared/ui/pages/NotFound'
import Home from '@/shared/ui/pages/Home'
import ErrorPage from '@/shared/ui/pages/ErrorPage'
import UsersView from '@/admin/ui/pages/UsersView'
import ReportsView from '@/admin/ui/pages/ReportsView'
import FieldsView from '@/admin/ui/pages/FieldsView'
import ProfileView from '@/profiles/ui/pages/ProfileView'
import VehicleTypesView from '@/admin/ui/vehicle-type'
import RequiredAdmin from '@/admin/ui/pages/RequiredAdmin'
import RouteDetail from '@/routes/pages/RouteDetail'
import CheckpointsView from '@/routes/pages/CheckpointsView'
import Redirect from '@/shared/ui/components/Redirect'
import TermsAndConditions from '@/shared/ui/pages/TermsAndConditions'
import VehiclesView from '@/admin/ui/pages/VehiclesView'
import MaterialsView from '@/admin/ui/pages/MaterialsView'
import ReportTypeGroupView from '@/admin/ui/report-type-group'
import CompaniesView from '@/admin/ui/companies'

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
    element: <RequiredAdmin />,
    children: [
      {
        path: 'usuarios',
        element: <UsersView />
      },
      {
        path: 'grupos-reportes',
        element: <ReportTypeGroupView />
      },
      {
        path: 'reportes',
        element: <ReportsView/>
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
        element: <VehiclesView />
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
