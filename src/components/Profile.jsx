import { useEffect } from "react"
import { Outlet, useOutletContext, Link, useLoaderData } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import Messages from "./Messages"

const Profile = () => {
  console.log("RENDER PROFILE")
  
  const token = useLoaderData()
  const [socket] = useOutletContext()

  useEffect(() => { // initiate manual connection
    console.log("initiate connection")
    socket.auth = { token: token };
    socket.connect()
  }, [socket, token])

  const decoded = jwtDecode(token)
  const username = decoded.username
  const userId = decoded.id

  return (
    <>
    <h2>Welcome {username}!</h2>
    <Messages socket={socket} username={username} userId={userId}/>
    </>
  )
}

export default Profile