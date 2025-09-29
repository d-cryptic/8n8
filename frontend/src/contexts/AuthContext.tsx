import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { api } from "../lib/api"

interface User {
  id: string
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name?: string) => Promise<void>
  verifyOtp: (email: string, otp: string) => Promise<void>
  resendOtp: (email: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (storedToken) {
      setToken(storedToken)
      verifyToken(storedToken)
    } else {
      setLoading(false)
    }
  }, [])

  const verifyToken = async (token: string) => {
    try {
      const response = await api.get("/auth/me", {
        headers: {Authorization: `Bearer ${token}`}
      })
      setUser(response.data.user)
    } catch (error) {
      console.error("Token verification failed: ", error)
      localStorage.removeItem("token")
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/signin", {
        email, password
      })
      const {token: newToken, user: userData} = response.data

      setToken(newToken)
      setUser(userData)
      localStorage.setItem("token", newToken)
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Login failed")
    }
  }

  const signup = async (email: string, password: string, name?: string) => {
    try {
      await api.post("/auth/signup", { email, password, name})
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Signup failed')
    }
  }

  const verifyOtp = async (email: string, otp: string) => {
    try {
      const response = await api.post("/auth/verify-otp", {
        email, otp
      })
      const { token: newToken, user: userData } = response.data

      setToken(newToken)
      setUser(userData)
      localStorage.setItem("token", newToken)
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "OTP verification failed")
    }
  }

  const resendOtp = async (email: string) => {
    try {
      await api.post("/auth/resend-otp", {email})
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Failed to resend OTP")
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
  } 

  const value: AuthContextType = {
    user,
    token,
    login,
    signup,
    verifyOtp,
    resendOtp,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}