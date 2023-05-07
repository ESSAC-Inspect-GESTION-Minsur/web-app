import React, { type ReactElement, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Button from '@/shared/ui/components/Button'
import { ProfilesService } from '@/profiles/services/profile.service'
import { type Company } from '@/profiles/models/company.interface'
import { CompaniesService } from '@/profiles/services/company.service'
import { UserContext } from '../contexts/UserContext'
import { PROFILE_INITIAL_STATE } from '@/profiles/models/profile.interface'
import { USER_INITIAL_STATE } from '@/users/models/user.interface'

interface AssignCompanyProps {
  onClose: () => void
}

const AssignCompany = ({ onClose }: AssignCompanyProps): ReactElement => {
  const { selectedUser, setSelectedUser, updateUser, toastId } = useContext(UserContext)

  const profile = selectedUser?.profile ?? PROFILE_INITIAL_STATE

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
    const profileService = new ProfilesService()

    profileService.assignCompany(profile?.id, selectedCompany)
      .then((response) => {
        updateUser({ ...selectedUser ?? USER_INITIAL_STATE, profile: response })
        setSelectedUser({ ...selectedUser ?? USER_INITIAL_STATE, profile: response })
        toast('Empresa agregada correctamente', { toastId, type: 'success' })
        onClose()
      })
      .catch((error) => {
        console.log(error)
        toast('Hubo un error, intente más tarde', { toastId, type: 'error' })
        onClose()
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
              <p className='text-center uppercase text-xl'><span className='font-bold'>Usuario seleccionado:</span> {profile.name}</p>
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
                <Button color='secondary' onClick={onClose}>Cancelar</Button>
                <Button color='primary' type='submit'>Agregar</Button>
              </div>
            </form>
          </>

            )
          : (
            <div className='flex flex-col justify-center items-center'>
              <p className='text-center uppercase text-xl'>No hay empresas disponibles</p>
              <Button color='secondary' onClick={onClose}>Cerrar</Button>
            </div>
            )
      }

    </div >
  )
}

export default AssignCompany
