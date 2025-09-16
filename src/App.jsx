
import { useState } from 'react'
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

  return (
    <>
    <header>
    <h1>Chat App</h1>
    <div className='navigation'>
      <Link to="/">Home</Link><br />
      <Link to="profile">Profile</Link><br />
      <Link to="login">Login</Link><br />
      <Link to="sign-up">Signup</Link><br />
      <Link to="rooms/:id">Rooms</Link>
    </div>
    </header>
    <Outlet context={ [socket, userState, setUserState] }/>
    </>
  )
}

export default App
