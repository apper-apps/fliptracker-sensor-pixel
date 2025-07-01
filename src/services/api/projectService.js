import mockProjects from '@/services/mockData/projects.json'

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const projectService = {
  async getAll() {
    await delay(300)
    return [...mockProjects]
  },
  
  async getById(id) {
    await delay(200)
    const project = mockProjects.find(p => p.Id === parseInt(id))
    if (!project) {
      throw new Error('Project not found')
    }
    return { ...project }
  },
  
  async create(projectData) {
    await delay(400)
    const newProject = {
      Id: Math.max(...mockProjects.map(p => p.Id)) + 1,
      ...projectData,
      createdAt: new Date().toISOString()
    }
    mockProjects.push(newProject)
    return { ...newProject }
  },
  
  async update(id, projectData) {
    await delay(350)
    const index = mockProjects.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Project not found')
    }
    mockProjects[index] = { ...mockProjects[index], ...projectData }
    return { ...mockProjects[index] }
  },
  
  async delete(id) {
    await delay(300)
    const index = mockProjects.findIndex(p => p.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Project not found')
    }
    const deleted = mockProjects.splice(index, 1)[0]
    return { ...deleted }
  }
}