import React, { type ReactElement, useState } from 'react'
import { type Observation } from '@/reports/models/observation.interface'
import EyeIcon from '@/shared/ui/assets/icons/EyeIcon'
import { Transition } from '@headlessui/react'
import ShowImageEvidence from './ShowImageEvidence'

interface ObservationDetailProps {
  observation: Observation
  index: number
}

const ObservationDetail = ({ observation, index }: ObservationDetailProps): ReactElement => {
  const [showImage, setShowImage] = useState<boolean>(false)
  const [openImage, setOpenImage] = useState<boolean>(false)

  const onEyeIconClick = (): void => {
    setShowImage(!showImage)
  }

  return (
    <div className='my-2 w-[250px]'>
      <div className='flex gap-3 items-center'>
        <p className='uppercase font-semibold'>Observación #{index + 1}</p>
        {observation.imageEvidence !== '' && <EyeIcon className={`w-6 h-6 cursor-pointer ${showImage ? 'text-red' : ''}`}onClick={onEyeIconClick}></EyeIcon>}
      </div>
      <div className='flex gap-3'>
        <p className='font-semibold'>Campo</p>
        <p>: {observation.fieldName}</p>
      </div>
      <div className='flex gap-3'>
        <p className='font-semibold'>Observación</p>
        <p>: {observation.message}</p>
      </div>

      <Transition
        show={showImage}
        enter="transition-all ease duration-300 transform"
        enterFrom="opacity-0 scale-y-0"
        enterTo="opacity-100"
        leave="transition-all ease duration-300 transform"
        leaveFrom="opacity-100"
        leaveTo="opacity-0 scale-y-0"
      >
        <div className='my-3'>
          {
            observation.imageEvidence !== '' && (
              <div className='h-[250px] w-[250px] overflow-hidden rounded-md'>
                <img className='object-cover cursor-pointer' src={`${observation.imageEvidence}`} alt="" onClick={() => { setOpenImage(true) }}/>
              </div>
            )
          }
        </div>
      </Transition>

      { openImage && <ShowImageEvidence imageUrl={observation.imageEvidence} name={observation.fieldName} close={() => { setOpenImage(false) }}/>}
    </div>
  )
}

export default ObservationDetail
