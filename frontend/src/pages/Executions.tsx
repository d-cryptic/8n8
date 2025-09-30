import {
  CheckCircle,
  Clock,
  Eye,
  Play,
  RefreshCw,
  Trash2,
  XCircle
} from 'lucide-react'
import React, { useEffect, useState } from "react"
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { api } from "../lib/api"

interface Execution {
  id: string
  status: string
  tasksDone: string
  startedAt: string
  completedAt?: string
  error?: string
  workflow: {
    id: string
    title: string
  }
}

const Executions: React.FC = () => {
  const [executions, setExecutions] = useState<Execution[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedExecution, setSelectedExecution] = useState<Execution | null>(null)

  useEffect(() => {
    fetchExecutions()
  }, [])

  const fetchExecutions = async () => {
    try {
      const response = await api.get("/execution")
      setExecutions(response.data.executions)
    } catch (error) {
      console.error("Failed to fetche executions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this execution>")) {
      try {
        await api.delete(`/execution/${id}`)
        await fetchExecutions()
      } catch (error) {
        console.error("Failed to delete execution:", error)
      }
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'running':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'running':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDuration = (startedAt: string, completedAt?: string) => {
    const start = new Date(startedAt)
    const end = completedAt ? new Date(completedAt) : new Date()
    const duration = end.getTime() - start.getTime()

    if (duration < 1000) return '< 1s'
    if (duration < 60000) return `${Math.floor(duration / 1000)}s`
    if (duration < 3600000) return `${Math.floor(duration / 60000)}m`
    return `${Math.floor(duration / 3600000)}h`
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Executions</h1>
          <p className="text-gray-600">Monitor your workflow executions and their status</p>
        </div>
        <Button onClick={fetchExecutions} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Executions List */}
      <div className="space-y-4">
        {executions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No executions yet</h3>
              <p className="text-gray-600">Workflow executions will appear here when you run them</p>
            </CardContent>
          </Card>
        ) : (
          executions.map((execution) => (
            <Card key={execution.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(execution.status)}
                    <div>
                      <h3 className="font-medium text-gray-900">{execution.workflow.title}</h3>
                      <p className="text-sm text-gray-600">
                        Started {new Date(execution.startedAt).toLocaleString()}
                        {execution.completedAt && (
                          <span> • Duration: {formatDuration(execution.startedAt, execution.completedAt)}</span>
                        )}
                      </p>
                      {execution.error && (
                        <p className="text-sm text-red-600 mt-1">{execution.error}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(execution.status)}`}>
                      {execution.status}
                    </div>
                    <div className="text-sm text-gray-600">
                      {execution.tasksDone}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedExecution(execution)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(execution.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Execution Details Modal */}
      {selectedExecution && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Execution Details</CardTitle>
                <Button
                  variant="outline"
                  onClick={() => setSelectedExecution(null)}
                >
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Workflow</h4>
                  <p className="text-sm text-gray-600">{selectedExecution.workflow.title}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Status</h4>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedExecution.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedExecution.status)}`}>
                      {selectedExecution.status}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Progress</h4>
                  <p className="text-sm text-gray-600">{selectedExecution.tasksDone}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Started</h4>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedExecution.startedAt).toLocaleString()}
                  </p>
                </div>
                {selectedExecution.completedAt && (
                  <div>
                    <h4 className="font-medium text-gray-900">Completed</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedExecution.completedAt).toLocaleString()}
                    </p>
                  </div>
                )}
                <div>
                  <h4 className="font-medium text-gray-900">Duration</h4>
                  <p className="text-sm text-gray-600">
                    {formatDuration(selectedExecution.startedAt, selectedExecution.completedAt)}
                  </p>
                </div>
                {selectedExecution.error && (
                  <div>
                    <h4 className="font-medium text-gray-900">Error</h4>
                    <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      {selectedExecution.error}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Executions