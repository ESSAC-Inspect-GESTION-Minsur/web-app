
import { type Project } from '@/users/models/project.interface'
import React from 'react'

interface ProjectContextInterface {
  toastId: string

  projects: Project[]
  addProject: (project: Project) => void
  updateProject: (project: Project) => void

  selectedProject: Project | null
  setSelectedProject: (project: Project | null) => void

  projectForm: Project | null
  setProjectForm: (projectForm: Project | null) => void
}

export const ProjectContext = React.createContext<ProjectContextInterface>({
  toastId: '',
  projects: [],
  addProject: () => { },
  updateProject: () => { },
  selectedProject: null,
  setSelectedProject: () => { },
  projectForm: null,
  setProjectForm: () => { }
})
