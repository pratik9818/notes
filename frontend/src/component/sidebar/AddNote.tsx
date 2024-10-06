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
  function addnotefun(){
    setIssearchstate(false)
    if(prvrestate){
      prvrestate.style.background = '#71797E'
      }
      if (deleteState) {
          setDeleteState(null);
      }
    navigate(`/app/newnote`)
  }
  return (
      <img onClick={addnotefun} className={`${size} invert`} src="/assets/addicondark.png" alt="nav icon" />
  )
}
export default AddNote
