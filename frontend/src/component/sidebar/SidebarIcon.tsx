import { useRecoilState } from "recoil"
import { sidebardisplayState } from "../../store/modal"
import { useNavigate } from "react-router-dom"

export default function SidebarIcon() {
  const navigate = useNavigate()
  // const [display,setDisplay] = useRecoilState(sidebardisplayState)
  function showandhideSidebar(){
    // display ? setDisplay(false) : setDisplay(true)
    navigate(`app/newnote`)
  }
  return (
      <img onClick={showandhideSidebar} className="mx-2 cursor-pointer" src="/src/assets/sidenavicon.png" alt="nav icon" />
  )
}
