import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@/shared/ui/components/Button'
import Input from '@/shared/ui/components/Input'
import { useDataForm } from '@/shared/hooks/useDataForm'
import { type FormAction } from '@/shared/types'
import { useBooleanState } from '@/shared/hooks/useBooleanState'
import { ProjectContext } from '../../contexts/ProjectContext'
import { type ProjectDto } from '@/users/models/project.interface'
import { REPORT_TYPE_DTO_INITIAL_STATE } from '@/reports/models/report-type.interface'
import { ProjectsService } from '@/users/services/project.service'

const ProjectForm = (): ReactElement => {
  const { toastId, projectForm, setProjectForm, addProject, updateProject } = useContext(ProjectContext)

  const [project, setProjectValue, setProject, reset] = useDataForm<ProjectDto>(REPORT_TYPE_DTO_INITIAL_STATE)

  const [formAction, setFormAction] = useState<FormAction>('add')

  const [isSubmitting, toggleIsSubmitting, setIsSubmitting] = useBooleanState()

  useEffect(() => {
    setIsSubmitting(false)
    if (projectForm === null) {
      setFormAction('add')
      reset()
      return
    }

    const { name } = projectForm
    setFormAction('update')

    setProject({
      name
    })
  }, [projectForm])

  const handleCancel = (): void => {
    setProjectForm(null)
    reset()
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    toggleIsSubmitting()
    const projectsService = new ProjectsService()

    const submitAction = formAction === 'add' ? projectsService.create : projectsService.update
    const onSuccess = formAction === 'add' ? addProject : updateProject
    const id = projectForm?.id ?? ''

    void submitAction(project, id)
      .then((response) => {
        setProjectForm(null)
        onSuccess(response)
        reset()

        toast(`Proyecto ${formAction === 'add' ? 'añadido' : 'guardado'} correctamente`, { toastId, type: 'success' })
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
    <div>
      <h2 className='font-bold uppercase'>{formAction === 'add' ? 'Añadir' : 'Editar'} Proyectos</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label='Nombre'
          value={project.name}
          name='name' placeholder='Nombre checklist' type='text'
          setValue={setProjectValue}></Input>

        <div className='mt-3 flex items-center gap-3'>
          <Button className='py-1' color='primary' type='submit' isLoading={isSubmitting}>{formAction === 'add' ? 'Añadir' : 'Guardar'}</Button>
          <Button className='py-1' color='secondary' onClick={handleCancel} >Cancelar</Button>
        </div>
      </form>
    </div>
  )
}

export default ProjectForm
