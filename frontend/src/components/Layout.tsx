import {
  Key,
  LayoutDashboard,
  LogOut,
  Play,
  Plus,
  Workflow
} from 'lucide-react'
import React from "react"
import { Outlet, useLocation, useNavigate, type NavigateFunction } from "react-router-dom"
import { useAuth } from '../contexts/AuthContext'
import { Button } from './ui/button'

const Layout: React.FC = () => {
  const {user, logout} = useAuth()
	const navigate: NavigateFunction = useNavigate()
	const location = useLocation()

	const navigation: { name: string, href: string, icon: React.ElementType }[] = [
		{ name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Workflows', href: '/workflow', icon: Workflow },
    { name: 'Credentials', href: '/credentials', icon: Key },
    { name: 'Executions', href: '/executions', icon: Play },
	]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

	const isActive = (path: string) => {
		if (path === '/workflow') {
			return location.pathname.startsWith('/workflow')
		}
		return location.pathname === path
	} 

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
				<div className="flex h-full flex-col">

					{/* Logo */}
					<div className="flex h-16 items-center justify-center border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">8n8</h1>
          </div>
				</div>

				{/* Navigation */}
				<nav className="flex-1 space-y-1 px-4 py-4">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.href)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </button>
              )
            })}
        </nav>
        
        {/* User info and logout */}
        <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="ml-2"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

				{/* Main */}
				 <div className="pl-64">
        <div className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            {location.pathname === '/dashboard' && (
              <Button onClick={() => navigate('/workflow')}>
                <Plus className="h-4 w-4 mr-2" />
                New Workflow
              </Button>
            )}
          </div>
        </div>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>

			</div>
		</div>
	)
}

export default Layout