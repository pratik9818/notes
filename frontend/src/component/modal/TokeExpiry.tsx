import React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { islogin, tokenmodalstate } from '../../store/notes';
import { useNavigate } from 'react-router-dom';


const Modal = () => {
  const isuserlogin = useRecoilValue(islogin)

  
  const navigate = useNavigate()
  
  function authpage(){
        navigate('/app/auth')
    }
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md text-center h-1/12">
        <p className="mb-4">{isuserlogin.reason}</p>
        <button
        onClick={authpage}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isuserlogin.message == 'token absent' ? 'Signup':'Login'}
        </button>
      </div>
    </div>
  );
};

export default Modal;
