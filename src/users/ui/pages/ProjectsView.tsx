import React, { type ReactElement, useEffect, useState } from 'react'
import { useArrayReducer } from '@/shared/hooks/useArrayReducer'
import Toast from '@/shared/ui/components/Toast'
import Divider from '@/shared/ui/components/Divider'
import { type Project } from '@/users/models/project.interface'
import { ProjectsService } from '@/users/services/project.service'
import { ProjectContext } from '../contexts/ProjectContext'
import ProjectsDetail from '../components/projects/ProjectsDetail'
import ProjectForm from '../components/projects/ProjectForm'
import SponsorsComponent from '../components/sponsors/SponsorsComponent'
import ReportTypeGroupsComponent from '../components/report-type-group/ReportTypeGroupComponent'

const TOAST_ID = 'reports'

const ProjectsView = (): ReactElement => {
  const [projects, setProjects, addProject, updateProject] = useArrayReducer<Project>([])

  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projectForm, setProjectForm] = useState<Project | null>(null)

  useEffect(() => {
    const projectsService = new ProjectsService()
    void projectsService.findAll()
      .then(setProjects)
  }, [])

  useEffect(() => {
    if (projects.length > 0 && selectedProject === null) { setSelectedProject(projects[0]) }
  }, [projects])

  useEffect(() => {
    setProjectForm(null)
  }, [selectedProject])

  return (
    <ProjectContext.Provider value={{
      projects,
      selectedProject,
      setSelectedProject,
      projectForm,
      setProjectForm,
      addProject,
      updateProject,
      toastId: TOAST_ID
    }}>

      <h1 className='text-2xl uppercase font-semibold'>Proyectos</h1>
      <Divider></Divider>
      <div className='sm:grid sm:grid-cols-table sm:gap-12'>
        <main className='mb-4'>
          <div className='mb-4'>
            <h2 className='uppercase font-bold mt-2'>Proyectos</h2>
            <ProjectsDetail />
          </div>
          <div className='w-full border-t border-solid border-gray-light my-3'></div>
          <ProjectForm />
        </main>

        <div className='w-full border-t border-solid border-gray-light my-3 sm:hidden'></div>
        <div>
          <SponsorsComponent />
          <ReportTypeGroupsComponent />
        </div>
      </div>

      <Toast id={TOAST_ID}></Toast>

    </ProjectContext.Provider>
  )
}

export default ProjectsView
