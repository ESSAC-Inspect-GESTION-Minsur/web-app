import React, { useContext, type ReactElement, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Input from '@/shared/ui/components/Input'
import { type FormAction } from '@/shared/types'
import Button from '@/shared/ui/components/Button'

import { SPONSOR_DTO_INITIAL_STATE, type SponsorDto } from '@/users/models/sponsor.interface'
import { SponsorsService } from '@/users/services/sponsor.service'
import { SponsorContext } from '../../contexts/SponsorContext'
import { useDataForm } from '@/shared/hooks/useDataForm'
import Modal from '@/shared/ui/components/Modal'
import { ProjectContext } from '../../contexts/ProjectContext'

interface SponsorFormModalProps {
  isOpen: boolean
  onClose: () => void
}

const SponsorFormModal = ({ isOpen, onClose }: SponsorFormModalProps): ReactElement => {
  const { selectedProject, toastId } = useContext(ProjectContext)
  const { sponsorForm, setSponsorForm, addSponsor, updateSponsor } = useContext(SponsorContext)

  const [sponsor, setSponsorValue, setSponsor, reset] = useDataForm<SponsorDto>(SPONSOR_DTO_INITIAL_STATE)
  const [formAction, setFormAction] = useState<FormAction>('add')

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  useEffect(() => {
    if (sponsorForm === null) {
      setFormAction('add')
      return
    }

    const { name } = sponsorForm
    setFormAction('update')

    setSponsor({
      name,
      projectId: ''
    })
  }, [sponsorForm])

  const handleCancel = (): void => {
    setSponsorForm(null)
    reset()
    onClose()
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setIsSubmitting(true)
    const sponsorsService = new SponsorsService()

    const submitAction = formAction === 'add' ? sponsorsService.create : sponsorsService.update
    const onSuccess = formAction === 'add' ? addSponsor : updateSponsor
    const id = sponsorForm?.id ?? ''

    sponsor.projectId = selectedProject?.id ?? ''

    void submitAction(sponsor, id)
      .then((response) => {
        setSponsorForm(null)
        onSuccess(response)
        reset()
        onClose()
        toast(`Sponsor ${formAction === 'add' ? 'añadido' : 'guardado'} correctamente`, { toastId, type: 'success' })
      })
      .catch(error => {
        console.log(error)
        const { message } = error.data
        toast(message, { toastId, type: 'success' })
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className='uppercase font-bold mb-3'>{formAction === 'add' ? 'Añadir' : 'Editar'} Sponsor</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label='Nombre'
          name='name'
          placeholder='Ej: Administración'
          value={sponsor.name}
          setValue={setSponsorValue}
          type='text'
        />
        <div className='mt-3 flex gap-3'>
          <Button color='primary' type='submit' isLoading={isSubmitting}>{formAction === 'add' ? 'Añadir' : 'Guardar'}</Button>
          {sponsor !== SPONSOR_DTO_INITIAL_STATE && <Button color='secondary' onClick={handleCancel}>Cancelar</Button>}
        </div>
      </form>
    </Modal>

  )
}

export default SponsorFormModal
