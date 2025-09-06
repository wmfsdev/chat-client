
export async function appLoader() {
  const token = localStorage.getItem("token")

  try {
    const response = await fetch('http://localhost:3001/some', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8', 'Authorization': `Bearer ${token}`
      }
    })

    const data = await response.json()
    console.log("appLoader: ", data)
    return data
   
  } catch (err) {
    return err
  }
}

export async function profileLoader() {

  try {
    const response = await fetch('http://localhost:3001/test', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
    const data = await response.json()
    console.log("profileLoader: ", data)
    return data
  } catch (err) {
    return err
  }

}