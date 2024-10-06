import {useState,useEffect, ChangeEvent,useRef, ClipboardEvent}from 'react'
import { useParams,useNavigate} from 'react-router-dom'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { alertstate, deletenote, device, notes, trackactivenotecolor } from '../../store/notes'
import GetToken from '../../packages/GetToken'
import {servername} from '../../servername'
import { sidebardisplayState } from '../../store/modal'

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
   const setDisplaystate = useSetRecoilState(sidebardisplayState)
   const devicetype = useRecoilValue(device)
const [isdescriptionload , isDescriptionload] = useState<boolean>(false)
   const {id} = useParams()
  //  const descriptionRef = useRef(description);
   const updatetime = 2000
   const index =  allnotes?.findIndex(element => element.noteid === id)
  const setAlertstate = useSetRecoilState(alertstate)
    useEffect(()=>{
      if(currentnote == null){
        const targetelement =  document.getElementById(`${id}`)
        if(targetelement) {
          targetelement.style.backgroundColor = '#71797E'
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
    
     if(devicetype === 'mobile'){
          setDisplaystate('hidden')
        }
    async function getdes() {
      isDescriptionload(false)
       const isdescription = allnotes[index]?.notedescription
       
        if(!isdescription){
         const result =  await fetch(`${servername}/api/getnote/notedescription/${id}`,{
            headers:{
                Authorization:  `${token}`
            }
          })
          const res = await result.json()
          if(res.status === 200){
            const resdes = res.data[0].notedescription
            resdes ? setDescription(resdes) : setDescription('') 
            const updatednotes = [...allnotes]
            updatednotes[index] = {
                ...updatednotes[index] ,
                notedescription : resdes ? resdes :' '
            }
            setNotes(updatednotes)
          }else{
            setAlertstate({
              isalert:true,
              alertname: res.message,
              alertcolor:'bg-red-500'
            })
          }
    }
    else setDescription(isdescription)
    isDescriptionload(true)
    if(textarearef.current) textarearef.current.focus() //may be iterating feature
}
    getdes()
},[id , allnotes])  //it could be a bug in a future

async function updatedescription(){
  const formData = new URLSearchParams();
  if(textarearef.current?.value) formData.append('notedescription', textarearef.current?.value);
  else formData.append('notedescription', ' ');

      const result =  await fetch(`${servername}/api/updatenote/notedescription/${id}`,{
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
              notedescription : description ? textarearef.current?.value :' '
          }
          setNotes(updatednotes)
          setAlertstate({
            isalert:true,
            alertname: res.message,
            alertcolor:'bg-green-500'
          })
        }else{
          setAlertstate({
            isalert:true,
            alertname: res.message,
            alertcolor:'bg-red-500'
          })
        }
}

const textonchnage = (e:ChangeEvent<HTMLTextAreaElement>)=>{
  const value = e.target.value
  setDescription(value)
  // descriptionRef.current = value;

  if(typing){
    clearTimeout(typing)
  }
  const timeoutid = setTimeout(() => {
  updatedescription()
}, updatetime);

setTyping(timeoutid)
}
// const onpaste = (e:ClipboardEvent<HTMLTextAreaElement>)=>{
//     const paste = e.clipboardData?.getData('text/plain')  //no need of it
//     console.log(paste);
//     const value = textarearef.current?.value ? textarearef.current?.value : description
//     setDescription(value)
//   if(typing){
//     clearTimeout(typing)
//   }
//   const timeoutid = setTimeout(() => {
//   updatedescription()
// }, updatetime);

// setTyping(timeoutid)
// }



  return (
    <div className='w-full bg-dark text-textcolor' >
    { !isdescriptionload ? <div className='h-full flex justify-center w-64 mx-auto py-64'>L O A D I N G . . . .</div>: <textarea placeholder='Write here'  id='txtar' ref={textarearef} onChange={textonchnage} value={description} className='w-full p-2 outline-none resize-none bg-dark scrollbar-thin h-[99%]'>
      </textarea>}
    </div>
  )
}