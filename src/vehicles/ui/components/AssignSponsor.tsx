import React, { type ReactElement, useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Button from '@/shared/ui/components/Button'
import Modal from '@/shared/ui/components/Modal'
import { VehicleContext } from '../contexts/VehicleContext'
import { VehiclesService } from '@/vehicles/services/vehicles.service'
import { type Sponsor } from '@/users/models/sponsor.interface'
import { type Project } from '@/users/models/project.interface'
import { ProjectsService } from '@/users/services/project.service'
import Divider from '@/shared/ui/components/Divider'
import SelectInput from '@/shared/ui/components/SelectInput'

interface AddVehicleFormProps {
  isOpen: boolean
  onClose: () => void
}

const AssignSponsor = ({ isOpen, onClose }: AddVehicleFormProps): ReactElement => {
  const { toastId, selectedVehicle, updateVehicle, setSelectedVehicle } = useContext(VehicleContext)

  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null)

  useEffect(() => {
    const projectsService = new ProjectsService()

    void projectsService.findAll()
      .then((projects) => {
        const userSponsors = selectedVehicle?.sponsors ?? []
        const actualSponsorsId = userSponsors.map((sponsor) => sponsor.id)

        const projectsWithoutActualSponsors = projects.map((project) => {
          return {
            ...project,
            sponsors: project.sponsors.filter((sponsor) => !actualSponsorsId.includes(sponsor.id))
          }
        })
        const projectsFiltered = projectsWithoutActualSponsors.filter((project) => project.sponsors.length > 0)
        setProjects(projectsFiltered)
        if (projectsFiltered.length === 0) return
        setSelectedProject(projectsFiltered[0])
      })
  }, [selectedVehicle])

  useEffect(() => {
    if (!selectedProject) return

    if (selectedProject.sponsors.length === 0) return

    setSelectedSponsor(selectedProject.sponsors[0])
  }, [selectedProject])

  const onSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    if (!selectedVehicle || !selectedProject || !selectedSponsor) return
    event.preventDefault()

    const vehiclesService = new VehiclesService()

    void vehiclesService.assignSponsor(selectedVehicle.licensePlate, selectedSponsor.id)
      .then((response) => {
        updateVehicle(response)
        setSelectedVehicle(response)
        toast('Sponsor asignado correctamente', { toastId, type: 'success' })
        onClose()
      })
      .catch((error) => {
        const { message } = error.data
        toast(message, { toastId, type: 'error' })
      })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='text-center uppercase font-semibold'>
        <h3>Asignar Sponsor</h3>
        <p>Vehículo: {selectedVehicle?.licensePlate}</p>
      </div>

      <Divider className='mt-0'></Divider>

      {projects.length > 0
        ? (
        <form onSubmit={onSubmit}>
          <SelectInput<Project>
            label='Proyecto'
            name='project'
            objects={projects}
            setValue={(name, value) => {
              const project = projects.find((project) => project.id === value)
              if (!project) return
              setSelectedProject(project)
            }}
            value={selectedProject?.id ?? ''}
            optionKey='name'
            valueKey='id'
          />

          {
            selectedProject && selectedProject.sponsors.length > 0 &&
            <SelectInput<Sponsor>
              label='Sponsor'
              name='sponsor'
              objects={selectedProject?.sponsors ?? []}
              setValue={(name, value) => {
                const sponsor = selectedProject?.sponsors.find((sponsor) => sponsor.id === value)
                if (!sponsor) return
                setSelectedSponsor(sponsor)
              }}
              value={selectedSponsor?.id ?? ''}
              optionKey='name'
              valueKey='id'
            />
          }

          <div className='flex gap-2 mt-4'>
            <Button color='secondary' onClick={onClose}>Cancelar</Button>
            <Button color='primary' type='submit'>Asignar</Button>
          </div>
        </form>
          )
        : (
        <p className='text-center'>No hay más proyectos disponibles para asignar</p>
          )

    }

    </Modal>
  )
}

export default AssignSponsor
