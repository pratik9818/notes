import SidebarIcon from "./SidebarIcon"
import UserProfile from "./UserProfile"
import Notification from "./Notification"
export default  function SidebarNav() {
  return (
    <div className="flex items-center my-3 ">
      <UserProfile/>
      <Notification/>
      <SidebarIcon/>
    </div>
  )
}

