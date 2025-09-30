import React, { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  NodeTypes,
  ReactFlow,
  useEdgesState,
  useNodesState
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { useWorkflow } from '../contexts/WorkflowContext'

import {
  ArrowLeft,
  Play,
  Plus,
  Save,
  Settings
} from 'lucide-react'

import EmailNode from '../components/nodes/EmailNode'
import EndNode from '../components/nodes/EndNode'
import StartNode from '../components/nodes/StartNode'
import TelegramNode from '../components/nodes/TelegramNode'
import WebhookNode from '../components/nodes/WebhookNode'

const nodeTypes: NodeTypes = {
  start: StartNode,
  end: EndNode,
  webhook: WebhookNode,
  email: EmailNode,
  telegram: TelegramNode,
}

const WorkflowEditor: React.FC = () => {
  const {id} = useParams()
  const navigate = useNavigate()

  const {
    currentWorkflow,
    loading,
    fetchWorkflow,
    createWorkflow,
    updateWorkflow,
  } = useWorkflow()

  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [title, setTitle] = useState("")
  const [enabled, setEnabled] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (id) {
      fetchWorkflow(id)
    }
  }, [id, fetchWorkflow])

  useEffect(() => {
    if (currentWorkflow) {
      setTitle(currentWorkflow.title)
      setEnabled(currentWorkflow.enabled)
      setNodes(currentWorkflow.nodes || [])
      setEdges(currentWorkflow.connections || [])
    } else if (!id) {
      const initialNodes: Node[] = [
        {
          id: '1',
          type: 'start',
          position: { x: 100, y: 100 },
          data: { label: 'Start' }
        },
        {
          id: '2',
          type: 'end',
          position: { x: 400, y: 100 },
          data: { label: 'End' }
        }
      ]

      setNodes(initialNodes)
      setEdges([])
    }
  }, [currentWorkflow, id])

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const handleSave = async () => {
    try {
      setSaving(true)

      if (id && currentWorkflow) {
        await updateWorkflow(id, {
          title,
          enabled,
          nodes,
          connections: edges
        })
      } else {
        const newWorkflow = await createWorkflow(title || "Untitled Workflow", nodes, edges)
        navigate(`/workflow/${newWorkflow.id}`)
      }
    } catch (error) {
      console.error("Failed to save workflow:", error)
    } finally {
      setSaving(false)
    }
  }

  const addNode = (type: string) => {
    const newNode: Node = {
      id: `${Date.now()}`,
      type,
      position: {x : Math.random()*400+200, y:Math.random()*300+100},
      data: {label: type.charAt(0).toUpperCase() + type.slice(1)}
    }
    setNodes((nds) => [...nds, newNode])
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Workflow name"
              className="text-lg font-semibold border-none p-0 h-auto"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={saving}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button
            onClick={() => {/* TODO: Implement execution */}}
            disabled={!enabled}
          >
            <Play className="h-4 w-4 mr-2" />
            Run
          </Button>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Node Palette */}
        <div className="w-64 bg-white border-r p-4">
          <h3 className="font-semibold mb-4">Nodes</h3>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => addNode('webhook')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Webhook
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => addNode('email')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Send Email
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => addNode('telegram')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Send Telegram
            </Button>
          </div>
        </div>

        {/* ReactFlow Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>
      </div>
    </div>
  )
}

export default WorkflowEditor