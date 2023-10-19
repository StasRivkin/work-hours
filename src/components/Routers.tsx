import { Routes, Route, Navigate } from "react-router-dom"
import Home from "./home/Home"
import Login from "./login/Login"
import Register from "./register/Register"
import Profile from "./profile/Profile"

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}

export default Routers
