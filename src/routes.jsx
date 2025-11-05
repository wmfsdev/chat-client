import App from "./App";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Error from "./components/Error";
import Room from "./components/Room";
import { appLoader, profileLoader } from "./util/loader";

const routes = [
  {
    path: '/',
    loader: appLoader,
    element: <App/>,
    children: [
      { path: '/error', element: <Error /> },
      { path: '/rooms/:id', element: <Room />, loader: profileLoader },
      { path: '/sign-up', element: <Signup /> },
      { path: '/login', element: <Login /> },
      { path: '/messages',
        element: <Profile />,
        loader: profileLoader,
      }
    ]
  },
]

export default routes