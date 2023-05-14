import React, { Fragment, useContext, type ReactElement } from 'react'
import { toast } from 'react-toastify'
import EditIcon from '@/shared/ui/assets/icons/EditIcon'
import ToggleOnIcon from '@/shared/ui/assets/icons/ToggleOnIcon'
import ToggleOffIcon from '@/shared/ui/assets/icons/ToggleOfIcon'
import { ProjectContext } from '../../contexts/ProjectContext'
import { ProjectsService } from '@/users/services/project.service'
import { type Project } from '@/users/models/project.interface'

const ProjectsDetail = (): ReactElement => {
  const { projects, updateProject, selectedProject, setSelectedProject, setProjectForm, toastId } = useContext(ProjectContext)

  const handleToggleProjectActive = (project: Project): void => {
    const projectsService = new ProjectsService()
    void projectsService.toggleActive(project.id)
      .then((project) => {
        updateProject(project)
        toast('Proyecto actualizado correctamente', { toastId, type: 'success' })
      })
      .catch((error) => {
        console.log(error)
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  const handleOnProjectClick = (project: Project): void => {
    setSelectedProject(project)
  }

  const handleUpdate = (project: Project): void => {
    setProjectForm(project)
  }

  return (
    <Fragment>
      {
        projects.length > 0
          ? (

              projects.map(project =>
                (
              <div key={project.id}
                onClick={() => { handleOnProjectClick(project) }}
                className={`w-full flex justify-between items-center py-2 rounded-r-xl cursor-pointer ${selectedProject?.id === project.id ? 'bg-blue text-white' : ''}`}>
                <p className='px-2'>{project.name}</p>
                <div className='flex gap-3 px-2'>
                  <EditIcon className='cursor-pointer w-5 h-5' onClick={() => { handleUpdate(project) }} />
                  <div onClick={() => { handleToggleProjectActive(project) }}>
                    {
                      project.active
                        ? (<ToggleOnIcon className='w-6 h-6 cursor-pointer text-success' />)
                        : (<ToggleOffIcon className='w-6 h-6 cursor-pointer' />)
                    }
                  </div>
                </div>
              </div>
                ))

            )
          : (<p>No hay proyectos</p>)
      }
    </Fragment>
  )
}

export default ProjectsDetail
