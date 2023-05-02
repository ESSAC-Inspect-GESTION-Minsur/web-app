import React, { useContext, type ReactElement, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Input from '@/shared/ui/components/Input'
import Button from '@/shared/ui/components/Button'
import { type CompanyDto, INITIAL_STATE_COMPANY_DTO } from '@/profiles/models/company.interface'
import { CompanyContext } from '../context'
import { CompaniesService } from '@/profiles/services/company.service'

type FormAction = 'add' | 'update'

const CompanyForm = (): ReactElement => {
  const { companyForm, setCompanyForm, addCompany, updateCompany, toastId } = useContext(CompanyContext)

  const [data, setData] = useState<CompanyDto>(INITIAL_STATE_COMPANY_DTO)
  const [formAction, setFormAction] = useState<FormAction>('add')

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  useEffect(() => {
    if (companyForm === null) {
      setFormAction('add')
      return
    }

    const { name, ruc } = companyForm
    setFormAction('update')

    setData({
      name,
      ruc
    })
  }, [companyForm])

  const setValue = (name: string, value: string): void => {
    setData({ ...data, [name]: value })
  }

  const handleCancel = (): void => {
    setCompanyForm(null)
    setData(INITIAL_STATE_COMPANY_DTO)
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setIsSubmitting(true)
    const companiesService = new CompaniesService()
    const submitAction = formAction === 'add' ? companiesService.create : companiesService.update
    const onFinishAction = formAction === 'add' ? addCompany : updateCompany
    const id = companyForm?.id ?? ''

    void submitAction(data, id)
      .then((response) => {
        setCompanyForm(null)
        setData(INITIAL_STATE_COMPANY_DTO)
        onFinishAction(response)
        toast(`Equipo ${formAction === 'add' ? 'añadido' : 'actualizado'} correctamente`, { toastId, type: 'success' })
      })
      .catch(error => {
        console.log(error)
        const { message } = error.data
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
        <div className='flex flex-col gap-1'>
          <label>Nombre</label>
          <Input
            name='nombre'
            placeholder='Ingresa nombre'
            value={data.name}
            setValue={(value) => { setValue('name', value) }}
            type='text'
          />
        </div>

        <div className='flex flex-col gap-1 mt-2'>
          <label>Ruc</label>
          <Input
            name='ruc'
            placeholder='Ingresa el ruc'
            value={data.ruc}
            setValue={(value) => { setValue('ruc', value) }}
            type='text'
          />
        </div>

        <div className='mt-3 flex gap-3 justify-end'>
          <Button color='primary' type='submit' isLoading={isSubmitting}>{formAction === 'add' ? 'Añadir' : 'Editar'}</Button>
          {data !== INITIAL_STATE_COMPANY_DTO && <Button color='secondary' onClick={handleCancel}>Cancelar</Button>}
        </div>
      </form>
    </div>

  )
}

export default CompanyForm
