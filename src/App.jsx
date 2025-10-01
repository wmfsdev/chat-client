
import { useState, useEffect } from 'react'
import './App.css'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'

const token = localStorage.getItem("token")
const socket = io('http://localhost:3001/profile', {
  autoConnect: false, // manually called in Profile
  auth: { 
    token: token,
  },
  reconnectionDelay: 10000, 
  reconnectionDelayMax: 10000 
})

const App = () => {
  
  const navigate = useNavigate()
  const [userState, setUserState] = useState()
  const [error, setError] = useState(null)

  useEffect(() => {
    socket.on("connect_error", err => {
      console.log(err instanceof Error); // true
      console.log(err.message);
      setError(err)
      navigate('/error')
    });
  })

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
    <Outlet context={ {socket, userState, setUserState, error} }/>
    </>
  )
}

export default App
