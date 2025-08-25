import App from "./App";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Room from "./components/Room";

const routes = [
  {
    path: '/',
    element: <App/>,
    children: [
      { path: '/sign-up', element: <Signup /> },
      { path: '/login', element: <Login /> },
      { path: '/profile',
        element: <Profile />,
        children: [
          { path: '/profile/room', element: <Room /> }
        ] 
      }
    ]
  }
]

export default routes