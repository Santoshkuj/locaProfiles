import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { addProfile, updateProfile } from '../redux/admin/adminSlice';
import {toast} from 'react-toastify'
import { fetchProfiles } from '../redux/user/userSlice';


Modal.setAppElement('#modal');

const ProfilePopup = ({ isOpen, closePopup, profileState = {} }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photo: '',
    photoFile: null,
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });

  const [photoPreview, setPhotoPreview] = useState('');

  const handleClose = ()=>{
    setFormData({}),
    setPhotoPreview('')
    closePopup()
  }

  useEffect(() => {
    if (profileState && Object.keys(profileState).length > 0) {
      setFormData({
        name: profileState.name || '',
        email: profileState.email || '',
        photo: profileState.photo || '',
        photoFile: null,
        description: profileState.description || '',
        address: {
          street: profileState.address?.street || '',
          city: profileState.address?.city || '',
          state: profileState.address?.state || '',
          zipCode: profileState.address?.zipCode || '',
        },
      });
      setPhotoPreview(profileState.photo || '');
    }
  }, [profileState]);


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (['street', 'city', 'state', 'zipCode'].includes(name)) {
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          [name]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        photoFile: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('email', formData.email);
    submitData.append('description', formData.description);
    submitData.append('address[street]', formData.address.street);
    submitData.append('address[city]', formData.address.city);
    submitData.append('address[state]', formData.address.state);
    submitData.append('address[zipCode]', formData.address.zipCode);
  
    if (formData.photoFile) {
      submitData.append('photo', formData.photoFile);
    }
  
    try {
      if (profileState && Object.keys(profileState).length > 0) {
        const addProfile = await dispatch(updateProfile({ id: profileState?._id, profileData:submitData }));
  
        if (addProfile?.payload?.success) {
          toast.success(addProfile?.payload?.message);
          await dispatch(fetchProfiles({}))
          handleClose();
          setFormData({
            name: '',
            email: '',
            photo: '',
            photoFile: null,
            description: '',
            address: {
              street: '',
              city: '',
              state: '',
              zipCode: '',
            },
          });
          setPhotoPreview('');
        }
      } else {
        const updateProfile = await dispatch(addProfile(submitData));
        if (updateProfile?.payload?.success) {
          toast.success(updateProfile?.payload?.message);
          await dispatch(fetchProfiles({}))
          handleClose();
          setFormData({
            name: '',
            email: '',
            photo: '',
            photoFile: null,
            description: '',
            address: {
              street: '',
              city: '',
              state: '',
              zipCode: '',
            },
          });
          setPhotoPreview('');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };
  
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={()=>handleClose()}
      contentLabel={profileState && Object.keys(profileState).length > 0 ? 'Edit Profile' : 'Add Profile'}
      className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
    <div className='flex flex-col max-h-[100vh] overflow-y-auto p-6'>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {profileState && Object.keys(profileState).length > 0 ? 'Edit Profile' : 'Add Profile'}
        </h2>
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handlePhotoChange}
            className="w-full border rounded p-2"
          />
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Preview"
              className="mt-2 w-24 h-24 object-cover rounded"
            />
          )}
        </div>
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          name="street"
          placeholder="Street"
          value={formData.address?.street}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.address?.city}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          name="state"
          placeholder="State"
          value={formData.address?.state}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          name="zipCode"
          placeholder="Zip Code"
          value={formData.address?.zipCode}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={handleClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </form>
      </div>
    </Modal>
  );
};

export default ProfilePopup;
