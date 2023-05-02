import Toast from '@/shared/ui/components/Toast'
import React, { type ReactElement } from 'react'
import MaterialsComponent from '../components/materials/MaterialsComponent'

const TOAST_ID = 'materials'
export const MaterialToastContext = React.createContext({ id: '' })

const MaterialsView = (): ReactElement => {
  return (
    <MaterialToastContext.Provider value={{ id: TOAST_ID }}>
      <div className='container-page'>
        <h1 className='text-3xl mb-4 after:h-px after:w-52 after:bg-gray-light after:block after:mt-1'>Tipo de Materiales</h1>
        <div className='mb-5 sm:mb-0'>
          <MaterialsComponent />
        </div>
        <Toast id={TOAST_ID}></Toast>
      </div>
    </MaterialToastContext.Provider>
  )
}

export default MaterialsView
