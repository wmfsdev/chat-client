
import { useState, useEffect } from 'react'
import './App.css'
import { Link, Outlet, useNavigate, useLoaderData } from 'react-router-dom'
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

  const loaderAuth = useLoaderData()
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [auth, setAuth] = useState(false)

  useEffect(() => {
    socket.on("connect_error", err => {
      if (socket.active) {
      // temporary disconnection, the socket will automatically try to reconnect
        console.log(err)
        return
      } else {
      // the connection was forcefully closed by the server or the client itself
        setError(err)
        navigate('/error')
      }
    
    });
  })

  return (
    <>
    <header>
    <h1>Chat App</h1>
    <div className='navigation'>
      <Link to="/">Home</Link><br />
      { auth || loaderAuth ? <><Link to="profile">Profile</Link><br /></> : null }
      <Link to="login">Login</Link><br />
      <Link to="sign-up">Signup</Link><br />
      <Link to="rooms/:id">Rooms</Link>
    </div>
    </header>
    <Outlet context={ [socket, error, auth, setAuth] }/>
    </>
  )
}

export default App
