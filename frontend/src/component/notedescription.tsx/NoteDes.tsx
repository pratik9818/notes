import {useState,useEffect, ChangeEvent,useRef, ClipboardEvent}from 'react'
import { useParams,useNavigate} from 'react-router-dom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { deletenote, notes, trackactivenotecolor } from '../../store/notes'
import TextArea from './TextArea'
import DeleteNotepage from '../DeleteNotepage'
import GetToken from '../../packages/GetToken'
// import { setTimeout } from 'timers'


type descriptiontypo = string
export default function NoteDes() {
  const token = GetToken()
  const navigate = useNavigate()
  const textarearef = useRef<HTMLTextAreaElement>(null)
  const [allnotes,setNotes]= useRecoilState(notes)
   const isnotedelete = useRecoilValue(deletenote)
   const [currentnote ,setCurrentnote] = useRecoilState(trackactivenotecolor)
   const [description, setDescription] = useState<descriptiontypo>('')
   const [wordscount , setWordscount] = useState<number>(0)
   const [typing, setTyping ] = useState<NodeJS.Timeout | null>(null)
   const {id} = useParams()
    const  maxchartoUpdate = 5 //what if user cut/remove the notes before 20 char
    //i can do one thing , i take updateed note every 2or 4 sec and store in local storage and every 1 minutes all the notes send to db . 2 probem will sove through it 1 is i dont have send req in every update of notes and 2nd is i dont have to worry for what if 20 word not completerd or what if (user computer shutdown i need to think is although apert from it) user switch notes , close the tab 
    //need to think when user copy and paste
    //need to think if i use ls logic then what is storage size of ls and need to limit also note size according to ls size
    //big-problem is ls apporch when user open its notes on another device , then he wont find its update notes (if user close tab before 1 minutes and login to other devices)
    //solution ladies -- > i will use indexDB for storing data and for updating the data in the case of close tab , i will use Page Unload Event
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
},[id]) //need to fix rerender due to allnotes state

async function updatedescription(){
  const formData = new URLSearchParams();
  formData.append('notedescription', description);
      const result =  await fetch(`http://localhost:3001/api/updatenote/notedescription/${id}`,{
          method: 'PATCH',
          headers:{
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: `${token}`
          },
          body: formData.toString(),
         
        })
        const res = await result.json()
        // console.log(res);
        if(res.status == 200){
          const updatednotes = [...allnotes]
          updatednotes[index] = {
              ...updatednotes[index] ,
              notedescription : description ? description :' '
          }
          setNotes(updatednotes)
        }
}
// useEffect(()=>{
   
//     if(wordscount >= maxchartoUpdate){ //need to think about how i can do it another optimize way
//       updatedescription()
//       setWordscount(0)
//     }
// },[description])
const textonchnage = (e:ChangeEvent<HTMLTextAreaElement>)=>{
  setDescription(e.target.value)
  // setWordscount(prvcount=>++prvcount ) // need to solve this doubt
if(typing){
  clearTimeout(typing)
}
const timeoutid = setTimeout(() => {
  updatedescription()
}, 2000);

setTyping(timeoutid)
}
useEffect(() => {
  return ()=>{
    if(typing){
      clearTimeout(typing)
    }
  }
}, [typing])


const onpaste = (e:ClipboardEvent<HTMLTextAreaElement>)=>{
  e.preventDefault()
    const paste = e.clipboardData?.getData('text/plain')
    setDescription(paste)
    // if(paste.length >= maxchartoUpdate){
    //   setWordscount(maxchartoUpdate)
    //   setDescription(paste)
    //   return
    // }
    // setWordscount(paste.length)
    //   setDescription(paste)
    
    if(typing){
      clearTimeout(typing)
    }
    const timeoutid = setTimeout(() => {
      updatedescription()
    }, 2000);
    
    setTyping(timeoutid)
}
  return (
    <div className='w-full' >
      
      {/* <TextArea/> */}
       <textarea placeholder='Write here'  id='txtar' ref={textarearef} onPaste={onpaste} onChange={textonchnage} value={description} className='w-full h-full p-2 outline-none resize-none'>
      </textarea>
    </div>
  )
}