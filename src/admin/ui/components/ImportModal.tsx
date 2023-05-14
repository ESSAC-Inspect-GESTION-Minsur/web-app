import React, { type ReactElement, useState } from 'react'
import { AdminService } from '@/admin/services/admin.service'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import { toast } from 'react-toastify'
import Modal from '@/shared/ui/components/Modal'
import Divider from '@/shared/ui/components/Divider'
import Button from '@/shared/ui/components/Button'

type ImportObject = 'profile' | 'vehicle' | 'company' | 'assign-driver-company' | 'assign-vehicle-company' | 'cart'

interface ImportExcelProps {
  isOpen: boolean
  type: ImportObject
  toastId: string
  onSuccess: (data: any) => void
  onClose: () => void
}

const ImportExcel = ({ isOpen, onClose, onSuccess, toastId, type }: ImportExcelProps): ReactElement => {
  const adminService = new AdminService()
  const [file, setFile] = useState<File | null | undefined>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, toggleLoading, setIsLoading] = useBooleanState()

  const reset = (): void => {
    setFile(null)
    setErrors([])
  }

  const handleCancel = (): void => {
    reset()
    onClose()
  }

  const getTitle = (): string => {
    const titles = {
      profile: 'Conductores',
      vehicle: 'Vehículos',
      company: 'Empresas',
      cart: 'Semirremolques',
      'assign-driver-company': 'Asignar conductores a empresas',
      'assign-vehicle-company': 'Asignar vehículos a empresas'
    }

    return titles[type]
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

    if (file === null || file === undefined) {
      setErrors(['No se ha subido ningún archivo'])
      toast('No se ha subido ningún archivo', { toastId, type: 'error' })
      return
    }

    toggleLoading()
    const formData = new FormData()
    formData.append('excel-file', file)

    const importFunctions = {
      profile: adminService.importDriverExcel,
      vehicle: adminService.importVehicleExcel,
      company: adminService.importCompanyExcel,
      cart: adminService.importCartExcel,
      'assign-driver-company': adminService.importAssignUserCompanyExcel,
      'assign-vehicle-company': adminService.importAssignVehicleCompanyExcel
    }
    const importExcelFunction = importFunctions[type]

    void importExcelFunction(formData)
      .then(response => {
        const { data, dataMissed } = response
        onSuccess(data)

        if (dataMissed.length > 0) {
          setErrors(dataMissed)
          toast('Hubo un error al guardar algunas filas', { toastId, type: 'error' })
          return
        }

        toast('La información se importó correctamente', { toastId, type: 'success' })
        onClose()
      })
      .catch(error => {
        const { message } = error.data
        setErrors([message])
        toast(message, { toastId, type: 'error' })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const onChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.item(0)

    if (file) {
      const { name } = file
      const lastDot = name.lastIndexOf('.')
      const ext = name.substring(lastDot + 1)

      if (!['xlsx', 'xlsm', 'xls', 'xlt', 'xlsb'].includes(ext)) {
        setErrors(['El archivo no tiene la extension correcta'])
        toast('El archivo no tiene la extension correcta', { toastId, type: 'error' })
        event.target.value = ''
        return
      } else {
        setErrors([])
      }
    }

    setFile(file)
  }

  const handleClickInput = (): void => {
    if (isLoading) return
    setErrors([])
  }

  return (
    <Modal isOpen={isOpen} onClose={handleCancel}>
      <div className=''>
        <h1 className='uppercase text-center text-xl font-bold'>Importar excel {getTitle()}</h1>
        <Divider className='mt-1'></Divider>
        <form onSubmit={handleSubmit}>
          <div className='mt-5'>
            <input onClick={handleClickInput} onChange={onChange} type="file" accept='.xlsx,.xlsm,.xls,.xlt,.xlsb' />
            <div className='max-h-[150px] overflow-y-scroll mt-4'>
              {
                errors.map((error) => (<p className='m-0 mt-1 text-red max-w-[80%]' key={error}>{error}</p>))
              }
            </div>
          </div>
          <div className='mt-2 flex gap-3 justify-center'>
            <Button color='secondary' onClick={handleCancel}>Cancelar</Button>
            <Button color='primary' type='submit' isLoading={isLoading}>Importar</Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}

export default ImportExcel
