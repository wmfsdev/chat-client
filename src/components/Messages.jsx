import { useOutletContext } from "react-router-dom"
import { useState, useEffect } from "react"
import Chat from "./Chat"

const Messages = () => {

  const [socket, username, userId] = useOutletContext()
  const [displayChat, setDisplayChat] = useState(false)

  function initChat(e) {
    if (displayChat !== false) {
      setDisplayChat(false)
    }
    const recipientId = e.target.dataset.userid
    const recipientUsername = e.target.innerText
    setDisplayChat({ recipientId: recipientId, recipientUsername: recipientUsername })
  }

  const [users, setUsers] = useState([])

  useEffect(() => {
    console.log("Messages useEffect emit req_users")
    socket.emit("req_users")
  }, [socket])
  
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
  //  socket.emit("req_users")
    socket.on("users", (data) => {
      console.log("users")
      console.log(data)
      setUsers(...users, data)
    })
    return () => {
      socket.off("users")
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

  return (
    <>
    <h2>MESSAGES</h2>
    <div className="chat-frame">
      <div className="chat-users">
        <h3>Users Online:</h3>
        <ul>
          {users.map(user => (
            <div key={user.userID}className="chat-user" onClick={(e) => initChat(e)}>
              <li data-userid={user.userID}>{user.username}</li>
            </div>
          ))}
        </ul>
      </div>
      <div className="chat-messages">
        { displayChat ? <Chat recipientInfo={displayChat} socket={socket} sender={{ username: username, userId: userId }} /> : null }
      </div>
    </div>
    </>
  )
}

export default Messages