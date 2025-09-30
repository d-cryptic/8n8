import {
  CheckCircle,
  Edit,
  Key,
  Mail,
  Plus,
  Send,
  Trash2
} from 'lucide-react'
import React, { useEffect, useState } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { api } from "../lib/api"

interface Credential {
  id: string,
  title: string,
  platform: string,
  data: any,
  createdAt: string,
  updatedAt: string
}

const Credentials: React.FC = () => {
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCredential, setEditingCredential] = useState<Credential | null>(null)

  const [formData, setFormData] = useState({
    title: "",
    platform: "telegram",
    data: {}
  })

  useEffect(() => {
    fetchCredentials()
  }, [])

  const fetchCredentials = async () => {
    try {
      const response = await api.get("/credential")
      setCredentials(response.data.credentials)
    } catch (error) {
      console.error("Failed to fetch credentials:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingCredential) {
        await api.put(`/credential/${editingCredential.id}`, formData)
      } else {
        await api.post(`/credential`, formData)
      }
      await fetchCredentials()
      setShowForm(false)
      setEditingCredential(null)
      setFormData({ title: "", platform: "telegram", data: {} })
    } catch (error) {
      console.error("Failed to save credential:",error)
    }
  }

  const handleEdit = (credential: Credential) => {
    setEditingCredential(credential)
    setFormData({
      title: credential.title,
      platform: credential.platform,
      data: credential.data
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this credential?")) {
      try {
        await api.delete(`/credential/${id}`)
        await fetchCredentials()
      } catch (error) {
        console.error("Failed to delete credential:", error)
      }
    }
  }

  const handleTest = async (id: string) => {
    try {
      const response = await api.post(`/credential/${id}/test`)
      if (response.data.isValid) {
        alert('Credential is valid!')
      } else {
        alert(`Credential test faield: ${response.data.error}`)
      }
    } catch (error) {
      console.error("Failed to test credential:", error)
      alert("Failed to test credential")
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'telegram':
        return <Send className="h-5 w-5 text-cyan-500" />
      case 'email':
        return <Mail className="h-5 w-5 text-orange-500" />
      default:
        return <Key className="h-5 w-5 text-gray-500" />
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'telegram':
        return 'bg-cyan-100 text-cyan-800'
      case 'email':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
          <h1 className="text-2xl font-bold text-gray-900">Credentials</h1>
          <p className="text-gray-600">Manage your API keys and authentication tokens</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Credential
        </Button>
      </div>

      {/* Credentials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {
          credentials.map((credential) => (
            <Card key={credential.id}>
              <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getPlatformIcon(credential.platform)}
                  <CardTitle className="text-lg">{credential.title}</CardTitle>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${getPlatformColor(credential.platform)}`}>
                  {credential.platform}
                </div>
              </div>
              <CardDescription>
                Created {new Date(credential.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  {Object.keys(credential.data).length} configuration fields
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTest(credential.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Test
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(credential)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(credential.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
            </Card>
          ))
        }
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {editingCredential ? 'Edit Credential' : 'Add New Credential'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <select
                    id="platform"
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value, data: {} })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="telegram">Telegram</option>
                    <option value="email">Email (Resend)</option>
                  </select>
                </div>
                {formData.platform === 'telegram' && (
                  <div>
                    <Label htmlFor="botToken">Bot Token</Label>
                    <Input
                      id="botToken"
                      type="password"
                      value={formData.data.botToken || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        data: { ...formData.data, botToken: e.target.value }
                      })}
                      placeholder="Enter your Telegram bot token"
                      required
                    />
                  </div>
                )}
                {formData.platform === 'email' && (
                  <div>
                    <Label htmlFor="apiKey">Resend API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      value={formData.data.apiKey || ''}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        data: { ...formData.data, apiKey: e.target.value }
                      })}
                      placeholder="Enter your Resend API key"
                      required
                    />
                  </div>
                )}
                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    {editingCredential ? 'Update' : 'Create'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setEditingCredential(null)
                      setFormData({ title: '', platform: 'telegram', data: {} })
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Credentials