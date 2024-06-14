import './App.css'

import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import SideBar from './component/sidebar/SideBar'
import NoteDes from './component/notedescription.tsx/NoteDes';
import NewnoteDes from './component/notedescription.tsx/NewnoteDes';

export function App() {
  return (
       <div className='flex flex-col'>
        <Router>
        <div className='flex'>
        <SideBar />
        <Routes>
     <Route path="/app/:id" element={<NoteDes/>} />
     <Route path="/app/newnote" element={<NewnoteDes/>} />
   </Routes>
        </div>
 </Router>
       </div>
        
  )
}

//i think the main problem is main state which is allnotes(could be diff name) , i adding notes in difee way and in diff component
//2nd is i need to figure out how whole state data flow in app
//refactore component code
//prevent re-render as much as possible , learn how ui / browser render page when state change in react