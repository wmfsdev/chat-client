
import { redirect } from "react-router-dom"

export async function appLoader() {
  const token = localStorage.getItem("token")
  try {
    const response = await fetch('http://localhost:3001/auth', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8', 'Authorization': `Bearer ${token}`
      }
    })
    const data = await response.json()
    
    if (response.status !== 200) {
      return false
    } else {
      return true
    }
  } catch (err) {
    console.log(err)
    return err
  }
}

export async function profileLoader() {
  const token = localStorage.getItem("token")

  if (!token) {
    throw redirect('/')
  } else {
    return token
  }
}