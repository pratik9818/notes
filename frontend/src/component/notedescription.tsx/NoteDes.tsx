import {useState,useEffect, ChangeEvent,useRef, ClipboardEvent}from 'react'
import { useParams,useNavigate} from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { deletenote, notes, trackactivenotecolor } from '../../store/notes'
import GetToken from '../../packages/GetToken'
type descriptiontypo = string
export default function NoteDes() {
  const token = GetToken()
  const navigate = useNavigate()
  const textarearef = useRef<HTMLTextAreaElement>(null)
  const [allnotes,setNotes]= useRecoilState(notes)
   const isnotedelete = useRecoilValue(deletenote)
   const [currentnote ,setCurrentnote] = useRecoilState(trackactivenotecolor)
   const [description, setDescription] = useState<descriptiontypo>('')
   const [typing, setTyping ] = useState<NodeJS.Timeout | null>(null)
   const {id} = useParams()
   const descriptionRef = useRef(description);
   const updatetime = 2000
    const index =  allnotes?.findIndex(element => element.noteid === id)
    useEffect(()=>{
      if(currentnote == null){
        const targetelement =  document.getElementById(`${id}`)
        if(targetelement) {
          targetelement.style.backgroundColor = 'rgb(226 232 240)'
          setCurrentnote(targetelement)
        }
       }
    },[allnotes])
    useEffect(()=>{
     
     if(isnotedelete && isnotedelete == id){
      navigate('/app/deletenote')
     }
    },[isnotedelete , currentnote])

   useEffect(()=>{
    
    async function getdes() {
       const isdescription = allnotes[index]?.notedescription
       
        if(!isdescription){
         const result =  await fetch(`http://localhost:3001/api/getnote/notedescription/${id}`,{
            headers:{
                Authorization:  `${token}`
            }
          })
          const res = await result.json()
          const resdes = res.data[0].notedescription
          // console.log(resdes);
          resdes ? setDescription(resdes) : setDescription('') 
          
          const updatednotes = [...allnotes]
          
          updatednotes[index] = {
              ...updatednotes[index] ,
              notedescription : resdes ? resdes :' '
          }
          setNotes(updatednotes)
        
    }
    else setDescription(isdescription)
    
    if(textarearef.current) textarearef.current.focus() //may be iterating feature
}
    getdes()
},[id])

async function updatedescription(){
  const formData = new URLSearchParams();
  formData.append('notedescription', descriptionRef.current);
      const result =  await fetch(`http://localhost:3001/api/updatenote/notedescription/${id}`,{
          method: 'PATCH',
          headers:{
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `${token}`
          },
          body: formData.toString(),
         
        })
        const res = await result.json()
        if(res.status == 200){
          const updatednotes = [...allnotes]
          updatednotes[index] = {
              ...updatednotes[index] ,
              notedescription : descriptionRef.current ? description :' '
          }
          setNotes(updatednotes)
        }
}

const textonchnage = (e:ChangeEvent<HTMLTextAreaElement>)=>{
  const value = e.target.value
  setDescription(value)
  descriptionRef.current = value;
  if(typing){
    clearTimeout(typing)
  }
  const timeoutid = setTimeout(() => {
  updatedescription()
}, updatetime);

setTyping(timeoutid)
}
const onpaste = (e:ClipboardEvent<HTMLTextAreaElement>)=>{
  e.preventDefault()
    const paste = e.clipboardData?.getData('text/plain')
    setDescription( description + paste)
    descriptionRef.current = description + paste;
  if(typing){
    clearTimeout(typing)
  }
  const timeoutid = setTimeout(() => {
  updatedescription()
}, updatetime);

setTyping(timeoutid)
}


  return (
    <div className='w-full' >
       <textarea placeholder='Write here'  id='txtar' ref={textarearef} onPaste={onpaste} onChange={textonchnage} value={description} className='w-full h-full p-2 outline-none resize-none'>
      </textarea>
    </div>
  )
}