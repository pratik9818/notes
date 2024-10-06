import {useRecoilValue, useSetRecoilState } from 'recoil'
import { sidebardisplayState } from '../../store/modal'
import SidebarNav from './SidebarNav'
import Search from '../Search'
import NotesSection from './NotesSection'
import UserProfile from '../UserProfile'
import { useEffect, useState } from 'react'
import { device } from '../../store/notes'


const SideBar = function SideBar() {
  const setDevicetype = useSetRecoilState(device)
  const [width, setwidth] = useState('w-96')
  useEffect(()=>{
    const innerwidth = window.innerWidth
    const max = 450
    if(max >= innerwidth){
      setDevicetype('mobile')
      setwidth('w-screen absolute z-100')
    }
  },[])
  const displaystate = useRecoilValue(sidebardisplayState)
   return (
    <div className={`border border-bordercolor h-screen ${displaystate =='block' ? width : 'w-12' } py-1 text-notenamecolor`}>
      <SidebarNav/>
    <div className={`h-4/5 ${displaystate} w-full px-2`}>
      <Search/>
      <NotesSection/>
      <UserProfile/>
    </div> 
    </div> 
  )
}

export default SideBar
