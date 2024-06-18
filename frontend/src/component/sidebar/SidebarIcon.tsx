import { useRecoilState } from "recoil"
import { sidebardisplayState } from "../../store/modal"

export default function SidebarIcon() {
    const [display,setDisplay] = useRecoilState(sidebardisplayState)
  function showandhideSidebar(){
    display ? setDisplay(false) : setDisplay(true)
  }
  return (
      <img className="cursor-pointer" onClick={showandhideSidebar} src="/src/assets/sidenavicon.png" alt="sidebaricon" />
    
  )
}
