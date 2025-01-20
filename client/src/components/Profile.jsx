import { useNavigate } from "react-router-dom";

const Profile = ({ profile }) => {

    const navigate = useNavigate()
  return (
    profile && <div onClick={()=>navigate(`/user/profile/${profile._id}`,{state:profile})} className="flex flex-col mx-auto w-full h-64 sm:h-[265px] bg-white border border-gray-300 rounded-lg overflow-hidden cursor-pointer">
        <div className="h-[60%] m-1 overflow-hidden rounded-[50%]">
        <img
        src={profile.photo}
        alt={profile.name}
        className="w-full h-full object-center"
        />
        </div>
      <div className="p-1 pb-0">
        <h3 className="text-xl text-center font-semibold text-gray-900 truncate">{profile.name}</h3>
        <div className="h-9">
        <p className="mt-1 text-gray-600 text-sm leading-tight line-clamp-2">Desc: {profile.description}</p>
        </div>
      </div>
      <button onClick={(e)=>{
        e.stopPropagation()
        navigate('/user/map',{state:profile})
        }} className="bg-purple-400 rounded-md  mt-auto mb-1 text-gray-900  hover:bg-purple-500">Summary</button>
    </div>
  );
};

export default Profile;
