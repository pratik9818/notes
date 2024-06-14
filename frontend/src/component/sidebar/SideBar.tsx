import { useRecoilValue } from 'recoil'
import { sidebardisplayState } from '../../store/modal'
import SidebarNav from './SidebarNav'
import Search from '../Search'
import NotesSection from './NotesSection'

function SideBar() {
  const displaystate = useRecoilValue(sidebardisplayState)
   return (
    displaystate &&<div className='border-2 h-screen w-68'>
      <SidebarNav/>
      <Search/>
      <NotesSection/>
      {/* <FolderSection/> */}
    </div> 
  )
}

export default SideBar
