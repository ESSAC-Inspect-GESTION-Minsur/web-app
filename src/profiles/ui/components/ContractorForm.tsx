import React, { useContext, type ReactElement, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Input from '@/shared/ui/components/Input'
import Button from '@/shared/ui/components/Button'
import { type ContractorDto, CONTRACTOR_DTO_INITIAL_STATE } from '@/profiles/models/contractor.interface'
import { ContractorsService } from '@/profiles/services/contractor.service'
import { ContractorContext } from '../contexts/ContractorContext'
import { useDataForm } from '@/shared/hooks/useDataForm'

type FormAction = 'add' | 'update'

const ContractorForm = (): ReactElement => {
  const { contractorForm, setContractorForm, addContractor, updateContractor, toastId } = useContext(ContractorContext)

  const [contractor, setContractorValue, setContractor] = useDataForm<ContractorDto>(CONTRACTOR_DTO_INITIAL_STATE)
  const [formAction, setFormAction] = useState<FormAction>('add')

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  useEffect(() => {
    if (contractorForm === null) {
      setFormAction('add')
      return
    }

    const { name, ruc } = contractorForm
    setFormAction('update')

    setContractor({
      name,
      ruc
    })
  }, [contractorForm])

  const handleCancel = (): void => {
    setContractorForm(null)
    setContractor(CONTRACTOR_DTO_INITIAL_STATE)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setIsSubmitting(true)
    const contractorsService = new ContractorsService()
    const submitAction = formAction === 'add' ? contractorsService.create : contractorsService.update
    const onFinishAction = formAction === 'add' ? addContractor : updateContractor
    const id = contractorForm?.id ?? ''

    void submitAction(contractor, id)
      .then((response) => {
        setContractorForm(null)
        setContractor(CONTRACTOR_DTO_INITIAL_STATE)
        onFinishAction(response)
        toast(`Empresa ${formAction === 'add' ? 'añadido' : 'actualizado'} correctamente`, { toastId, type: 'success' })
      })
      .catch(error => {
        const { message } = error.data
        const errors = typeof message === 'object' ? Object.values(message).join(',') : message
        toast(errors, { toastId, type: 'error' })
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <div className='shadow-card p-5 rounded-md'>
      <form onSubmit={handleSubmit}>

        <Input
          label='Nombre'
          name='name'
          placeholder='Ingresa nombre'
          value={contractor.name}
          setValue={setContractorValue}
          type='text'
        />

        <Input
          label='Ruc'
          name='ruc'
          placeholder='Ingresa ruc'
          value={contractor.ruc}
          setValue={setContractorValue}
          type='text'
        />

        <div className='mt-3 flex gap-3 justify-end'>
          <Button color='primary' type='submit' isLoading={isSubmitting}>{formAction === 'add' ? 'Añadir' : 'Editar'}</Button>
          {contractor !== CONTRACTOR_DTO_INITIAL_STATE && <Button color='secondary' onClick={handleCancel}>Cancelar</Button>}
        </div>
      </form>
    </div>

  )
}

export default ContractorForm
