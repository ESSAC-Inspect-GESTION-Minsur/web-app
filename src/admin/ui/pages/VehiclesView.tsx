import Toast from '@/shared/ui/components/Toast'
import React, { type ReactElement } from 'react'
import VehicleComponent from '../components/vehicles/VehicleComponent'

const TOAST_ID = 'vehicle-types'
export const VehicleToastContext = React.createContext({ id: '' })

const VehiclesView = (): ReactElement => {
  const [viewOption, setViewOption] = React.useState<number>(1)

  const handleViewOption = (option: number): void => {
    setViewOption(option)
  }

  return (
    <VehicleToastContext.Provider value={{ id: TOAST_ID }}>
      <div className='container-page'>
        <h1 className='text-3xl font-semibold mb-4 after:h-px after:w-72 after:bg-gray-light after:block after:mt-1'>
        { viewOption === 1 ? 'Vehículos y Semirremolques' : viewOption === 2 ? 'Vehículos' : 'Semirremolques' }</h1>
        <div className='mb-5 sm:mb-0'>
          <VehicleComponent viewOption={viewOption} handleViewOption={handleViewOption} />
        </div>
        <Toast id={TOAST_ID}></Toast>
      </div>
    </VehicleToastContext.Provider>

  )
}

export default VehiclesView
