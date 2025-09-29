import { type Edge, type Node } from "@xyflow/react"
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react"
import { api } from "../lib/api"

interface Workflow {
  id: string,
  title: string,
  enabled: boolean,
  nodes: Node[],
  connections: Edge[],
  createdAt: string,
  updatedAt: string
}

interface WorkflowContextType {
  workflows: Workflow[],
  currentWorkflow: Workflow | null
  loading: boolean
  fetchWorkflows: () => Promise<void>
  fetchWorkflow: (id: string) => Promise<void>
  createWorkflow: (title: string, nodes: Node[], connections: Edge[]) => Promise<Workflow>
  updateWorkflow: (id: string, data: Partial<Workflow>) => Promise<void>
  deleteWorkflow: (id: string) => Promise<void>
  executeWorkflow: (id: string) => Promise<void>
  setCurrentWorkflow: (workflow: Workflow | null) => void
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined)

export const useWorkflow = () => {
  const context = useContext(WorkflowContext)
  if (context === undefined) { 
    throw new Error("useWorkflow must be used within a WorkflowProvider")
  }

  return context
}

interface WorkflowProviderProps { 
  children: ReactNode
}

export const WorkflowProvider: React.FC<WorkflowProviderProps> = ({ children }) => {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [currentWorkflow, setCurrentWorkflow] = useState<Workflow | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchWorkflows = async () => {
    try {
      setLoading(true)
      const response = await api.get("/workflow")
      setWorkflows(response.data.workflows)
    } catch (error) {
      console.error("Failed to fetch workflows: ", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchWorkflow = async (id: string) => {
    try {
      setLoading(true)
      const response = await api.get(`/workflow/${id}`)
      setCurrentWorkflow(response.data.workflow)
    } catch (error) {
      console.error("Failed to fetch workflow: ", error)
    } finally {
      setLoading(false)
    }
  }

  const createWorkflow = async (title: string, nodes: Node[], connections: Edge[]): Promise<Workflow> => {
    try {
      const response = await api.post("/workflow", {
        title,
        nodes,
        connections,
        enabled: true
      })

      const newWorkflow = response.data.workflow
      setWorkflows(prev => [newWorkflow, ...prev])
      return newWorkflow
    } catch (error) {
      console.error("Failed to create workflow:", error)
      throw error
    }
  }

  const updateWorkflow = async (id: string, data: Partial<Workflow>) => {
    try {
      const response = await api.put(`/workflow/${id}`, data)
      const updatedWorkflow = response.data.workflow

      setWorkflows((prev: any[]) => prev.map(w => w.id === id ? updatedWorkflow : w))

      if (currentWorkflow?.id === id) {
        setCurrentWorkflow(updatedWorkflow)
      }
    } catch (error) {
      console.error("Failed to update workflow:", error)
      throw error
    }
  }

  const deleteWorkflow = async (id: string) => {
    try {
      await api.delete(`/delete/${id}`)
      setWorkflows((prev: any[]) => prev.filter(w => w.id !== id))

      if (currentWorkflow?.id === id) {
        setCurrentWorkflow(null)
      }
    } catch (error) {
      console.error("Failed to delete workflow: ", error)
      throw error
    }
  }

  const executeWorkflow = async (id: string) => {
    try {
      await api.post(`/workflow/${id}/execute`)
    } catch (error) {
      console.error("Failed to execute workflow:", error)
      throw error
    }
  }

  const value: WorkflowContextType = {
    workflows,
    currentWorkflow,
    loading,
    fetchWorkflows,
    fetchWorkflow,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    executeWorkflow,
    setCurrentWorkflow
  }

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  )
}