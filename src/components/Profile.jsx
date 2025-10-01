import { useEffect, useState } from "react"
import { Outlet, useOutletContext, Link } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

const Profile = () => {
  console.log("RENDER PROFILE")
  
  const { socket } = useOutletContext()
  const [connected, setConnected] = useState(false)
  const token = localStorage.getItem("token")
  const decoded = jwtDecode(token)
  const username = decoded.username
  const userId = decoded.id

  useEffect(() => { // initiate manual connection
    console.log("initiate connection")
    const token = localStorage.getItem("token")
    socket.auth = { token: token };
    socket.connect()
    if (socket.connected === true) {
      setConnected(true)
    }
  },[socket])

  if (connected === true) {
    return (
      <>
      <h2>Welcome {username}!</h2>
      <Link to="/profile/messages">Messages</Link><br />
      <Outlet context={[socket, username, userId]}/>
      </>
    )
  } else {
    return (
      null
    )
  }
}

export default Profile