import { useState } from "react"
import { io } from "socket.io-client"
import { Outlet, useNavigate } from "react-router-dom"

const socket = io('http://localhost:3001/profile')

const Profile = () => {
  
  const nav = useNavigate()
  const [username, setUsername] = useState('')
  const [room, setRoom] = useState('')
  
  function joinRoom() {
    socket.emit("join_room", { room: room, username: username })
    nav('/profile/room')
  }

  return (
    <>
    <h2>Profile</h2>
      <input type="text" onChange={(e) => setUsername(e.target.value)} />
      <input type="text" placeholder="room name" onChange={(e) => setRoom(e.target.value)} />
      <button onClick={joinRoom}>JOIN ROOM</button>
    <Outlet context={[socket, room, username, setUsername]}/>
    </>
  )
}

export default Profile