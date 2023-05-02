import React, { type ReactElement, useContext, useState, useEffect } from 'react'
import Button from '@/shared/ui/components/Button'
import { type User } from '@/iam/models/user.model'
import { toast } from 'react-toastify'
import { ToastContext } from '../../pages/UsersView'
import { ProfileService } from '@/profiles/services/profile.service'
import { type Company } from '@/profiles/models/company.interface'
import { CompaniesService } from '@/profiles/services/company.service'

interface AssignCompanyProps {
  user: User
  updateUser: (user: User) => void
  close: () => void
}

const AssignCompany = ({ user, updateUser, close }: AssignCompanyProps): ReactElement => {
  const toastContext = useContext(ToastContext)

  const profile = user.profile

  const [selectedCompany, setSelectedCompany] = useState<string>('')
  const [companies, setCompanies] = useState<Company[]>([])

  useEffect(() => {
    const companiesService = new CompaniesService()
    void companiesService.findAll()
      .then((response) => {
        const profileCompanies = profile?.companies.map((company) => company.id)
        const companiesFiltered = response.filter((company) => !profileCompanies?.includes(company.id))
        setCompanies(companiesFiltered)
        if (companiesFiltered.length > 0) {
          setSelectedCompany(companiesFiltered[0].id)
        }
      })
  }, [])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const profileService = new ProfileService()

    profileService.assignCompany(profile?.id, selectedCompany)
      .then((response) => {
        updateUser({ ...user, profile: response })
        toast('Empresa agregada correctamente', { toastId: toastContext.id, type: 'success' })
        close()
      })
      .catch((error) => {
        console.log(error)
        toast('Hubo un error, intente más tarde', { toastId: toastContext.id, type: 'error' })
        close()
      })
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { value } = event.target

    setSelectedCompany(value)
  }

  const inputClass = 'block w-full h-10 px-2 border-b border-solid border-purple-900 outline-none'

  return (
    <div className='p-6'>
      {
        companies.length > 0
          ? (
          <>
            <div className='mb-4'>
              <p className='text-center uppercase text-xl'><span className='font-bold'>Usuario seleccionado:</span> {user?.profile.name}</p>
            </div>

            <form onSubmit={handleSubmit}>
              <select name="area" onChange={handleChange} className={`${inputClass}`}>
                {
                  companies.map(company => {
                    return (
                      <option key={company.id} value={company.id}>{company.name.toUpperCase()}</option>
                    )
                  })
                }
              </select>

              <div className='flex justify-center gap-5 mt-2'>
                <Button color='secondary' onClick={close}>Cancelar</Button>
                <Button color='primary' type='submit'>Agregar</Button>
              </div>
            </form>
          </>

            )
          : (
            <div className='flex flex-col justify-center items-center'>
              <p className='text-center uppercase text-xl'>No hay empresas disponibles</p>
              <Button color='secondary' onClick={close}>Cerrar</Button>
            </div>
            )
      }

    </div >
  )
}

export default AssignCompany
