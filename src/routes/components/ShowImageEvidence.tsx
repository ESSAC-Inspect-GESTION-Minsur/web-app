import React, { type ReactElement, useState } from 'react'
import Button from '@/shared/ui/components/Button'
import Modal from '@/shared/ui/components/Modal'
import Spinner from '@/shared/ui/components/Spinner'

interface ShowImageEvidenceProps {
  name: string
  imageUrl: string
  close: () => void
}

const ShowImageEvidence = ({ imageUrl, name, close }: ShowImageEvidenceProps): ReactElement => {
  const [loading, setIsLoading] = useState<boolean>(true)

  return (
    <Modal>
      <div className='w-[400px] pb-6'>
        <div className='flex justify-end'>
          <Button color='secondary' onClick={close}>Close</Button>
        </div>
        <p className='text-center uppercase text-xl font-semibold mt-4'>{name}</p>
        <div className={`${loading ? 'block' : 'hidden'}`}>
          <Spinner />
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
