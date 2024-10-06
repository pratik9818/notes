import './App.css'

import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, useMatch} from "react-router-dom";
import SideBar from './component/sidebar/SideBar'
import NoteDes from './component/notedescription.tsx/NoteDes';
import NewnoteDes from './component/notedescription.tsx/NewnoteDes';
import DefaultPage from './component/DefaultPage';
import AuthForm from './component/AuthForm';
import { useEffect } from 'react';
import TokenModal from './component/modal/TokeExpiry';
import GetToken from './packages/GetToken';
import { useSetRecoilState } from 'recoil';
import { islogin } from './store/notes';
import AlertModal from './component/modal/AlertModal';
import ShareModal from './component/modal/ShareModal';
import ShowContent from './component/sharepage/ShowContent';

export function App() {
  
  return <div className='flex flex-col bg-dark text-textcolor '>
      <Router>
      <AppContent />
      </Router>
      <AlertModal/>
      <ShareModal/>
    </div>
}
function AppContent() {
  
  const location = useLocation();
  const match = useMatch('/app/sharenote/:id')
  const hideSidebar = location.pathname === '/app/auth' || location.pathname === '/app/token' || match
  
  const setTokeninfo = useSetRecoilState(islogin)
  const navigate = useNavigate()
  const token = GetToken()
  useEffect(()=>{
    if(!token){
      setTokeninfo({
        islogin:false,
        reason:'If you are new user please signup first',
        message:'token absent'
      })
      navigate('/app/token')
    }
  },[])
  return (
    <div className='flex h-full bg-dark text-textcolor'>
        {/* <Route path="/app/*" element={!hideSidebar && <SideBar/> } /> */}
       {!hideSidebar && <SideBar/> }
      <Routes>
        <Route path="/" element={<DefaultPage />} />
        <Route path="/app/:id" element={<NoteDes />} />
        <Route path="/app/newnote" element={<NewnoteDes />} />
        <Route path="/app/deletenote" element={<DefaultPage />} />
        <Route path="/app/search" element={<DefaultPage />} />
        <Route path="/app/auth" element={<AuthForm />} />
        <Route path="/app/token" element={<TokenModal />} />
        <Route path="/app/sharenote/:id" element={<ShowContent/>} />
      </Routes>
    </div>
  );
} 
//i think the main problem is main state which is allnotes(could be diff name) , i adding notes in difee way and in diff component
//2nd is i need to figure out how whole state data flow in app
//refactore component code
//prevent re-render as much as possible , learn how ui / browser render page when state change in react