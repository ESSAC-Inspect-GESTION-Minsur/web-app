import React, { useContext, type ReactElement } from 'react'
import { SponsorContext } from '../../contexts/SponsorContext'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import DeleteIcon from '@/shared/ui/assets/icons/DeleteIcon'
import { type Sponsor } from '@/users/models/sponsor.interface'

interface SponsorsDetailProps {
  toggleShowForm: () => void
}

const SponsorsDetail = ({ toggleShowForm }: SponsorsDetailProps): ReactElement => {
  const { sponsors, setSponsorForm, setSelectedSponsor } = useContext(SponsorContext)

  const handleRemove = (): void => {
    console.log('remove')
  }

  const handleUpdate = (sponsor: Sponsor): void => {
    setSponsorForm(sponsor)
    toggleShowForm()
  }

  return (
    <div className='flex gap-2'>
      {
        sponsors.map(sponsor => (
          <div key={sponsor.id}
            onClick={() => { setSelectedSponsor(sponsor) }}
            className='flex flex-col gap-2 bg-black text-white px-6 py-4 rounded-lg text-center items-center justify-center'>
            <p className='px-2 uppercase'>{sponsor.name}</p>
            <div className='flex gap-3 px-2'>
              <EditIcon className='cursor-pointer w-5 h-5' onClick={ () => { handleUpdate(sponsor) }}/>
              <DeleteIcon className='cursor-pointer w-5 h-5' onClick={handleRemove} />
            </div>
          </div>
        ))
      }
      {sponsors.length <= 0 && (<p>No hay sponsors creados</p>)}
    </div>

  )
}

export default SponsorsDetail
