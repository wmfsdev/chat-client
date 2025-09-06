
import { useEffect, useState } from 'react'
import './App.css'
import { Link, Outlet, useLoaderData } from 'react-router-dom'
import { io } from 'socket.io-client'

const token = localStorage.getItem("token")
const socket = io('http://localhost:3001/profile', {
  autoConnect: false, // manually called in Profile
  auth: { 
    token: token,
  }
})
  
const App = () => {

  const [userState, setUserState] = useState()
  const user = useLoaderData()
  
  useEffect(() => {
    setUserState(user)
  }, [user])

  console.log("app ID: ", socket.id)

  return (
    <>
    <h1>Chat App</h1>
    <Link to="profile">Profile</Link><br />
    <Link to="login">Login</Link><br />
    <Link to="sign-up">Signup</Link><br />
    <Link to="rooms/:id">Rooms</Link>
    <Outlet context={ [socket, userState, setUserState] }/>
    </>
  )

}

export default App
