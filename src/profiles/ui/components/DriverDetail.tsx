import Button from '@/shared/ui/components/Button'
import Divider from '@/shared/ui/components/Divider'
import React, { useContext, type ReactElement } from 'react'
import { DriverContext } from '../contexts/DriverContext'
import { isDate } from '@/shared/utils'

interface DriverDetailProps {
  toggleForm: () => void
  toggleAssignCompanyModal: () => void
}

const DriverDetail = ({ toggleForm, toggleAssignCompanyModal }: DriverDetailProps): ReactElement => {
  const { selectedDriver, setDriverForm } = useContext(DriverContext)

  if (!selectedDriver) {
    return (<p>No se ha seleccionado un conductor</p>)
  }

  const formatLicenseExpiration = (): string => {
    const licenseExpiration = selectedDriver.licenseExpiration ?? 'No registrado'
    if (!isDate(licenseExpiration)) return 'No registrado'

    return new Date(licenseExpiration).toLocaleDateString()
  }

  const handleEdit = (): void => {
    setDriverForm(selectedDriver)
    toggleForm()
  }

  return (
    <section className='shadow-card rounded-md w-[30%] py-3 px-5'>
      <h1 className='text-center font-semibold uppercase text-lg'>Detalle de Conductor</h1>
      <Divider className='mt-1' />
      <div className='capitalize'>
        <p><span className='font-semibold uppercase'>Nombre:</span> {selectedDriver.name}</p>
        <p><span className='font-semibold uppercase'>Apellido:</span> {selectedDriver.lastName}</p>
        <p><span className='font-semibold uppercase'>Dni:</span> {selectedDriver.dni}</p>
        <p><span className='font-semibold uppercase'>Teléfono 1:</span> {selectedDriver.license}</p>
        <p><span className='font-semibold uppercase'>Teléfono 2:</span> {selectedDriver.licenseCategory ?? 'No registrado'}</p>
        <p><span className='font-semibold uppercase'>correo:</span> {formatLicenseExpiration()}</p>
      </div>

      {
        selectedDriver && selectedDriver.companies.length > 0 && (
          <div>
            <p>Empresas:</p>
            <ul className='ml-3'>
              {
                selectedDriver.companies.map(company => (
                  <li className='uppercase' key={company.id}>{company.name}</li>
                ))
              }
            </ul>
          </div>
        )
      }

      <div className='mt-4 flex gap-3 justify-end'>
        <Button color='secondary' onClick={handleEdit}>Editar</Button>
        <Button color='secondary' onClick={toggleAssignCompanyModal}>Asignar Empresa</Button>
      </div>
    </section>
  )
}

export default DriverDetail
