import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { type Material, type MaterialDto } from '@/routes/models/material.interface'
import { MaterialsService } from '@/routes/services/materials.service'
import Button from '@/shared/ui/components/Button'
import Input from '@/shared/ui/components/Input'
import Modal from '@/shared/ui/components/Modal'
import { MaterialToastContext } from '../../pages/MaterialsView'

type FormAction = 'add' | 'update'

interface MaterialFormProps {
  material: Material | null
  formAction: FormAction
  onFinishSubmit: (material: Material) => void
  close: () => void
}

const INITIAL_STATE = {
  name: ''
}

const getInitialState = (material: Material | null): MaterialDto => {
  if (material === null) return INITIAL_STATE
  const { id, createdAt, updatedAt, active, ...materialDto } = material
  return materialDto
}

const MaterialForm = ({ material, formAction, onFinishSubmit, close }: MaterialFormProps): ReactElement => {
  const materialToastContext = useContext(MaterialToastContext)
  const materialsService = new MaterialsService()
  const [inputValue, setInputValue] = useState<MaterialDto>(getInitialState(material))

  const [canSubmit, setCanSubmit] = useState<boolean>(false)

  useEffect(() => {
    setInputValue(getInitialState(material))
  }, [material])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    if (formAction === 'update') {
      const id = material ? material.id : ''
      void materialsService.update(id, inputValue)
        .then(response => {
          onFinishSubmit(response)
          close()
          toast('Tipo de material guardado correctamente', { toastId: materialToastContext.id, type: 'success' })
        })
        .catch((error) => {
          const { message } = error.data
          toast(message, { toastId: materialToastContext.id, type: 'error' })
        })

      return
    }

    void materialsService.create(inputValue)
      .then(response => {
        onFinishSubmit(response)
        close()
        toast('Tipo de material creado correctamente', { toastId: materialToastContext.id, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId: materialToastContext.id, type: 'error' })
      })
  }

  const setIsValidInput = (valid: boolean): void => {
    setCanSubmit(valid)
  }

  return (
    <Modal>
      <div className='min-w-[300px] sm:min-w-[600px] p-6'>
        <div className='mt-3'>
          <h2 className='uppercase font-bold'>{formAction === 'add' ? 'Añadir' : 'Editar'} Tipo de Material</h2>
          <form onSubmit={handleSubmit}>
            <Input
              value={inputValue.name}
              name='name' placeholder='Nombre del área' type='text'
              setValid={setIsValidInput}
              setValue={(value) => { setInputValue({ ...inputValue, name: value }) }}></Input>

            <div className='mt-3 flex items-center gap-3'>
              <Button className='py-1' color='primary' type='submit' disabled={!canSubmit}>{formAction === 'add' ? 'Añadir' : 'Guardar'}</Button>
              <Button className='py-1' color='secondary' onClick={close}>Cancelar</Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>

  )
}

export default MaterialForm
