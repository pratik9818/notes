import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import { useNavigate } from "react-router-dom"
import { deletenote, issearch, trackactivenotecolor } from "../../store/notes";
interface sizetype {
  size:string
}
const AddNote = ({size}:sizetype)=> {
  const prvrestate = useRecoilValue(trackactivenotecolor)
  const navigate = useNavigate()
  const [deleteState, setDeleteState] = useRecoilState(deletenote);
  const setIssearchstate  = useSetRecoilState(issearch)
  function showandhideSidebar(){
    setIssearchstate(false)
    if(prvrestate){
      prvrestate.style.background = 'rgb(241 245 249)'
      }
      if (deleteState) {
          setDeleteState(null);
      }
    navigate(`/app/newnote`)
  }
  return (
      <img onClick={showandhideSidebar} className={size} src="/assets/addicondark.png" alt="nav icon" />
  )
}
export default AddNote
