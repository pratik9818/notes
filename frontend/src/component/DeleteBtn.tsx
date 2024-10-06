import useGetToken from "../packages/GetToken";
import { servername } from "../servername";
import { alertstate, deletenote as deletenoteatom, notes, searchresultstate } from "../store/notes";
import { useRecoilState ,useSetRecoilState} from 'recoil'
interface noteidtype {
  noteid:string
}
const DeleteBtn = ({noteid}:noteidtype) =>{
  const token = useGetToken()
  const [allnotes , setAllnotes] = useRecoilState(notes)
  const setNotedelete = useSetRecoilState(deletenoteatom)
  const [searchnotes,setSearchnotes] = useRecoilState(searchresultstate)
  const setAlertstate = useSetRecoilState(alertstate)
  async function deletenotefun() {
    const index =  allnotes?.findIndex(element => element.noteid == noteid)
    const result =  await fetch(`${servername}/api/deletenote/${noteid}`,{
      method:'DELETE',
      headers:{
        Authorization:  `${token}`
      }
    })
    const res = await result.json()
    if(res.status === 200){
      if(searchnotes.length){
        const index =  searchnotes?.findIndex(element => element.noteid == noteid)
        const updatedNotes = searchnotes.filter((_, i) => i !== index);
        setSearchnotes(updatedNotes);
      }
      const updatedNotes = allnotes.filter((_, i) => i !== index);
    setAllnotes(updatedNotes);
    setNotedelete(noteid)
      setAlertstate({
        isalert:true,
        alertname: res.message,
        alertcolor:'bg-green-500'
      })
    }
    else {
      setAlertstate({
        isalert:true,
        alertname: res.message,
        alertcolor:'bg-red-500'
      })
    }
   
  }
  return <img id="delete" onClick={deletenotefun} className="w-5 h-5 cursor-pointer" src="/assets/delete.png" alt="" />
}
export default DeleteBtn