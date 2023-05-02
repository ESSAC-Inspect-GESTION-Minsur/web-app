import { FieldType } from '@/reports/models/enums/field-type.enum'
import { type Field } from '@/reports/models/field.entity'
import { FieldsService } from '@/reports/services/field.service'
import Button from '@/shared/ui/components/Button'
import Input from '@/shared/ui/components/Input'
import React, { type ReactElement, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

type FormAction = 'add' | 'update'

interface FieldFormProps {
  toastId: string
  field: Field
  formAction: FormAction
  onFinishSubmit: (fields: Field) => void
  reset: () => void
}

const FieldForm = ({ field, toastId, formAction, onFinishSubmit, reset }: FieldFormProps): ReactElement => {
  const [inputValue, setInputValue] = useState<Field>(field)
  const fieldsService = new FieldsService()

  const fieldTypes = Object.values(FieldType)

  const [canSubmit, setCanSubmit] = useState<boolean>(false)
  const [validInputs, setValidInputs] = useState({
    name: false,
    placeholder: true
  })
  const [resetInputs, setResetInputs] = useState<boolean>(false)

  useEffect(() => {
    setInputValue(field)
  }, [field])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    const { id, values, createdAt, updatedAt, ...newField } = inputValue

    if (formAction === 'update') {
      void fieldsService.update(id, newField)
        .then(response => {
          resetForm()
          onFinishSubmit(response)
          toast('Campo actualizado correctamente', { toastId, type: 'success' })
        })
        .catch((error) => {
          const { message } = error.data
          toast(message, { toastId, type: 'error' })
        })
      return
    }

    void fieldsService.create(newField)
      .then(response => {
        resetForm()
        onFinishSubmit(response)
        toast('Campo creado correctamente', { toastId, type: 'success' })
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { name, value } = event.target

    if (value !== 'text') {
      inputValue.placeholder = ''
      setIsValidInput('placeholder', true)
    }

    setInputValue({
      ...inputValue,
      [name]: value
    })
  }

  const resetForm = (): void => {
    reset()
    setResetInputs(!resetInputs)
    setInputValue(field)
  }

  useEffect(() => {
    setCanSubmit(Object.values(validInputs).every(v => v))
  }, [validInputs])

  const setIsValidInput = (name: string, valid: boolean): void => {
    // setCanSubmit(valid)
    setValidInputs({
      ...validInputs,
      [name]: valid
    })
  }

  const setValueInputValue = (name: string, value: string): void => {
    setInputValue({
      ...inputValue,
      [name]: value
    })
  }

  return (
    <div className='mt-5'>
      <h2 className='uppercase font-bold'>{formAction === 'add' ? 'Añadir' : 'Editar'} Campo</h2>
      <form onSubmit={handleSubmit}>
        <Input
          value={inputValue.name}
          name='field name' placeholder='Nombre del campo' type='text'
          setValid={(valid) => { setIsValidInput('name', valid) }}
          reset={resetInputs}
          setValue={(value) => { setValueInputValue('name', value) }}></Input>

        <div className='mt-2'>
          <p className='font-bold text-sm'>Selecciona el tipo de campo</p>
          <select
            className='block w-full h-10 px-2 border-b border-solid border-blue-dark outline-none capitalize'
            name="type" value={inputValue.type} onChange={handleChange}>
            {
              fieldTypes.map(fieldType => {
                return (
                  <option key={fieldType} value={fieldType} className='capitalize'>{fieldType}</option>
                )
              })
            }
          </select>
        </div>

        {

          inputValue.type === FieldType.TEXT && (
            <div className='mt-2'>
              <Input
                value={inputValue.placeholder}
                required={false}
                name='placeholder' placeholder='Descripción del campo' type='text'
                setValid={(valid) => { setIsValidInput('placeholder', valid) }}
                reset={resetInputs}
                setValue={(value) => { setValueInputValue('placeholder', value) }}></Input>
            </div>
          )
        }

        <div className='mt-4 flex gap-3'>
          <Button color='primary' type='submit' disabled={!canSubmit}>{formAction === 'add' ? 'Añadir' : 'Guardar'}</Button>
          <Button color='secondary' onClick={resetForm}>Cancelar</Button>
        </div>

      </form>
    </div>
  )
}

export default FieldForm
