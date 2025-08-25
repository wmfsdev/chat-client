
import './App.css'
import { useEffect } from 'react'
import { Link, Outlet } from 'react-router-dom'


const App = () => {

  return (
    <>
    <h1>Chat App</h1>
    <Link to="profile">Profile</Link>
    <Outlet />
    </>
  )

}

export default App
