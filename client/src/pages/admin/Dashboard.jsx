import { useEffect, useState } from "react";
import ProfilePopup from "../../components/Addprofile";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfiles } from "../../redux/user/userSlice";
import Profile from "../../components/Profile";
import { deleteProfile } from "../../redux/admin/adminSlice";

const Dashboard = () => {

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [profileState,setProfileState] = useState({})
  const [profileUpdate, setProfileUpdate] = useState(false)
  const openPopup = () => setIsPopupOpen(true);

  const dispatch = useDispatch()
  const {profiles} = useSelector(state => state.user)

  const closePopup = () => {
    setProfileState({})
    setIsPopupOpen(false)
  };

  const handleEdit = (profile) =>{
    setProfileState(profile)
  }

  const handleDelete = async(id) =>{
    await dispatch(deleteProfile(id))
    setProfileUpdate(!profileUpdate)
  }

  useEffect(()=>{
    const loadProfiles = async()=>{
      if (profiles.length <= 0 || profileUpdate) {
        await dispatch(fetchProfiles())
      }
    }
    loadProfiles()
  },[dispatch,profileUpdate])
  useEffect(()=>{
    if (Object.keys(profileState).length > 0) {
      setIsPopupOpen(true)
    }
  },[profileState])

  return (
    <div className="w-full">
      <p className="text-center font-bold p-1.5 bg-slate-500 text-slate-100 shadow-md">Admin Dashboard</p>
      <button onClick={openPopup} className="m-2 px-3 py-1 bg-[#FFA500] text-white rounded hover:bg-[#FF8C00]">Add Profile</button>

      <ProfilePopup
        isOpen={isPopupOpen}
        closePopup={closePopup}
        profileState={profileState}
      />
      <div className="container mx-auto p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {profiles.map(profile => (
          <div
            key={profile.name}
            className=" flex flex-col items-center bg-white border border-gray-300 rounded-lg shadow-md overflow-hidden max-w-64"
          >
            <Profile profile={profile}/>
            
          <div className="flex justify-between w-full p-2">
              <button onClick={()=>handleEdit(profile)} className="bg-yellow-300 px-3 rounded-md">Edit</button>
              <button onClick={()=>handleDelete(profile?._id)} className="bg-red-500 px-3 rounded-md">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  )
}
export default Dashboard