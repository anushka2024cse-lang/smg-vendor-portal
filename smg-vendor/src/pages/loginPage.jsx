"use client"

import { useState } from "react"

function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  icon: Icon,
  rightElement,
  ...props
}) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
        {Icon && <Icon className="h-5 w-5" />}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full h-12 pl-10 pr-4 border border-gray-200 rounded-lg text-sm placeholder:text-gray-300 focus:outline-none focus:border-[#1B365D] focus:ring-1 focus:ring-[#1B365D] transition-all text-gray-600 ${className}`}
        {...props}
      />
      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
    </div>
  )
}

function UserIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function LockIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function EyeIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" x2="22" y1="2" y2="22" />
    </svg>
  )
}

import { useNavigate } from "react-router-dom"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Login submitted", { username })
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex w-full">
      {/* Left side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white relative z-10">
        <div className="w-full max-w-[400px] flex flex-col items-center">
          {/* Logo and Title */}
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-6xl font-bold text-[#1B365D] tracking-wide" style={{ fontFamily: "serif" }}>
              SMG
            </h1>

            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-[#1B365D]">Employee Portal</h2>
              <div className="space-y-1">
                <p className="text-xl text-[#4A6FA5] font-medium">Welcome</p>
                <p className="text-sm text-gray-400 font-light">Login with username</p>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="space-y-5">
              {/* Username Input */}
              <Input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                icon={UserIcon}
                autoComplete="username"
              />

              {/* Password Input */}
              <div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={LockIcon}
                  autoComplete="current-password"
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-300 hover:text-gray-500 focus:outline-none"
                    >
                      {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  }
                />
                <div className="flex justify-end mt-2">
                  <a href="#" className="text-xs text-gray-400 hover:text-[#1B365D] transition-colors font-light underline decoration-gray-300 underline-offset-2">
                    Forgot your password ?
                  </a>
                </div>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full h-12 bg-[#1B365D] hover:bg-[#152a48] text-white text-sm font-bold rounded-lg transition-colors cursor-pointer shadow-sm tracking-wider uppercase mt-4"
            >
              LOGIN
            </button>
          </form>
        </div>
      </div>

      {/* Right side - Office Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden bg-gray-100">
        <img
          src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
          alt="Modern office workspace"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Glassmorphism Card Overlay */}
        <div className="absolute inset-0 flex items-center justify-center p-12">
          {/* This container centers the glass card visually */}
          <div className="w-[80%] h-[40%] bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  )
}
