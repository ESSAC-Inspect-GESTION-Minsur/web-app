import React, { useContext, type ReactElement, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Input from '@/shared/ui/components/Input'
import { type FormAction } from '@/shared/types'
import Button from '@/shared/ui/components/Button'

import { AREA_DTO_INITIAL_STATE, type AreaDto } from '@/users/models/area.interface'
import { AreasService } from '@/users/services/area.service'
import { AreaContext } from '../contexts/AreaContext'
import { useDataForm } from '@/shared/hooks/useDataForm'
import { UserContext } from '../contexts/UserContext'

const AreaForm = (): ReactElement => {
  const { toastId } = useContext(UserContext)
  const { areaForm, setAreaForm, addArea, updateArea } = useContext(AreaContext)

  const [area, setAreaValue, setArea, reset] = useDataForm<AreaDto>(AREA_DTO_INITIAL_STATE)
  const [formAction, setFormAction] = useState<FormAction>('add')

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  useEffect(() => {
    if (areaForm === null) {
      setFormAction('add')
      return
    }

    const { name } = areaForm
    setFormAction('update')

    setArea({
      name
    })
  }, [areaForm])

  const handleCancel = (): void => {
    setAreaForm(null)
    reset()
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setIsSubmitting(true)
    const areasService = new AreasService()

    const submitAction = formAction === 'add' ? areasService.create : areasService.update
    const onSuccess = formAction === 'add' ? addArea : updateArea
    const id = areaForm?.id ?? ''

    void submitAction(area, id)
      .then((response) => {
        setAreaForm(null)
        onSuccess(response)
        reset()

        toast(`Area ${formAction === 'add' ? 'añadida' : 'guardada'} correctamente`, { toastId, type: 'success' })
      })
      .catch(error => {
        const { message } = error.data
        toast(message, { toastId, type: 'success' })
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  return (
    <div className='mt-3'>
      <h2 className='uppercase font-bold mb-3'>{formAction === 'add' ? 'Añadir' : 'Editar'} Área</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label='Nombre'
          name='name'
          placeholder='Ej: Administración'
          value={area.name}
          setValue={setAreaValue}
          type='text'
        />
        <div className='mt-3 flex gap-3'>
          <Button color='primary' type='submit' isLoading={isSubmitting}>{formAction === 'add' ? 'Añadir' : 'Guardar'}</Button>
          {area !== AREA_DTO_INITIAL_STATE && <Button color='secondary' onClick={handleCancel}>Cancelar</Button>}
        </div>
      </form>
    </div>

  )
}

export default AreaForm
