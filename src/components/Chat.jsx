import { useEffect, useState } from "react"

const Chat = ({ recipientInfo, socket, sender, notify }) => {

  const [message, setMessage] = useState('')
  const [chat, setChat] = useState([])
  const conversationId = recipientInfo.recipientId

  function sendMessage() {
    const id = crypto.randomUUID()

    socket.emit("send_priv_message", { 
      from: { id: sender.userId, username: sender.username }, 
      to: conversationId, 
      message: message, 
      id: id
    }, (response) => {
      if (response.status === "Bad Request") {
        return console.log("bad request")
      } else {
        setChat([...chat, { id: id, username: sender.username, message: message, timestamp: Date.now() }])
        setMessage('')
      }
    })
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp) 
    return date.toLocaleString()
  }

  useEffect(() => { // RETRIEVE CHAT HISTORY
    async function getChat() {
      try {
        const response = await fetch(`http://localhost:3001/chat`, { 
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
    getChat()
  }, [conversationId, sender.userId])
  
  useEffect(() => { // RECEIVE PRIVATE MESSAGE
    socket.on("receive_priv_message", (data) => {

      if (data.from.id !== conversationId) { 
        console.log("!data id: ", data)
      // this data is logged if not directly in same room as sender
      } else {
        notify.setNotification(data.from.username)
        setChat([...chat, { id: data.id, username: data.from.username, message: data.message }])
      }
    })
    return () => {
      socket.off("receive_priv_message")
    }
  })

  return (
    <div className="chat-messages">
      <p>Chatting with: {recipientInfo.recipientUsername}</p>
      <ul>
        {chat.map(data => (
          <li key={data.id}>{data.username}: {data.message}<p>{formatDate(data.timestamp)}</p></li>
        ))}
      </ul> 
      <div className="chat-type">
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={sendMessage}>SEND</button>
      </div>
    </div>
  )
}

export default Chat