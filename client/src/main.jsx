import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import Layout from './Layout/Layout';
import Home from './compoments/Home/Home';
import SocketProvider from './AuthProvider/SocketProvider';
import RoomPage from './compoments/RomePage/RoomPage';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout></Layout>,
    children:[

      {
        path:'/',
        element:<Home></Home>
      },{
        path:'/room/:id',
        element:<RoomPage></RoomPage>
      }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <SocketProvider>
  <RouterProvider router={router} />
  </SocketProvider>
  </StrictMode>,
)
