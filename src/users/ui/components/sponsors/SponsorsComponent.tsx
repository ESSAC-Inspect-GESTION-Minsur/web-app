import React, { type ReactElement, useEffect, useState, useContext } from 'react'

import { useArrayReducer } from '@/shared/hooks/useArrayReducer'
import { SponsorsService } from '@/users/services/sponsor.service'
import { type Sponsor } from '@/users/models/sponsor.interface'

import { SponsorContext } from '../../contexts/SponsorContext'
import SponsorsDetail from './SponsorsDetail'
import { ProjectContext } from '../../contexts/ProjectContext'
import SponsorFormModal from './SponsorForm'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import Button from '@/shared/ui/components/Button'
import Divider from '@/shared/ui/components/Divider'

const SponsorsComponent = (): ReactElement => {
  const { selectedProject } = useContext(ProjectContext)
  const [sponsors, setSponsors, addSponsor, updateSponsor] = useArrayReducer<Sponsor>(selectedProject?.sponsors ?? [])

  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null)
  const [sponsorForm, setSponsorForm] = useState<Sponsor | null>(null)

  const [showForm, toggleShowForm] = useBooleanState()

  useEffect(() => {
    if (selectedProject === null) return

    const sponsorsService = new SponsorsService()
    void sponsorsService.findAll(selectedProject.id)
      .then((response) => {
        setSponsors(response)
      })
  }, [selectedProject])

  return (
    <SponsorContext.Provider value={{
      sponsors,
      addSponsor,
      updateSponsor,
      sponsorForm,
      selectedSponsor,
      setSponsorForm,
      setSelectedSponsor
    }}>
      <section className='p-3'>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl font-bold uppercase'>Sponsors del proyecto {selectedProject?.name}</h2>
          <Button color='primary' onClick={toggleShowForm}>Crear Sponsor</Button>
        </div>
        <Divider></Divider>
        <SponsorsDetail toggleShowForm={toggleShowForm}/>
      </section>

      <SponsorFormModal isOpen={showForm} onClose={toggleShowForm}/>
    </SponsorContext.Provider>
  )
}

export default SponsorsComponent
