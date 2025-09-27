import { useEffect } from "react"
import { Outlet, useOutletContext, Link } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

const Profile = () => {
  console.log("RENDER PROFILE")

  const [socket] = useOutletContext()
  const token = localStorage.getItem("token")
  console.log(token)
  const decoded = jwtDecode(token)

  useEffect(() => { // initiate manual connection
    console.log("initiate connection")
    const token = localStorage.getItem("token")
    socket.auth = { token: token };
    socket.connect() 
    
  },[socket])
  
  const username = decoded.username
  const userId = decoded.id

  return (
    <>
    <h2>Welcome {username}!</h2>
    <Link to="/profile/messages">Messages</Link><br />
    <Outlet context={[socket, username, userId]}/>
    </>
  )
}

export default Profile