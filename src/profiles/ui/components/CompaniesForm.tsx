import React, { useContext, type ReactElement, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Input from '@/shared/ui/components/Input'
import Button from '@/shared/ui/components/Button'
import { type CompanyDto, INITIAL_STATE_COMPANY_DTO } from '@/profiles/models/company.interface'
import { CompaniesService } from '@/profiles/services/company.service'
import { CompanyContext } from '../contexts/CompanyContext'
import { useDataForm } from '@/shared/hooks/useDataForm'

type FormAction = 'add' | 'update'

const CompanyForm = (): ReactElement => {
  const { companyForm, setCompanyForm, addCompany, updateCompany, toastId } = useContext(CompanyContext)

  const [company, setCompanyValue, setCompany] = useDataForm<CompanyDto>(INITIAL_STATE_COMPANY_DTO)
  const [formAction, setFormAction] = useState<FormAction>('add')

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  useEffect(() => {
    if (companyForm === null) {
      setFormAction('add')
      return
    }

    const { name, ruc } = companyForm
    setFormAction('update')

    setCompany({
      name,
      ruc
    })
  }, [companyForm])

  const handleCancel = (): void => {
    setCompanyForm(null)
    setCompany(INITIAL_STATE_COMPANY_DTO)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setIsSubmitting(true)
    const companiesService = new CompaniesService()
    const submitAction = formAction === 'add' ? companiesService.create : companiesService.update
    const onFinishAction = formAction === 'add' ? addCompany : updateCompany
    const id = companyForm?.id ?? ''

    void submitAction(company, id)
      .then((response) => {
        setCompanyForm(null)
        setCompany(INITIAL_STATE_COMPANY_DTO)
        onFinishAction(response)
        toast(`Equipo ${formAction === 'add' ? 'añadido' : 'actualizado'} correctamente`, { toastId, type: 'success' })
      })
      .catch(error => {
        console.log(error)
        const { message } = error.company
        const errorMessage = typeof message === 'object' ? message.join(' ') : message
        toast(errorMessage, { toastId, type: 'error' })
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
            value={company.name}
            setValue={setCompanyValue}
            type='text'
          />

          <Input
          label='RUC'
            name='ruc'
            placeholder='Ingresa el ruc'
            value={company.ruc}
            setValue={setCompanyValue}
            type='text'
          />

        <div className='mt-3 flex gap-3 justify-end'>
          <Button color='primary' type='submit' isLoading={isSubmitting}>{formAction === 'add' ? 'Añadir' : 'Editar'}</Button>
          {company !== INITIAL_STATE_COMPANY_DTO && <Button color='secondary' onClick={handleCancel}>Cancelar</Button>}
        </div>
      </form>
    </div>

  )
}

export default CompanyForm
