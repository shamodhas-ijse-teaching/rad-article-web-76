import axios from "axios"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { register } from "../service/auth"

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [conPassword, setCOnPassword] = useState("")

  const handleRegister = async () => {
    if (!name || !email || !password || !conPassword) {
      return alert("Please fill all fields..!")
    }

    if (password !== conPassword) {
      return alert("Password not match..!")
    }

    try {
      // await axios.post("http://localhost:3000/api/v1/auth/register", {
      //   name,
      //   email,
      //   password
      // })
      await register(name, email, password)
      alert("Registration success..!")
      navigate("/login")
    } catch (err) {
      console.error(err)
      alert("Registration fail..!")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col gap-4 w-80">
        <h1>Register</h1>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="123456"
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          type="password"
          value={conPassword}
          onChange={(e) => setCOnPassword(e.target.value)}
          placeholder="123456"
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          onClick={handleRegister}
        >
          Register
        </button>
        <p className="mt-4 text-gray-700 text-center">
          <span>Alrady have an account? </span>
          <button
            className="text-blue-600 font-semibold hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  )
}

export default Register
