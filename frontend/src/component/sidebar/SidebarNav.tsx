import AddNote from "./AddNote"
import SidebarIcon from "./SidebarIcon"
export default  function SidebarNav() {
   const size = 'w-6 h-6 cursor-pointer'
  return (
    <div className="flex justify-between">
      <SidebarIcon/>
      <AddNote size={size}/>
    </div>
  )
}

