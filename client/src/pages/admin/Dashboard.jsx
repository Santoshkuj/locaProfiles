import { useEffect, useState } from "react";
import ProfilePopup from "../../components/Addprofile";
import { useDispatch } from "react-redux";
import { deleteProfile } from "../../redux/admin/adminSlice";
import Profiles from "../../components/Allprofiles";
import { fetchProfiles } from "../../redux/user/userSlice";

const Dashboard = () => {

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [profileState,setProfileState] = useState({})
  const [profileUpdate, setProfileUpdate] = useState(false)
  const openPopup = () => setIsPopupOpen(true);

  const dispatch = useDispatch()

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
    if (Object.keys(profileState).length > 0) {
      setIsPopupOpen(true)
    }
  },[profileState])

  useEffect(()=>{
    dispatch(fetchProfiles({}))
  },[profileUpdate])

  return (
    <div className="w-full relative">
      <p className="text-center font-bold p-1.5 bg-slate-500 text-slate-100 shadow-md">Admin Dashboard</p>
      <button onClick={openPopup} className="m-2 px-3 py-1 bg-[#FFA500] text-white rounded hover:bg-[#FF8C00] absolute right-2 top-[-5px]">Add Profile</button>

      <ProfilePopup
        isOpen={isPopupOpen}
        closePopup={closePopup}
        profileState={profileState}
      />
      <div>
      <Profiles handleDelete={handleDelete} handleEdit={handleEdit}/>
      </div>
     
    </div>
  )
}
export default Dashboard