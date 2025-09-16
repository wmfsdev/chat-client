import { useEffect, useState } from "react"

const Chat = ({ recipientInfo, socket, sender }) => {

  const [message, setMessage] = useState('')
  const [chat, setChat] = useState([])
  const uniqueConversationID = recipientInfo.recipientId
  
  function sendMessage() {
    console.log("sending message")
    const id = crypto.randomUUID()
    socket.emit("send_priv_message", { from: { id: sender.userId, username: sender.username }, to: recipientInfo.recipientId, message: message, id: id })
    setChat([...chat, { id: id, username: sender.username, message: message }])
  }
  
  useEffect(() => { // RECEIVE PRIVATE MESSAGE
    socket.on("receive_priv_message", (data) => {
      if (data.from.id !== uniqueConversationID) {
        console.log("non-message")
      } else {
        setChat([...chat, { id: data.id, username: data.from.username, message: data.message }])
      }
    })
    return () => {
      socket.off("receive_priv_message")
    }
  })
  
  return (
    <>
    <h2>PRIVATE CHAT</h2>
    <p>Chatting with {recipientInfo.recipientUsername}</p>
    <ul>
      {chat.map(data => (
        <li key={data.id}>{data.username}: {data.message}</li>
      ))}
    </ul> 
    <div className="chat-type">
      <input type="text" placeholder="message" onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>send</button>
    </div>
    </>
  )
}

export default Chat