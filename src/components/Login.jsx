
import { useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"

const Login = () => {
  console.log("LOGIN")
  const navigate = useNavigate()
  const [socket, error, setError, auth, setAuth] = useOutletContext()
  const [loginStatus, setLoginStatus] = useState(auth)
  const [validationErrors, setValidationErrors] = useState(null)
  
  function handleSubmit(e) {
    e.preventDefault()
    const data = new FormData(e.target)
    const username = data.get("username")
    const password = data.get("password")
    login(username, password)
  }

  async function login(username, password) {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/login', {
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: password,
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
        navigate("/messages")
      }

      if (response.status === 401) {
        console.log("401 - Authorisation")
        const { info } = await response.json()
        setLoginStatus(info.message)
      }

      if (response.status === 422) {
        const errors = await response.json()
        setValidationErrors(errors)
        console.log(errors)
      }

    } catch(err) {
      console.log(err)
      setError(err)
      navigate('/error')
    }
  }

  return (
    <>
    <div className="login"><h2>LOGIN</h2>
      <form method="post" onSubmit={handleSubmit} className="material-form">
      <div className="input-field">
        <input title="Username may only contain alphanumeric characters" id="username" name="username" type="text" placeholder=""  />
        <label htmlFor="username">USERNAME</label>
      </div>
      <div className="input-field">
        <input id="password" name="password" type="password" minLength="1" maxLength="25" required={true} /> <label htmlFor="password">PASSWORD</label>  
      </div>
      <button type="submit">SUBMIT</button>
      </form>
    </div>
      { loginStatus ? <p>{loginStatus}</p>  : null }
      { validationErrors && 
        validationErrors.map((error, index) => <p key={index}>{error.msg}</p> )}
    </>
  )
}

export default Login