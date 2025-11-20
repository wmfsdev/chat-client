import { useState, useEffect } from "react"
import Chat from "./Chat"

const Messages = ({ socket, username, userId }) => {

  const [displayChat, setDisplayChat] = useState(false)
  const [users, setUsers] = useState([])
  const [userCount, setUserCount] = useState(null)
  const [notification, setNotification] = useState([])
  const [chat, setChat] = useState([])
  const [chatStatus, setChatStatus] = useState(null)
  
  function initChat(e) {
    if (displayChat !== false) {
      setDisplayChat(false)
    }
    const recipientId = e.target.dataset.userid
    const recipientUsername = e.target.innerText
    setDisplayChat({ recipientId: recipientId, recipientUsername: recipientUsername })
    setNotification(notification.filter((user) => user !== recipientUsername ))
  }

  useEffect(() => { // RECEIVE PRIVATE MESSAGE
    socket.on("receive_priv_message", (data) => {
      console.log("receive private message")
      console.log(notification)
      console.log(data.from.username)

      if (data.from.id === chatStatus) {
        setChat([...chat, { id: data.id, username: data.from.username, message: data.message, timestamp: data.timestamp }])
      }
       if (displayChat.recipientUsername !== data.from.username) {
        setNotification([...notification, data.from.username])
      }
    })
    return () => {
      socket.off("receive_priv_message")
    }
  })

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
        { users.map(user => { 
          return  <div key={user.userID} className="chat-user">
                    <li 
                      onClick={ (user.username === username ? null : (e) => initChat(e) )} 
                      className={(user.username === username) ? '' : 'link' } 
                      data-userid={user.userID}>{user.username + (user.username === username ? ' (you)' : '')}
                    </li>
                    <div className="message-notify" data-user={user.username}>
                      { 
                      notification.includes(user.username)
                      ? 
                        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="50" cy="50" r="50" fill="#6ee2a6"/>
                        </svg>
                        : null  
                      }
                    </div>
                  </div>
        }) }
        </ul>
      </div>
        { displayChat ? 
          <Chat 
            recipientInfo={displayChat} 
            socket={socket} 
            sender={{ username: username, userId: userId }} 
            notify={{notification, setNotification}}
            chat={chat}
            setChat={setChat}
            setChatStatus={setChatStatus}
          /> 
          : null }
      </div>
    </>
  )
}

export default Messages