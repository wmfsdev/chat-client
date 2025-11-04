import { useState, useEffect } from "react"
import Chat from "./Chat"

const Messages = ({ socket, username, userId }) => {

  const [displayChat, setDisplayChat] = useState(false)
  const [users, setUsers] = useState([])
  const [userCount, setUserCount] = useState(null)
  const [notification, setNotification] = useState(null)
  
  function initChat(e) {
    if (displayChat !== false) {
      setDisplayChat(false)
    }
    const recipientId = e.target.dataset.userid
    const recipientUsername = e.target.innerText
    setDisplayChat({ recipientId: recipientId, recipientUsername: recipientUsername })
  }

  useEffect(() => { // REQUEST USERS - EMIT
    console.log("Messages useEffect emit req_users")
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
    console.log("useEffect users")
    socket.on("users", (data, userCount) => {
      console.log("users: ", data)
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
  }, [users, userCount, socket])

  return (
    <>
    <div className="chat-frame">
      <div className="chat-users">
        <h3>Online: {userCount}</h3>
        <ul>
          {
          users.map(user => { 
            return  <div key={user.userID} className={"chat-user" + (notification ? '-message' : '') } >
                      <li onClick={ (user.username === username ? null : (e) => initChat(e) )} className={(user.username === username) ? '' : 'link' } data-userid={user.userID}>{user.username + (user.username === username ? ' (you)' : '')}</li>
                    </div>
          })
          }
        </ul>
      </div>
        { displayChat ? <Chat recipientInfo={displayChat} socket={socket} sender={{ username: username, userId: userId }} notify={{notification, setNotification}} /> : null }
      </div>
    </>
  )
}

export default Messages