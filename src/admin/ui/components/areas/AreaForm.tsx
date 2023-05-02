import { type AreaDto } from '@/admin/models/area-dto.interface'
import { AreasService } from '@/admin/services/areas.service'
import { type Area } from '@/iam/models/user.model'
import Button from '@/shared/ui/components/Button'
import Input from '@/shared/ui/components/Input'
import React, { type ReactElement, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

type FormAction = 'add' | 'update'

interface AreaFormProps {
  toastId: string
  area: Area | null
  formAction: FormAction
  onFinishSubmit: (area: Area) => void
  reset: () => void
}

const INITIAL_STATE = {
  name: ''
}

const getInitialState = (area: Area | null): AreaDto => {
  if (area === null) return INITIAL_STATE
  const { id, createdAt, updatedAt, active, ...areaDto } = area
  return areaDto
}

const AreaForm = ({ area, formAction, toastId, onFinishSubmit, reset }: AreaFormProps): ReactElement => {
  const areasService = new AreasService()
  const [inputValue, setInputValue] = useState<AreaDto>(getInitialState(area))

  const [canSubmit, setCanSubmit] = useState<boolean>(false)
  const [resetInputs, setResetInputs] = useState<boolean>(false)

  useEffect(() => {
    setInputValue(getInitialState(area))
  }, [area])

  const resetForm = (): void => {
    reset()
    setResetInputs(!resetInputs)
    setInputValue(getInitialState(null))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    if (formAction === 'update') {
      const id = area ? area.id : ''
      void areasService.update(id, inputValue)
        .then(response => {
          resetForm()
          onFinishSubmit(response)
          toast('Área guardada correctamente', { toastId, type: 'success' })
        })
        .catch((error) => {
          const { message } = error.data
          toast(message, { toastId, type: 'error' })
        })

      return
    }

    void areasService.create(inputValue)
      .then(response => {
        resetForm()
        onFinishSubmit(response)
        toast('Área creada correctamente', { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  const setIsValidInput = (valid: boolean): void => {
    setCanSubmit(valid)
  }

  return (
    <div className='mt-3'>
      <h2 className='uppercase font-bold'>{formAction === 'add' ? 'Añadir' : 'Editar'} Área</h2>
      <form onSubmit={handleSubmit}>
        <Input
            value={inputValue.name}
            name='name' placeholder='Nombre del área' type='text'
            setValid={setIsValidInput}
            reset={resetInputs}
            setValue={(value) => { setInputValue({ ...inputValue, name: value }) }}></Input>

        <div className='mt-3 flex items-center gap-3'>
          <Button className='py-1' color='primary' type='submit' disabled={!canSubmit}>{formAction === 'add' ? 'Añadir' : 'Guardar'}</Button>
          <Button className='py-1' color='secondary' onClick={resetForm}>Cancelar</Button>
        </div>
      </form>
    </div>
  )
}

export default AreaForm
