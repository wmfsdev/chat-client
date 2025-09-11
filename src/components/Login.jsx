
import { useNavigate } from "react-router-dom"

const Login = () => {

  const navigate = useNavigate()
  
  function handleSubmit(e) {
    e.preventDefault()
    const data = new FormData(e.target)
    const username = data.get("username")
    const password = data.get("password")
    login(username, password)
  }

  async function login(username, password) {
    console.log(username), console.log(password)
    try {
      const response = await fetch('http://localhost:3001/login', {
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
        const token = await response.json()
        const key = Object.keys(token)
        const value = Object.values(token)
        localStorage.setItem(key, value)
        navigate("/") 
      }

      if (response.status === 422) {
        const errors = await response.json()
        setError(errors)
      }
    } catch(err) {
      console.log(err)
    }
  }

  return (
    <>
    <h2>Login</h2>
      <form method="post" onSubmit={handleSubmit} className="material-form">
      <div className="input-field">
        <input title="Username may only contain alphanumeric characters" id="username" name="username" type="text" placeholder=""  />
        <label htmlFor="username">Username</label>
      </div>
      <div className="input-field">
        <input id="password" name="password" type="password" minLength="1" maxLength="25" required={true} />
        <label htmlFor="password">Password</label>   
      </div>
      <button type="submit">submit</button>
      </form>
    </>
  )
}

export default Login