import { useState, useEffect } from "react"
import { Outlet, useOutletContext, Link } from "react-router-dom"
import Rooms from './Rooms'


const Profile = () => {
  console.log("RENDER PROFILE")

  useEffect(() => {
    socket.connect() // manual connection
  })
  
  const [socket, userState, setUserState] = useOutletContext()
  const username = userState.username

  useEffect(() => {
     socket.on("user_connected", (data) => {
      console.log("user connected")
      console.log(data)
    })
    return () => {
      socket.off("user_connected")
    }
  })

  useEffect(() => {
     socket.on("users", (data) => {
      console.log("users")
      console.log(data)
    })
    return () => {
      socket.off("users")
    }
  })
  
  useEffect(() => {
    socket.on("friends", (data) => {
      console.log("friends")
      console.log(data);
    });
    return () => {
      socket.off("friends");
    };
  }, [socket]);

  console.log("profile ID: ", socket.id)

  return (
    <>
    <h2>Profile</h2>
    <h3>for {username}</h3>
    {/* <Rooms /> */}
    <Link to="/profile/messages">Messages</Link><br />
    <Outlet context={[socket, username]}/>
    </>
  )
}

export default Profile