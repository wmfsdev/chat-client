import { useOutletContext } from "react-router-dom"
import { useEffect } from "react"

const Room = () => {

  const [socket, room, username, setUsername] = useOutletContext()

  useEffect(() => {
    socket.on("user_joined", (data) => {
      console.log(data);
      setUsername(data)
    });
    return () => {
      socket.off("user_joined");
    };
  }, [setUsername, socket]);

  return (
    <>
    <h3>{username} joined room: {room}</h3>
    </>
  )

}

export default Room