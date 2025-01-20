import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "./layout/Layout"
import Home from "./pages/user/Home"
import AuthCheck from "./config/AuthCheck"
import Dashboard from "./pages/admin/Dashboard"
import AdminLoginPage from "./pages/admin/login"
import UserProfile from "./components/UserProfile"
import OpenStreetMapComponent from "./components/map/OpenStreetMap"

const App = () => {

  const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        {
          path: '/',
          element: <Home />
        },
        {
          path: '/login',
          element: <AdminLoginPage />
        },
        {
          path: '/user/profile/:id',
          element: <UserProfile />
        },
        {
          path: '/user/map',
          element: <OpenStreetMapComponent />
        },
      ]
    },
    {
      path: '/admin',
      element: (
        <AuthCheck>
          <Layout />
        </AuthCheck>
      ),
      children:[
        {
          path: 'dashboard',
          element: <Dashboard />
        }
      ]
    }
  ])
  return (
    <RouterProvider router={router}/>
  )
}
export default App