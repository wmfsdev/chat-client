import App from "./App";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Rooms from "./components/Rooms";
import Messages from "./components/Messages";
import Room from "./components/Room";
import { appLoader } from "./util/loader";

const routes = [
  {
    path: '/',
    loader: appLoader,
    element: <App/>,
    children: [
      { path: '/rooms/:id', element: <Room /> },
      { path: '/sign-up', element: <Signup /> },
      { path: '/login', element: <Login /> },
      { path: '/profile',
        element: <Profile />,
        children: [
          { path: '', element: <Rooms /> },
          { path: '/profile/messages', element: <Messages /> }
        ] 
      }
    ]
  }
]

export default routes