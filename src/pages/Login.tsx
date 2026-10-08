import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { getMyDetails, login } from "../service/auth"

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async () => {
    if (!email || !password) {
      return alert("Please fill all fields")
    }

    try {
      const res = await login(email, password)
      const resData = res.data

      const accessToken = resData.access_token
      const refreshToken = resData.refresh_token

      if (!accessToken || !refreshToken) {
        return alert("Login fail..!")
      }

      localStorage.setItem("ACCESS_TOKEN", accessToken)
      localStorage.setItem("REFRESH_TOKEN", refreshToken)

      navigate("/")
    } catch (err) {
      console.error(err)
      alert("Login fail..!")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col gap-4 w-80">
        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Login
        </button>
        <p className="mt-4 text-gray-700 text-center">
          <span>Don't have an account? </span>
          <button
            onClick={() => {
              navigate("/register")
            }}
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  )
}

export default Login
