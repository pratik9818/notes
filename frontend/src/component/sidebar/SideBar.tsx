import { useRecoilValue } from 'recoil'
import { sidebardisplayState } from '../../store/modal'
import SidebarNav from './SidebarNav'
import Search from '../Search'
import NotesSection from './NotesSection'
import SidebarIcon from './SidebarIcon'
import UserProfile from '../UserProfile'
import { useEffect, useState } from 'react'

const SideBar = function SideBar() {
  const [width, setwidth] = useState('w-96')
  useEffect(()=>{
    const innerwidth = window.innerWidth
    const max = 450
    if(max >= innerwidth){
      setwidth('w-screen absolute z-100')
    }
  },[])
  const displaystate = useRecoilValue(sidebardisplayState)
   return (
    !displaystate ?<div className={`border-2 h-screen ${width} px-2 py-1 bg-white `}>
      <SidebarNav/>
      <Search/>
      <NotesSection />
      <UserProfile/>
    </div> :<div className='flex flex-col justify-between border-2 h-screen w-12 px-2 py-1'>
    <SidebarIcon/>
    </div>
  )
}

export default SideBar
