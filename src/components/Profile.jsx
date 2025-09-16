import { useEffect } from "react"
import { Outlet, useOutletContext, Link } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

const Profile = () => {
  console.log("RENDER PROFILE")

  const token = localStorage.getItem("token")
  const decoded = jwtDecode(token)

  useEffect(() => { // initiate manual connection
    console.log("initate connection")
    const token = localStorage.getItem("token")
    socket.auth = { token: token };
    socket.connect() 
  })
  
  const [socket] = useOutletContext()
  const username = decoded.username
  const userId = decoded.id

  return (
    <>
    <h2>Welcome {username}!</h2>
    {/* <Rooms /> */}
    <Link to="/profile/messages">Messages</Link><br />
    <Outlet context={[socket, username, userId]}/>
    </>
  )
}

export default Profile