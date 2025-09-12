import { useOutletContext } from "react-router-dom"
import { useState } from "react"
import Chat from "./Chat"

const Messages = () => {

  const [users, socket, username] = useOutletContext()
  const [displayChat, setDisplayChat] = useState(false)
  
  function initChat(e) {
    if (displayChat !== false) {
      setDisplayChat(false)
    }
    const recipientId = e.target.dataset.socketid
    const recipientUsername = e.target.innerText
    setDisplayChat({ recipientId: recipientId, recipientUsername: recipientUsername })
  }

  return (
    <>
    <h2>MESSAGES</h2>
    <div className="chat-frame">
      <div className="chat-users">
        <h3>Users Online:</h3>
        <ul>
          {users.map(user => (
            <div key={user.userID}className="chat-user" onClick={(e) => initChat(e)}>
              <li data-socketid={user.socketID}>{user.username}</li>
            </div>
          ))}
        </ul>
      </div>
      <div className="chat-messages">
        { displayChat ? <Chat recipientInfo={displayChat} socket={socket} username={username} /> : null }
      </div>
    </div>
    </>
  )
}

export default Messages