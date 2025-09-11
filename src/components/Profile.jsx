import { useState, useEffect } from "react"
import { Outlet, useOutletContext, Link } from "react-router-dom"

const Profile = () => {
  console.log("RENDER PROFILE")

  useEffect(() => {
    const token = localStorage.getItem("token")
    socket.auth = { token: token };
    socket.connect() // manual connection
  })
  
  const [socket, userState, setUserState] = useOutletContext()
  const username = userState.username
  const [users, setUsers] = useState([])
 
  useEffect(() => {
    socket.on("user_connected", (data) => {
      console.log("user connected")
      console.log(data)
      setUsers([...users, data]) 
    })
    return () => {
      socket.off("user_connected")
    }
  })

  useEffect(() => {
    socket.on("user_disconnected", (data) => {
      console.log("user disconnected: ", data)
      console.log("connected users: ", users)
      setUsers(
        users.filter(user => 
          user.username !== data.username
        )
      )
    })
    return () => {
      socket.off("user_disconnected")
    }
  })

  useEffect(() => {
     socket.on("users", (data) => {
      console.log("users")
      console.log(data)
      setUsers(...users, data)
    })
    return () => {
      socket.off("users")
    }
  })
  
  return (
    <>
    <h2>Welcome {username}!</h2>
    {/* <Rooms /> */}
    <Link to="/profile/messages">Messages</Link><br />
    <Outlet context={[users, socket, username]}/>
    </>
  )
}

export default Profile