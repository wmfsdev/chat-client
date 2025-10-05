
import { useState } from 'react'
import '../App.css'
import { useNavigate, useOutletContext } from 'react-router-dom'

function Signup() {

  const navigate = useNavigate()
  const [socket, error, setAuth] = useOutletContext()
  const [signupStatus, setSignupStatus] = useState()

  function handleSubmit(e) {
    e.preventDefault()
    const data = new FormData(e.target)
    const username = data.get("username")
    const password = data.get("password")
    const confirmPwd = data.get("password_confirm")
    signup(username, password, confirmPwd)
  }

  async function signup(username, password, confirmPwd) {
    try {
      const response = await fetch('http://localhost:3001/signup', {
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: password,
          confirm: confirmPwd,
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })

      if (response.status === 200) {
        console.log("response status 200")
        setAuth(true)
        const token = await response.json()
        const key = Object.keys(token)
        const value = Object.values(token)
        localStorage.setItem(key, value)
        navigate("/profile")
      }

      if (response.status === 422) {
        const info = await response.json()
        console.log(info)
        setSignupStatus(info)
      }
    } catch(err) {
      console.log(err)
    }
  }

  return (
      <div className="signup">
      <h1>SIGNUP</h1>
      <form method="post" onSubmit={handleSubmit} className="material-form">
        <div className="input-field">
          <input title="Username may only contain alphanumeric characters" id="username" name="username" type="text" placeholder=""  />
          <label htmlFor="username">Username</label>
        </div>
        <div className="input-field">
          <input id="password" name="password" type="password" minLength="1" maxLength="25" required={true} />
          <label htmlFor="password">Password</label>   
        </div>
        <div className="input-field">
          <input id="password_confirm" name="password_confirm" type="password" required={true} />
          <label htmlFor="password_confirm">Confirm</label>
        </div>
        <button type="submit">submit</button>
      </form>
      { signupStatus && signupStatus.map((item, index) => <p key={index}>{item.msg}</p> )}
    </div>
  )
}

export default Signup
