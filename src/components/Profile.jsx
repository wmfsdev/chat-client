import { useEffect } from "react"
import { useOutletContext, useLoaderData } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import Messages from "./Messages"

const Profile = () => {

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