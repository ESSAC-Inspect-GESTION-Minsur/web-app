import React, { useContext, type ReactElement, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Input from '@/shared/ui/components/Input'
import { type FormAction } from '@/shared/types'
import Button from '@/shared/ui/components/Button'

import { MATERIAL_DTO_INITIAL_STATE, type MaterialDto } from '@/vehicles/models/material.interface'
import { MaterialsService } from '@/vehicles/services/materials.service'
import { MaterialContext } from '../contexts/MaterialContext'
import { useDataForm } from '@/shared/hooks/useDataForm'
import Divider from '@/shared/ui/components/Divider'

const MaterialForm = (): ReactElement => {
  const { materialForm, setMaterialForm, addMaterial, updateMaterial, toastId } = useContext(MaterialContext)

  const [material, setMaterialValue, setMaterial, reset] = useDataForm<MaterialDto>(MATERIAL_DTO_INITIAL_STATE)
  const [formAction, setFormAction] = useState<FormAction>('add')

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  useEffect(() => {
    if (materialForm === null) {
      setFormAction('add')
      reset()
      return
    }

    const { name } = materialForm
    setFormAction('update')

    setMaterial({
      name
    })
  }, [materialForm])

  const handleCancel = (): void => {
    setMaterialForm(null)
    reset()
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setIsSubmitting(true)
    const materialsService = new MaterialsService()
    const submitAction = formAction === 'add' ? materialsService.create : materialsService.update
    const onSuccess = formAction === 'add' ? addMaterial : updateMaterial
    const id = materialForm?.id ?? ''

    void submitAction(material, id)
      .then((material) => {
        setMaterialForm(null)
        reset()
        onSuccess(material)
        toast('Material añadido correctamente', { toastId, type: 'success' })
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
    <div className='shadow-card p-4 rounded-md'>
      <p className='uppercase font-semibold text-lg'>{formAction === 'add' ? 'Añadir' : 'Editar'} Material</p>
      <Divider className='mt-0'></Divider>
      <form onSubmit={handleSubmit}>

        <Input
          label='Nombre'
          name='name'
          placeholder='Ingresa nombre'
          value={material.name}
          setValue={setMaterialValue}
          type='text'
        />

        <div className='mt-3 flex gap-3 justify-end'>
          <Button color='primary' type='submit' isLoading={isSubmitting}>{formAction === 'add' ? 'Añadir' : 'Guardar'}</Button>
          {material !== MATERIAL_DTO_INITIAL_STATE && <Button color='secondary' onClick={handleCancel}>Cancelar</Button>}
        </div>
      </form>
    </div>

  )
}

export default MaterialForm
