import { type Profile } from '@/profiles/models/profile.interface'
import { useArrayReducer } from '@/shared/hooks/useArrayReducer'
import React, { useState, type ReactElement, useEffect } from 'react'
import { DriverContext } from '../contexts/DriverContext'
import { ProfilesService } from '@/profiles/services/profile.service'
import Button from '@/shared/ui/components/Button'
import Divider from '@/shared/ui/components/Divider'
import DriverTable from '../components/DriverTable'
import Toast from '@/shared/ui/components/Toast'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import DriverFormModal from '../components/DriverForm'
import ImportModal from '@/admin/ui/components/ImportModal'
import DriverDetail from '../components/DriverDetail'
import AssignCompanyModal from '../components/AssignCompanyModal'

const TOAST_ID = 'drivers'

const DriversView = (): ReactElement => {
  const [drivers, setDrivers, addDriver, updateDriver, removeDriver] = useArrayReducer<Profile>([])

  const [selectedDriver, setSelectedDriver] = useState<Profile | null>(null)
  const [driverForm, setDriverForm] = useState<Profile | null>(null)

  const [showFormModal, toggleShowFormModal] = useBooleanState()
  const [showImportModal, toggleShowImportModal] = useBooleanState()
  const [showAssignCompanyModal, toggleShowAssignCompanyModal] = useBooleanState()
  const [showImportAssignCompanyModal, toggleShowImportAssignCompanyModal] = useBooleanState()

  useEffect(() => {
    const profilesService = new ProfilesService()
    void profilesService.findAll()
      .then(response => {
        const profiles = response.filter(profile => profile.isDriver)
        setDrivers(profiles)
      })
  }, [])

  const refreshImportedProfiles = (profiles: Profile[]): void => {
    setDrivers([...drivers, ...profiles])
  }

  const refreshImportedProfilesWithCompany = (newProfiles: Profile[]): void => {
    setDrivers(drivers.map(driver => {
      const newProfile = newProfiles.find(newProfile => newProfile.id === driver.id)
      return newProfile ?? driver
    }))
  }
  return (
    <DriverContext.Provider value={{
      drivers,
      addDriver,
      updateDriver,
      removeDriver,
      selectedDriver,
      setSelectedDriver,
      driverForm,
      setDriverForm,
      toastId: TOAST_ID
    }}>

      <div className='container-page'>
        <section className='flex justify-between items-center'>
          <h1 className='text-blue-era uppercase text-2xl font-semibold'>Conductores</h1>
          <div className='flex gap-2'>
            <Button color='primary' onClick={toggleShowFormModal}>Agregar Conductor</Button>
            <Button color='secondary' onClick={toggleShowImportAssignCompanyModal}>Importar Asignar Empresas</Button>
            <Button color='secondary' onClick={toggleShowImportModal}>Importar Excel</Button>
          </div>
        </section>
        <Divider></Divider>
        <div className='flex gap-5 items-start'>

        <main className={selectedDriver !== null ? 'w-[70%]' : 'w-full'}>
          <DriverTable/>
        </main>
        {
          selectedDriver && (
            <DriverDetail toggleForm={toggleShowFormModal} toggleAssignCompanyModal={toggleShowAssignCompanyModal}/>
          )
        }
      </div>

      </div>

      <ImportModal isOpen={showImportModal} onClose={toggleShowImportModal} onSuccess={refreshImportedProfiles} toastId={TOAST_ID} type='profile' />
      <ImportModal isOpen={showImportAssignCompanyModal} onClose={toggleShowImportAssignCompanyModal} onSuccess={refreshImportedProfilesWithCompany} toastId={TOAST_ID} type='assign-driver-company' />
      <DriverFormModal isOpen={showFormModal} onClose={toggleShowFormModal}/>
      <AssignCompanyModal isOpen={showAssignCompanyModal} onClose={toggleShowAssignCompanyModal} />

      <Toast id={TOAST_ID} />

    </DriverContext.Provider>
  )
}

export default DriversView
