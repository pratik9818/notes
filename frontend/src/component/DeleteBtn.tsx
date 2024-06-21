import useGetToken from "../packages/GetToken";
import { deletenote as deletenoteatom, notes, searchresultstate } from "../store/notes";
import { useRecoilState ,useSetRecoilState} from 'recoil'
interface noteidtype {
  noteid:string
}
const DeleteBtn = ({noteid}:noteidtype) =>{
  const token = useGetToken()
  const [allnotes , setAllnotes] = useRecoilState(notes)
  const setNotedelete = useSetRecoilState(deletenoteatom)
  const [searchnotes,setSearchnotes] = useRecoilState(searchresultstate)
  async function deletenotefun() {
    const index =  allnotes?.findIndex(element => element.noteid == noteid)
    const result =  await fetch(`http://localhost:3001/api/deletenote/${noteid}`,{
      method:'DELETE',
      headers:{
        Authorization:  `${token}`
      }
    })
    const res = await result.json()
    console.log(res);
    if(searchnotes.length){
      const index =  searchnotes?.findIndex(element => element.noteid == noteid)
      const updatedNotes = searchnotes.filter((_, i) => i !== index);
      setSearchnotes(updatedNotes);
    }
    const updatedNotes = allnotes.filter((_, i) => i !== index);
  setAllnotes(updatedNotes);
  setNotedelete(noteid)
  }
  return <img id="delete" onClick={deletenotefun} className="w-5 h-5 cursor-pointer" src="/assets/delete.png" alt="" />
}
export default DeleteBtn