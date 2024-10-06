import { useRecoilValue } from "recoil"
import AddNote from "./AddNote"
import SidebarIcon from "./SidebarIcon"
import { sidebardisplayState } from "../../store/modal"
export default  function SidebarNav() {
  const displaystate = useRecoilValue(sidebardisplayState)
   const size = 'w-7 h-7 cursor-pointer'
  return (
    <div className="flex justify-between px-1 py-1">
      <SidebarIcon/>
     { displaystate == 'block'? <AddNote size={size}/> :''}
    </div>
  )
}

