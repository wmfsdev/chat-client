import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const Chat = ({ recipientInfo, socket, sender, notify, chat, setChat, setChatStatus }) => {

  const [message, setMessage] = useState('')
  const [messageLimitStatus, setMessageLimitStatus] = useState(false)
  const conversationId = recipientInfo.recipientId
  const navigate = useNavigate()
  
  function sendMessage() {
    const id = crypto.randomUUID()

    if (conversationId === "public") { // PUBLIC
      console.log("PUBLIC", conversationId)
      socket.emit("send_public_message", {
        id: id, 
        room: "public",
        userId: sender.userId,
        username: sender.username,
        message: message
      }, (response) => {
        if (response.status === "force_logout") {
          socket.disconnect()
          localStorage.clear()
          navigate('/')
        }
        if (response.status === "Bad Request") {
          return console.log(response.status)
        } else if (response.status === "Message Limit") {
          setMessageLimitStatus(`You have reached the message limit. Try again in ${response.timeleft} seconds`)
        } else {
          setChat([...chat, { id: id, username: sender.username, message: message, timestamp: Date.now() }])
          setMessage('')
          setMessageLimitStatus(false)
        }
      })
    } else { // PRIVATE
      console.log("PRIVATE", conversationId)
      socket.emit("send_priv_message", { 
        from: { id: sender.userId, username: sender.username }, 
        to: conversationId, 
        message: message, 
        id: id
      }, (response) => {
        if (response.status === "force_logout") {
          socket.disconnect()
          localStorage.clear()
          navigate('/')
        }
        if (response.status === "Bad Request") {
          return console.log(response.status)
        } else if (response.status === "Message Limit") {
          setMessageLimitStatus(`You have reached the message limit. Try again in ${response.timeleft} seconds`)
        } else {
          setChat([...chat, { id: id, username: sender.username, message: message, timestamp: Date.now() }])
          setMessage('')
          setMessageLimitStatus(false)
        }
      })
    }
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp) 
    return date.toLocaleString()
  }

  useEffect(() => {
    setChatStatus(conversationId)
  })

  useEffect(() => { // RETRIEVE CHAT HISTORY
    async function getDirectChat() {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL + '/direct_chat', { 
          method: "POST",
          headers: {
            'Content-type': 'application/json; charset=UTF-8'
          },
          body: JSON.stringify({
            room: conversationId,
            author: sender.userId
          }) 
        })
        const data = await response.json()
        const chat = data.map((d) => {
          return { id: d.id, username: d.author.username, message: d.content, timestamp: d.timestamp }
        })
        setChat(chat)
      } catch(err) {
        console.log(err)
        return err
      }
    }

    async function getPublicChar() {
      try {
        const response = await fetch(import.meta.env.VITE_API_URL + '/public_chat', {
          method: "POST",
          headers: {
            'Content-type': 'application/json; charset=UTF-8'
          },
          body: JSON.stringify({
            room: conversationId,
            author: sender.userId
          }) 
        })
        const data = await response.json()
        const chat = data.map((d) => {
          return { id: d.id, username: d.author.username, message: d.content, timestamp: d.timestamp }
        })
        setChat(chat)
      } catch(err) {
        console.log(err)
        return err
      }
    }

    if (conversationId === "public") {
      getPublicChar()
    } else {
      getDirectChat()
    }
  }, [conversationId, sender.userId])
  
  useEffect(() => { // RECEIVE PUBLIC MESSAGE
    socket.on("receive_public_message", (data) => {
      const { id, username, message, timestamp } = data
      setChat([...chat, { id: id, username: username, message: message, timestamp: timestamp }])
    })
    return () => {
      socket.off("receive_public_message")
    }
  })

  return (
    <div className="chat-wrapper">
      <div className="chat-messages">
        <ul>
          {chat.map(data => (
            <li key={data.id}>{data.username}: {data.message}<p>{formatDate(data.timestamp)}</p></li>
          ))}
        </ul>
      </div>
      { messageLimitStatus ? <div className="message-limit">{messageLimitStatus}</div> : null }
      <div className="chat-type">
        <input id="chat-box" type="text" minLength="1" maxLength="500" required={true} value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={sendMessage}>SEND</button>
      </div>
    </div>
  )
}

export default Chat