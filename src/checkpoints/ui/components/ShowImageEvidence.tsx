import React, { type ReactElement, useState } from 'react'
import Button from '@/shared/ui/components/Button'
import Modal from '@/shared/ui/components/Modal'

interface ShowImageEvidenceProps {
  isOpen: boolean
  name: string
  imageUrl: string
  onClose: () => void
}

const ShowImageEvidence = ({ imageUrl, name, isOpen, onClose }: ShowImageEvidenceProps): ReactElement => {
  const [loading, setIsLoading] = useState<boolean>(true)

  return (
    <Modal isOpen={isOpen} onClose={onClose} className='w-[400px] pb-6'>
      <div>
        <div className='flex justify-end'>
          <Button color='secondary' onClick={onClose}>Close</Button>
        </div>
        <p className='text-center uppercase text-xl font-semibold mt-4'>{name}</p>
        <div className={`${loading ? 'block' : 'hidden'}`}>
          <div className="flex justify-center items-center">
            <div className="border-4 border-black rounded-full w-16 h-16 animate-spin"></div>
          </div>
        </div>
        <div className={`${!loading ? 'block' : 'hidden'}`}>
          <div className='w-[80%] mx-auto mt-5'>
            <img src={imageUrl} alt="" onLoad={() => { setIsLoading(false) }} />
          </div>
        </div>

      </div>
    </Modal>
  )
}

export default ShowImageEvidence
