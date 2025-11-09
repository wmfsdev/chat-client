import { useEffect, useState } from "react"

const Chat = ({ recipientInfo, socket, sender, notify, chat, setChat }) => {

  const [message, setMessage] = useState('')
  const conversationId = recipientInfo.recipientId
  
  function sendMessage() {
    const id = crypto.randomUUID()

    if (conversationId === "public") { // PUBLIC
      socket.emit("send_public_message", {
        id: id, 
        room: "public",
        userId: sender.userId,
        username: sender.username,
        message: message
      }, (response) => {
        if (response.status === "Bad Request") {
          return console.log(response.status)
        } else {
          setChat([...chat, { id: id, username: sender.username, message: message, timestamp: Date.now() }])
        }
      })
    } else { // PRIVATE
      socket.emit("send_priv_message", { 
        from: { id: sender.userId, username: sender.username }, 
        to: conversationId, 
        message: message, 
        id: id
      }, (response) => {
        if (response.status === "Bad Request") {
          return console.log(response.status)
        } else {
          setChat([...chat, { id: id, username: sender.username, message: message, timestamp: Date.now() }])
          setMessage('')
        }
      })
    }
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp) 
    return date.toLocaleString()
  }

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
      <div className="chat-type">
        <input type="text" minLength="1" maxLength="500" required={true} value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={sendMessage}>SEND</button>
      </div>
    </div>
  )
}

export default Chat