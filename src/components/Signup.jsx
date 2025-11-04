
import { useState } from 'react'
import '../App.css'
import { useNavigate, useOutletContext } from 'react-router-dom'

function Signup() {

  const navigate = useNavigate()
  const [socket, error, setError, auth, setAuth] = useOutletContext()
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
      const response = await fetch(import.meta.env.VITE_API_URL + '/signup', {
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
        setAuth(true)
        const token = await response.json()
        const key = Object.keys(token)
        const value = Object.values(token)
        localStorage.setItem(key, value)
        navigate("/profile")
      }

      if (response.status === 422) {
        const info = await response.json()
        setSignupStatus(info)
      }
    } catch(err) {
      console.log(err)
      setError(err)
      navigate('/error')
    }
  }

  return (
      <div className="signup">
      <h2>SIGNUP</h2>
      <form method="post" onSubmit={handleSubmit} className="material-form">
        <div className="input-field">
          <input title="username" id="username" name="username" type="text" minLength="5" maxLength="18" placeholder="May only contain alphanumeric characters" required={true} />
          <label htmlFor="username">USERNAME</label>
        </div>
        <div className="input-field">
          <input id="password" name="password" type="password" minLength="6" maxLength="25" required={true} />
          <label htmlFor="password">PASSWORD</label>   
        </div>
        <div className="input-field">
          <input id="password_confirm" name="password_confirm" type="password" minLength="6" maxLength="25" required={true} />
          <label htmlFor="password_confirm">CONFIRM</label>
        </div>
        <button type="submit">SUBMIT</button>
      </form>
      { signupStatus && signupStatus.map((item, index) => <p key={index}>{item.msg}</p> )}
    </div>
  )
}

export default Signup
