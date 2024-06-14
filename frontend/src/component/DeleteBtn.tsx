import { notes } from "../store/notes";
import { notestypo } from "../typo/notestypo";
import { useRecoilState } from 'recoil'
export default function DeleteBtn({noteid}) {
  const [allnotes , setAllnotes] = useRecoilState(notes)
  async function deletenote() {
    const index =  allnotes?.findIndex(element => element.noteid == noteid)
    console.log(index);
    const result =  await fetch(`http://localhost:3001/api/deletenote/${noteid}`,{
      method:'DELETE',
      headers:{
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJwcmF0aWtzaW5naDIxMjAwMEBnbWFpbC5jb20iLCJpYXQiOjE3MTgyMTE2NTcsImV4cCI6MTcxODU3MTY1N30.8BEBSU1MmqTFERMnvK_KJ7PdE5uYY53Ol3NWwHAU9_s'
      }
    })
    const res = await result.json()
    console.log(res);
    const updatedNotes = allnotes.filter((_, i) => i !== index);
  setAllnotes(updatedNotes);
  }
  return <img onClick={deletenote} className="w-4 h-4 cursor-pointer" src="/src/assets/delete.png" alt="" />
}
