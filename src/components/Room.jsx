import { useLoaderData, useOutletContext, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"
import Chat from "./Chat"

const Room = () => {

  const [chatStatus, setChatStatus] = useState(null)
  const [socket] = useOutletContext()
  const [users, setUsers] = useState([])
  const [userCount, setUserCount] = useState(null)
  const [chat, setChat] = useState([])
  const { id } = useParams()
  const token = useLoaderData()
  const decoded = jwtDecode(token)
  const userId = decoded.id
  const username = decoded.username

  useEffect(() => { // REQUEST USERS - EMIT
    socket.emit("req_users")
  }, [socket])

  useEffect(() => { // USER CONNECT
    socket.on("user_connected", (data) => {
      setUsers([...users, data])
    })
    return () => {
      socket.off("user_connected")
    }
  }, [users, socket])

  useEffect(() => { // RECEIVE USERS - ON
    socket.on("users", (data, userCount) => {
      setUserCount(userCount)
      setUsers(...users, data)
    })
    return () => {
      socket.off("users")
    }
  }, [])

  useEffect(() => { // USER DISCONNECT
    socket.on("user_disconnected", (data) => {
      setUsers(
        users.filter(user => 
          user.username !== data.username
        )
      )
      setUserCount(users.length - 1)
    })
    return () => {
      socket.off("user_disconnected")
    }
  },  [users, userCount, socket])

  return (
    <>
    <div className="chat-frame">
      <div className="chat-users">
        <h3>Online: {userCount}</h3>
      </div>
      <Chat 
        recipientInfo={{ recipientId: id , recipientUsername: id }} 
        socket={socket} 
        sender={{ username: username, userId: userId  }}
        chat={chat}
        setChat={setChat}
        setChatStatus={setChatStatus}
      />
    </div>
    </>
  )
}

export default Room