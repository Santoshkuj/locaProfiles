import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

const Sidebar = ({sidebarOpen}) => {
  const{token} = useSelector(state=> state.auth)
  return (
    sidebarOpen && token && <aside className={`bg-gray-800 text-white sm:w-40 lg:w-52`}>
        <ul className="pt-8 space-y-6">
          <li><Link to="/admin/dashboard" className="block py-2 px-4 hover:bg-gray-700">Dashboard</Link></li>
        </ul>
      </aside>
  )
}
export default Sidebar