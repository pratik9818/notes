import { useRecoilState } from "recoil"
import { sidebardisplayState } from "../../store/modal"

export default function SidebarIcon() {
    const [display,setDisplay] = useRecoilState(sidebardisplayState)
  function showandhideSidebar(){
    display == 'hidden' ? setDisplay('block') : setDisplay('hidden')
  }
  return (
      <img className="cursor-pointer w-7 h-7 invert" onClick={showandhideSidebar} src="/assets/sidenavicon.png" alt="sidebaricon" />
  )
}
