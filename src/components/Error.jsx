import { useOutletContext } from "react-router-dom"

const Error = () => {
 
  const [socket, error]  = useOutletContext()

  console.log(error)
  return (
    <>
    <h1>Error</h1>
    <p>{error.message || 'Something went wrong.'}</p>
    </>
  )
}

export default Error