
import { useState, useEffect } from 'react'
import './App.css'
import { Link, Outlet, useNavigate, useLoaderData, useLocation } from 'react-router-dom'
import { io } from 'socket.io-client'

const token = localStorage.getItem("token")
const socketConnection = import.meta.env.VITE_API_URL + '/messages'

const socket = io(socketConnection, {
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
  const [homeNavStatus, setHomeNavStatus] = useState(true)
  const location = useLocation()
  
  useEffect(() => {
    socket.on("connect_error", err => {
      console.log("connect_error")
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
    return () => {
      socket.off("connect_error")
    }
  }, [navigate])

  useEffect(() => {
    if (location.pathname !== '/') {
      setHomeNavStatus(false)
    } else setHomeNavStatus(true)
  }, [location])

  const logOut = () => {
    console.log("disconnect")
    socket.disconnect()
    setAuth(false)
    localStorage.clear()
    navigate('/')
  }

  return (
    <>
    <header>
    <h1>Let's Talk</h1>
    <div className='navigation'>
      { auth || loaderAuth ? 
        <>
        <Link to="/rooms/public">Public Chat</Link><br />
        <Link to="messages">Private Chat</Link><br />
        <Link to="/" onClick={logOut}>Sign-out</Link>
        </>
      : <>
        <Link to="/">Home</Link><br />
        <Link to="login">Login</Link><br />
        <Link to="sign-up">Signup</Link><br />
        </>
      } 
    </div>
    </header>
    { homeNavStatus ? 
      <div className="app-desc">
        <p><b>Let's Talk</b> allows you to share a public chat space with other users, participating in real-time conversations and catching up with what others have been discussing whilst you were away from the action. If you wish to engage in one-on-one conversations with any other user you can easily start up a private chat by clicking their name in the list of users currently online.</p>
      </div>
      :
      null
    }
   
    <Outlet context={ [socket, error, setError, auth, setAuth] }/>
    </>
  )
}

export default App
