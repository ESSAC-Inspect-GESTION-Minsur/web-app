import React, { type ReactElement, useState, useEffect, useMemo } from 'react'
import Toast from '@/shared/ui/components/Toast'
import Button from '@/shared/ui/components/Button'
import { useArrayReducer } from '@/shared/hooks/useArrayReducer'
import { type VehicleType } from '@/vehicles/models/vehicle-type.interface'
import { VehicleTypesService } from '@/vehicles/services/vehicle-types.service'
import { VehicleTypeContext } from '../contexts/VehicleTypeContext'
import Divider from '@/shared/ui/components/Divider'
import VehicleTypeList from '../components/VehicleTypeList'
import VehicleTypeForm from '../components/VehicleTypeForm'
import VehicleTypeMaterials from '../components/VehicleTypeMaterials'
import VehicleTypeSubTypes from '../components/VehicleTypeSubtypes'

const TOAST_ID = 'vehicle-types'

export type VehicleTypeTab = 'materials' | 'subtypes'

const VehicleTypesView = (): ReactElement => {
  const [vehicleTypes, setVehicleTypes, addVehicleType, updateVehicleType, removeVehicleType] = useArrayReducer<VehicleType>([])
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
        setVehicleTypes(response)
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

  const vehicleTypesNoCart = useMemo(() => vehicleTypes.filter(vehicleType => !vehicleType.isCart), [vehicleTypes])
  const vehicleTypesCart = useMemo(() => vehicleTypes.filter(vehicleType => vehicleType.isCart), [vehicleTypes])

  return (
    <VehicleTypeContext.Provider
      value={{
        toastId: TOAST_ID,
        vehicleTypes,
        addVehicleType,
        updateVehicleType,
        removeVehicleType,
        selectedVehicleType,
        setSelectedVehicleType,
        vehicleTypeTab,
        vehicleTypeForm,
        setVehicleTypeForm
      }}>

      <div className='flex justify-between items-center'>
        <h1 className='text-2xl uppercase font-semibold'>Tipo de Vehículos</h1>
        <div className='flex gap-3'>
          <Button color={vehicleTypeTab === 'materials' ? 'primary' : 'secondary'} onClick={() => { setVehicleTypeTab('materials') }}>Materiales</Button>
          {!selectedVehicleType?.isCart && <Button color={vehicleTypeTab === 'subtypes' ? 'primary' : 'secondary'} onClick={() => { setVehicleTypeTab('subtypes') }}>Carretas</Button>}
        </div>
      </div>
      <Divider></Divider>

      <div className='md:grid md:grid-cols-table md:gap-12'>
        <div className='mb-5 sm:mb-0'>
          <VehicleTypeList name='Vehículos' vehicleTypes={vehicleTypesNoCart} />
          <VehicleTypeList name='Carretas' vehicleTypes={vehicleTypesCart} />
          <section className='mt-5'>
            <VehicleTypeForm />
          </section>
        </div>
        <div>
          {
            vehicleTypeTab === 'materials'
              ? <VehicleTypeMaterials />
              : <VehicleTypeSubTypes />
          }
        </div>
      </div>
      <Toast id={TOAST_ID}></Toast>

    </VehicleTypeContext.Provider>

  )
}

export default VehicleTypesView
