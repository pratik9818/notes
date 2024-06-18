import {useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);
   const useremail = localStorage.getItem('email')
  const initial = useremail?.charAt(0).toUpperCase();
function logout(){
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    navigate('/app/auth')
}
  return (
    <div className="absolute bottom-0">
         {isModalOpen && (
        <div className="absolute -top-8 right-12 w-44 bg-white border border-gray-200 rounded-md shadow-lg">
          <button
            onClick={logout}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
             Logout
          </button>
          <button
            onClick={() => document.documentElement.classList.toggle('dark')}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
             Dark Mode
          </button>
        </div>
      )}
      <div
        className="flex items-center justify-center w-10 h-10 bg-blue-800 text-white rounded-full cursor-pointer text-2xl"
        onClick={toggleModal}
      >
        {initial ? initial : "User" }
      </div>
     
    </div>
  );
};

export default UserProfile;
