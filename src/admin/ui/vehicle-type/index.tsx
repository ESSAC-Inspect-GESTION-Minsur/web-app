import React, { type ReactElement, useState, useEffect } from 'react'
import { type VehicleType } from '@/routes/models/vehicle-type.interface'
import Toast from '@/shared/ui/components/Toast'
import Button from '@/shared/ui/components/Button'
import { useArrayReducer } from '@/shared/hooks/useArrayReducer'

import { VehicleTypesService } from '@/routes/services/vehicle-type.service'

import VehicleTypeComponent from './components/VehicleTypeComponent'
import VehicleTypeMaterialsComponent from './components/VehicleTypeMaterialsComponent'
import VehicleTypeSubTypes from './components/VehicleTypeSubtypes'
import { VehicleTypeContext } from './context'

const TOAST_ID = 'vehicle-types'

export type VehicleTypeTab = 'materials' | 'subtypes'

const VehicleTypesView = (): ReactElement => {
  const [vehicleTypes, set, add, update, remove] = useArrayReducer<VehicleType>([])
  const [selectedVehicleType, setSelectedVehicleType] = useState<VehicleType | null>(null)
  const [vehicleTypeForm, setVehicleTypeForm] = useState<VehicleType | null>(null)
  const [vehicleTypeTab, setVehicleTypeTab] = useState<VehicleTypeTab>('materials')

  useEffect(() => {
    const vehicleTypesService = new VehicleTypesService()
    void vehicleTypesService.findAll()
      .then(response => {
        response.sort((a, b) => {
          const boolDiff = Number(a.isCart) - Number(b.isCart)

          if (boolDiff !== 0) return boolDiff

          return a.name.localeCompare(b.name)
        })
        set(response)
      })
  }, [])

  useEffect(() => {
    if (vehicleTypes.length > 0 && selectedVehicleType === null) setSelectedVehicleType(vehicleTypes[0])
  }, [vehicleTypes])

  useEffect(() => {
    if (selectedVehicleType?.isCart) {
      setVehicleTypeTab('materials')
    }
  }, [selectedVehicleType])

  return (
    <VehicleTypeContext.Provider
      value={{
        toastId: TOAST_ID,
        vehicleTypes,
        add,
        update,
        remove,
        selectedVehicleType,
        setSelectedVehicleType,
        vehicleTypeTab,
        vehicleTypeForm,
        setVehicleTypeForm
      }}>

      <div className='container-page'>
        <div className='flex justify-between items-center'>
          <h1
            className='text-3xl mb-4 after:h-px after:w-52 after:bg-gray-light after:block after:mt-1'
          >
            Tipo de Vehículos
          </h1>
          <div className='flex gap-3'>
            <Button color={vehicleTypeTab === 'materials' ? 'primary' : 'secondary'} onClick={() => { setVehicleTypeTab('materials') }}>Materiales</Button>
            {!selectedVehicleType?.isCart && <Button color={vehicleTypeTab === 'subtypes' ? 'primary' : 'secondary'} onClick={() => { setVehicleTypeTab('subtypes') }}>Carretas</Button>}
          </div>
        </div>

        <div className='md:grid md:grid-cols-table md:gap-12'>
          <div className='mb-5 sm:mb-0'>
            <VehicleTypeComponent />
          </div>
          <div>
            {
              vehicleTypeTab === 'materials'
                ? <VehicleTypeMaterialsComponent />
                : <VehicleTypeSubTypes />
            }
          </div>
        </div>
        <Toast id={TOAST_ID}></Toast>
      </div>
    </VehicleTypeContext.Provider>

  )
}

export default VehicleTypesView
